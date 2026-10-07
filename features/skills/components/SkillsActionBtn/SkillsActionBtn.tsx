"use client";

import { useSearchParams } from "next/navigation";
import PageActionBtn from "@/features/general/components/module/PageActionBtn/PageActionBtn";
import { useLocale } from "@/features/general/components/module/LocaleProvider/LocaleProvider";

function SkillsActionBtn() {
  const { t } = useLocale();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const activeTab = tab || "all";

  const href =
    activeTab && activeTab !== "all"
      ? `/skills/new?category=${encodeURIComponent(activeTab)}`
      : "/skills/new";

  return <PageActionBtn href={href}>{t("skills.new")}</PageActionBtn>;
}

export default SkillsActionBtn;
