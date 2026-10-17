"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "cn";

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
import { Button } from "@/features/general/components/ui/Button/Button";
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

  return (
    <PageWrapper>
      <TopBar>
        <TopBar.Title asTitle>{categoryTitle}</TopBar.Title>
        <TopBar.Btn backIcon href="/framework" position="left" />
        <TopBar.HelpBtn position="right" />
      </TopBar>

      <PageItemsWrapper>
        {/* Section Switcher (Visions, Rules, Concepts) */}
        <div className="w-full flex gap-2">
          {FRAMEWORK_SECTIONS.map((section) => {
            const isActive = section === activeSection;
            const count = items.filter(
              (i) =>
                i.category.toLowerCase() === category.toLowerCase() &&
                i.section.toLowerCase() === section.toLowerCase(),
            ).length;
            const label =
              t(`framework.sections.${section.toLowerCase()}`) || section;

            return (
              <Button
                key={section}
                type="button"
                className="flex-1 justify-center rounded-container text-xs sm:text-sm font-semibold transition-all py-2 gap-1.5"
                variant={isActive ? "primary" : "card"}
                onClick={() => setActiveSection(section)}
              >
                <span>{label}</span>
                <span
                  className={cn(
                    "text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full font-bold",
                    isActive
                      ? "bg-background/25 text-background"
                      : "bg-foreground/10 text-foreground/70",
                  )}
                >
                  {count}
                </span>
              </Button>
            );
          })}
        </div>

        {/* Items Section */}
        <div className="w-full overflow-hidden rounded-container">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`${category}-${activeSection}`}
              className="w-full space-y-3"
              transition={{ ease: "linear", duration: 0.15 }}
              initial={{
                translateX: "-10%",
                opacity: 0,
                filter: "blur(4px)",
              }}
              animate={{ translateX: 0, opacity: 1, filter: "none" }}
              exit={{
                translateX: "10%",
                opacity: 0,
                filter: "blur(4px)",
              }}
            >
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
            </motion.div>
          </AnimatePresence>
        </div>

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
