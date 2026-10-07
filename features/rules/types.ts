export type Rule = {
  id: number;
  title: string;
  description?: string;
  repeatInterval: string;
  history?: { date: string; isDone: boolean }[];
  createdAt: string;
};
