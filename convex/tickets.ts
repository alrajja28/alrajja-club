import {v,ConvexError} from 'convex/values';
import {mutation} from './model';
import {requireAdmin} from './permissions';
export function validatePrices(prices:unknown){
 if(!prices||typeof prices!=='object'||Array.isArray(prices)||['vip','first','second','third'].some(k=>!Number.isSafeInteger((prices as Record<string,unknown>)[k])||Number((prices as Record<string,unknown>)[k])<0||Number((prices as Record<string,unknown>)[k])>100000000))throw new ConvexError('السعر يجب أن يكون عددًا صحيحًا بين صفر و100 مليون دينار');
}
export const saveSettings=mutation({args:{id:v.id('content'),prices:v.object({vip:v.number(),first:v.number(),second:v.number(),third:v.number()}),enabled:v.boolean()},handler:async(ctx,{id,prices,enabled})=>{
 const actor=await requireAdmin(ctx);validatePrices(prices);
 const row=await ctx.db.get(id);
 if(!row||row.section!=='matches'||row.deletedAt!==undefined)throw new ConvexError('المباراة غير موجودة');
 if(enabled&&(!row.published||row.data.status==='finished'))throw new ConvexError('افتح الحجز لمباراة منشورة وغير منتهية فقط');
 await ctx.db.patch(id,{data:{...row.data,ticketPrices:prices,ticketPrice:prices.second,ticketSalesEnabled:enabled},updatedAt:Date.now(),updatedBy:actor._id});
 await ctx.db.insert('auditLog',{actor:actor._id,operation:'ticket-settings',section:'matches',slug:row.slug,at:Date.now()});
}});
