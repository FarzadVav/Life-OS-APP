import TopBar from "@/features/general/components/static/TopBar/TopBar";
import CreateBtn from "@/features/general/components/module/CreateBtn/CreateBtn";
import PageWrapper from "@/features/general/components/static/PageWrapper/PageWrapper";
import PageItemsWrapper from "@/features/general/components/static/PageItemsWrapper/PageItemsWrapper";

function EventLogsPage() {
  return (
    <PageWrapper>
      <TopBar>
        <TopBar.Title asTitle>Event Logs</TopBar.Title>
        <TopBar.Btn backIcon href="/journals" position="left" />
      </TopBar>

      <PageItemsWrapper>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate
          aliquid fugiat sapiente libero perspiciatis? Voluptatum quo quibusdam
          at voluptas distinctio minima impedit? At facere possimus debitis
          omnis nisi reprehenderit voluptatem?
        </p>

        <CreateBtn withPlusIcon href="/journals/new?type=event-logs">
          New Event Log
        </CreateBtn>
      </PageItemsWrapper>
    </PageWrapper>
  );
}

export default EventLogsPage;
