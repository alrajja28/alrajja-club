import {validatePrices} from './tickets';
import { v, ConvexError } from 'convex/values';
import { query, mutation } from './model';
import { section } from './schema';
import { currentUser, isAdminEmail, requireAdmin } from './permissions';
import initialContent from './initialContent.json';
import type { QueryCtx, MutationCtx } from './model';

const defaultCategories=[{slug:'first',title:'الفريق الأول'},{slug:'youth',title:'الشباب'},{slug:'juniors',title:'الناشئين'},{slug:'cubs',title:'الأشبال'}];
async function categoryRows(ctx:QueryCtx|MutationCtx,trashed=false){
  const stored=await ctx.db.query('content').withIndex('by_section',q=>q.eq('section','playerCategories')).take(500);
  if(trashed)return stored.filter(r=>r.deletedAt!==undefined);
  const defaults=defaultCategories.filter(c=>!stored.some(r=>r.slug===c.slug)).map(c=>({...c,section:'playerCategories' as const,data:{},published:true,sort:defaultCategories.findIndex(d=>d.slug===c.slug),updatedAt:0}));
  return [...defaults,...stored.filter(r=>r.deletedAt===undefined)].sort((a,b)=>a.sort-b.sort);
}
async function checkCategory(ctx:QueryCtx|MutationCtx,slug:unknown){
  if(typeof slug!=='string'||!(await categoryRows(ctx)).some(c=>c.slug===slug&&c.published))throw new ConvexError('التصنيف غير متاح؛ أضف التصنيف أو استعده أولًا');
}
async function checkCategoryEmpty(ctx:MutationCtx,slug:string){
  const assigned=await ctx.db.query('content').withIndex('by_section',q=>q.eq('section','players')).filter(q=>q.and(q.eq(q.field('deletedAt'),undefined),q.or(q.eq(q.field('data.teamCategory'),slug),...(slug==='first'?[q.eq(q.field('data.teamCategory'),undefined)]:[])))).first();
  if(assigned)throw new ConvexError('انقل اللاعبين الموجودين في هذا التصنيف إلى تصنيف آخر قبل حذفه');
}
export const listPlayerCategories=query({args:{},handler:async ctx=>(await categoryRows(ctx)).filter(c=>c.published).map(c=>({slug:c.slug,title:c.title,sort:c.sort,...('_id' in c?{_id:c._id}:{})}))});

export const authStatus=query({args:{},handler:async()=>({googleReady:Boolean(process.env.FIREBASE_PROJECT_ID)})});

export const me = query({ args: {}, handler: async ctx => {
  const user = await currentUser(ctx);
  return user ? { name: user.name, email: user.email, image: user.image, isAdmin: isAdminEmail(user.email) } : null;
} });

export const listPublished = query({ args: { section }, handler: async (ctx, args) => {
  const rows = await ctx.db.query('content').withIndex('by_section', q => q.eq('section', args.section))
    .filter(q => q.and(q.eq(q.field('published'), true),q.eq(q.field('deletedAt'),undefined))).take(500);
  return Promise.all(rows.sort((a,b) => a.sort-b.sort).map(async ({updatedBy, ...row}) => ({
    ...row, data: { ...row.data, ...(row.data.storageId ? { url: await ctx.storage.getUrl(row.data.storageId) } : {}) },
  })));
} });

export const listAdmin = query({ args: { section, trashed:v.optional(v.boolean()) }, handler: async (ctx, args) => {
  await requireAdmin(ctx);
  if(args.section==='playerCategories')return categoryRows(ctx,args.trashed??false);
  const rows = await ctx.db.query('content').withIndex('by_section', q => q.eq('section', args.section)).filter(q=>args.trashed?q.neq(q.field('deletedAt'),undefined):q.eq(q.field('deletedAt'),undefined)).take(500);
  return rows.sort((a,b) => a.sort-b.sort);
} });

export const save = mutation({
  args: { id: v.optional(v.id('content')), section, slug: v.string(), title: v.string(),
    data: v.any(), published: v.boolean(), sort: v.number() },
  handler: async (ctx, args) => {
    const actor = await requireAdmin(ctx);
    const slug = args.slug.trim();
    if (!/^[a-zA-Z0-9_-]{1,100}$/.test(slug)) throw new ConvexError('رمز العنصر غير صالح');
    if (!args.title.trim() || args.title.length > 300) throw new ConvexError('العنوان مطلوب وأقصاه 300 حرف');
    if (!Number.isFinite(args.sort)) throw new ConvexError('ترتيب العنصر غير صالح');
    if (!args.data || typeof args.data !== 'object' || Array.isArray(args.data) || JSON.stringify(args.data).length > 60000)
      throw new ConvexError('بيانات المحتوى غير صالحة أو كبيرة');
    const data={...args.data};
    if(['staff','management'].includes(args.section)){data.name=args.title.trim();if(typeof data.role!=='string'||!data.role.trim())throw new ConvexError('المنصب مطلوب');}
    if(args.section==='matches'){if(data.ticketPrices!==undefined){validatePrices(data.ticketPrices);data.ticketPrice=data.ticketPrices.second;}if(data.ticketSalesEnabled!==undefined&&typeof data.ticketSalesEnabled!=='boolean')throw new ConvexError('حالة الحجز غير صالحة');}
    if(args.section==='players'){
      data.teamCategory??='first';await checkCategory(ctx,data.teamCategory);
      if(data.birthYear!==undefined&&(!Number.isInteger(data.birthYear)||data.birthYear<1900||data.birthYear>new Date().getUTCFullYear()))throw new ConvexError('سنة الميلاد غير صالحة');
    }
    if(args.section==='playerCategories'&&!args.published)throw new ConvexError('التصنيف يكون متاحًا أو ينتقل إلى المحذوفات');
    for(const key of ['price','ticketPrice'])if (args.data[key] !== undefined && (!Number.isFinite(args.data[key]) || args.data[key] < 0))
      throw new ConvexError('السعر يجب أن يكون رقمًا موجبًا أو صفرًا');
    for (const key of ['url', 'image', 'imgSrc', 'imgUrl', 'videoUrl', 'streamUrl','opponentLogo','facebook','instagram','twitter','tiktok']) {
      if (args.data[key]) {
        try { if (new URL(args.data[key]).protocol !== 'https:') throw new Error(); }
        catch { throw new ConvexError('روابط الصور والفيديو يجب أن تبدأ بـ https://'); }
      }
    }
    if (args.data.storageId) {
      const uploaded = await ctx.db.query('uploads').withIndex('by_storage', q=>q.eq('storageId', args.data.storageId)).unique();
      if (!uploaded || uploaded.owner !== actor._id) throw new ConvexError('الملف غير معتمد لهذا الحساب');
    }
    const existing = await ctx.db.query('content').withIndex('by_section_slug', q=>q.eq('section',args.section).eq('slug',slug)).unique();
    if (existing && existing._id !== args.id) throw new ConvexError('رمز العنصر مستخدم');
    const {id, ...record} = args;
    const values = {...record,data,slug,title:args.title.trim(),updatedAt:Date.now(),updatedBy:actor._id};
    if (id) {
      const previous = await ctx.db.get(id);
      if (!previous || previous.section !== args.section) throw new ConvexError('العنصر غير موجود');
      if(previous.deletedAt!==undefined)throw new ConvexError('العنصر في المحذوفات؛ استعده أولًا');
      if(previous.slug!==slug)throw new ConvexError('رمز العنصر لا يمكن تغييره');
      await ctx.db.patch(id, values);
    } else await ctx.db.insert('content', values);
    await ctx.db.insert('auditLog',{actor:actor._id,operation:'save',section:args.section,slug,at:Date.now()});
  },
});

export const archive = mutation({ args: {id:v.id('content')}, handler: async(ctx,{id})=>{
  const actor=await requireAdmin(ctx); const row=await ctx.db.get(id);
  if (!row) throw new ConvexError('العنصر غير موجود');
  if(row.deletedAt!==undefined)throw new ConvexError('العنصر في المحذوفات؛ استعده أولًا');
  if(row.section==='playerCategories')throw new ConvexError('استخدم حذف التصنيف بدل الإخفاء');
  await ctx.db.patch(id,{published:false,updatedAt:Date.now(),updatedBy:actor._id});
  await ctx.db.insert('auditLog',{actor:actor._id,operation:'archive',section:row.section,slug:row.slug,at:Date.now()});
} });

export const remove=mutation({args:{id:v.id('content')},handler:async(ctx,{id})=>{
  const actor=await requireAdmin(ctx),row=await ctx.db.get(id);if(!row)throw new ConvexError('العنصر غير موجود');
  if(row.deletedAt!==undefined)return;
  if(row.section==='playerCategories')await checkCategoryEmpty(ctx,row.slug);
  await ctx.db.patch(id,{deletedAt:Date.now(),published:false,updatedAt:Date.now(),updatedBy:actor._id});
  await ctx.db.insert('auditLog',{actor:actor._id,operation:'delete',section:row.section,slug:row.slug,at:Date.now()});
}});
export const removeCategory=mutation({args:{slug:v.string()},handler:async(ctx,{slug})=>{
  const actor=await requireAdmin(ctx);await checkCategoryEmpty(ctx,slug);
  const row=await ctx.db.query('content').withIndex('by_section_slug',q=>q.eq('section','playerCategories').eq('slug',slug)).unique();
  const fallback=defaultCategories.find(c=>c.slug===slug);if(!row&&!fallback)throw new ConvexError('التصنيف غير موجود');
  if(row?.deletedAt!==undefined)return;
  const values={deletedAt:Date.now(),published:false,updatedAt:Date.now(),updatedBy:actor._id};
  if(row)await ctx.db.patch(row._id,values);else await ctx.db.insert('content',{...values,section:'playerCategories',slug,title:fallback!.title,data:{},sort:defaultCategories.findIndex(c=>c.slug===slug)});
  await ctx.db.insert('auditLog',{actor:actor._id,operation:'delete',section:'playerCategories',slug,at:Date.now()});
}});
export const restore=mutation({args:{id:v.id('content')},handler:async(ctx,{id})=>{
  const actor=await requireAdmin(ctx),row=await ctx.db.get(id);if(!row)throw new ConvexError('العنصر غير موجود');
  if(row.deletedAt===undefined)return;
  if(row.section==='players')await checkCategory(ctx,row.data.teamCategory??'first');
  await ctx.db.patch(id,{deletedAt:undefined,published:row.section==='playerCategories',updatedAt:Date.now(),updatedBy:actor._id});
  await ctx.db.insert('auditLog',{actor:actor._id,operation:'restore',section:row.section,slug:row.slug,at:Date.now()});
}});

export const initialize = mutation({args:{},handler:async ctx=>{
  const actor=await requireAdmin(ctx);
  if(await ctx.db.query('content').first())throw new ConvexError('المحتوى موجود بالفعل؛ لم يتم استبداله');
  for(const [section, rows] of Object.entries(initialContent)){
    for(const [sort, value] of rows.entries()){
      const data=value as Record<string,unknown>;
      const slug=String(data.id??`item-${sort+1}`);
      await ctx.db.insert('content',{section:section as 'products',slug,title:String(data.title??data.name??slug),
        data,published:true,sort,updatedAt:Date.now(),updatedBy:actor._id});
    }
  }
  await ctx.db.insert('auditLog',{actor:actor._id,operation:'initialize',section:'all',slug:'initial',at:Date.now()});
} });
