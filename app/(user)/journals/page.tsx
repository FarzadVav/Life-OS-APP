import Card from "@/features/general/components/module/Card/Card";
import TopBar from "@/features/general/components/static/TopBar/TopBar";
import PageWrapper from "@/features/general/components/static/PageWrapper/PageWrapper";
import PageItemsWrapper from "@/features/general/components/static/PageItemsWrapper/PageItemsWrapper";
import { JOURNALS_LINKS } from "@/features/journals/lib/constant";

function JournalsPage() {
  return (
    <PageWrapper>
      <TopBar>
        <TopBar.Capsule>
          <TopBar.Title asTitle>Journals</TopBar.Title>
        </TopBar.Capsule>
      </TopBar>

      <PageItemsWrapper>
        {JOURNALS_LINKS.map((item) => (
          <Card
            key={item.id}
            name={item.name}
            href={`/journals/${item.id}`}
            description={item.description}
          />
        ))}
      </PageItemsWrapper>
    </PageWrapper>
  );
}

export default JournalsPage;
