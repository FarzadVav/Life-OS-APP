import { SearchIcon, UserIcon } from "lucide-react";

import TopBar from "@/features/general/components/static/TopBar/TopBar";
import PageWrapper from "@/features/general/components/static/PageWrapper/PageWrapper";
import CreateFeatureLink from "@/features/general/components/module/CreateFeatureLink/CreateFeatureLink";

function UserHomePage() {
  return (
    <PageWrapper>
      <TopBar>
        <TopBar.Btn href="/search" position="right">
          <SearchIcon />
        </TopBar.Btn>
        <TopBar.Title asTitle>Farzad Vahdati</TopBar.Title>
        <TopBar.Btn href="/profile" position="left">
          <UserIcon />
        </TopBar.Btn>
      </TopBar>

      <CreateFeatureLink featureArea="notes" />
    </PageWrapper>
  );
}

export default UserHomePage;
