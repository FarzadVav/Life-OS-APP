import { journals } from "@/features/journals/constants";
import TopBar from "@/features/general/components/static/TopBar/TopBar";
import JournalCard from "@/features/journals/components/JournalCard/JournalCard";
import CreateBtn from "@/features/general/components/module/CreateBtn/CreateBtn";
import PageWrapper from "@/features/general/components/static/PageWrapper/PageWrapper";
import PageItemsWrapper from "@/features/general/components/static/PageItemsWrapper/PageItemsWrapper";

function JournalsPage() {
  return (
    <PageWrapper>
      <TopBar>
        <TopBar.Title asTitle>Journals</TopBar.Title>
        <TopBar.Btn backIcon href="/" position="left" />
      </TopBar>

      <PageItemsWrapper>
        {journals.map((journal) => (
          <JournalCard key={journal.id} journal={journal} />
        ))}

        {journals.length === 0 && (
          <div
            className="
              flex w-full flex-1
              items-center justify-center
              rounded-component
              border-2 border-dashed
              p-3
            "
          >
            <p>You haven{"'"}t any journals</p>
          </div>
        )}

        <p className="sub-text w-full text-center">
          Writing daily uncovers patterns and brings peace of mind.
        </p>

        <CreateBtn href="/journals/new">New Journal</CreateBtn>
      </PageItemsWrapper>
    </PageWrapper>
  );
}

export default JournalsPage;
