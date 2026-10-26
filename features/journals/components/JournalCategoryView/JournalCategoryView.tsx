"use client";

import { useJournals } from "../../hooks";
import { JournalType } from "../../types";
import JournalCard from "../JournalCard/JournalCard";
import TopBar from "@/features/general/components/static/TopBar/TopBar";
import HelpDialog from "@/features/general/components/module/HelpDialog/HelpDialog";
import PageActionBtn from "@/features/general/components/module/PageActionBtn/PageActionBtn";
import PageWrapper from "@/features/general/components/static/PageWrapper/PageWrapper";
import PageItemsWrapper from "@/features/general/components/static/PageItemsWrapper/PageItemsWrapper";
import EmptyAlert from "@/features/general/components/static/EmptyAlert";
import Skeleton from "@/features/general/components/ui/Skeleton";
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
        <HelpDialog position="right" />
      </TopBar>

      <PageItemsWrapper>
        <div className="w-full flex items-center justify-between pb-1 text-xs text-foreground/70">
          <span className="font-semibold text-foreground">{title}</span>
          <span>
            {journals.length} {t("profile.total")}
          </span>
        </div>

        {isLoading && journals.length === 0 ? (
          <div className="w-full space-y-3">
            <Skeleton count={3} />
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
              <EmptyAlert
                alert={t("journals.noJournalsInCategory")}
                description={t("journals.subtitle")}
                className="p-10"
              />
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
