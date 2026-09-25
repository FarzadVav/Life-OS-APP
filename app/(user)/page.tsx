import { SearchIcon, UserIcon } from "lucide-react";

import TopBar from "@/features/general/components/static/TopBar/TopBar";
import PageWrapper from "@/features/general/components/static/PageWrapper/PageWrapper";
import PageItemsWrapper from "@/features/general/components/static/PageItemsWrapper/PageItemsWrapper";
import CreateBtn from "@/features/general/components/module/CreateBtn/CreateBtn";

function UserHomePage() {
  return (
    <PageWrapper>
      <TopBar>
        <TopBar.Btn href="/search" position="right">
          <SearchIcon />
        </TopBar.Btn>
        <TopBar.Title asTitle>Today</TopBar.Title>
        <TopBar.Btn href="/profile" position="left">
          <UserIcon />
        </TopBar.Btn>
      </TopBar>

      <PageItemsWrapper>
        {Array.from({ length: 25 }).map((_, i) => (
          <div key={i} className="w-full py-12 rounded-lg bg-card" />
        ))}

        <CreateBtn withPlusIcon>New Todo</CreateBtn>
      </PageItemsWrapper>
    </PageWrapper>
  );
}

export default UserHomePage;
