import { LucideIcon } from "lucide-react";

export type FeaturesAreas = "notes" | "journals" | "habits" | "todos";

export type NavigationLink = {
  name: string;
  href: string;
  matchPathname: string;

  Icon: LucideIcon;
};

export type LifeArea = {
  id: number;
  title: string;
}

export type FeatureCardData = {
  id: number;
  name: string;
  categoryId: number;
  description?: string;
};
