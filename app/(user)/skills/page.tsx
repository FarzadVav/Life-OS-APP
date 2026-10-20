"use client";

import TopBar from "@/features/general/components/static/TopBar/TopBar";
import PageWrapper from "@/features/general/components/static/PageWrapper/PageWrapper";
import PageItemsWrapper from "@/features/general/components/static/PageItemsWrapper/PageItemsWrapper";
import { SkillsList } from "@/features/skills/components";
import { useLocale } from "@/features/general/components/module/LocaleProvider/LocaleProvider";

export default function SkillsPage() {
  const { t } = useLocale();

  return (
    <PageWrapper>
      <TopBar>
        <TopBar.Title asTitle>{t("skills.title")}</TopBar.Title>
        <TopBar.HelpBtn position="right" />
      </TopBar>

      <PageItemsWrapper>
        <SkillsList />
      </PageItemsWrapper>
    </PageWrapper>
  );
}
