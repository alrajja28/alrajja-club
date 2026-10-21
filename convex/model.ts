import { queryGeneric, mutationGeneric } from 'convex/server';
import type { DataModelFromSchemaDefinition, GenericQueryCtx, GenericMutationCtx, QueryBuilder, MutationBuilder } from 'convex/server';
import schema from './schema';
type DataModel = DataModelFromSchemaDefinition<typeof schema>;
export type QueryCtx = GenericQueryCtx<DataModel>;
export type MutationCtx = GenericMutationCtx<DataModel>;
export const query: QueryBuilder<DataModel, 'public'> = queryGeneric;
export const mutation: MutationBuilder<DataModel, 'public'> = mutationGeneric;
