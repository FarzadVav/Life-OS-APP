"use client";

import { useSearchParams } from "next/navigation";
import PageActionBtn from "@/features/general/components/module/PageActionBtn/PageActionBtn";
import { useLocale } from "@/features/general/components/module/LocaleProvider/LocaleProvider";

function TodosActionBtn() {
  const { t } = useLocale();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const activeTab = tab === "upcoming" ? "upcoming" : "today";
  const href = `/todos/new?type=${activeTab === "upcoming" ? "upcoming" : "daily"}`;

  return <PageActionBtn href={href}>{t("todos.new")}</PageActionBtn>;
}

export default TodosActionBtn;
