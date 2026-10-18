import { type } from 'arktype';

export const FRAMEWORK_CATEGORIES = [
  'Career',
  'Mindset',
  'Social',
  'Health',
  'Behavior',
  'Finance',
  'Lifestyle',
  'Knowledge',
] as const;

/**
 * ArkType schema and inferred type for Framework categories.
 */
export const FrameworkCategorySchema = type.enumerated(...FRAMEWORK_CATEGORIES);
export type FrameworkCategory = typeof FrameworkCategorySchema.infer;

export const FRAMEWORK_SECTIONS = ['Visions', 'Rules', 'Concepts'] as const;

/**
 * ArkType schema and inferred type for Framework sections.
 */
export const FrameworkSectionSchema = type.enumerated(...FRAMEWORK_SECTIONS);
export type FrameworkSection = typeof FrameworkSectionSchema.infer;

/**
 * ArkType schema and inferred type for a complete Framework item.
 */
export const FrameworkItemSchema = type({
  id: 'number',
  title: 'string',
  content: 'string',
  category: FrameworkCategorySchema,
  section: FrameworkSectionSchema,
  createdAt: 'string',
});
export type FrameworkItem = typeof FrameworkItemSchema.infer;

/**
 * ArkType schemas for Framework Repository operations.
 */
export const CreateFrameworkItemSchema = type({
  title: 'string >= 1',
  content: 'string',
  category: FrameworkCategorySchema,
  section: FrameworkSectionSchema,
  'userId?': 'number',
});
export type CreateFrameworkItemData = typeof CreateFrameworkItemSchema.infer;

export const UpdateFrameworkItemSchema = type({
  'title?': 'string >= 1',
  'content?': 'string',
  'category?': FrameworkCategorySchema,
  'section?': FrameworkSectionSchema,
});
export type UpdateFrameworkItemData = typeof UpdateFrameworkItemSchema.infer;
