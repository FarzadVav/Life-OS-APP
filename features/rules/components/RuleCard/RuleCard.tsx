"use client";

import Link from "next/link";
import {
  CalendarDaysIcon,
  ChevronRightIcon,
  InfoIcon,
  ShieldAlertIcon,
  TagIcon,
} from "lucide-react";

import { Rule } from "../../types";
import Drawer from "@/features/general/components/ui/Drawer/Drawer";
import { Button } from "@/features/general/components/ui/Button/Button";
import { useLocale } from "@/features/general/components/module/LocaleProvider/LocaleProvider";

type RuleCardProps = {
  rule: Rule;
};

function RuleCard({ rule }: RuleCardProps) {
  const { formatDate, t } = useLocale();

  return (
    <Drawer
      nativeButton={false}
      trigger={
        <div
          key={rule.id}
          className="w-full rounded-component bg-card p-3 transition-opacity hover:opacity-90 cursor-pointer"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5 flex-1 min-w-0">
              <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-card-thick">
                <ShieldAlertIcon className="size-3.5 text-foreground/80" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="font-bold">{rule.title}</p>
                {rule.description ? (
                  <p className="mt-1 line-clamp-2 sub-text text-sm">
                    {rule.description}
                  </p>
                ) : null}
              </div>
            </div>

            <span className="shrink-0 rounded-full bg-card-thick px-2.5 py-0.5 text-xs font-medium">
              {rule.category}
            </span>
          </div>
        </div>
      }
    >
      <Drawer.Title className="title">{rule.title}</Drawer.Title>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-component bg-background p-3">
          <div className="flex items-center gap-2 sub-text">
            <TagIcon className="size-4" />
            <span>{t("common.category")}</span>
          </div>
          <p className="mt-2 font-medium">{rule.category}</p>
        </div>

        <div className="rounded-component bg-background p-3">
          <div className="flex items-center gap-2 sub-text">
            <CalendarDaysIcon className="size-4" />
            <span>{t("rules.established")}</span>
          </div>
          <p className="mt-2 font-medium">{formatDate(rule.createdAt)}</p>
        </div>
      </div>

      {rule.description && (
        <section className="space-y-2">
          <div className="flex items-center gap-2 sub-text">
            <InfoIcon className="size-4" />
            <span className="font-bold">{t("rules.rationale")}</span>
          </div>

          <div className="rounded-component bg-background p-4 text-sm leading-relaxed whitespace-pre-wrap">
            {rule.description}
          </div>
        </section>
      )}

      <div className="flex gap-3">
        <Drawer.Close
          render={
            <Button
              type="button"
              variant="card"
              className="flex-1 justify-center"
            >
              Close
            </Button>
          }
        />

        <Drawer.Close
          nativeButton={false}
          render={
            <Button
              type="button"
              variant="primary"
              nativeButton={false}
              className="w-full justify-center"
              render={
                <Link
                  className="flex flex-1"
                  href={`/rules/new?editId=${rule.id}`}
                >
                  <span>{t("common.edit")}</span>
                  <ChevronRightIcon />
                </Link>
              }
            />
          }
        />
      </div>
    </Drawer>
  );
}

export default RuleCard;
