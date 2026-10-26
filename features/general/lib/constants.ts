import {
  PenLineIcon,
  UserIcon,
  Repeat2Icon,
  CircleCheckBig,
  DatabaseIcon,
} from "lucide-react";

import { FeaturesAreas, LifeArea, NavigationLink } from "./types";

export const APP_PROFILE = {
  name: "Arrow Up",
  themeColor: "#fafafa",
  description:
    "Personal operating system for moving up and managing the land of the mind",
  icons: {
    favicon: {
      sizes: "32x32",
      type: "image/png",
      url: "/icon-fav.png",
    },
    apple: {
      sizes: "180x180",
      type: "image/png",
      url: "/icon-apple-touch.png",
    },
    192: {
      sizes: "192x192",
      type: "image/png",
      url: "/icon-192x192.png",
    },
    512: {
      sizes: "512x512",
      type: "image/png",
      url: "/icon-512x512.png",
    },
  },
};

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
    href: "/profile",
    name: "Profile",
    matchPathname: "/profile",
    Icon: UserIcon,
  },
  {
    name: "Todos",
    href: "/todos",
    matchPathname: "/todos",
    Icon: CircleCheckBig,
  },
  {
    name: "Habits and Rules",
    href: "/habits-n-rules",
    matchPathname: "/habits-n-rules",
    Icon: Repeat2Icon,
  },
  {
    name: "Skills",
    href: "/skills",
    matchPathname: "/skills",
    Icon: DatabaseIcon,
  },
  {
    href: "/journals",
    name: "Journals",
    matchPathname: "/journals",
    Icon: PenLineIcon,
  },
];
