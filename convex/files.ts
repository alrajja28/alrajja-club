import { v, ConvexError } from 'convex/values';
import { mutation } from './model';
import { requireAdmin } from './permissions';

export const generateUploadUrl = mutation({ args:{}, handler:async ctx=>{
  await requireAdmin(ctx); return ctx.storage.generateUploadUrl();
} });
export const register = mutation({ args:{storageId:v.id('_storage'),filename:v.string()}, handler:async(ctx,args)=>{
  const admin=await requireAdmin(ctx);
  const file=await ctx.db.system.get(args.storageId);
  if (!file) throw new ConvexError('لم يكتمل رفع الملف');
  const mime=file.contentType??'';
  if (!['image/jpeg','image/png','image/webp','image/gif','video/mp4','video/webm'].includes(mime)) {
    await ctx.storage.delete(args.storageId); throw new ConvexError('صيغة الملف غير مدعومة');
  }
  const maximum=mime.startsWith('video/')?100*1024*1024:8*1024*1024;
  if(file.size>maximum) {await ctx.storage.delete(args.storageId);throw new ConvexError('حجم الملف يتجاوز الحد المسموح');}
  const existing=await ctx.db.query('uploads').withIndex('by_storage',q=>q.eq('storageId',args.storageId)).unique();
  if(existing && existing.owner!==admin._id)throw new ConvexError('الملف مسجل لحساب آخر');
  if(!existing)await ctx.db.insert('uploads',{...args,owner:admin._id,mimeType:mime,size:file.size,createdAt:Date.now()});
  return {storageId:args.storageId,url:await ctx.storage.getUrl(args.storageId)};
} });
