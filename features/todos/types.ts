import { type } from 'arktype';

/**
 * ArkType schema and inferred type for Todo type variants.
 */
export const TodoTypeSchema = type.enumerated('Daily', 'Upcoming', 'Mission');
export type TodoType = typeof TodoTypeSchema.infer;

/**
 * Summary schema for Life Area referenced in Todo and Disciplines.
 */
export const TodoLifeAreaSummarySchema = type({
  id: 'number',
  title: 'string',
  'vision?': 'string',
});

/**
 * ArkType schema and inferred type for sub-action items in missions.
 */
export const TodoActionSchema = type({
  id: 'number',
  title: 'string',
  deadline: 'string',
  isDone: 'boolean',
  'createdAt?': 'string',
  'updatedAt?': 'string',
});
export type TodoAction = typeof TodoActionSchema.infer;

/**
 * ArkType schema for recurring discipline completion history.
 */
export const TodoDisciplineHistorySchema = type({
  date: 'string',
  isDone: 'boolean',
});

/**
 * ArkType schema and inferred type for recurring mission disciplines.
 */
export const TodoDisciplineSchema = type({
  id: 'number',
  title: 'string',
  'lifeAreaId?': 'number | null',
  'lifeArea?': TodoLifeAreaSummarySchema,
  'history?': TodoDisciplineHistorySchema.array(),
});
export type TodoDiscipline = typeof TodoDisciplineSchema.infer;

/**
 * ArkType schema and inferred type for a complete Todo entity.
 */
export const TodoSchema = type({
  id: 'number',
  title: 'string',
  description: 'string',
  deadline: 'string',
  type: TodoTypeSchema,
  isDone: 'boolean',
  'difficulty?': 'number',
  'lifeAreaId?': 'number | null',
  'lifeArea?': TodoLifeAreaSummarySchema,
  'actions?': TodoActionSchema.array(),
  'disciplines?': TodoDisciplineSchema.array(),
  'createdAt?': 'string',
  'updatedAt?': 'string',
});
export type Todo = typeof TodoSchema.infer;

/**
 * ArkType schemas for Todo Repository mutations and data operations.
 */
export const CreateTodoSchema = type({
  title: 'string >= 1',
  'description?': 'string',
  type: TodoTypeSchema,
  deadline: 'string >= 1',
  'difficulty?': 'number',
  'lifeAreaId?': 'number | null',
  'isDone?': 'boolean',
  'actions?': type({
    'id?': 'number',
    title: 'string >= 1',
    deadline: 'string >= 1',
    'isDone?': 'boolean',
  }).array(),
  'disciplines?': type({
    'id?': 'number',
    title: 'string >= 1',
    'lifeAreaId?': 'number | null',
  }).array(),
});
export type CreateTodoData = typeof CreateTodoSchema.infer;

export const UpdateTodoSchema = type({
  'id?': 'number',
  'title?': 'string >= 1',
  'description?': 'string',
  'type?': TodoTypeSchema,
  'deadline?': 'string >= 1',
  'isDone?': 'boolean',
  'difficulty?': 'number',
  'lifeAreaId?': 'number | null',
  'actions?': type({
    'id?': 'number',
    title: 'string >= 1',
    deadline: 'string >= 1',
    'isDone?': 'boolean',
  }).array(),
  'disciplines?': type({
    'id?': 'number',
    title: 'string >= 1',
    'lifeAreaId?': 'number | null',
  }).array(),
});
export type UpdateTodoData = typeof UpdateTodoSchema.infer;

export const CreateActionSchema = type({
  title: 'string >= 1',
  deadline: 'string >= 1',
  'isDone?': 'boolean',
});
export type CreateActionData = typeof CreateActionSchema.infer;

export const UpdateActionSchema = type({
  'title?': 'string >= 1',
  'deadline?': 'string >= 1',
  'isDone?': 'boolean',
});
export type UpdateActionData = typeof UpdateActionSchema.infer;

export const CreateDisciplineSchema = type({
  title: 'string >= 1',
  'lifeAreaId?': 'number | null',
});
export type CreateDisciplineData = typeof CreateDisciplineSchema.infer;

/**
 * Form state for Base UI and React 19 useActionState form handling.
 */
export type TodoFormState = {
  errors?: {
    title?: string[];
    description?: string[];
    type?: string[];
    deadline?: string[];
    difficulty?: string[];
    lifeAreaId?: string[];
    general?: string[];
  };
  message?: string;
  inputs?: {
    id?: number;
    title?: string;
    description?: string;
    type?: TodoType;
    deadline?: string;
    difficulty?: number;
    lifeAreaId?: number | null;
  };
  success?: boolean;
  todoId?: number;
} | null;
