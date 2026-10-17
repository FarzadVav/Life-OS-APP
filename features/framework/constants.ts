import {
  FRAMEWORK_CATEGORIES,
  FRAMEWORK_SECTIONS,
  FrameworkItem,
} from "./types";

export { FRAMEWORK_CATEGORIES, FRAMEWORK_SECTIONS };

export const INITIAL_FRAMEWORK_ITEMS: FrameworkItem[] = [
  // Career
  {
    id: 1,
    category: "Career",
    section: "Visions",
    title: "Autonomous Software Craftsmanship & High-Impact Products",
    content:
      "<p>Build and scale sovereign software systems that solve real problems for tens of thousands of users. Master distributed architecture and maintain relentless engineering quality without bureaucratic compromises.</p>",
    createdAt: "2026-10-01T10:00:00Z",
  },
  {
    id: 2,
    category: "Career",
    section: "Rules",
    title: "Never ship without testing core invariants",
    content:
      "<p>Always verify critical user journeys, edge cases, and offline states before deploying. Speed is a byproduct of high confidence, not sloppy shortcuts.</p>",
    createdAt: "2026-10-02T11:00:00Z",
  },
  {
    id: 3,
    category: "Career",
    section: "Concepts",
    title: "First Principles & System Bottlenecks (Theory of Constraints)",
    content:
      "<p>Identify the single constraining factor in any project or architecture. Optimize only that bottleneck; optimizing non-bottlenecks creates illusionary progress.</p>",
    createdAt: "2026-10-03T12:00:00Z",
  },

  // Mindset
  {
    id: 4,
    category: "Mindset",
    section: "Visions",
    title: "Stoic Equanimity & Unshakeable Inner Clarity",
    content:
      "<p>Remain unperturbed by external chaos, delays, or opinions. Cultivate an inner citadel of reasoned decision-making, genuine humility, and relentless focus on what can be influenced.</p>",
    createdAt: "2026-10-04T09:00:00Z",
  },
  {
    id: 5,
    category: "Mindset",
    section: "Rules",
    title: "10-Second Pause Before Responding Under Stress",
    content:
      "<p>When triggered by an unexpected crisis, harsh comment, or unexpected obstacle, consciously breathe and wait 10 seconds. Never respond from acute emotional agitation.</p>",
    createdAt: "2026-10-05T14:30:00Z",
  },
  {
    id: 6,
    category: "Mindset",
    section: "Concepts",
    title: "Dichotomy of Control (Epictetus)",
    content:
      "<p>Some things are in our control (our thoughts, reactions, choices, actions) and others are not (outcomes, weather, other people's behaviors). Invest 100% of energy into the former.</p>",
    createdAt: "2026-10-06T15:00:00Z",
  },

  // Health
  {
    id: 7,
    category: "Health",
    section: "Visions",
    title: "Agile, Resilient Body with High Aerobic & Strength Reserve",
    content:
      "<p>Maintain single-digit body fat, sub-4-hour marathon cardiovascular base, and pain-free joints through mobility and consistent calisthenics.</p>",
    createdAt: "2026-10-07T08:00:00Z",
  },
  {
    id: 8,
    category: "Health",
    section: "Rules",
    title: "No Screens 60 Minutes Before Sleep & Consistent Sleep Window",
    content:
      "<p>Protect circadian rhythms. Dim household lights after 9:30 PM, put phone on charger in another room, and read physical books to wind down.</p>",
    createdAt: "2026-10-08T22:00:00Z",
  },
  {
    id: 9,
    category: "Health",
    section: "Concepts",
    title: "Zone 2 Cardio & Mitochondrial Density",
    content:
      "<p>Low-intensity aerobic training builds capillary and mitochondrial networks, powering all other physical and cognitive capacities without inducing excessive systemic fatigue.</p>",
    createdAt: "2026-10-09T07:30:00Z",
  },

  // Finance
  {
    id: 10,
    category: "Finance",
    section: "Visions",
    title: "Absolute Financial Autonomy & Multigenerational Resilience",
    content:
      "<p>Own assets that produce passive cash flow exceeding 3x living expenses, freeing all cognitive surplus for meaningful creative pursuits.</p>",
    createdAt: "2026-10-10T16:00:00Z",
  },
  {
    id: 11,
    category: "Finance",
    section: "Rules",
    title: "Save & Invest First, Spend What Remains",
    content:
      "<p>Automate 40%+ of all net monthly earnings directly into investment accounts on payday. Lifestyle inflation must strictly lag income growth by at least 2 years.</p>",
    createdAt: "2026-10-11T12:00:00Z",
  },
  {
    id: 12,
    category: "Finance",
    section: "Concepts",
    title: "Compound Interest & Asymmetric Risk/Reward",
    content:
      "<p>Protect downside first (zero high-interest debt, liquid emergency fund). Then pursue convex opportunities where potential gain vastly outweighs the capped loss.</p>",
    createdAt: "2026-10-12T13:00:00Z",
  },

  // Behavior
  {
    id: 13,
    category: "Behavior",
    section: "Visions",
    title: "Frictionless Execution & Deep Focus Habit Architecture",
    content:
      "<p>A lifestyle where essential habits happen automatically without relying on transient bursts of motivation.</p>",
    createdAt: "2026-10-13T10:00:00Z",
  },
  {
    id: 14,
    category: "Behavior",
    section: "Rules",
    title: "Never miss twice in a row",
    content:
      "<p>Missing a habit once is an accident; missing it twice is the beginning of a new, negative habit. Re-engage immediately the next day.</p>",
    createdAt: "2026-10-14T09:00:00Z",
  },
  {
    id: 15,
    category: "Behavior",
    section: "Concepts",
    title: "Habit Stacking & Implementation Intentions",
    content:
      "<p>Anchor a desired new behavior immediately after an established daily routine: 'After I pour my morning water, I will sit down for 20 minutes of deep study.'</p>",
    createdAt: "2026-10-15T11:00:00Z",
  },

  // Social
  {
    id: 16,
    category: "Social",
    section: "Visions",
    title: "Deep, Trusted Circle of Synergistic Companions",
    content:
      "<p>Nurture lifelong friendships with individuals committed to truth, mutual elevation, craftsmanship, and compassionate accountability.</p>",
    createdAt: "2026-10-15T17:00:00Z",
  },
  {
    id: 17,
    category: "Social",
    section: "Rules",
    title: "Weekly deliberate outreach to one close friend or family member",
    content:
      "<p>Never let connections drift due to busy schedules. Send an authentic update, call, or plan an in-person meal every week.</p>",
    createdAt: "2026-10-16T18:00:00Z",
  },
  {
    id: 18,
    category: "Social",
    section: "Concepts",
    title: "Active Constructive Responding",
    content:
      "<p>When others share good news, celebrate enthusiastically with authentic questions rather than minimizing or changing the subject.</p>",
    createdAt: "2026-10-16T19:00:00Z",
  },

  // Lifestyle
  {
    id: 19,
    category: "Lifestyle",
    section: "Visions",
    title: "Minimalist, Nature-Adjacent Living with Creative Sanctuary",
    content:
      "<p>Surroundings composed only of well-made, functional objects. Regular access to trails, fresh air, natural sunlight, and quiet work spaces.</p>",
    createdAt: "2026-10-17T08:00:00Z",
  },
  {
    id: 20,
    category: "Lifestyle",
    section: "Rules",
    title: "Quarterly declutter: One in, one out",
    content:
      "<p>Physical clutter leads directly to cognitive clutter. Regularly donate or recycle unused clothes, books, and gadgets.</p>",
    createdAt: "2026-10-17T09:00:00Z",
  },
  {
    id: 21,
    category: "Lifestyle",
    section: "Concepts",
    title: "Essentialism: The Disciplined Pursuit of Less",
    content:
      "<p>If it is not a definite yes, it is a clear no. Protect focus for the highest-leverage vital few rather than the trivial many.</p>",
    createdAt: "2026-10-17T10:00:00Z",
  },

  // Knowledge
  {
    id: 22,
    category: "Knowledge",
    section: "Visions",
    title: "Polymathic Grasp of Core Universal Disciplines",
    content:
      "<p>Deep comprehension of computation, evolutionary biology, economics, physics, and cognitive psychology to reason across domains seamlessly.</p>",
    createdAt: "2026-10-17T11:00:00Z",
  },
  {
    id: 23,
    category: "Knowledge",
    section: "Rules",
    title: "Read 30 minutes of non-fiction book every single day",
    content:
      "<p>Social media feeds are ephemeral noise; books are condensed wisdom. Read with a pen or note app to extract core mental models.</p>",
    createdAt: "2026-10-17T11:15:00Z",
  },
  {
    id: 24,
    category: "Knowledge",
    section: "Concepts",
    title: "Feynman Technique for Deep Understanding",
    content:
      "<p>To test whether you truly understand a concept, explain it in simple language as if teaching an intelligent 10-year-old. Identify gaps where jargon hides ignorance.</p>",
    createdAt: "2026-10-17T11:30:00Z",
  },
];
