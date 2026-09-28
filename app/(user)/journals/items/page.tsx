import { NextPageProps } from "@/features/general/lib/types";
import TopBar from "@/features/general/components/static/TopBar/TopBar";
import CreateBtn from "@/features/general/components/module/CreateBtn/CreateBtn";
import PageWrapper from "@/features/general/components/static/PageWrapper/PageWrapper";

async function JournalItemsPage({ searchParams }: NextPageProps) {
  const sp = await searchParams;

  return (
    <PageWrapper>
      <TopBar>
        <TopBar.Title asTitle>{sp.type}</TopBar.Title>
        <TopBar.Btn backIcon href="/journals" position="left" />
      </TopBar>

      <CreateBtn withPlusIcon href={`/journals/new?type=${sp.type}`}>
        New {sp.type}
      </CreateBtn>
    </PageWrapper>
  );
}

export default JournalItemsPage;
