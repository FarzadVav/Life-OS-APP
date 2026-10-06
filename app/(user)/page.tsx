import { Suspense } from "react";
import { UserIcon } from "lucide-react";

import TopBar from "@/features/general/components/static/TopBar/TopBar";
import TodosTabs from "@/features/todos/components/TodosTabs/TodosTabs";
import CreateBtn from "@/features/general/components/module/CreateBtn/CreateBtn";
import PageWrapper from "@/features/general/components/static/PageWrapper/PageWrapper";
import PageItemsWrapper from "@/features/general/components/static/PageItemsWrapper/PageItemsWrapper";

import ConnectivityFallback from "@/features/general/components/module/ConnectivityFallback/ConnectivityFallback";
import { getTranslations } from "@/features/general/lib/i18n/server";

async function UserHomePage() {
  const { t } = await getTranslations();

  return (
    <PageWrapper>
      <TopBar>
        <TopBar.Title asTitle>{t("todos.title")}</TopBar.Title>
        <TopBar.Btn href="/profile" position="left">
          <UserIcon />
        </TopBar.Btn>
        <TopBar.InstallBtn position="right" />
      </TopBar>

      <PageItemsWrapper>
        <Suspense fallback={<ConnectivityFallback message={t("todos.loading")} />}>
          <TodosTabs />
        </Suspense>

        <p className="sub-text w-full text-center">
          {t("todos.subtitle")}
        </p>

        <CreateBtn href="/todos/new">{t("todos.new")}</CreateBtn>
      </PageItemsWrapper>
    </PageWrapper>
  );
}

export default UserHomePage;
