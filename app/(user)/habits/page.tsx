import { HABITS_LINKS } from "@/features/habits/lib/constant";
import TopBar from "@/features/general/components/static/TopBar/TopBar";
import PageWrapper from "@/features/general/components/static/PageWrapper/PageWrapper";
import FeatureCardsMap from "@/features/general/components/module/FeatureCardsMap/FeatureCardsMap";
import PageItemsWrapper from "@/features/general/components/static/PageItemsWrapper/PageItemsWrapper";
import CreateFeatureLink from "@/features/general/components/module/CreateFeatureLink/CreateFeatureLink";

function HabitsPage() {
  return (
    <PageWrapper>
      <TopBar>
        <TopBar.Title asTitle>Habits</TopBar.Title>
      </TopBar>

      <PageItemsWrapper>
        <FeatureCardsMap featureArea="habits" featureData={HABITS_LINKS} />

        <CreateFeatureLink featureArea="habits" />
      </PageItemsWrapper>
    </PageWrapper>
  );
}

export default HabitsPage;
