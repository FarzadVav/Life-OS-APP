"use client";

import Link from "next/link";
import {
  BookOpen,
  Brain,
  Briefcase,
  ChevronRight,
  Coins,
  HeartPulse,
  Sparkles,
  Target,
  Users,
  type LucideIcon,
} from "lucide-react";

import { FRAMEWORK_CATEGORIES, FrameworkCategory } from "../../types";
import { useFrameworkItems } from "../../items";
import { useLocale } from "@/features/general/components/module/LocaleProvider/LocaleProvider";

const CATEGORY_META: Record<
  FrameworkCategory,
  {
    icon: LucideIcon;
    descriptionKey: string;
    fallbackDescription: string;
  }
> = {
  Career: {
    icon: Briefcase,
    descriptionKey: "framework.categoryDesc.career",
    fallbackDescription: "Mastery, high-impact craft, engineering quality, and focus",
  },
  Mindset: {
    icon: Brain,
    descriptionKey: "framework.categoryDesc.mindset",
    fallbackDescription: "Stoic equanimity, mental models, and emotional clarity",
  },
  Social: {
    icon: Users,
    descriptionKey: "framework.categoryDesc.social",
    fallbackDescription: "Lifelong trusted circle, deep connection, and companionship",
  },
  Health: {
    icon: HeartPulse,
    descriptionKey: "framework.categoryDesc.health",
    fallbackDescription: "Physical resilience, aerobic endurance, mobility, and sleep",
  },
  Behavior: {
    icon: Target,
    descriptionKey: "framework.categoryDesc.behavior",
    fallbackDescription: "Frictionless habit architecture, discipline, and routines",
  },
  Finance: {
    icon: Coins,
    descriptionKey: "framework.categoryDesc.finance",
    fallbackDescription: "Financial autonomy, compounding assets, and downside protection",
  },
  Lifestyle: {
    icon: Sparkles,
    descriptionKey: "framework.categoryDesc.lifestyle",
    fallbackDescription: "Minimalist sanctuary, intentional spaces, and nature access",
  },
  Knowledge: {
    icon: BookOpen,
    descriptionKey: "framework.categoryDesc.knowledge",
    fallbackDescription: "Foundational reading, polymathic models, and deep learning",
  },
};

export default function FrameworkCategoryList() {
  const { items } = useFrameworkItems();
  const { t } = useLocale();

  return (
    <div className="w-full flex flex-col gap-3">
      {FRAMEWORK_CATEGORIES.map((category) => {
        const meta = CATEGORY_META[category];
        const Icon = meta.icon;
        const count = items.filter(
          (i) => i.category.toLowerCase() === category.toLowerCase(),
        ).length;
        const label =
          t(`framework.categories.${category.toLowerCase()}`) || category;
        const desc = t(meta.descriptionKey) || meta.fallbackDescription;

        return (
          <Link
            key={category}
            href={`/framework/${category.toLowerCase()}`}
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
