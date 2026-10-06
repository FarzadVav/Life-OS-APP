import { Todo, TodoType } from "./types";

export const TODO_TYPES: { value: TodoType; label: string }[] = [
  { value: "Daily", label: "Daily" },
  { value: "Upcoming", label: "Upcoming" },
];

export const todos: Todo[] = [
  {
    id: 1,
    title: "Review pull requests and deploy SaaS hotfix",
    deadline: "10:30",
    type: "Daily",
    isDone: true,
  },
  {
    id: 2,
    title: "Cold shower and 20-minute mobility routine",
    deadline: "07:00",
    type: "Daily",
    isDone: true,
  },
  {
    id: 3,
    title: "Deep work: Write 500 lines of core logic",
    deadline: "13:00",
    type: "Daily",
    isDone: false,
  },
  {
    id: 4,
    title: "Read 20 pages of Systems Architecture",
    deadline: "18:00",
    type: "Daily",
    isDone: false,
  },
  {
    id: 5,
    title: "Track macros and drink 3L water",
    deadline: "21:30",
    type: "Daily",
    isDone: false,
  },
  {
    id: 6,
    title: "Prepare presentation for Q4 product roadmap",
    deadline: "2026-10-12",
    type: "Upcoming",
    isDone: false,
  },
  {
    id: 7,
    title: "Finalize Stripe payment gateway integration",
    deadline: "2026-10-15",
    type: "Upcoming",
    isDone: false,
  },
  {
    id: 8,
    title: "Schedule quarterly team sync and performance reviews",
    deadline: "2026-10-20",
    type: "Upcoming",
    isDone: false,
  },
  {
    id: 9,
    title: "Renew developer server & cloud certificates",
    deadline: "2026-10-28",
    type: "Upcoming",
    isDone: true,
  },
  {
    id: 10,
    title: "Deploy public marketing landing page v2",
    deadline: "2026-11-01",
    type: "Upcoming",
    isDone: false,
  },
];
