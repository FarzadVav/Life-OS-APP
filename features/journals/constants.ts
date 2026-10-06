import { Journal, JournalType } from "./types";

export const JOURNAL_TYPES: { value: JournalType; label: string }[] = [
  { value: "Logs", label: "Logs" },
  { value: "Feelings", label: "Feelings" },
  { value: "Thoughts", label: "Thoughts" },
  { value: "Ideas", label: "Ideas" },
  { value: "Wishes", label: "Wishes" },
  { value: "Future", label: "Future" },
];

export const journals: Journal[] = [
  {
    id: 1,
    title: "Reflecting on deep work & morning momentum",
    content:
      "Woke up at 6:30 AM without alarm. Completed a 2-hour uninterrupted coding session on the core architecture. When external notifications are muted, mental clarity reaches a completely different plane. Need to protect this time slot religiously.",
    type: "Thoughts",
    createdAt: "2026-10-06T07:45:00",
  },
  {
    id: 2,
    title: "SaaS micro-features and customer onboarding flow",
    content:
      "Idea for onboarding: Instead of a generic 5-step tour that users immediately skip, trigger an interactive challenge that lets them configure their first real mission in under 60 seconds. Frictionless 'aha' moment.",
    type: "Ideas",
    createdAt: "2026-10-05T18:20:00",
  },
  {
    id: 3,
    title: "Calm evening after heavy workout",
    content:
      "Pushed hard in today's pull-up and upper body training session. Feeling peaceful and physically grounded. Experiencing gratitude for health, endurance, and quiet evenings where I can just read and breathe.",
    type: "Feelings",
    createdAt: "2026-10-04T21:15:00",
  },
  {
    id: 4,
    title: "Daily execution log: Feature-based refactoring",
    content:
      "Implemented the feature architecture across the app. Cleaned up dependencies, harmonized UI tokens, and verified Drawer interactions. Clean code reduces anxiety significantly.",
    type: "Logs",
    createdAt: "2026-10-04T14:30:00",
  },
  {
    id: 5,
    title: "Vision 2028: Autonomous freedom & craftsmanship",
    content:
      "Envisioning myself running independent software products with hundreds of happy users, living in a quiet place close to nature, with full control over time and creative energy. Daily discipline today constructs that reality.",
    type: "Future",
    createdAt: "2026-10-02T10:00:00",
  },
  {
    id: 6,
    title: "A wish for sustained curiosity & humility",
    content:
      "I wish to never lose the hunger to learn foundational things from scratch — whether it's low-level systems, new languages, or human psychology. True confidence is quiet and always curious.",
    type: "Wishes",
    createdAt: "2026-09-29T22:40:00",
  },
];
