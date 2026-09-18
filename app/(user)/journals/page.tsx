import TopBar from "@/features/general/components/static/TopBar/TopBar";
import CreateLink from "@/features/general/components/module/CreateLink/CreateLink";
import PageItemsWrapper from "@/features/general/components/static/PageItemsWrapper/PageItemsWrapper";
import JournalsLinksMap from "@/features/journals/components/static/JournalsLinksMap/JournalsLinksMap";
import PageWrapper from "@/features/general/components/static/PageWrapper/PageWrapper";

function JournalsPage() {
  return (
    <>
      <PageWrapper>
        <TopBar>
          <TopBar.Title asTitle>Journals</TopBar.Title>
        </TopBar>

        <PageItemsWrapper>
          <JournalsLinksMap />

          <CreateLink name="New Journal" href="/journals/new" />
        </PageItemsWrapper>
      </PageWrapper>
    </>
  );
}

export default JournalsPage;
