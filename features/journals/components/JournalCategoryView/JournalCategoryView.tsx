"use client";

import { useJournals } from "../../items";
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
  const { journals } = useJournals();
  const { t } = useLocale();

  const currentJournals = journals.filter(
    (item) => item.type?.toLowerCase() === category.toLowerCase(),
  );

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
            {currentJournals.length} {t("profile.total") || "items"}
          </span>
        </div>

        <div className="w-full space-y-3">
          {currentJournals.map((journal) => (
            <JournalCard key={journal.id} journal={journal} />
          ))}

          {currentJournals.length === 0 && (
            <div className="flex w-full flex-col items-center justify-center rounded-container border-2 border-dashed border-foreground/15 p-10 text-center gap-2">
              <p className="font-semibold text-foreground text-sm">
                {t("journals.noJournalsInCategory") ||
                  "No journals in this category"}
              </p>
              <p className="sub-text text-xs">
                {t("journals.subtitle")}
              </p>
            </div>
          )}
        </div>

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
