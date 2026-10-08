import {
  HomeIcon,
  LayersIcon,
  PenLineIcon,
  ShieldBanIcon,
  CircleCheckBig,
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
    Icon: LayersIcon,
  },
  {
    name: "Rules",
    href: "/rules",
    matchPathname: "/rules",
    Icon: ShieldBanIcon,
  },
  {
    name: "Missions",
    href: "/missions",
    matchPathname: "/missions",
    Icon: CircleCheckBig,
  },
];
