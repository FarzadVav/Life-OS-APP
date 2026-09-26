import TopBar from "@/features/general/components/static/TopBar/TopBar";
import CreateBtn from "@/features/general/components/module/CreateBtn/CreateBtn";
import PageWrapper from "@/features/general/components/static/PageWrapper/PageWrapper";
import PageItemsWrapper from "@/features/general/components/static/PageItemsWrapper/PageItemsWrapper";

function HabitsPage() {
  return (
    <PageWrapper>
      <TopBar>
        <TopBar.Title asTitle>Disciplines</TopBar.Title>
        <TopBar.Btn backIcon href="/" position="left" />
      </TopBar>

      <PageItemsWrapper>
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="w-full space-y-1 p-3 rounded-component bg-card"
          >
            <div>
              <p className="font-bold">Go to the gym and do some exersices</p>
              <span className="sub-text">Every single day</span>
            </div>
          </div>
        ))}

        <CreateBtn withPlusIcon href="/disciplines/new">
          New Discipline
        </CreateBtn>
      </PageItemsWrapper>
    </PageWrapper>
  );
}

export default HabitsPage;
