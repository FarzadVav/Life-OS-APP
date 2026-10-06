export type JournalCategory = {
  id: number;
  name: string;
};

export type JournalType = string;

export type Journal = {
  id: number;
  title: string;
  content: string;
  type?: JournalType;
  createdAt: string;
};
