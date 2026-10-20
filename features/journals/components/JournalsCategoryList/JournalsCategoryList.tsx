"use client";

import Link from "next/link";
import {
  Brain,
  ChevronRight,
  Heart,
  Lightbulb,
  PenLine,
  ScrollText,
  type LucideIcon,
} from "lucide-react";

import { JOURNAL_CATEGORIES, JournalCategory, JournalType } from "../../types";
import { useJournalsStats } from "../../hooks";
import { useLocale } from "@/features/general/components/module/LocaleProvider/LocaleProvider";

const CATEGORY_META: Record<
  JournalType,
  {
    icon: LucideIcon;
    descriptionKey: string;
    fallbackDescription: string;
  }
> = {
  Logs: {
    icon: ScrollText,
    descriptionKey: "journals.categoryDesc.logs",
    fallbackDescription: "Daily activity, execution notes, and progress logs",
  },
  Thoughts: {
    icon: Brain,
    descriptionKey: "journals.categoryDesc.thoughts",
    fallbackDescription: "Reflections, mental models, and deep contemplations",
  },
  Feelings: {
    icon: Heart,
    descriptionKey: "journals.categoryDesc.feelings",
    fallbackDescription: "Emotional awareness, gratitude, and inner state",
  },
  Ideas: {
    icon: Lightbulb,
    descriptionKey: "journals.categoryDesc.ideas",
    fallbackDescription: "Sparks of creativity, projects, and future concepts",
  },
  Notes: {
    icon: PenLine,
    descriptionKey: "journals.categoryDesc.notes",
    fallbackDescription: "Quick references, checklists, and working memos",
  },
};

export default function JournalsCategoryList() {
  const { stats } = useJournalsStats();
  const { t } = useLocale();

  return (
    <div className="w-full flex flex-col gap-3">
      {JOURNAL_CATEGORIES.map((category) => {
        const meta = CATEGORY_META[category];
        const Icon = meta.icon;
        const count = stats?.counts?.[category as unknown as JournalCategory] ?? 0;
        const label =
          t(`journals.categories.${category.toLowerCase()}`) || category;
        const desc = t(meta.descriptionKey) || meta.fallbackDescription;

        return (
          <Link
            key={category}
            href={`/journals/${category.toLowerCase()}`}
            className="group flex items-center justify-between gap-4 p-4 rounded-container bg-card border border-foreground/10 hover:border-foreground/30 transition-all active:scale-[0.99] select-none shadow-xs"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="size-11 rounded-full bg-foreground/5 flex items-center justify-center shrink-0 text-foreground group-hover:bg-foreground group-hover:text-background transition-colors">
                <Icon className="size-5" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-foreground text-base tracking-tight truncate">
                  {label}
                </span>
                <span className="sub-text text-xs line-clamp-1 mt-0.5">
                  {desc}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-foreground/5 text-foreground/70 group-hover:bg-foreground/10 transition-colors">
                {count}
              </span>
              <ChevronRight className="size-4 text-foreground/40 group-hover:text-foreground transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
