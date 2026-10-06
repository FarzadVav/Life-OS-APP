import { Suspense } from "react";

import TopBar from "@/features/general/components/static/TopBar/TopBar";
import CreateBtn from "@/features/general/components/module/CreateBtn/CreateBtn";
import PageWrapper from "@/features/general/components/static/PageWrapper/PageWrapper";
import PageItemsWrapper from "@/features/general/components/static/PageItemsWrapper/PageItemsWrapper";
import ConnectivityFallback from "@/features/general/components/module/ConnectivityFallback/ConnectivityFallback";
import JournalsTabs from "@/features/journals/components/JournalsTabs/JournalsTabs";

function JournalsPage() {
  return (
    <PageWrapper>
      <TopBar>
        <TopBar.Title asTitle>Journals</TopBar.Title>
        <TopBar.Btn backIcon href="/" position="left" />
      </TopBar>

      <PageItemsWrapper>
        <Suspense
          fallback={
            <ConnectivityFallback message="Waiting for connection to load journals..." />
          }
        >
          <JournalsTabs />
        </Suspense>

        <p className="sub-text w-full text-center">
          Writing daily uncovers patterns and brings peace of mind.
        </p>

        <CreateBtn href="/journals/new">New Journal</CreateBtn>
      </PageItemsWrapper>
    </PageWrapper>
  );
}

export default JournalsPage;
