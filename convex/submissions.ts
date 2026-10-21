import {v,ConvexError} from 'convex/values';
import {query,mutation} from './model';
import {currentUser,requireAdmin} from './permissions';

export const mine=query({args:{},handler:async ctx=>{
  const user=await currentUser(ctx);if(!user)return [];
  return ctx.db.query('submissions').withIndex('by_owner',q=>q.eq('owner',user._id)).order('desc').take(100);
}});
export const listAdmin=query({args:{},handler:async ctx=>{
  await requireAdmin(ctx);
  return ctx.db.query('submissions').withIndex('by_created').order('desc').take(200);
}});
export const submit=mutation({args:{kind:v.union(v.literal('academy'),v.literal('contact'),v.literal('tickets')),data:v.any(),nonce:v.string()},handler:async(ctx,args)=>{
  const user=await currentUser(ctx);if(!user)throw new ConvexError('يرجى تسجيل الدخول بحساب Google قبل إرسال الطلب');
  if(!args.nonce||args.nonce.length>100||!args.data||typeof args.data!=='object'||JSON.stringify(args.data).length>10000)throw new ConvexError('بيانات الطلب غير صالحة');
  const previous=await ctx.db.query('submissions').withIndex('by_owner_nonce',q=>q.eq('owner',user._id).eq('nonce',args.nonce)).unique();
  if(previous)return previous;
  const recent=await ctx.db.query('submissions').withIndex('by_owner',q=>q.eq('owner',user._id)).order('desc').take(10);
  if(recent.filter(r=>r.createdAt>Date.now()-60000).length>=5)throw new ConvexError('أرسلت عدة طلبات؛ يرجى الانتظار قليلًا');
  const data={...args.data};
  if(args.kind==='tickets'){
    const match=await ctx.db.query('content').withIndex('by_section_slug',q=>q.eq('section','matches').eq('slug',String(data.matchId))).unique();
    if(!match?.published||match.data.status==='finished')throw new ConvexError('الحجز غير متاح لهذه المباراة');
    const tiers=[{id:'vip',name:'VIP',rate:2.5},{id:'first',name:'درجة أولى',rate:1.5},{id:'second',name:'درجة ثانية',rate:1},{id:'third',name:'درجة ثالثة',rate:.5}];
    let seats=0,total=0;const descriptions=[];
    for(const tier of tiers){const qty=data.quantities?.[tier.id]??0;if(!Number.isInteger(qty)||qty<0||qty>20)throw new ConvexError('عدد المقاعد غير صالح');seats+=qty;total+=qty*Math.round(Number(match.data.ticketPrice||0)*tier.rate);if(qty)descriptions.push(`${tier.name}: ${qty}`);}
    if(seats<1||seats>20)throw new ConvexError('اختر بين مقعد واحد و20 مقعدًا');
    Object.assign(data,{matchTitle:`الرجاء العراقي × ${match.data.opponent}`,date:match.data.date,stadium:match.data.stadium,seats,total,category:descriptions.join('، ')});
  }else if(args.kind==='academy'){
    if(typeof data.childName!=='string'||data.childName.trim().length<3||typeof data.phone!=='string'||!/^\+?[0-9\s-]{8,20}$/.test(data.phone))throw new ConvexError('يرجى إدخال اسم اللاعب ورقم هاتف صالح');
  }else if(typeof data.details!=='string'||data.details.trim().length<5)throw new ConvexError('يرجى كتابة تفاصيل الطلب');
  const now=Date.now();const id=await ctx.db.insert('submissions',{owner:user._id,kind:args.kind,data,nonce:args.nonce,status:'pending',createdAt:now,updatedAt:now});
  return ctx.db.get(id);
}});
export const review=mutation({args:{id:v.id('submissions'),status:v.union(v.literal('pending'),v.literal('approved'),v.literal('rejected'))},handler:async(ctx,args)=>{
  const actor=await requireAdmin(ctx);const row=await ctx.db.get(args.id);if(!row)throw new ConvexError('الطلب غير موجود');
  await ctx.db.patch(args.id,{status:args.status,updatedAt:Date.now()});
  await ctx.db.insert('auditLog',{actor:actor._id,operation:`review:${args.status}`,section:'submissions',slug:args.id,at:Date.now()});
}});
