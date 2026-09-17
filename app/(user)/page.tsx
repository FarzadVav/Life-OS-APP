import TopBar from "@/features/general/components/static/TopBar/TopBar";
import TopBarBackBtn from "@/features/general/components/static/TopBar/TopBarBackBtn";
import { SearchIcon, UserIcon } from "lucide-react";

function UserHomePage() {
  return (
    <>
      <TopBar>
        <TopBar.TopBarCapsule>
          <TopBarBackBtn href="/search" position="right">
            <SearchIcon />
          </TopBarBackBtn>
          <TopBar.TopBarTitle asTitle>Farzad Vahdati</TopBar.TopBarTitle>
          <TopBarBackBtn href="/profile" position="left">
            <UserIcon />
          </TopBarBackBtn>
        </TopBar.TopBarCapsule>
      </TopBar>
    </>
  );
}

export default UserHomePage;
