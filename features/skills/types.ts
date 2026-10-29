import { type } from 'arktype';

/**
 * Summary schema for Life Area referenced in Skill.
 */
export const SkillLifeAreaSummarySchema = type({
  id: 'number',
  title: 'string',
  'vision?': 'string',
});

/**
 * ArkType schema and inferred type for a complete Skill entity.
 */
export const SkillSchema = type({
  id: 'number',
  title: 'string',
  content: 'string',
  'lifeAreaId?': 'number | null',
  'lifeArea?': SkillLifeAreaSummarySchema,
  'tag?': 'string | null',
  'createdAt?': 'string',
  'updatedAt?': 'string',
});
export type Skill = typeof SkillSchema.infer;

/**
 * ArkType schemas for Skill data operations.
 */
export const CreateSkillSchema = type({
  title: 'string >= 1',
  content: 'string',
  'lifeAreaId?': 'number | null',
  'tag?': 'string | null',
});
export type CreateSkillData = typeof CreateSkillSchema.infer;

export const UpdateSkillSchema = type({
  'id?': 'number',
  'title?': 'string >= 1',
  'content?': 'string',
  'lifeAreaId?': 'number | null',
  'tag?': 'string | null',
});
export type UpdateSkillData = typeof UpdateSkillSchema.infer;

export type SkillFormState = {
  errors?: {
    title?: string[];
    content?: string[];
    lifeAreaId?: string[];
    tag?: string[];
    general?: string[];
  };
  inputs?: {
    title?: string;
    content?: string;
    lifeAreaId?: number | null;
    tag?: string | null;
  };
  success?: boolean;
  skillId?: number;
} | null | undefined;

/**
 * ArkType schema and inferred type for the SkillTag entity.
 * A tag belongs to one life area; lifeAreaId null scopes it to the General area.
 */
export const SkillTagSchema = type({
  id: 'number',
  title: 'string',
  lifeAreaId: 'number | null',
  'createdAt?': 'string',
  'updatedAt?': 'string',
});
export type SkillTag = typeof SkillTagSchema.infer;

export const CreateSkillTagSchema = type({
  title: 'string >= 1',
  lifeAreaId: 'number | null',
});
export type CreateSkillTagData = typeof CreateSkillTagSchema.infer;

export const UpdateSkillTagSchema = type({
  id: 'number',
  'title?': 'string >= 1',
  'lifeAreaId?': 'number | null',
});
export type UpdateSkillTagData = typeof UpdateSkillTagSchema.infer;

export type SkillTagFormState = {
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
