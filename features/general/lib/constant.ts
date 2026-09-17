import { CheckSquareIcon, HomeIcon, ListIcon, PenLineIcon } from "lucide-react";

export const NAVIGATION_LINKS = [
  {
    name: "Home",
    href: "/",
    matchPathname: "//",
    Icon: HomeIcon,
  },
  {
    name: "Journals",
    href: "/journals",
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
