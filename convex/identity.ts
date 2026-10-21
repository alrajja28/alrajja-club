import {ConvexError} from 'convex/values';
import {mutation} from './model';
import {verifiedGoogleIdentity} from './permissions';

export const ensureUser=mutation({args:{},handler:async ctx=>{
 const identity=await verifiedGoogleIdentity(ctx);
 if(!identity)throw new ConvexError('يلزم تسجيل Google موثّق تابع لتطبيق النادي');
 const mapping=await ctx.db.query('googleIdentities').withIndex('by_identity',q=>q.eq('identity',identity.tokenIdentifier)).unique();
 const profile={email:identity.email!,name:identity.name??'مشجع رجاوي',...(identity.pictureUrl?{image:identity.pictureUrl}:{}),emailVerificationTime:Date.now()};
 if(mapping){await ctx.db.patch(mapping.userId,profile);return mapping.userId;}
 const userId=await ctx.db.insert('users',profile);
 await ctx.db.insert('googleIdentities',{identity:identity.tokenIdentifier,userId});
 return userId;
}});
