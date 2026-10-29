import { notFound } from "next/navigation";

import SkillTagsList from "@/features/skills/components/SkillTagsList/SkillTagsList";
import { parseLifeAreaSlug } from "@/features/general/lib/lifeAreaSlug";

type PageProps = {
  params: Promise<{ area: string }>;
};

export default async function SkillTagsPage({ params }: PageProps) {
  const { area: rawSlug } = await params;
  const lifeAreaId = parseLifeAreaSlug(rawSlug);

  if (lifeAreaId === undefined) {
    notFound();
  }

  return <SkillTagsList lifeAreaId={lifeAreaId} />;
}
