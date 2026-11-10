import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { convexTest } from 'convex-test';
import { anyApi } from 'convex/server';
import schema from './schema';

// Convex-test uses this generated-directory marker to discover the module root.
// The functions under test import our schema-typed builders and need no deployment.
const modules = {
  ...import.meta.glob(['./**/*.ts', '!./**/*.test.ts']),
  './_generated/testModuleRoot.ts': async () => ({}),
};
const api = anyApi;
beforeEach(() => {vi.stubEnv('ADMIN_EMAILS', 'alrajja28@gmail.com');vi.stubEnv('FIREBASE_PROJECT_ID','alrajja-club-auth');});
afterEach(() => vi.unstubAllEnvs());

async function createActor(email: string) {
  const t = convexTest(schema, modules);
  const actor=t.withIdentity({...googleIdentity,subject:email,email});
  await actor.mutation(api.identity.ensureUser,{});
  return { t, actor };
}
const product = {section:'products',slug:'test-product',title:'Test kit',data:{price:12000,category:'jerseys'},published:false,sort:0};

// Convex exposes nested JWT claims as dotted keys, unlike the raw Firebase JWT.
const googleIdentity={issuer:'https://securetoken.google.com/alrajja-club-auth',subject:'google-customer',email:'alrajja28@gmail.com',email_verified:true,'firebase.sign_in_provider':'google.com'};
describe('Firebase Google identity boundary',()=>{
  it('creates a single profile for a verified Google identity',async()=>{
    const t=convexTest(schema,modules),actor=t.withIdentity(googleIdentity);
    const first=await actor.mutation(api.identity.ensureUser,{});
    expect(await actor.mutation(api.identity.ensureUser,{})).toBe(first);
    expect((await actor.query(api.content.me,{})).isAdmin).toBe(true);
  });
  it('rejects unverified mail, another issuer, and non-Google sign-in',async()=>{
    const t=convexTest(schema,modules);
    for(const change of [{email_verified:false},{issuer:'https://securetoken.google.com/another-project'},{'firebase.sign_in_provider':'password'},{'firebase.sign_in_provider':undefined}]){
      const actor=t.withIdentity({...googleIdentity,...change});
      await expect(actor.mutation(api.identity.ensureUser,{})).rejects.toThrow('Google');
      expect(await actor.query(api.content.me,{})).toBeNull();
    }
  });
  it('uses the fresh verified mail rather than a cached admin profile',async()=>{
    const t=convexTest(schema,modules),admin=t.withIdentity(googleIdentity);
    await admin.mutation(api.identity.ensureUser,{});
    const changed=t.withIdentity({...googleIdentity,email:'fan@example.com'});
    await expect(changed.mutation(api.content.save,product)).rejects.toThrow('تصريح');
  });
});

describe('server-side content authorization',()=>{
  it('blocks anonymous administration and uploads',async()=>{
    const t=convexTest(schema,modules);
    await expect(t.query(api.content.listAdmin,{section:'products'})).rejects.toThrow('تصريح');
    await expect(t.mutation(api.content.save,product)).rejects.toThrow('تصريح');
    await expect(t.mutation(api.files.generateUploadUrl,{})).rejects.toThrow('تصريح');
  });
  it('blocks a signed-in fan from editing or reading drafts',async()=>{
    const {actor}=await createActor('fan@example.com');
    await expect(actor.mutation(api.content.save,product)).rejects.toThrow('تصريح');
    await expect(actor.query(api.content.listAdmin,{section:'products'})).rejects.toThrow('تصريح');
  });
  it('publishes admin changes, keeps drafts private, and archives reversibly',async()=>{
    const {t,actor}=await createActor('alrajja28@gmail.com');
    await actor.mutation(api.content.save,product);
    expect(await t.query(api.content.listPublished,{section:'products'})).toEqual([]);
    const [draft]=await actor.query(api.content.listAdmin,{section:'products'});
    await actor.mutation(api.content.save,{...product,id:draft._id,published:true,data:{price:18000}});
    const published=await t.query(api.content.listPublished,{section:'products'});
    expect(published).toHaveLength(1);
    expect(published[0].data.price).toBe(18000);
    expect(published[0]).not.toHaveProperty('updatedBy');
    await actor.mutation(api.content.archive,{id:draft._id});
    expect(await t.query(api.content.listPublished,{section:'products'})).toEqual([]);
    expect(await actor.query(api.content.listAdmin,{section:'products'})).toHaveLength(1);
  });
  it('rejects invalid prices, unsafe links, and duplicate slugs',async()=>{
    const {actor}=await createActor('alrajja28@gmail.com');
    await expect(actor.mutation(api.content.save,{...product,data:{price:-1}})).rejects.toThrow('السعر');
    await expect(actor.mutation(api.content.save,{...product,data:{image:'javascript:alert(1)'}})).rejects.toThrow('https');
    await actor.mutation(api.content.save,product);
    await expect(actor.mutation(api.content.save,product)).rejects.toThrow('مستخدم');
  });
  it('does not overwrite existing content during initialization',async()=>{
    const {actor}=await createActor('alrajja28@gmail.com');
    await actor.mutation(api.content.save,product);
    await expect(actor.mutation(api.content.initialize,{})).rejects.toThrow('موجود');
    expect((await actor.query(api.content.listAdmin,{section:'products'}))[0].data.price).toBe(12000);
  });
});

describe('fan requests',()=>{
  it('requires login, isolates private requests, and retries without duplicates',async()=>{
    const {t,actor}=await createActor('fan@example.com');
    const request={kind:'contact',data:{details:'Please contact me'},nonce:'retry-test'};
    await expect(t.mutation(api.submissions.submit,request)).rejects.toThrow('تسجيل الدخول');
    const first=await actor.mutation(api.submissions.submit,request);
    const retry=await actor.mutation(api.submissions.submit,request);
    expect(retry._id).toBe(first._id);
    expect(await actor.query(api.submissions.mine,{})).toHaveLength(1);
    const other=t.withIdentity({...googleIdentity,subject:'other',email:'other@example.com'});
    await other.mutation(api.identity.ensureUser,{});
    expect(await other.query(api.submissions.mine,{})).toEqual([]);
    await expect(actor.query(api.submissions.listAdmin,{})).rejects.toThrow('تصريح');
    await expect(actor.mutation(api.submissions.review,{id:first._id,status:'approved'})).rejects.toThrow('تصريح');
  });
  it('calculates ticket totals on the server and allows admin review',async()=>{
    const {t,actor}=await createActor('fan@example.com');
    const admin=t.withIdentity(googleIdentity);
    await admin.mutation(api.identity.ensureUser,{});
    await admin.mutation(api.content.save,{section:'matches',slug:'match',title:'Match',data:{opponent:'Test',date:'Tomorrow',stadium:'Club',status:'upcoming',ticketPrice:10000},published:true,sort:0});
    const row=await actor.mutation(api.submissions.submit,{kind:'tickets',nonce:'ticket-request',data:{matchId:'match',quantities:{vip:2,second:1},total:1}});
    expect(row.data.total).toBe(60000);
    expect(row.status).toBe('pending');
    await admin.mutation(api.submissions.review,{id:row._id,status:'approved'});
    expect((await actor.query(api.submissions.mine,{}))[0].status).toBe('approved');
    await expect(actor.mutation(api.submissions.submit,{kind:'tickets',nonce:'invalid-quantity',data:{matchId:'match',quantities:{second:21}}})).rejects.toThrow('المقاعد');
  });
});


describe('content deletion and editable player categories',()=>{
  it('removes every content section from active lists and restores it without losing its data',async()=>{
    const {t,actor}=await createActor('alrajja28@gmail.com');
    for(const section of ['products','news','media','stream','matches','players','academy','settings','standings']){
      const record={...product,section,slug:'delete-'+section,published:true,data:section==='players'?{name:'Existing player'}:{price:12000}};
      await actor.mutation(api.content.save,record);
      const [row]=await actor.query(api.content.listAdmin,{section});
      await expect(t.mutation(api.content.remove,{id:row._id})).rejects.toThrow('تصريح');
      await actor.mutation(api.content.remove,{id:row._id});
      expect(await actor.query(api.content.listAdmin,{section})).toEqual([]);
      expect(await t.query(api.content.listPublished,{section})).toEqual([]);
      const [deleted]=await actor.query(api.content.listAdmin,{section,trashed:true});
      expect(deleted._id).toBe(row._id);expect(deleted.data).toEqual(row.data);
      await expect(actor.mutation(api.content.save,{...record,id:row._id})).rejects.toThrow('المحذوفات');
      await actor.mutation(api.content.restore,{id:row._id});
      const [restored]=await actor.query(api.content.listAdmin,{section});
      expect(restored.published).toBe(false);expect(restored.data).toEqual(row.data);
    }
  });
  it('creates and renames categories, protects assigned players, and keeps deleted defaults deleted',async()=>{
    const {t,actor}=await createActor('alrajja28@gmail.com');
    expect(await t.query(api.content.listPlayerCategories,{})).toHaveLength(4);
    await actor.mutation(api.content.save,{...product,section:'playerCategories',slug:'youth',title:'شباب النادي',published:true,data:{}});
    expect((await t.query(api.content.listPlayerCategories,{})).filter((c:any)=>c.slug==='youth')).toHaveLength(1);
    expect((await t.query(api.content.listPlayerCategories,{})).find((c:any)=>c.slug==='youth').title).toBe('شباب النادي');
    const category={...product,section:'playerCategories',slug:'new-academy',title:'البراعم',published:true,data:{}};
    await actor.mutation(api.content.save,category);
    let categories=await t.query(api.content.listPlayerCategories,{});
    const added=categories.find((c:any)=>c.slug==='new-academy');expect(added.title).toBe('البراعم');
    await actor.mutation(api.content.save,{...category,id:added._id,title:'براعم النادي'});
    expect((await t.query(api.content.listPlayerCategories,{})).find((c:any)=>c.slug===added.slug).title).toBe('براعم النادي');
    const player={...product,section:'players',slug:'young-player',data:{name:'Young player',teamCategory:'new-academy',birthYear:2014}};
    await actor.mutation(api.content.save,player);
    await expect(actor.mutation(api.content.removeCategory,{slug:added.slug})).rejects.toThrow('انقل');
    const [row]=await actor.query(api.content.listAdmin,{section:'players'});
    await actor.mutation(api.content.remove,{id:row._id});
    await actor.mutation(api.content.removeCategory,{slug:added.slug});
    expect((await t.query(api.content.listPlayerCategories,{})).some((c:any)=>c.slug===added.slug)).toBe(false);
    await expect(actor.mutation(api.content.restore,{id:row._id})).rejects.toThrow('التصنيف');
    await actor.mutation(api.content.restore,{id:added._id});
    await actor.mutation(api.content.restore,{id:row._id});
    await actor.mutation(api.content.removeCategory,{slug:'cubs'});
    expect((await t.query(api.content.listPlayerCategories,{})).some((c:any)=>c.slug==='cubs')).toBe(false);
    const [deletedDefault]=await actor.query(api.content.listAdmin,{section:'playerCategories',trashed:true});
    await actor.mutation(api.content.restore,{id:deletedDefault._id});
    expect((await t.query(api.content.listPlayerCategories,{})).some((c:any)=>c.slug==='cubs')).toBe(true);
  });
  it('preserves uncategorized legacy players and denies invalid categories and fan deletion',async()=>{
    const {t,actor}=await createActor('alrajja28@gmail.com');
    await t.run(async ctx=>{await ctx.db.insert('content',{...product,section:'players',data:{name:'Legacy player'},published:true,updatedAt:1});});
    await expect(actor.mutation(api.content.removeCategory,{slug:'first'})).rejects.toThrow('انقل');
    await expect(actor.mutation(api.content.save,{...product,section:'players',data:{teamCategory:'missing'}})).rejects.toThrow('التصنيف');
    await expect(actor.mutation(api.content.save,{...product,section:'players',data:{teamCategory:'first',birthYear:1600}})).rejects.toThrow('الميلاد');
    const fan=t.withIdentity({...googleIdentity,subject:'fan-delete',email:'fan@example.com'});await fan.mutation(api.identity.ensureUser,{});
    const [row]=await actor.query(api.content.listAdmin,{section:'players'});
    await expect(fan.mutation(api.content.remove,{id:row._id})).rejects.toThrow('تصريح');
    await expect(fan.mutation(api.content.restore,{id:row._id})).rejects.toThrow('تصريح');
    await expect(fan.mutation(api.content.removeCategory,{slug:'first'})).rejects.toThrow('تصريح');
    await expect(fan.query(api.content.listAdmin,{section:'players',trashed:true})).rejects.toThrow('تصريح');
  });
});
