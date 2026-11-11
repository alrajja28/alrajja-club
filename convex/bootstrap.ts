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

import legacyPeople from './legacyPeople.json';
// A section with any existing row (even deleted) belongs to the customer.
export const migratePeople=internalMutation({args:{},handler:async ctx=>{
  let count=0;
  for(const section of ['staff','management'] as const){
    if(await ctx.db.query('content').withIndex('by_section',q=>q.eq('section',section)).first())continue;
    for(const [sort,person] of legacyPeople[section].entries()){
      await ctx.db.insert('content',{section,slug:`legacy-${section}-${sort+1}`,title:person.name,data:person,published:true,sort,updatedAt:Date.now()});count++;
    }
  }
  if(count)await ctx.db.insert('auditLog',{operation:'migrate-editable-people',section:'people',slug:'legacy',at:Date.now()});
  return {count};
}});

import legacyPages from './legacyPages.json';
import legacySettings from './legacySettings.json';
export const migrateManagedContent=internalMutation({args:{},handler:async ctx=>{
 let count=0;
 if(!await ctx.db.query('content').withIndex('by_section',q=>q.eq('section','pages')).first()){
  for(const [sort,page] of legacyPages.entries()){
   await ctx.db.insert('content',{section:'pages',slug:`legacy-page-${sort+1}`,title:page.title,data:page,published:true,sort,updatedAt:Date.now()});count++;
  }
 }
 const settings=await ctx.db.query('content').withIndex('by_section',q=>q.eq('section','settings')).first();
 if(settings&&settings.deletedAt===undefined){
  const missing=Object.fromEntries(Object.entries(legacySettings).filter(([key])=>settings.data[key]===undefined));
  if(Object.keys(missing).length)await ctx.db.patch(settings._id,{data:{...missing,...settings.data},updatedAt:Date.now()});
 }
 if(count)await ctx.db.insert('auditLog',{operation:'migrate-managed-content',section:'pages',slug:'legacy',at:Date.now()});
 return {count};
}});
