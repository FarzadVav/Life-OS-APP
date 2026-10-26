import TopBar from "@/features/general/components/static/TopBar/TopBar";
import PageWrapper from "@/features/general/components/static/PageWrapper/PageWrapper";
import PageItemsWrapper from "@/features/general/components/static/PageItemsWrapper/PageItemsWrapper";
import { SkillsList } from "@/features/skills/components";
import PageActionBtn from "@/features/general/components/module/PageActionBtn/PageActionBtn";
import { getTranslations } from "@/features/general/lib/i18n/server";

import HelpDialog from "@/features/general/components/module/HelpDialog/HelpDialog";

export default async function SkillsPage() {
  const { t } = await getTranslations();

  return (
    <PageWrapper>
      <TopBar>
        <TopBar.Title asTitle>{t("skills.title")}</TopBar.Title>
        <HelpDialog position="right" />
      </TopBar>

      <PageItemsWrapper>
        <SkillsList />
      </PageItemsWrapper>

      <PageActionBtn href="/skills/new">{t("skills.new")}</PageActionBtn>
    </PageWrapper>
  );
}
