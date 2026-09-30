import { UserIcon } from "lucide-react";

import TopBar from "@/features/general/components/static/TopBar/TopBar";
import { Button } from "@/features/general/components/ui/Button/Button";
import CreateBtn from "@/features/general/components/module/CreateBtn/CreateBtn";
import PageWrapper from "@/features/general/components/static/PageWrapper/PageWrapper";
import PageItemsWrapper from "@/features/general/components/static/PageItemsWrapper/PageItemsWrapper";
import TodosTabs from "@/features/todos/components/TodosTabs/TodosTabs";
import { Suspense } from "react";

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

        <CreateBtn withPlusIcon>New Todo</CreateBtn>
      </PageItemsWrapper>
    </PageWrapper>
  );
}

export default UserHomePage;
