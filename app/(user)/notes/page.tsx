import TopBar from "@/features/general/components/static/TopBar/TopBar";
import PageWrapper from "@/features/general/components/static/PageWrapper/PageWrapper";
import NotesCardsList from "@/features/notes/components/statics/NotesCardsList/NotesCardsList";
import PageItemsWrapper from "@/features/general/components/static/PageItemsWrapper/PageItemsWrapper";
import CreateFeatureLink from "@/features/general/components/module/CreateFeatureLink/CreateFeatureLink";

function NotesPage() {
  return (
    <PageWrapper>
      <TopBar>
        <TopBar.Title asTitle>Notes</TopBar.Title>

        <TopBar.Btn goBack position="left" />
      </TopBar>

      <PageItemsWrapper>
        <NotesCardsList />

        <CreateFeatureLink featureArea="notes" />
      </PageItemsWrapper>
    </PageWrapper>
  );
}

export default NotesPage;
