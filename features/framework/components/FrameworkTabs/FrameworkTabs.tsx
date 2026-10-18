"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { LoaderIcon } from "lucide-react";

import {
  FRAMEWORK_CATEGORIES,
  FRAMEWORK_SECTIONS,
  FrameworkCategory,
  FrameworkSection,
} from "../../types";
import { useFrameworkItems } from "../../hooks";
import FrameworkItemCard from "../FrameworkItemCard/FrameworkItemCard";
import { Button } from "@/features/general/components/ui/Button/Button";
import { useLocale } from "@/features/general/components/module/LocaleProvider/LocaleProvider";

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

export function FrameworkTabs() {
  const sp = useSearchParams();
  const activeCategory = resolveCategory(sp.get("category"));
  const activeSection = resolveSection(sp.get("section"));

  const { items: filteredItems, isLoading, deleteItem } = useFrameworkItems(
    activeCategory,
    activeSection,
  );
  const { t } = useLocale();

  const handleDelete = (id: number) => {
    deleteItem(id).catch((err) =>
      console.error("Failed to delete framework item:", err),
    );
  };

  return (
    <>
      {/* Category Pills */}
      <div className="w-full flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden py-0.5">
        {FRAMEWORK_CATEGORIES.map((category) => {
          const isActive =
            category.toLowerCase() === activeCategory.toLowerCase();
          return (
            <Button
              key={category}
              nativeButton={false}
              render={
                <Link
                  href={`/framework?category=${encodeURIComponent(
                    category.toLowerCase(),
                  )}&section=${encodeURIComponent(
                    activeSection.toLowerCase(),
                  )}`}
                  scroll={false}
                />
              }
              variant={isActive ? "primary" : "card"}
              className="shrink-0"
            >
              {t(`framework.categories.${category.toLowerCase()}`) || category}
            </Button>
          );
        })}
      </div>

      {/* Section Sub-Pills (Visions, Rules, Concepts) */}
      <div className="w-full flex items-center gap-2 py-1">
        {FRAMEWORK_SECTIONS.map((section) => {
          const isActive =
            section.toLowerCase() === activeSection.toLowerCase();
          return (
            <Button
              key={section}
              nativeButton={false}
              render={
                <Link
                  href={`/framework?category=${encodeURIComponent(
                    activeCategory.toLowerCase(),
                  )}&section=${encodeURIComponent(section.toLowerCase())}`}
                  scroll={false}
                />
              }
              variant={isActive ? "primary" : "ghost"}
              className="flex-1 justify-center text-xs"
            >
              {t(`framework.sections.${section.toLowerCase()}`) || section}
            </Button>
          );
        })}
      </div>

      {/* Items List */}
      <div className="w-full overflow-hidden rounded-container">
        {isLoading && filteredItems.length === 0 ? (
          <div className="flex w-full items-center justify-center p-12 text-foreground/40 gap-2">
            <LoaderIcon className="size-5 animate-spin" />
            <span className="text-xs sub-text">{t("common.loading")}</span>
          </div>
        ) : (
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`${activeCategory}-${activeSection}`}
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
                <FrameworkItemCard
                  key={item.id}
                  item={item}
                  onDelete={handleDelete}
                />
              ))}

              {filteredItems.length === 0 && (
                <div
                  className="
                    flex w-full flex-1
                    items-center justify-center
                    rounded-container
                    border-2 border-dashed
                    p-6
                  "
                >
                  <p className="sub-text">
                    {t("framework.emptySection", {
                      section:
                        t(
                          `framework.sections.${activeSection.toLowerCase()}`,
                        ) || activeSection,
                      category:
                        t(
                          `framework.categories.${activeCategory.toLowerCase()}`,
                        ) || activeCategory,
                    })}
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </>
  );
}

export default FrameworkTabs;
