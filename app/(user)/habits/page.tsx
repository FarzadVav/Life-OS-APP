"use client";

import TopBar from "@/features/general/components/static/TopBar/TopBar";
import PageWrapper from "@/features/general/components/static/PageWrapper/PageWrapper";
import PageItemsWrapper from "@/features/general/components/static/PageItemsWrapper/PageItemsWrapper";
import { HabitsList } from "@/features/habits/components";
import { useLocale } from "@/features/general/components/module/LocaleProvider/LocaleProvider";

export default function HabitsPage() {
  const { t } = useLocale();

  return (
    <PageWrapper>
      <TopBar>
        <TopBar.Title asTitle>{t("habits.title") || "Habits"}</TopBar.Title>
        <TopBar.HelpBtn position="right" />
      </TopBar>

      <PageItemsWrapper>
        <HabitsList />
      </PageItemsWrapper>
    </PageWrapper>
  );
}
