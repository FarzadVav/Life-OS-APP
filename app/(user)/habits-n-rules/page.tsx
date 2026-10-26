import TopBar from "@/features/general/components/static/TopBar/TopBar";
import PageWrapper from "@/features/general/components/static/PageWrapper/PageWrapper";
import PageItemsWrapper from "@/features/general/components/static/PageItemsWrapper/PageItemsWrapper";
import { HabitsList } from "@/features/habits-n-rules/components";
import PageActionBtn from "@/features/general/components/module/PageActionBtn/PageActionBtn";
import { getTranslations } from "@/features/general/lib/i18n/server";

import HelpDialog from "@/features/general/components/module/HelpDialog/HelpDialog";

export default async function HabitsPage() {
  const { t } = await getTranslations();

  return (
    <PageWrapper>
      <TopBar>
        <TopBar.Title asTitle>{t("habits.title")}</TopBar.Title>
        <HelpDialog position="right" />
      </TopBar>

      <PageItemsWrapper>
        <HabitsList />
      </PageItemsWrapper>

      <PageActionBtn href="/habits-n-rules/new">{t("habits.new")}</PageActionBtn>
    </PageWrapper>
  );
}
