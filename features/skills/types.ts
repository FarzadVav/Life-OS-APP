import { type } from 'arktype';

/**
 * Summary schema for Life Area referenced in Skill.
 */
export const SkillLifeAreaSummarySchema = type({
  id: 'number',
  title: 'string',
  'vision?': 'string',
});
export type SkillLifeAreaSummary = typeof SkillLifeAreaSummarySchema.infer;

/**
 * ArkType schema and inferred type for a complete Skill entity.
 */
export const SkillSchema = type({
  id: 'number',
  title: 'string',
  content: 'string',
  'lifeAreaId?': 'number | null',
  'lifeArea?': SkillLifeAreaSummarySchema,
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
  'userId?': 'number',
});
export type CreateSkillData = typeof CreateSkillSchema.infer;

export const UpdateSkillSchema = type({
  'id?': 'number',
  'title?': 'string >= 1',
  'content?': 'string',
  'lifeAreaId?': 'number | null',
});
export type UpdateSkillData = typeof UpdateSkillSchema.infer;

export type SkillFormState = {
  errors?: {
    title?: string[];
    content?: string[];
    lifeAreaId?: string[];
    general?: string[];
  };
  inputs?: {
    title?: string;
    content?: string;
    lifeAreaId?: number | null;
  };
  success?: boolean;
  skillId?: number;
} | null | undefined;
