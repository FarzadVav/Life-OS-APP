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
});
export type UpdateFrameworkData = typeof UpdateFrameworkSchema.infer;

export type FrameworkFormState = {
  errors?: {
    title?: string[];
    description?: string[];
    lifeAreaId?: string[];
    general?: string[];
  };
  inputs?: {
    title?: string;
    description?: string;
    lifeAreaId?: number | null;
  };
  success?: boolean;
  frameworkId?: number;
} | null | undefined;
