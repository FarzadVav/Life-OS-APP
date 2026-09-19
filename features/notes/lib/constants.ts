import { Note } from "./types";
import { LIFE_AREAS_DATA } from "@/features/general/lib/constants";

export const NOTES_DATA: Note[] = [
  {
    id: 1,
    content: "Hello world Lorem ipsum dolor, sit amet consectetur adipisicing elit. Laudantium fugit deleniti aut vitae modi. Quod ipsum assumenda fugit nobis, dolor quae ea voluptate repellat, exercitationem aut non numquam tempora reprehenderit",
    isArchived: false,
    createdAt: "2026",
    updatedAt: "2026",
    areas: [LIFE_AREAS_DATA[0]],
  },
  {
    id: 2,
    content: "What is this bulshit Lorem ipsum dolor, sit amet consectetur adipisicing elit. Laudantium fugit deleniti aut vitae modi. Quod ipsum assumenda fugit nobis, dolor quae ea voluptate repellat, exercitationem aut non numquam tempora reprehenderit",
    isArchived: false,
    createdAt: "2026",
    updatedAt: "2026",
    areas: [LIFE_AREAS_DATA[1]],
  },
  {
    id: 3,
    content: "Fix the bugs Lorem ipsum dolor, sit amet consectetur adipisicing elit. Laudantium fugit deleniti aut vitae modi. Quod ipsum assumenda fugit nobis, dolor quae ea voluptate repellat, exercitationem aut non numquam tempora reprehenderit",
    isArchived: false,
    createdAt: "2026",
    updatedAt: "2026",
    areas: [LIFE_AREAS_DATA[2]],
  },
];
