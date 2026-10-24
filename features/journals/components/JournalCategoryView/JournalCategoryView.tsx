"use client";

import { LoaderIcon } from "lucide-react";
import { useJournals } from "../../hooks";
import { JournalType } from "../../types";
import JournalCard from "../JournalCard/JournalCard";
import TopBar from "@/features/general/components/static/TopBar/TopBar";
import PageActionBtn from "@/features/general/components/module/PageActionBtn/PageActionBtn";
import PageWrapper from "@/features/general/components/static/PageWrapper/PageWrapper";
import PageItemsWrapper from "@/features/general/components/static/PageItemsWrapper/PageItemsWrapper";
import { useLocale } from "@/features/general/components/module/LocaleProvider/LocaleProvider";

type JournalCategoryViewProps = {
  category: JournalType;
  title: string;
};

export default function JournalCategoryView({
  category,
  title,
}: JournalCategoryViewProps) {
  const {
    journals,
    isLoading,
    mutate: revalidateJournals,
  } = useJournals(category);
  const { t } = useLocale();

  return (
    <PageWrapper>
      <TopBar>
        <TopBar.Title asTitle>{title}</TopBar.Title>
        <TopBar.Btn backIcon href="/journals" position="left" />
        <TopBar.HelpBtn position="right" />
      </TopBar>

      <PageItemsWrapper>
        <div className="w-full flex items-center justify-between pb-1 text-xs text-foreground/70">
          <span className="font-semibold text-foreground">{title}</span>
          <span>
            {journals.length} {t("profile.total") || "items"}
          </span>
        </div>

        {isLoading && journals.length === 0 ? (
          <div className="flex w-full items-center justify-center p-12 text-foreground/40 gap-2">
            <LoaderIcon className="size-5 animate-spin" />
            <span className="text-xs sub-text">{t("common.loading")}</span>
          </div>
        ) : (
          <div className="w-full space-y-3">
            {journals.map((journal) => (
              <JournalCard
                key={journal.id}
                journal={journal}
                onDeleted={revalidateJournals}
              />
            ))}

            {journals.length === 0 && (
              <div className="flex w-full flex-col items-center justify-center rounded-container border-2 border-dashed border-foreground/15 p-10 text-center gap-2">
                <p className="font-semibold text-foreground text-sm">
                  {t("journals.noJournalsInCategory") ||
                    "No journals in this category"}
                </p>
                <p className="sub-text text-xs">{t("journals.subtitle")}</p>
              </div>
            )}
          </div>
        )}

        <PageActionBtn
          href={`/journals/new?category=${encodeURIComponent(
            category.toLowerCase(),
          )}`}
        >
          {t("journals.new")}
        </PageActionBtn>
      </PageItemsWrapper>
    </PageWrapper>
  );
}
