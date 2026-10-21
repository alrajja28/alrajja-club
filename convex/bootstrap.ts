import {internalMutation} from './_generated/server';
import initialContent from './initialContent.json';
// Deployment-only initialization. Never exposed through a public API or fan UI.
export const initialize=internalMutation({args:{},handler:async ctx=>{
  if(await ctx.db.query('content').first())return {initialized:false,reason:'Content already exists'};
  let count=0;
  for(const [section,rows] of Object.entries(initialContent))for(const [sort,value] of rows.entries()){
    const data=value as Record<string,unknown>;
    await ctx.db.insert('content',{section:section as 'products',slug:String(data.id??`item-${sort+1}`),title:String(data.title??data.name??`item-${sort+1}`),data,published:true,sort,updatedAt:Date.now()});count++;
  }
  await ctx.db.insert('auditLog',{operation:'deployment-initialize',section:'all',slug:'initial',at:Date.now()});
  return {initialized:true,count};
}});
