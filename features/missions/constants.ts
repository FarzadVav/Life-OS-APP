import { Mission } from "./types";

export const missions: Mission[] = [
  {
    id: 1,
    title: "Build and launch my SaaS",
    deadline: "2026-12-20",
    difficulty: 5,
    actions: [
      {
        id: 1,
        title: "Finalize MVP feature set",
        deadline: "2026-10-15",
        isDone: true,
      },
      {
        id: 2,
        title: "Build landing page",
        deadline: "2026-10-25",
        isDone: true,
      },
      {
        id: 3,
        title: "Implement payment system",
        deadline: "2026-11-05",
        isDone: false,
      },
      {
        id: 4,
        title: "Deploy production version",
        deadline: "2026-11-20",
        isDone: false,
      },
      {
        id: 5,
        title: "Acquire first 10 customers",
        deadline: "2026-12-20",
        isDone: false,
      },
    ],
    disciplines: [
      {
        id: 1,
        title: "Work on the product every day",
        repeatInterval: "Every 1 Day",
        history: [{ date: '2026-10-06T10:00:00Z', isDone: true }, { date: '2026-10-07T10:00:00Z', isDone: false }],
      },
      {
        id: 2,
        title: "Talk to potential customers",
        repeatInterval: "Every 1 Day",
        history: [{ date: '2026-10-06T10:00:00Z', isDone: true }, { date: '2026-10-07T10:00:00Z', isDone: false }],
      },
      {
        id: 3,
        title: "Publish business-related content",
        repeatInterval: "Every 1 Day",
        history: [{ date: '2026-10-06T10:00:00Z', isDone: true }, { date: '2026-10-07T10:00:00Z', isDone: false }],
      },
    ],
  },
  {
    id: 2,
    title: "Reach B2 English level",
    deadline: "2027-01-15",
    difficulty: 4,
    actions: [
      {
        id: 1,
        title: "Finish Vocabulary in Use B2",
        deadline: "2026-11-15",
        isDone: true,
      },
      {
        id: 2,
        title: "Read the first English book",
        deadline: "2026-11-30",
        isDone: false,
      },
      {
        id: 3,
        title: "Read the second English book",
        deadline: "2026-12-20",
        isDone: false,
      },
      {
        id: 4,
        title: "Finish B2 grammar review",
        deadline: "2027-01-05",
        isDone: false,
      },
    ],
    disciplines: [
      {
        id: 1,
        title: "English study",
        repeatInterval: "Every 1 Day",
        history: [{ date: '2026-10-06T10:00:00Z', isDone: true }, { date: '2026-10-07T10:00:00Z', isDone: false }],
      },
      {
        id: 2,
        title: "Watch English content",
        repeatInterval: "Every 1 Day",
        history: [{ date: '2026-10-06T10:00:00Z', isDone: true }, { date: '2026-10-07T10:00:00Z', isDone: false }],
      },
    ],
  },
  {
    id: 3,
    title: "Reach 20 pull-ups",
    deadline: "2026-11-30",
    difficulty: 4,
    actions: [
      {
        id: 1,
        title: "Reach 12 strict pull-ups",
        deadline: "2026-10-20",
        isDone: true,
      },
      {
        id: 2,
        title: "Reach 15 strict pull-ups",
        deadline: "2026-11-05",
        isDone: false,
      },
      {
        id: 3,
        title: "Reach 18 strict pull-ups",
        deadline: "2026-11-20",
        isDone: false,
      },
      {
        id: 4,
        title: "Reach 20 strict pull-ups",
        deadline: "2026-11-30",
        isDone: false,
      },
    ],
    disciplines: [
      {
        id: 1,
        title: "Pull-up training",
        repeatInterval: "Every 1 Day",
        history: [{ date: '2026-10-06T10:00:00Z', isDone: true }, { date: '2026-10-07T10:00:00Z', isDone: false }],
      },
      {
        id: 2,
        title: "Track bodyweight",
        repeatInterval: "Every 1 Day",
        history: [{ date: '2026-10-06T10:00:00Z', isDone: true }, { date: '2026-10-07T10:00:00Z', isDone: false }],
      },
    ],
  },
  {
    id: 4,
    title: "Build my personal brand",
    deadline: "2027-02-01",
    difficulty: 5,
    actions: [
      {
        id: 1,
        title: "Define personal positioning",
        deadline: "2026-10-20",
        isDone: false,
      },
      {
        id: 2,
        title: "Build portfolio website",
        deadline: "2026-11-10",
        isDone: false,
      },
      {
        id: 3,
        title: "Prepare first 10 content ideas",
        deadline: "2026-11-20",
        isDone: false,
      },
      {
        id: 4,
        title: "Publish first case study",
        deadline: "2026-12-01",
        isDone: false,
      },
      {
        id: 5,
        title: "Build professional network",
        deadline: "2027-01-15",
        isDone: false,
      },
    ],
    disciplines: [
      {
        id: 1,
        title: "Create or document something",
        repeatInterval: "Every 1 Day",
        history: [{ date: '2026-10-06T10:00:00Z', isDone: true }, { date: '2026-10-07T10:00:00Z', isDone: false }],
      },
      {
        id: 2,
        title: "Reach out to people",
        repeatInterval: "Every 1 Day",
        history: [{ date: '2026-10-06T10:00:00Z', isDone: true }, { date: '2026-10-07T10:00:00Z', isDone: false }],
      },
    ],
  },
  {
    id: 5,
    title: "Read 6 English books",
    deadline: "2027-01-01",
    difficulty: 3,
    actions: [
      {
        id: 1,
        title: "Choose six books",
        deadline: "2026-10-10",
        isDone: true,
      },
      {
        id: 2,
        title: "Finish book #1",
        deadline: "2026-10-31",
        isDone: false,
      },
      {
        id: 3,
        title: "Finish book #2",
        deadline: "2026-11-15",
        isDone: false,
      },
      {
        id: 4,
        title: "Finish book #3",
        deadline: "2026-11-30",
        isDone: false,
      },
      {
        id: 5,
        title: "Finish book #4",
        deadline: "2026-12-15",
        isDone: false,
      },
      {
        id: 6,
        title: "Finish book #5",
        deadline: "2026-12-25",
        isDone: false,
      },
      {
        id: 7,
        title: "Finish book #6",
        deadline: "2027-01-01",
        isDone: false,
      },
    ],
    disciplines: [
      {
        id: 1,
        title: "Read English",
        repeatInterval: "Every 1 Day",
        history: [{ date: '2026-10-06T10:00:00Z', isDone: true }, { date: '2026-10-07T10:00:00Z', isDone: false }],
      },
    ],
  },
];
