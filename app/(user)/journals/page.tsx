import { Suspense } from "react";

import TopBar from "@/features/general/components/static/TopBar/TopBar";
import CreateBtn from "@/features/general/components/module/CreateBtn/CreateBtn";
import PageWrapper from "@/features/general/components/static/PageWrapper/PageWrapper";
import PageItemsWrapper from "@/features/general/components/static/PageItemsWrapper/PageItemsWrapper";
import ConnectivityFallback from "@/features/general/components/module/ConnectivityFallback/ConnectivityFallback";
import JournalsTabs from "@/features/journals/components/JournalsTabs/JournalsTabs";
import { getTranslations } from "@/features/general/lib/i18n/server";

async function JournalsPage() {
  const { t } = await getTranslations();

  return (
    <PageWrapper>
      <TopBar>
        <TopBar.Title asTitle>{t("journals.title")}</TopBar.Title>
        <TopBar.Btn backIcon href="/" position="left" />
      </TopBar>

      <PageItemsWrapper>
        <Suspense
          fallback={
            <ConnectivityFallback message={t("journals.loading")} />
          }
        >
          <JournalsTabs />
        </Suspense>

        <p className="sub-text w-full text-center">
          {t("journals.subtitle")}
        </p>

        <CreateBtn href="/journals/new">{t("journals.new")}</CreateBtn>
      </PageItemsWrapper>
    </PageWrapper>
  );
}

export default JournalsPage;
