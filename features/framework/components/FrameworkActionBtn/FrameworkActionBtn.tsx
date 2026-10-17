"use client";

import { useSearchParams } from "next/navigation";
import PageActionBtn from "@/features/general/components/module/PageActionBtn/PageActionBtn";
import { useLocale } from "@/features/general/components/module/LocaleProvider/LocaleProvider";
import {
  FRAMEWORK_CATEGORIES,
  FRAMEWORK_SECTIONS,
  FrameworkCategory,
  FrameworkSection,
} from "../../types";

function resolveCategory(param: string | null): FrameworkCategory {
  if (!param) return "Career";
  const found = FRAMEWORK_CATEGORIES.find(
    (c) => c.toLowerCase() === param.toLowerCase(),
  );
  return found ?? "Career";
}

function resolveSection(param: string | null): FrameworkSection {
  if (!param) return "Visions";
  const found = FRAMEWORK_SECTIONS.find(
    (s) => s.toLowerCase() === param.toLowerCase(),
  );
  return found ?? "Visions";
}

export function FrameworkActionBtn() {
  const { t } = useLocale();
  const searchParams = useSearchParams();

  const activeCategory = resolveCategory(searchParams.get("category"));
  const activeSection = resolveSection(searchParams.get("section"));

  const href = `/framework/new?category=${encodeURIComponent(
    activeCategory.toLowerCase(),
  )}&section=${encodeURIComponent(activeSection.toLowerCase())}`;

  const singular = activeSection.endsWith("s")
    ? activeSection.slice(0, -1)
    : activeSection;

  const label =
    t(`framework.new${singular}`) ||
    t("framework.newItem") ||
    `New ${singular}`;

  return <PageActionBtn href={href}>{label}</PageActionBtn>;
}

export default FrameworkActionBtn;
