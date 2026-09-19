import { CheckSquareIcon, HomeIcon, ListIcon, PenLineIcon } from "lucide-react";
import { FeaturesAreas, LifeArea, NavigationLink } from "./types";

export const LIFE_AREAS_DATA: LifeArea[] = [
  { id: 1, title: "Work" },
  { id: 2, title: "Sport" },
  { id: 3, title: "Connections" },
];

export const FEATURES_AREAS: FeaturesAreas[] = [
  "notes",
  "journals",
  "habits",
  "todos",
];

export const NAVIGATION_LINKS: NavigationLink[] = [
  {
    name: "Home",
    href: "/",
    matchPathname: "//",
    Icon: HomeIcon,
  },
  {
    href: "/journals",
    name: "Journals",
    matchPathname: "/journals",
    Icon: PenLineIcon,
  },
  {
    name: "Habits",
    href: "/habits",
    matchPathname: "/habits",
    Icon: ListIcon,
  },
  {
    name: "Todos",
    href: "/todos",
    matchPathname: "/todos",
    Icon: CheckSquareIcon,
  },
];
