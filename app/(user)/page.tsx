import TopBar from "@/features/general/components/static/TopBar/TopBar";
import TopBarBackBtn from "@/features/general/components/static/TopBar/TopBarBackBtn";

function UserHomePage() {
  return (
    <>
      <TopBar>
        <TopBar.TopBarCapsule>
          <TopBarBackBtn goBack />
          <TopBar.TopBarTitle>FarzadVav</TopBar.TopBarTitle>
        </TopBar.TopBarCapsule>
      </TopBar>
    </>
  );
}

export default UserHomePage;
