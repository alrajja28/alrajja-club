import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';
import { authTables } from '@convex-dev/auth/server';

export const section = v.union(
  v.literal('products'), v.literal('news'), v.literal('media'),
  v.literal('stream'), v.literal('matches'), v.literal('players'),
  v.literal('academy'), v.literal('settings'), v.literal('standings'),
);

export default defineSchema({
  ...authTables,
  content: defineTable({
    section, slug: v.string(), title: v.string(), data: v.any(),
    published: v.boolean(), sort: v.number(), updatedAt: v.number(),
    updatedBy: v.optional(v.id('users')),
  }).index('by_section', ['section']).index('by_section_slug', ['section', 'slug']),
  uploads: defineTable({
    storageId: v.id('_storage'), owner: v.id('users'),
    filename: v.string(), mimeType: v.string(), size: v.number(), createdAt: v.number(),
  }).index('by_storage', ['storageId']).index('by_owner', ['owner']),
  auditLog: defineTable({
    actor: v.optional(v.id('users')), operation: v.string(), section: v.string(),
    slug: v.string(), at: v.number(),
  }).index('by_time', ['at']),
  submissions: defineTable({
    owner:v.id('users'),kind:v.union(v.literal('academy'),v.literal('contact'),v.literal('tickets')),
    data:v.any(),nonce:v.string(),status:v.union(v.literal('pending'),v.literal('approved'),v.literal('rejected')),
    createdAt:v.number(),updatedAt:v.number(),
  }).index('by_owner',['owner']).index('by_owner_nonce',['owner','nonce']).index('by_created',['createdAt']),
});
