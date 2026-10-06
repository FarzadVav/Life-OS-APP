import { rules } from "@/features/rules/constants";
import TopBar from "@/features/general/components/static/TopBar/TopBar";
import RuleCard from "@/features/rules/components/RuleCard/RuleCard";
import CreateBtn from "@/features/general/components/module/CreateBtn/CreateBtn";
import PageWrapper from "@/features/general/components/static/PageWrapper/PageWrapper";
import PageItemsWrapper from "@/features/general/components/static/PageItemsWrapper/PageItemsWrapper";
import { getTranslations } from "@/features/general/lib/i18n/server";

async function RulesPage() {
  const { t } = await getTranslations();

  return (
    <PageWrapper>
      <TopBar>
        <TopBar.Title asTitle>{t("rules.title")}</TopBar.Title>
        <TopBar.Btn backIcon href="/" position="left" />
      </TopBar>

      <PageItemsWrapper>
        {rules.map((rule) => (
          <RuleCard key={rule.id} rule={rule} />
        ))}

        {rules.length === 0 && (
          <div
            className="
              flex w-full flex-1
              items-center justify-center
              rounded-component
              border-2 border-dashed
              p-3
            "
          >
            <p>{t("rules.empty")}</p>
          </div>
        )}

        <p className="sub-text w-full text-center">
          {t("rules.subtitle")}
        </p>

        <CreateBtn href="/rules/new">{t("rules.new")}</CreateBtn>
      </PageItemsWrapper>
    </PageWrapper>
  );
}

export default RulesPage;
