export type TodoType = "Daily" | "Upcoming";

export type Todo = {
  id: number;
  title: string;
  deadline: string;
  type: TodoType;
  isDone: boolean;
};
