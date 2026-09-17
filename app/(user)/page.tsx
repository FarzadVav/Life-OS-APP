import { SearchIcon, UserIcon } from "lucide-react";

import TopBar from "@/features/general/components/static/TopBar/TopBar";

function UserHomePage() {
  return (
    <>
      <TopBar>
        <TopBar.Capsule>
          <TopBar.Btn href="/search" position="right">
            <SearchIcon />
          </TopBar.Btn>
          <TopBar.Title asTitle>Farzad Vahdati</TopBar.Title>
          <TopBar.Btn href="/profile" position="left">
            <UserIcon />
          </TopBar.Btn>
        </TopBar.Capsule>
      </TopBar>
    </>
  );
}

export default UserHomePage;
