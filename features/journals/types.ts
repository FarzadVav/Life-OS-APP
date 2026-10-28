import { type } from 'arktype';

export const JOURNAL_CATEGORY_NAMES = [
  'Logs',
  'Thoughts',
  'Feelings',
  'Ideas',
  'Notes',
] as const;

/**
 * ArkType schema and inferred type for Journal categories.
 */
export const JournalCategorySchema = type.enumerated(...JOURNAL_CATEGORY_NAMES);
export type JournalCategory = typeof JournalCategorySchema.infer;

/**
 * Journal category definition with associated tags.
 */
export type JournalCategoryDefinition = {
  name: JournalCategory;
  tags: string[];
};

/**
 * Predefined journal categories with tags field.
 * By default, categories have no tags (empty array).
 */
export const JOURNAL_CATEGORIES: JournalCategoryDefinition[] = [
  {
    name: 'Logs',
    tags: [],
  },
  {
    name: 'Thoughts',
    tags: [],
  },
  {
    name: 'Feelings',
    tags: [],
  },
  {
    name: 'Ideas',
    tags: [],
  },
  {
    name: 'Notes',
    tags: [],
  },
];

/**
 * Helper to find a category definition by its name (case-insensitive).
 */
export function getJournalCategory(
  categoryName?: string | null,
): JournalCategoryDefinition | undefined {
  if (!categoryName) return undefined;
  return JOURNAL_CATEGORIES.find(
    (c) => c.name.toLowerCase() === categoryName.toLowerCase(),
  );
}

/**
 * Helper to get available tags for a given category.
 */
export function getCategoryTags(categoryName?: string | null): string[] {
  const cat = getJournalCategory(categoryName);
  return cat ? [...cat.tags] : [];
}

/**
 * ArkType schema and inferred type for Journal type variant.
 */
export const JournalTypeSchema = JournalCategorySchema.or('string');
export type JournalType = typeof JournalTypeSchema.infer;

/**
 * ArkType schema and inferred type for Journal entity.
 */
export const JournalSchema = type({
  id: 'number',
  title: 'string',
  content: 'string',
  type: JournalTypeSchema,
  'tag?': 'string | null',
  createdAt: 'string',
});
export type Journal = typeof JournalSchema.infer;

/**
 * ArkType schemas for Journal Repository operations.
 */
export const CreateJournalSchema = type({
  title: 'string >= 1',
  content: 'string >= 1',
  type: JournalCategorySchema,
  'tag?': 'string | null',
});
export type CreateJournalData = typeof CreateJournalSchema.infer;

export const UpdateJournalSchema = type({
  'id?': 'number',
  'title?': 'string >= 1',
  'content?': 'string >= 1',
  'type?': JournalCategorySchema,
  'tag?': 'string | null',
});
export type UpdateJournalData = typeof UpdateJournalSchema.infer;

/**
 * Form state for Base UI and React 19 useActionState form handling.
 */
export type JournalFormState = {
  errors?: {
    title?: string[];
    content?: string[];
    type?: string[];
    tag?: string[];
    general?: string[];
  };
  message?: string;
  inputs?: {
    id?: number;
    title?: string;
    content?: string;
    type?: JournalCategory;
    tag?: string | null;
  };
  success?: boolean;
  journalId?: number;
} | null;

/**
 * ArkType schema and inferred type for JournalTag entity.
 */
export const JournalTagSchema = type({
  id: 'number',
  title: 'string',
  category: JournalCategorySchema,
  'createdAt?': 'string',
  'updatedAt?': 'string',
});
export type JournalTag = typeof JournalTagSchema.infer;

export const CreateJournalTagSchema = type({
  title: 'string >= 1',
  category: JournalCategorySchema,
});
export type CreateJournalTagData = typeof CreateJournalTagSchema.infer;

export const UpdateJournalTagSchema = type({
  id: 'number',
  'title?': 'string >= 1',
  'category?': JournalCategorySchema,
});
export type UpdateJournalTagData = typeof UpdateJournalTagSchema.infer;

export type JournalTagFormState = {
  errors?: {
    title?: string[];
    category?: string[];
    general?: string[];
  };
  message?: string;
  inputs?: {
    id?: number;
    title?: string;
    category?: JournalCategory;
  };
  success?: boolean;
  tagId?: number;
} | null;

