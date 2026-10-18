import { type } from "arktype";
import { LucideIcon } from "lucide-react";

export type NextPageProps = {
  params: Promise<string | string[]>;
  searchParams: Promise<{ [key: string]: string }>;
};

/**
 * ArkType schema and inferred type for feature areas.
 */
export const FeaturesAreasSchema = type.enumerated(
  "notes",
  "journals",
  "habits",
  "todos",
);
export type FeaturesAreas = typeof FeaturesAreasSchema.infer;

export type NavigationLink = {
  name: string;
  href: string;
  matchPathname: string;
  Icon: LucideIcon;
};

/**
 * ArkType schema and inferred type for Life Area.
 */
export const LifeAreaSchema = type({
  id: "number",
  title: "string",
});
export type LifeArea = typeof LifeAreaSchema.infer;

/**
 * ArkType schema and inferred type for Feature Card Data.
 */
export const FeatureCardDataSchema = type({
  id: "number",
  name: "string",
  categoryId: "number",
  "description?": "string",
});
export type FeatureCardData = typeof FeatureCardDataSchema.infer;
