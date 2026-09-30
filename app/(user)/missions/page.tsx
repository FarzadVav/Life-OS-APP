import TopBar from "@/features/general/components/static/TopBar/TopBar";
import CreateBtn from "@/features/general/components/module/CreateBtn/CreateBtn";
import PageWrapper from "@/features/general/components/static/PageWrapper/PageWrapper";
import PageItemsWrapper from "@/features/general/components/static/PageItemsWrapper/PageItemsWrapper";

function MissionsPage() {
  return (
    <PageWrapper>
      <TopBar>
        <TopBar.Title asTitle>Missions</TopBar.Title>
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
              <span className="sub-text">To {new Date().toLocaleString()}</span>
            </div>
          </div>
        ))}

        <div className="p-3 border-2 w-full flex-1 border-dashed rounded-component flex justify-center items-center">
          <p>You haven{"'"}t any missions</p>
        </div>

        <p className="w-full text-center sub-text">
          Its better to have not more than 3 or 4 missions!
        </p>

        <CreateBtn withPlusIcon href="/missions/new">
          New Mission
        </CreateBtn>
      </PageItemsWrapper>
    </PageWrapper>
  );
}

export default MissionsPage;
