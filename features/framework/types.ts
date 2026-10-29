import { type } from 'arktype';

/**
 * Summary schema for Life Area referenced in Framework.
 */
export const FrameworkLifeAreaSummarySchema = type({
  id: 'number',
  title: 'string',
});

/**
 * Schema for framework check-in completion history.
 */
export const FrameworkHistoryItemSchema = type({
  id: 'number',
  date: 'string',
  isDone: 'boolean',
});

/**
 * ArkType schema and inferred type for Framework entity.
 */
export const FrameworkSchema = type({
  id: 'number',
  title: 'string',
  description: 'string',
  'lifeAreaId?': 'number | null',
  'lifeArea?': FrameworkLifeAreaSummarySchema,
  'tag?': 'string | null',
  'history?': FrameworkHistoryItemSchema.array(),
  'createdAt?': 'string',
  'updatedAt?': 'string',
});
export type Framework = typeof FrameworkSchema.infer;

/**
 * ArkType schema for creating a Framework.
 */
export const CreateFrameworkSchema = type({
  title: 'string >= 1',
  'description?': 'string',
  'lifeAreaId?': 'number | null',
  'tag?': 'string | null',
});
export type CreateFrameworkData = typeof CreateFrameworkSchema.infer;

/**
 * ArkType schema for updating a Framework.
 */
export const UpdateFrameworkSchema = type({
  'id?': 'number',
  'title?': 'string >= 1',
  'description?': 'string',
  'lifeAreaId?': 'number | null',
  'tag?': 'string | null',
});
export type UpdateFrameworkData = typeof UpdateFrameworkSchema.infer;

export type FrameworkFormState = {
  errors?: {
    title?: string[];
    description?: string[];
    lifeAreaId?: string[];
    tag?: string[];
    general?: string[];
  };
  inputs?: {
    title?: string;
    description?: string;
    lifeAreaId?: number | null;
    tag?: string | null;
  };
  success?: boolean;
  frameworkId?: number;
} | null | undefined;

/**
 * ArkType schema and inferred type for the FrameworkTag entity.
 * A tag belongs to one life area; lifeAreaId null scopes it to the General area.
 */
export const FrameworkTagSchema = type({
  id: 'number',
  title: 'string',
  lifeAreaId: 'number | null',
  'createdAt?': 'string',
  'updatedAt?': 'string',
});
export type FrameworkTag = typeof FrameworkTagSchema.infer;

export const CreateFrameworkTagSchema = type({
  title: 'string >= 1',
  lifeAreaId: 'number | null',
});
export type CreateFrameworkTagData = typeof CreateFrameworkTagSchema.infer;

export const UpdateFrameworkTagSchema = type({
  id: 'number',
  'title?': 'string >= 1',
  'lifeAreaId?': 'number | null',
});
export type UpdateFrameworkTagData = typeof UpdateFrameworkTagSchema.infer;

export type FrameworkTagFormState = {
  errors?: {
    title?: string[];
    lifeAreaId?: string[];
    general?: string[];
  };
  message?: string;
  inputs?: {
    id?: number;
    title?: string;
    lifeAreaId?: number | null;
  };
  success?: boolean;
  tagId?: number;
} | null;
