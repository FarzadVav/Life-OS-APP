import { Suspense } from "react";
import { getTranslations } from "@/features/general/lib/i18n/server";
import ConnectivityFallback from "@/features/general/components/module/ConnectivityFallback/ConnectivityFallback";
import { LifeAreaForm } from "@/features/life-areas/components";

export default async function ProfileNewLifeAreaPage() {
  const { t } = await getTranslations();

  return (
    <Suspense
      fallback={<ConnectivityFallback message={t("common.loading")} />}
    >
      <LifeAreaForm />
    </Suspense>
  );
}
