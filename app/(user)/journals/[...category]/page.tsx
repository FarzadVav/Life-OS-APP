import { notFound } from "next/navigation";
import { JOURNAL_CATEGORIES } from "@/features/journals/types";
import { getTranslations } from "@/features/general/lib/i18n/server";
import JournalCategoryView from "@/features/journals/components/JournalCategoryView/JournalCategoryView";

type PageProps = {
  params: Promise<{ category: string[] }>;
};

export default async function JournalCategoryPage({ params }: PageProps) {
  const { category: categoryParts } = await params;
  const rawSlug = categoryParts?.[0];

  if (!rawSlug) {
    notFound();
  }

  const matchedCategory = JOURNAL_CATEGORIES.find(
    (c) => c.toLowerCase() === rawSlug.toLowerCase(),
  );

  if (!matchedCategory) {
    notFound();
  }

  const { t } = await getTranslations();
  const title =
    t(`journals.categories.${matchedCategory.toLowerCase()}`) ||
    matchedCategory;

  return (
    <JournalCategoryView category={matchedCategory} title={title} />
  );
}
