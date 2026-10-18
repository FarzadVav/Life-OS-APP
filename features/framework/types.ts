import { type } from 'arktype';

export const FRAMEWORK_CATEGORIES = [
  'Career',
  'Mindset',
  'Social',
  'Health',
  'Behavior',
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
  content: 'string >= 1',
  category: FrameworkCategorySchema,
  section: FrameworkSectionSchema,
  'userId?': 'number',
});
export type CreateFrameworkItemData = typeof CreateFrameworkItemSchema.infer;

export const UpdateFrameworkItemSchema = type({
  'id?': 'number',
  'title?': 'string >= 1',
  'content?': 'string >= 1',
  'category?': FrameworkCategorySchema,
  'section?': FrameworkSectionSchema,
});
export type UpdateFrameworkItemData = typeof UpdateFrameworkItemSchema.infer;

/**
 * Form state for Base UI and React 19 useActionState form handling.
 */
export type FrameworkItemFormState = {
  errors?: {
    title?: string[];
    content?: string[];
    category?: string[];
    section?: string[];
    general?: string[];
  };
  message?: string;
  inputs?: {
    id?: number;
    title?: string;
    content?: string;
    category?: FrameworkCategory;
    section?: FrameworkSection;
  };
  success?: boolean;
  itemId?: number;
} | null;
