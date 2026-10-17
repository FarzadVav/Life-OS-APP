export const JOURNAL_CATEGORIES = [
  "Logs",
  "Thoughts",
  "Feelings",
  "Lessons",
  "Ideas",
  "Notes",
] as const;

export type JournalCategory = (typeof JOURNAL_CATEGORIES)[number];

export type JournalType = JournalCategory | string;

export type Journal = {
  id: number;
  title: string;
  content: string;
  type: JournalType;
  createdAt: string;
};
