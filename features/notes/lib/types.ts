import { LifeArea } from "@/features/general/lib/types";

export type Note = {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  isArchived: boolean;

  areas: LifeArea[];
}