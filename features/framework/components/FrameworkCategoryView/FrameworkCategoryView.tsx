"use client";

import { useState } from "react";

import {
  FRAMEWORK_SECTIONS,
  FrameworkCategory,
  FrameworkSection,
} from "../../types";
import { useFrameworkItems } from "../../items";
import FrameworkItemCard from "../FrameworkItemCard/FrameworkItemCard";
import TopBar from "@/features/general/components/static/TopBar/TopBar";
import PageActionBtn from "@/features/general/components/module/PageActionBtn/PageActionBtn";
import PageWrapper from "@/features/general/components/static/PageWrapper/PageWrapper";
import PageItemsWrapper from "@/features/general/components/static/PageItemsWrapper/PageItemsWrapper";
import SlideTabs, { SlideTabItem } from "@/features/general/components/ui/SlideTabs";
import { useLocale } from "@/features/general/components/module/LocaleProvider/LocaleProvider";

type FrameworkCategoryViewProps = {
  category: FrameworkCategory;
  initialSection?: FrameworkSection;
  categoryTitle: string;
};

export default function FrameworkCategoryView({
  category,
  initialSection = "Visions",
  categoryTitle,
}: FrameworkCategoryViewProps) {
  const { items } = useFrameworkItems();
  const { t } = useLocale();

  const [activeSection, setActiveSection] =
    useState<FrameworkSection>(initialSection);

  const filteredItems = items.filter(
    (item) =>
      item.category.toLowerCase() === category.toLowerCase() &&
      item.section.toLowerCase() === activeSection.toLowerCase(),
  );

  const sectionLabel =
    t(`framework.sections.${activeSection.toLowerCase()}`) || activeSection;

  const tabs: SlideTabItem[] = FRAMEWORK_SECTIONS.map((section) => {
    const count = items.filter(
      (i) =>
        i.category.toLowerCase() === category.toLowerCase() &&
        i.section.toLowerCase() === section.toLowerCase(),
    ).length;
    const label =
      t(`framework.sections.${section.toLowerCase()}`) || section;

    return {
      id: section,
      label,
      badge: count,
    };
  });

  return (
    <PageWrapper>
      <TopBar>
        <TopBar.Title asTitle>{categoryTitle}</TopBar.Title>
        <TopBar.Btn backIcon href="/framework" position="left" />
        <TopBar.HelpBtn position="right" />
      </TopBar>

      <PageItemsWrapper>
        {/* Section Switcher (Visions, Rules, Concepts) using SlideTabs */}
        <SlideTabs
          tabs={tabs}
          activeId={activeSection}
          onTabChange={(id) => setActiveSection(id as FrameworkSection)}
        >
          <div className="w-full space-y-3">
            {filteredItems.map((item) => (
              <FrameworkItemCard key={item.id} item={item} />
            ))}

            {filteredItems.length === 0 && (
              <div
                className="
                  flex w-full flex-1
                  flex-col
                  items-center justify-center
                  rounded-container
                  border-2 border-dashed
                  border-foreground/15
                  p-8
                  text-center
                  gap-2
                "
              >
                <p className="sub-text text-sm">
                  {t("framework.emptySection", {
                    section: sectionLabel,
                    category: categoryTitle,
                  })}
                </p>
              </div>
            )}
          </div>
        </SlideTabs>

        <PageActionBtn
          href={`/framework/new?category=${encodeURIComponent(
            category,
          )}&section=${encodeURIComponent(activeSection)}`}
        >
          {t("framework.newItemWithSection", { section: sectionLabel }) ||
            t("framework.new")}
        </PageActionBtn>
      </PageItemsWrapper>
    </PageWrapper>
  );
}
