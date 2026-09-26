import TopBar from "@/features/general/components/static/TopBar/TopBar";
import CreateBtn from "@/features/general/components/module/CreateBtn/CreateBtn";
import PageWrapper from "@/features/general/components/static/PageWrapper/PageWrapper";
import PageItemsWrapper from "@/features/general/components/static/PageItemsWrapper/PageItemsWrapper";

function TodosPage() {
  return (
    <PageWrapper>
      <TopBar>
        <TopBar.Title asTitle>Actions</TopBar.Title>
        <TopBar.Btn backIcon href="/" position="left" />
      </TopBar>

      <PageItemsWrapper>
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="w-full space-y-1 p-3 rounded-component bg-card"
          >
            <div>
              <p className="font-bold">
                Make the SaaS and sell to 100 customers
              </p>
              <span className="sub-text">
                To {new Date().toLocaleString()}
              </span>
            </div>
          </div>
        ))}

        <CreateBtn withPlusIcon href="/actions/new">
          New Action
        </CreateBtn>
      </PageItemsWrapper>
    </PageWrapper>
  );
}

export default TodosPage;
