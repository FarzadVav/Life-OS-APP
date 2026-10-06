import { rules } from "@/features/rules/constants";
import TopBar from "@/features/general/components/static/TopBar/TopBar";
import RuleCard from "@/features/rules/components/RuleCard/RuleCard";
import CreateBtn from "@/features/general/components/module/CreateBtn/CreateBtn";
import PageWrapper from "@/features/general/components/static/PageWrapper/PageWrapper";
import PageItemsWrapper from "@/features/general/components/static/PageItemsWrapper/PageItemsWrapper";

function RulesPage() {
  return (
    <PageWrapper>
      <TopBar>
        <TopBar.Title asTitle>Rules</TopBar.Title>
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
            <p>You haven{"'"}t any rules</p>
          </div>
        )}

        <p className="sub-text w-full text-center">
          Clear rules eliminate decision fatigue and protect your future.
        </p>

        <CreateBtn href="/rules/new">New Rule</CreateBtn>
      </PageItemsWrapper>
    </PageWrapper>
  );
}

export default RulesPage;
