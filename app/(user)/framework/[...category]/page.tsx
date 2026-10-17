import { notFound } from "next/navigation";
import {
  FRAMEWORK_CATEGORIES,
  FRAMEWORK_SECTIONS,
  FrameworkCategory,
  FrameworkSection,
} from "@/features/framework/types";
import { getTranslations } from "@/features/general/lib/i18n/server";
import FrameworkCategoryView from "@/features/framework/components/FrameworkCategoryView/FrameworkCategoryView";

type PageProps = {
  params: Promise<{ category: string[] }>;
  searchParams?: Promise<{ section?: string }>;
};

export default async function FrameworkCategoryPage({
  params,
  searchParams,
}: PageProps) {
  const { category: categoryParts } = await params;
  const sp = searchParams ? await searchParams : {};

  const rawSlug = categoryParts?.[0];
  if (!rawSlug) {
    notFound();
  }

  const matchedCategory = FRAMEWORK_CATEGORIES.find(
    (c) => c.toLowerCase() === rawSlug.toLowerCase(),
  );

  if (!matchedCategory) {
    notFound();
  }

  // Support optional sub-segment or query param for section (e.g. /framework/social/rules or ?section=rules)
  const rawSection = categoryParts?.[1] || sp?.section;
  let initialSection: FrameworkSection = "Visions";
  if (rawSection) {
    const matchedSection = FRAMEWORK_SECTIONS.find(
      (s) => s.toLowerCase() === rawSection.toLowerCase(),
    );
    if (matchedSection) {
      initialSection = matchedSection;
    }
  }

  const { t } = await getTranslations();
  const categoryTitle =
    t(`framework.categories.${matchedCategory.toLowerCase()}`) ||
    matchedCategory;

  return (
    <FrameworkCategoryView
      category={matchedCategory as FrameworkCategory}
      initialSection={initialSection}
      categoryTitle={categoryTitle}
    />
  );
}
