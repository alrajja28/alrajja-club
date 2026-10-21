import { ConvexError } from 'convex/values';
import type { QueryCtx, MutationCtx } from './model';

export async function verifiedGoogleIdentity(ctx:QueryCtx|MutationCtx){
  const identity=await ctx.auth.getUserIdentity();
  const project=process.env.FIREBASE_PROJECT_ID;
  if(!project||!identity||identity.issuer!==`https://securetoken.google.com/${project}`||identity.emailVerified!==true||!identity.email)return null;
  const provider=identity.firebase;
  if(!provider||typeof provider!=='object'||Array.isArray(provider)||provider.sign_in_provider!=='google.com')return null;
  return identity;
}

export async function currentUser(ctx: QueryCtx | MutationCtx) {
  const identity=await verifiedGoogleIdentity(ctx);if(!identity)return null;
  const mapping=await ctx.db.query('googleIdentities').withIndex('by_identity',q=>q.eq('identity',identity.tokenIdentifier)).unique();
  const user=mapping?await ctx.db.get(mapping.userId):null;
  return user?{...user,email:identity.email,name:identity.name??user.name,image:identity.pictureUrl??user.image}:null;
}

export function isAdminEmail(email?: string) {
  const admins = (process.env.ADMIN_EMAILS ?? '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
  return Boolean(email && admins.includes(email.toLowerCase()));
}

export async function requireAdmin(ctx: QueryCtx | MutationCtx) {
  const user = await currentUser(ctx);
  if (!user || !isAdminEmail(user.email)) throw new ConvexError('ليس لديك تصريح لإدارة النادي');
  return user;
}
