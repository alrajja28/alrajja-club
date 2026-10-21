import { ConvexError } from 'convex/values';
import { getAuthUserId } from '@convex-dev/auth/server';
import type { QueryCtx, MutationCtx } from './model';

export async function currentUser(ctx: QueryCtx | MutationCtx) {
  const id = await getAuthUserId(ctx);
  return id ? ctx.db.get(id) : null;
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
