import { v, ConvexError } from 'convex/values';
import { query, mutation } from './model';
import { section } from './schema';
import { currentUser, isAdminEmail, requireAdmin } from './permissions';
import initialContent from './initialContent.json';

export const authStatus=query({args:{},handler:async()=>({googleReady:Boolean(process.env.FIREBASE_PROJECT_ID)})});

export const me = query({ args: {}, handler: async ctx => {
  const user = await currentUser(ctx);
  return user ? { name: user.name, email: user.email, image: user.image, isAdmin: isAdminEmail(user.email) } : null;
} });

export const listPublished = query({ args: { section }, handler: async (ctx, args) => {
  const rows = await ctx.db.query('content').withIndex('by_section', q => q.eq('section', args.section))
    .filter(q => q.eq(q.field('published'), true)).take(500);
  return Promise.all(rows.sort((a,b) => a.sort-b.sort).map(async ({updatedBy, ...row}) => ({
    ...row, data: { ...row.data, ...(row.data.storageId ? { url: await ctx.storage.getUrl(row.data.storageId) } : {}) },
  })));
} });

export const listAdmin = query({ args: { section }, handler: async (ctx, args) => {
  await requireAdmin(ctx);
  const rows = await ctx.db.query('content').withIndex('by_section', q => q.eq('section', args.section)).take(500);
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
    for(const key of ['price','ticketPrice'])if (args.data[key] !== undefined && (!Number.isFinite(args.data[key]) || args.data[key] < 0))
      throw new ConvexError('السعر يجب أن يكون رقمًا موجبًا أو صفرًا');
    for (const key of ['url', 'image', 'imgSrc', 'imgUrl', 'videoUrl', 'streamUrl']) {
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
    const values = {...record,slug,title:args.title.trim(),updatedAt:Date.now(),updatedBy:actor._id};
    if (id) {
      const previous = await ctx.db.get(id);
      if (!previous || previous.section !== args.section) throw new ConvexError('العنصر غير موجود');
      await ctx.db.patch(id, values);
    } else await ctx.db.insert('content', values);
    await ctx.db.insert('auditLog',{actor:actor._id,operation:'save',section:args.section,slug,at:Date.now()});
  },
});

export const archive = mutation({ args: {id:v.id('content')}, handler: async(ctx,{id})=>{
  const actor=await requireAdmin(ctx); const row=await ctx.db.get(id);
  if (!row) throw new ConvexError('العنصر غير موجود');
  await ctx.db.patch(id,{published:false,updatedAt:Date.now(),updatedBy:actor._id});
  await ctx.db.insert('auditLog',{actor:actor._id,operation:'archive',section:row.section,slug:row.slug,at:Date.now()});
} });

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
