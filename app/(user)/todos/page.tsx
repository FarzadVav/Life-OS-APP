import TopBar from "@/features/general/components/static/TopBar/TopBar";
import CreateLink from "@/features/general/components/module/CreateLink/CreateLink";
import PageWrapper from "@/features/general/components/static/PageWrapper/PageWrapper";
import TodosLinksMap from "@/features/todos/components/static/TodosLinksMap/TodosLinksMap";
import PageItemsWrapper from "@/features/general/components/static/PageItemsWrapper/PageItemsWrapper";

function TodosPage() {
  return (
    <PageWrapper>
      <TopBar>
        <TopBar.Title asTitle>Todos</TopBar.Title>
      </TopBar>

      <PageItemsWrapper>
        <TodosLinksMap />

        <CreateLink name="New Todo" href="/todos/new" />
      </PageItemsWrapper>
    </PageWrapper>
  );
}

export default TodosPage;
