import { type } from 'arktype';

/**
 * ArkType schema and inferred type for a complete LifeArea entity.
 */
export const LifeAreaSchema = type({
  id: 'number',
  title: 'string',
  vision: 'string',
  'createdAt?': 'string',
  'updatedAt?': 'string',
});
export type LifeArea = typeof LifeAreaSchema.infer;

/**
 * ArkType schemas for LifeArea data operations.
 */
export const CreateLifeAreaSchema = type({
  title: 'string >= 1',
  vision: 'string',
});
export type CreateLifeAreaData = typeof CreateLifeAreaSchema.infer;

export const UpdateLifeAreaSchema = type({
  'id?': 'number',
  'title?': 'string >= 1',
  'vision?': 'string',
});
export type UpdateLifeAreaData = typeof UpdateLifeAreaSchema.infer;

export type LifeAreaFormState = {
  errors?: {
    title?: string[];
    vision?: string[];
    general?: string[];
  };
  inputs?: {
    title?: string;
    vision?: string;
  };
  success?: boolean;
  lifeAreaId?: number;
} | null | undefined;
