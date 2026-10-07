import { Suspense } from "react";

import TopBar from "@/features/general/components/static/TopBar/TopBar";
import PageActionBtn from "@/features/general/components/module/PageActionBtn/PageActionBtn";
import PageWrapper from "@/features/general/components/static/PageWrapper/PageWrapper";
import PageItemsWrapper from "@/features/general/components/static/PageItemsWrapper/PageItemsWrapper";
import ConnectivityFallback from "@/features/general/components/module/ConnectivityFallback/ConnectivityFallback";
import SkillsTabs from "@/features/skills/components/SkillsTabs/SkillsTabs";
import { getTranslations } from "@/features/general/lib/i18n/server";

async function SkillsPage() {
  const { t } = await getTranslations();

  return (
    <PageWrapper>
      <TopBar>
        <TopBar.Title asTitle>{t("skills.title")}</TopBar.Title>
        <TopBar.Btn backIcon href="/" position="left" />
        <TopBar.HelpBtn position="right" />
      </TopBar>

      <PageItemsWrapper>
        <Suspense
          fallback={
            <ConnectivityFallback message={t("skills.loading")} />
          }
        >
          <SkillsTabs />
        </Suspense>

        <p className="sub-text w-full text-center">
          {t("skills.subtitle")}
        </p>

        <PageActionBtn href="/skills/new">{t("skills.new")}</PageActionBtn>
      </PageItemsWrapper>
    </PageWrapper>
  );
}

export default SkillsPage;
