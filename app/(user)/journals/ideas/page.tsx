import TopBar from "@/features/general/components/static/TopBar/TopBar";
import CreateBtn from "@/features/general/components/module/CreateBtn/CreateBtn";
import PageWrapper from "@/features/general/components/static/PageWrapper/PageWrapper";
import PageItemsWrapper from "@/features/general/components/static/PageItemsWrapper/PageItemsWrapper";

function IdeasPage() {
  return (
    <PageWrapper>
      <TopBar>
        <TopBar.Title asTitle>Ideas</TopBar.Title>
        <TopBar.Btn backIcon href="/journals" position="left" />
      </TopBar>

      <PageItemsWrapper>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate
          aliquid fugiat sapiente libero perspiciatis? Voluptatum quo quibusdam
          at voluptas distinctio minima impedit? At facere possimus debitis
          omnis nisi reprehenderit voluptatem?
        </p>

        <CreateBtn withPlusIcon href="/journals/new?type=ideas">
          New Idea
        </CreateBtn>
      </PageItemsWrapper>
    </PageWrapper>
  );
}

export default IdeasPage;
