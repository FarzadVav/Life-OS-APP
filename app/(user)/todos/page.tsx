import { TODOS_LINKS } from "@/features/todos/lib/constant";
import TopBar from "@/features/general/components/static/TopBar/TopBar";
import PageWrapper from "@/features/general/components/static/PageWrapper/PageWrapper";
import FeatureCardsMap from "@/features/general/components/module/FeatureCardsMap/FeatureCardsMap";
import PageItemsWrapper from "@/features/general/components/static/PageItemsWrapper/PageItemsWrapper";
import CreateFeatureLink from "@/features/general/components/module/CreateFeatureLink/CreateFeatureLink";

function TodosPage() {
  return (
    <PageWrapper>
      <TopBar>
        <TopBar.Title asTitle>Todos</TopBar.Title>
      </TopBar>

      <PageItemsWrapper>
        <FeatureCardsMap featureArea="todos" featureData={TODOS_LINKS} />

        <CreateFeatureLink featureArea="todos" />
      </PageItemsWrapper>
    </PageWrapper>
  );
}

export default TodosPage;
