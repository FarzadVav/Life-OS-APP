import { JOURNALS_LINKS } from "@/features/journals/lib/constant";
import TopBar from "@/features/general/components/static/TopBar/TopBar";
import PageWrapper from "@/features/general/components/static/PageWrapper/PageWrapper";
import FeatureCardsMap from "@/features/general/components/module/FeatureCardsMap/FeatureCardsMap";
import PageItemsWrapper from "@/features/general/components/static/PageItemsWrapper/PageItemsWrapper";
import CreateFeatureLink from "@/features/general/components/module/CreateFeatureLink/CreateFeatureLink";

function JournalsPage() {
  return (
    <PageWrapper>
      <TopBar>
        <TopBar.Title asTitle>Journals</TopBar.Title>
      </TopBar>

      <PageItemsWrapper>
        <FeatureCardsMap featureArea="journals" featureData={JOURNALS_LINKS} />

        <CreateFeatureLink featureArea="journals" />
      </PageItemsWrapper>
    </PageWrapper>
  );
}

export default JournalsPage;
