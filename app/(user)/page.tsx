import { SearchIcon, UserIcon } from "lucide-react";

import TopBar from "@/features/general/components/static/TopBar/TopBar";
import CreateBtn from "@/features/general/components/module/CreateBtn/CreateBtn";
import PageWrapper from "@/features/general/components/static/PageWrapper/PageWrapper";
import PageItemsWrapper from "@/features/general/components/static/PageItemsWrapper/PageItemsWrapper";

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
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="w-full space-y-1 p-3 rounded-component bg-card"
          >
            <div>
              <p className="font-bold">
                Make the SaaS and sell to 100 customers
              </p>
              <span className="sub-text">To {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        ))}

        <CreateBtn withPlusIcon>New Todo</CreateBtn>
      </PageItemsWrapper>
    </PageWrapper>
  );
}

export default UserHomePage;
