import { CheckSquareIcon, HomeIcon, ListIcon, PenLineIcon } from "lucide-react";
import { FeaturesAreas, NavigationLink } from "./types";

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