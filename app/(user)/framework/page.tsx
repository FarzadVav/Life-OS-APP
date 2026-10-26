import TopBar from "@/features/general/components/static/TopBar/TopBar";
import PageWrapper from "@/features/general/components/static/PageWrapper/PageWrapper";
import PageItemsWrapper from "@/features/general/components/static/PageItemsWrapper/PageItemsWrapper";
import { FrameworksList } from "@/features/framework/components";
import PageActionBtn from "@/features/general/components/module/PageActionBtn/PageActionBtn";
import { getTranslations } from "@/features/general/lib/i18n/server";

import HelpDialog from "@/features/general/components/module/HelpDialog/HelpDialog";

export default async function HabitsPage() {
  const { t } = await getTranslations();

  return (
    <PageWrapper>
      <TopBar>
        <TopBar.Title asTitle>{t("framework.title")}</TopBar.Title>
        <HelpDialog position="right" />
      </TopBar>

      <PageItemsWrapper>
        <FrameworksList />
      </PageItemsWrapper>

      <PageActionBtn href="/framework/new">{t("framework.new")}</PageActionBtn>
    </PageWrapper>
  );
}
