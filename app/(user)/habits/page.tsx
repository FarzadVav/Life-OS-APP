import TopBar from "@/features/general/components/static/TopBar/TopBar";
import CreateLink from "@/features/general/components/module/CreateLink/CreateLink";
import PageWrapper from "@/features/general/components/static/PageWrapper/PageWrapper";
import HabitsLinksMap from "@/features/habits/components/static/HabitsLinksMap/HabitsLinksMap";
import PageItemsWrapper from "@/features/general/components/static/PageItemsWrapper/PageItemsWrapper";

function HabitsPage() {
  return (
    <PageWrapper>
      <TopBar>
        <TopBar.Title asTitle>Journals</TopBar.Title>
      </TopBar>

      <PageItemsWrapper>
        <HabitsLinksMap />

        <CreateLink name="New Habit" href="/habits/new" />
      </PageItemsWrapper>
    </PageWrapper>
  );
}

export default HabitsPage;
