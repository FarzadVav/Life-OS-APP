"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { LoaderIcon } from "lucide-react";

import { JOURNAL_CATEGORIES } from "../../types";
import { useJournals } from "../../hooks";
import JournalCard from "../JournalCard/JournalCard";
import { Button } from "@/features/general/components/ui/Button/Button";
import { useLocale } from "@/features/general/components/module/LocaleProvider/LocaleProvider";

function JournalsTabs() {
  const sp = useSearchParams();
  const tab = sp.get("tab");
  const activeTab = tab || "all";

  const { journals: currentJournals, isLoading, deleteJournal } = useJournals(activeTab);
  const { t } = useLocale();

  const handleDelete = (id: number) => {
    deleteJournal(id).catch((err) =>
      console.error("Failed to delete journal:", err),
    );
  };

  return (
    <>
      <div className="w-full flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden py-0.5">
        <Button
          nativeButton={false}
          render={<Link href="?tab=all" scroll={false} />}
          variant={activeTab === "all" ? "primary" : "card"}
          className="shrink-0"
        >
          {t("common.all") || "All"}
        </Button>

        {JOURNAL_CATEGORIES.map((category) => (
          <Button
            key={category}
            nativeButton={false}
            render={
              <Link
                href={`?tab=${encodeURIComponent(category.toLowerCase())}`}
                scroll={false}
              />
            }
            variant={
              activeTab.toLowerCase() === category.toLowerCase()
                ? "primary"
                : "card"
            }
            className="shrink-0"
          >
            {t(`journals.categories.${category.toLowerCase()}`) || category}
          </Button>
        ))}
      </div>

      <div className="w-full overflow-hidden rounded-container">
        {isLoading && currentJournals.length === 0 ? (
          <div className="flex w-full items-center justify-center p-12 text-foreground/40 gap-2">
            <LoaderIcon className="size-5 animate-spin" />
            <span className="text-xs sub-text">{t("common.loading")}</span>
          </div>
        ) : (
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeTab}
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
                <JournalCard
                  key={journal.id}
                  journal={journal}
                  onDelete={handleDelete}
                />
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
                    {activeTab !== "all"
                      ? t("journals.noJournalsInCategory")
                      : t("journals.noJournals")}
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

export default JournalsTabs;
