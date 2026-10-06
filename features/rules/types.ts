export type RuleCategory =
  | "Discipline"
  | "Health"
  | "Mindset"
  | "Productivity"
  | "Finance";

export type Rule = {
  id: number;
  title: string;
  category: RuleCategory;
  description?: string;
  createdAt: string;
};
