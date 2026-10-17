export const FRAMEWORK_CATEGORIES = [
  "Career",
  "Mindset",
  "Social",
  "Health",
  "Behavior",
  "Finance",
  "Lifestyle",
  "Knowledge",
] as const;

export type FrameworkCategory = (typeof FRAMEWORK_CATEGORIES)[number];

export const FRAMEWORK_SECTIONS = ["Visions", "Rules", "Concepts"] as const;

export type FrameworkSection = (typeof FRAMEWORK_SECTIONS)[number];

export type FrameworkItem = {
  id: number;
  title: string;
  content: string; // TipTap rich text HTML
  category: FrameworkCategory;
  section: FrameworkSection;
  createdAt: string;
};
