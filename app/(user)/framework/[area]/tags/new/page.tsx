import { Suspense } from "react";
import { notFound } from "next/navigation";

import ConnectivityFallback from "@/features/general/components/module/ConnectivityFallback/ConnectivityFallback";
import FrameworkTagForm from "@/features/framework/components/FrameworkTagForm/FrameworkTagForm";
import { parseLifeAreaSlug } from "@/features/general/lib/lifeAreaSlug";
import { getTranslations } from "@/features/general/lib/i18n/server";

type PageProps = {
  params: Promise<{ area: string }>;
};

export default async function NewFrameworkTagPage({ params }: PageProps) {
  const { area: rawSlug } = await params;
  const lifeAreaId = parseLifeAreaSlug(rawSlug);

  if (lifeAreaId === undefined) {
    notFound();
  }

  const { t } = await getTranslations();

  return (
    <Suspense fallback={<ConnectivityFallback message={t("common.loading")} />}>
      <FrameworkTagForm lifeAreaId={lifeAreaId} />
    </Suspense>
  );
}
