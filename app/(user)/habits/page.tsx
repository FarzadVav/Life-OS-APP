import TopBar from "@/features/general/components/static/TopBar/TopBar";
import PageWrapper from "@/features/general/components/static/PageWrapper/PageWrapper";
import PageItemsWrapper from "@/features/general/components/static/PageItemsWrapper/PageItemsWrapper";
import { HabitsList } from "@/features/habits/components";
import PageActionBtn from "@/features/general/components/module/PageActionBtn/PageActionBtn";
import { getTranslations } from "@/features/general/lib/i18n/server";

export default async function HabitsPage() {
  const { t } = await getTranslations();

  return (
    <PageWrapper>
      <TopBar>
        <TopBar.Title asTitle>{t("habits.title") || "Habits"}</TopBar.Title>
        <TopBar.HelpBtn position="right" />
      </TopBar>

      <PageItemsWrapper>
        <HabitsList />
      </PageItemsWrapper>

      <PageActionBtn href="/habits/new">{t("habits.new") || "New Habit"}</PageActionBtn>
    </PageWrapper>
  );
}
