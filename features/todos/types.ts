export type TodoType = "Daily" | "Upcoming" | "Mission";

export type TodoAction = {
  id: number;
  title: string;
  deadline: string;
  isDone: boolean;
};

export type TodoDiscipline = {
  id: number;
  title: string;
  repeatInterval: string;
  history?: { date: string; isDone: boolean }[];
};

export type Todo = {
  id: number;
  title: string;
  deadline: string;
  type: TodoType;
  isDone: boolean;
  difficulty?: number;
  actions?: TodoAction[];
  disciplines?: TodoDiscipline[];
};
