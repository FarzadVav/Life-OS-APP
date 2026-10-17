import { Suspense } from "react";

import TopBar from "@/features/general/components/static/TopBar/TopBar";
import PageActionBtn from "@/features/general/components/module/PageActionBtn/PageActionBtn";
import PageWrapper from "@/features/general/components/static/PageWrapper/PageWrapper";
import PageItemsWrapper from "@/features/general/components/static/PageItemsWrapper/PageItemsWrapper";
import ConnectivityFallback from "@/features/general/components/module/ConnectivityFallback/ConnectivityFallback";
import FrameworkTabs from "@/features/framework/components/FrameworkTabs/FrameworkTabs";
import FrameworkActionBtn from "@/features/framework/components/FrameworkActionBtn/FrameworkActionBtn";
import { getTranslations } from "@/features/general/lib/i18n/server";

async function FrameworkPage() {
  const { t } = await getTranslations();

  return (
    <PageWrapper>
      <TopBar>
        <TopBar.Title asTitle>{t("framework.title") || "Framework"}</TopBar.Title>
        <TopBar.Btn backIcon href="/" position="left" />
        <TopBar.HelpBtn position="right" />
      </TopBar>

      <PageItemsWrapper>
        <Suspense
          fallback={
            <ConnectivityFallback
              message={t("framework.loading") || "Loading framework..."}
            />
          }
        >
          <FrameworkTabs />
        </Suspense>

        <p className="sub-text w-full text-center text-xs">
          {t("framework.subtitle") ||
            "Your non-negotiables, mental models, and sovereign vision across all life areas."}
        </p>

        <Suspense
          fallback={
            <PageActionBtn href="/framework/new">
              {t("framework.new") || "New"}
            </PageActionBtn>
          }
        >
          <FrameworkActionBtn />
        </Suspense>
      </PageItemsWrapper>
    </PageWrapper>
  );
}

export default FrameworkPage;
