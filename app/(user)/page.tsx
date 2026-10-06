import { Suspense } from "react";
import { UserIcon } from "lucide-react";

import TopBar from "@/features/general/components/static/TopBar/TopBar";
import TodosTabs from "@/features/todos/components/TodosTabs/TodosTabs";
import CreateBtn from "@/features/general/components/module/CreateBtn/CreateBtn";
import PageWrapper from "@/features/general/components/static/PageWrapper/PageWrapper";
import PageItemsWrapper from "@/features/general/components/static/PageItemsWrapper/PageItemsWrapper";

import ConnectivityFallback from "@/features/general/components/module/ConnectivityFallback/ConnectivityFallback";

function UserHomePage() {
  return (
    <PageWrapper>
      <TopBar>
        <TopBar.Title asTitle>Todos</TopBar.Title>
        <TopBar.Btn href="/profile" position="left">
          <UserIcon />
        </TopBar.Btn>
        <TopBar.InstallBtn position="right" />
      </TopBar>

      <PageItemsWrapper>
        <Suspense fallback={<ConnectivityFallback message="Waiting for connection to load todos..." />}>
          <TodosTabs />
        </Suspense>

        <p className="sub-text w-full text-center">
          Focus on high-impact daily actions to build relentless momentum.
        </p>

        <CreateBtn href="/todos/new">New Todo</CreateBtn>
      </PageItemsWrapper>
    </PageWrapper>
  );
}

export default UserHomePage;
