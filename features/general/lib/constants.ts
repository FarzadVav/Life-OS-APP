import {
  ArrowUpWideNarrow,
  ChartNoAxesColumnIncreasingIcon,
  CircleCheckBig,
  HomeIcon,
  ListFilterIcon,
  ListIcon,
  PenLineIcon,
  TrendingUpIcon,
  ZapIcon,
} from "lucide-react";
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
    href: "/skills",
    name: "Skills",
    matchPathname: "/skills",
    Icon: ZapIcon,
  },
  {
    name: "Disciplines",
    href: "/disciplines",
    matchPathname: "/disciplines",
    Icon: TrendingUpIcon,
  },
  {
    name: "Goals",
    href: "/goals",
    matchPathname: "/goals",
    Icon: CircleCheckBig,
  },
];
