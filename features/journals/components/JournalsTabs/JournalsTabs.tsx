"use client";

import Link from "next/link";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { PlusIcon } from "lucide-react";

import { Journal } from "../../types";
import { journals as initialJournals } from "../../constants";
import { useJournalCategories } from "../../categories";
import JournalCard from "../JournalCard/JournalCard";
import { Button } from "@/features/general/components/ui/Button/Button";
import { useLocale } from "@/features/general/components/module/LocaleProvider/LocaleProvider";

function JournalsTabs() {
  const [journalsList] = useState<Journal[]>(initialJournals);
  const { categories } = useJournalCategories();
  const { t } = useLocale();
  const sp = useSearchParams();

  const tab = sp.get("tab");
  const activeTab = tab || "all";

  const hasCategories = categories.length > 0;

  const currentJournals =
    !hasCategories || activeTab === "all"
      ? journalsList
      : journalsList.filter(
        (item) => item.type?.toLowerCase() === activeTab.toLowerCase(),
      );

  return (
    <>
      {!hasCategories ? (
        <Button
          nativeButton={false}
          variant="card"
          className="w-full justify-center gap-1.5"
          render={<Link href="/journals/categories" />}
        >
          <PlusIcon className="size-4" />
          <span>{t("journals.createFirstCategory")}</span>
        </Button>
      ) : (
        <div className="w-full flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden py-0.5">
          <Button
            nativeButton={false}
            render={<Link href="?tab=all" scroll={false} />}
            variant={activeTab === "all" ? "primary" : "card"}
            className="shrink-0"
          >
            All
          </Button>

          {categories.map((category) => (
            <Button
              key={category.id}
              nativeButton={false}
              render={
                <Link
                  href={`?tab=${encodeURIComponent(category.name)}`}
                  scroll={false}
                />
              }
              variant={activeTab === category.name ? "primary" : "card"}
              className="shrink-0"
            >
              {category.name}
            </Button>
          ))}

          <Button
            nativeButton={false}
            render={<Link href="/journals/categories" />}
            variant="card"
            className="shrink-0 gap-1.5"
          >
            <PlusIcon className="size-4" />
            <span>{t("common.categories")}</span>
          </Button>
        </div>
      )}

      <div className="w-full overflow-hidden rounded-container">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={hasCategories ? activeTab : "all"}
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
            {currentJournals.map((journal) => (
              <JournalCard key={journal.id} journal={journal} />
            ))}

            {currentJournals.length === 0 && (
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
                  {hasCategories && activeTab !== "all"
                    ? t("journals.noJournalsInCategory")
                    : t("journals.noJournals")}
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}

export default JournalsTabs;
