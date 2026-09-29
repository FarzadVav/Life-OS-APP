import TopBar from "@/features/general/components/static/TopBar/TopBar";
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
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="w-full space-y-1 p-3 rounded-component bg-card"
          >
            <p className="font-bold">I feel like bitch, I am the crow</p>
            <span className="sub-text">{new Date().toLocaleTimeString()}</span>
          </div>
        ))}

        <div className="p-3 border-2 w-full flex-1 border-dashed rounded-component flex justify-center items-center">
          <p>You haven{"'"}t any journals</p>
        </div>

        <CreateBtn withPlusIcon href="/journals/new">
          New Journal
        </CreateBtn>
      </PageItemsWrapper>
    </PageWrapper>
  );
}

export default JournalsPage;
