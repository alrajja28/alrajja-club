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

const googleIdentity={issuer:'https://securetoken.google.com/alrajja-club-auth',subject:'google-customer',email:'alrajja28@gmail.com',emailVerified:true,firebase:{sign_in_provider:'google.com'}};
describe('Firebase Google identity boundary',()=>{
  it('creates a single profile for a verified Google identity',async()=>{
    const t=convexTest(schema,modules),actor=t.withIdentity(googleIdentity);
    const first=await actor.mutation(api.identity.ensureUser,{});
    expect(await actor.mutation(api.identity.ensureUser,{})).toBe(first);
    expect((await actor.query(api.content.me,{})).isAdmin).toBe(true);
  });
  it('rejects unverified mail, another issuer, and non-Google sign-in',async()=>{
    const t=convexTest(schema,modules);
    for(const change of [{emailVerified:false},{issuer:'https://securetoken.google.com/another-project'},{firebase:{sign_in_provider:'password'}}]){
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
