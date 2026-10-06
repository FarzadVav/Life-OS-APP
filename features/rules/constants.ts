import { Rule, RuleCategory } from "./types";

export const RULE_CATEGORIES: { value: RuleCategory; label: string }[] = [
  { value: "Discipline", label: "Discipline" },
  { value: "Health", label: "Health" },
  { value: "Mindset", label: "Mindset" },
  { value: "Productivity", label: "Productivity" },
  { value: "Finance", label: "Finance" },
];

export const rules: Rule[] = [
  {
    id: 1,
    title: "Never compromise on 7+ hours of quality sleep",
    category: "Health",
    description:
      "Sleep is the biological foundation for cognitive stamina, emotional regulation, and hormonal recovery. Everything suffers when sleep is sacrificed.",
    createdAt: "2026-09-01T00:00:00",
  },
  {
    id: 2,
    title: "Deep work before checking messages or email",
    category: "Productivity",
    description:
      "The first 2-3 hours of the morning belong to high-leverage creative work. Do not let someone else's agenda dictate your primary cognitive window.",
    createdAt: "2026-09-02T00:00:00",
  },
  {
    id: 3,
    title: "Don't smoke or consume toxic habits",
    category: "Health",
    description:
      "Protect physical vitality and pulmonary health. Non-negotiable boundary for longevity and energy.",
    createdAt: "2026-09-05T00:00:00",
  },
  {
    id: 4,
    title: "Speak only what is true, constructive, and clear",
    category: "Mindset",
    description:
      "Avoid gossiping, empty complaints, and exaggeration. Internal composure reflects concise and deliberate speech.",
    createdAt: "2026-09-10T00:00:00",
  },
  {
    id: 5,
    title: "Invest first, spend what remains",
    category: "Finance",
    description:
      "Automatically route at least 30% of income to long-term wealth assets before budgeting for discretionary lifestyle expenses.",
    createdAt: "2026-09-12T00:00:00",
  },
  {
    id: 6,
    title: "Physical training 4 times each week without excuse",
    category: "Discipline",
    description:
      "Calisthenics, pull-ups, and mobility. Discipline in the body directly translates to endurance in intellectual pursuits.",
    createdAt: "2026-09-15T00:00:00",
  },
  {
    id: 7,
    title: "Say no to anything that dilutes the primary mission",
    category: "Discipline",
    description:
      "If it is not an enthusiastic 'yes', it is a firm 'no'. Protect mental bandwidth from superficial distractions.",
    createdAt: "2026-09-20T00:00:00",
  },
];
