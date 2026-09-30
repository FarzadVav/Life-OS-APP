import { Suspense } from "react";
import { UserIcon } from "lucide-react";

import TopBar from "@/features/general/components/static/TopBar/TopBar";
import TodosTabs from "@/features/todos/components/TodosTabs/TodosTabs";
import CreateBtn from "@/features/general/components/module/CreateBtn/CreateBtn";
import PageWrapper from "@/features/general/components/static/PageWrapper/PageWrapper";
import PageItemsWrapper from "@/features/general/components/static/PageItemsWrapper/PageItemsWrapper";

function UserHomePage() {
  return (
    <PageWrapper>
      <TopBar>
        <TopBar.Title asTitle>Todos</TopBar.Title>
        <TopBar.Btn href="/profile" position="left">
          <UserIcon />
        </TopBar.Btn>
      </TopBar>

      <PageItemsWrapper>
        <Suspense>
          <TodosTabs />
        </Suspense>
      </PageItemsWrapper>

      <CreateBtn>New Todo</CreateBtn>
    </PageWrapper>
  );
}

export default UserHomePage;
