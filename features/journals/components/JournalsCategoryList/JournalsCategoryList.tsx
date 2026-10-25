"use client";

import Link from "next/link";
import {
  Brain,
  Heart,
  Lightbulb,
  PenLine,
  ScrollText,
  type LucideIcon,
} from "lucide-react";

import { JOURNAL_CATEGORIES, JournalType } from "../../types";
import { useLocale } from "@/features/general/components/module/LocaleProvider/LocaleProvider";
import CardView from "@/features/general/components/ui/CardView/CardView";

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
  const { t } = useLocale();

  return (
    <div className="w-full flex flex-col gap-2.5">
      {JOURNAL_CATEGORIES.map((category) => {
        const meta = CATEGORY_META[category];
        const Icon = meta.icon;
        const label =
          t(`journals.categories.${category.toLowerCase()}`) || category;
        const desc = t(meta.descriptionKey) || meta.fallbackDescription;

        return (
          <Link
            key={category}
            href={`/journals/${category.toLowerCase()}`}
            className="block"
          >
            <CardView
              icon={
                <div className="size-10 rounded-full bg-foreground/5 flex items-center justify-center shrink-0 text-foreground">
                  <Icon className="size-5" />
                </div>
              }
              title={label}
              description={desc}
            />
          </Link>
        );
      })}
    </div>
  );
}
