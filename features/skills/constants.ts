import { Skill, SkillType } from "./types";

export const SKILL_TYPES: { value: SkillType; label: string }[] = [];

export const skills: Skill[] = [
  {
    id: 1,
    title: "High-Leverage Negotiation & BATNA Playbook",
    content:
      "1. Clarify your Best Alternative to a Negotiated Agreement (BATNA) beforehand.\n2. Anchor high with realistic justification.\n3. Ask open-ended questions starting with 'How' or 'What' instead of 'Why'.\n4. Never negotiate against yourself in silence.\n5. Label emotions and acknowledge counterparts' constraints.",
    type: "",
    createdAt: "2026-08-15T00:00:00",
  },
  {
    id: 2,
    title: "Next.js App Router & Server Components Internals",
    content:
      "Server Components execute exclusively on the server and emit serialized UI trees (RSC Payload) without sending JavaScript to the client. Keep data fetching close to leaf components, leverage Suspense boundaries for progressive rendering, and pass interactivity down to Client Components.",
    type: "",
    createdAt: "2026-09-01T00:00:00",
  },
  {
    id: 3,
    title: "Overcoming Resistance: Action Precedes Motivation",
    content:
      "Motivation does not precede action; action generates momentum which summons emotional motivation. When feeling resistance, lower the barrier to entry until it is impossible to fail (the 2-minute rule). Once started, kinetic friction drops by 80%.",
    type: "",
    createdAt: "2026-09-10T00:00:00",
  },
  {
    id: 4,
    title: "SaaS Unit Economics & Metric Formulas",
    content:
      "• CAC: Total Sales & Marketing Costs / Number of New Customers.\n• LTV: (Average Revenue Per Account * Gross Margin) / Churn Rate.\n• Healthy Ratio: LTV / CAC >= 3x.\n• Payback Period: CAC / (ARPA * Gross Margin) < 12 months for healthy bootstrapping.",
    type: "",
    createdAt: "2026-09-18T00:00:00",
  },
  {
    id: 5,
    title: "Deep Work Flow State Setup Ritual",
    content:
      "1. Clear workspace physically: only notebook, pen, water, and machine.\n2. Close communication tools and full-screen terminal/editor.\n3. Define single target output before putting headphones on.\n4. Set 90-minute ultradian rhythm timer without interruptions.",
    type: "",
    createdAt: "2026-09-25T00:00:00",
  },
  {
    id: 6,
    title: "Concise Technical Communication",
    content:
      "Lead with the conclusion (BLUF: Bottom Line Up Front). Follow with the trade-offs and rationale. Remove filler adjectives. Use bullet points and architecture diagrams for cognitive ease.",
    type: "",
    createdAt: "2026-10-01T00:00:00",
  },
];
