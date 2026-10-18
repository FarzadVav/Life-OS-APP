import { type } from 'arktype';

export const JOURNAL_CATEGORIES = [
  'Logs',
  'Thoughts',
  'Feelings',
  'Lessons',
  'Ideas',
  'Notes',
] as const;

/**
 * ArkType schema and inferred type for Journal categories.
 */
export const JournalCategorySchema = type.enumerated(...JOURNAL_CATEGORIES);
export type JournalCategory = typeof JournalCategorySchema.infer;

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
  'userId?': 'number',
});
export type CreateJournalData = typeof CreateJournalSchema.infer;

export const UpdateJournalSchema = type({
  'id?': 'number',
  'title?': 'string >= 1',
  'content?': 'string >= 1',
  'type?': JournalCategorySchema,
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
    general?: string[];
  };
  message?: string;
  inputs?: {
    id?: number;
    title?: string;
    content?: string;
    type?: JournalCategory;
  };
  success?: boolean;
  journalId?: number;
} | null;
