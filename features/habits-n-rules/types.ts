import { type } from 'arktype';

/**
 * Summary schema for Life Area referenced in Habit.
 */
export const HabitLifeAreaSummarySchema = type({
  id: 'number',
  title: 'string',
});

/**
 * Schema for habit check-in completion history.
 */
export const HabitHistoryItemSchema = type({
  id: 'number',
  date: 'string',
  isDone: 'boolean',
});

/**
 * ArkType schema and inferred type for Habit entity.
 */
export const HabitSchema = type({
  id: 'number',
  title: 'string',
  description: 'string',
  'lifeAreaId?': 'number | null',
  'lifeArea?': HabitLifeAreaSummarySchema,
  'history?': HabitHistoryItemSchema.array(),
  'createdAt?': 'string',
  'updatedAt?': 'string',
});
export type Habit = typeof HabitSchema.infer;

/**
 * ArkType schema for creating a Habit.
 */
export const CreateHabitSchema = type({
  title: 'string >= 1',
  'description?': 'string',
  'lifeAreaId?': 'number | null',
});
export type CreateHabitData = typeof CreateHabitSchema.infer;

/**
 * ArkType schema for updating a Habit.
 */
export const UpdateHabitSchema = type({
  'id?': 'number',
  'title?': 'string >= 1',
  'description?': 'string',
  'lifeAreaId?': 'number | null',
});
export type UpdateHabitData = typeof UpdateHabitSchema.infer;

export type HabitFormState = {
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
  habitId?: number;
} | null | undefined;
