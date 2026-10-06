export type JournalType =
  | "Logs"
  | "Feelings"
  | "Thoughts"
  | "Ideas"
  | "Wishes"
  | "Future";

export type Journal = {
  id: number;
  title: string;
  content: string;
  type: JournalType;
  createdAt: string;
};
