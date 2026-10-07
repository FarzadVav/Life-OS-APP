import PageWrapper from "@/features/general/components/static/PageWrapper/PageWrapper";
import TopBar from "@/features/general/components/static/TopBar/TopBar";
import { getTranslations } from "@/features/general/lib/i18n/server";

async function SearchPage() {
  const { t } = await getTranslations();

  return (
    <PageWrapper>
      <TopBar>
        <TopBar.Title asTitle>{t("search.title")}</TopBar.Title>
        <TopBar.Btn backIcon href="/" position="left" />
        <TopBar.HelpBtn position="right" />
      </TopBar>
      <div className="flex flex-1 items-center justify-center p-6 text-center sub-text">
        {t("search.title")}
      </div>
    </PageWrapper>
  );
}

export default SearchPage;
