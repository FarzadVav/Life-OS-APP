import Link from "next/link";
import { PlusIcon } from "lucide-react";

// import { JOURNALS_LINKS } from "@/features/journals/lib/constant";
import { Button } from "@/features/general/components/ui/Button/Button";
import TopBar from "@/features/general/components/static/TopBar/TopBar";
import PageWrapper from "@/features/general/components/static/PageWrapper/PageWrapper";
// import FeatureCardsMap from "@/features/general/components/module/FeatureCardsMap/FeatureCardsMap";
import PageItemsWrapper from "@/features/general/components/static/PageItemsWrapper/PageItemsWrapper";

function JournalsPage() {
  return (
    <PageWrapper>
      <TopBar>
        <TopBar.Title asTitle>Journals</TopBar.Title>
      </TopBar>

      <PageItemsWrapper>
        {/* <FeatureCardsMap featureArea="journals" featureData={JOURNALS_LINKS} /> */}

        <Button render={<Link href={"/journals"} />}>
          <span>Journals</span>
          <PlusIcon />
        </Button>
      </PageItemsWrapper>
    </PageWrapper>
  );
}

export default JournalsPage;
