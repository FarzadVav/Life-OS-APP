"use client";

import Link from "next/link";
import {
  CalendarDaysIcon,
  ChevronRightIcon,
  ClockIcon,
  FileTextIcon,
  TagIcon,
} from "lucide-react";

import { Skill } from "../../types";
import Drawer from "@/features/general/components/ui/Drawer/Drawer";
import { Button } from "@/features/general/components/ui/Button/Button";
import { useLocale } from "@/features/general/components/module/LocaleProvider/LocaleProvider";
import { stripHtml } from "@/features/general/lib/richText";
import { RichTextViewer } from "@/features/general/components/ui/RichTextEditor";

type SkillCardProps = {
  skill: Skill;
};

function SkillCard({ skill }: SkillCardProps) {
  const { formatDate, formatTime, t } = useLocale();

  return (
    <Drawer
      nativeButton={false}
      trigger={
        <div
          key={skill.id}
          className="w-full rounded-component bg-card p-3 transition-opacity hover:opacity-90 cursor-pointer"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="font-bold line-clamp-1 flex-1">{skill.title}</p>
            {skill.type ? (
              <span className="shrink-0 rounded-full bg-card-thick px-2.5 py-0.5 text-xs font-medium">
                {skill.type}
              </span>
            ) : null}
          </div>

          <p className="mt-1.5 line-clamp-2 sub-text text-sm">
            {stripHtml(skill.content)}
          </p>

          <div className="mt-3 flex items-center justify-between text-xs sub-text">
            <span className="flex items-center gap-1">
              <CalendarDaysIcon className="size-3.5" />
              {formatDate(skill.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              <ClockIcon className="size-3.5" />
              {formatTime(skill.createdAt)}
            </span>
          </div>
        </div>
      }
    >
      <Drawer.Title className="title">{skill.title}</Drawer.Title>

      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-component bg-background p-3">
          <div className="flex items-center gap-2 sub-text">
            <TagIcon className="size-4" />
            <span>{t("common.type")}</span>
          </div>
          <p className="mt-2 font-medium">{skill.type || t("common.general")}</p>
        </div>

        <div className="rounded-component bg-background p-3">
          <div className="flex items-center gap-2 sub-text">
            <CalendarDaysIcon className="size-4" />
            <span>{t("common.date")}</span>
          </div>
          <p className="mt-2 font-medium">{formatDate(skill.createdAt)}</p>
        </div>

        <div className="rounded-component bg-background p-3">
          <div className="flex items-center gap-2 sub-text">
            <ClockIcon className="size-4" />
            <span>{t("common.time")}</span>
          </div>
          <p className="mt-2 font-medium">{formatTime(skill.createdAt)}</p>
        </div>
      </div>

      <section className="space-y-2">
        <div className="flex items-center gap-2 sub-text">
          <FileTextIcon className="size-4" />
          <span className="font-bold">{t("common.content")}</span>
        </div>

        <div className="rounded-component bg-background p-4 text-sm leading-relaxed">
          <RichTextViewer content={skill.content} />
        </div>
      </section>

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
                  href={`/skills/new?editId=${skill.id}`}
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

export default SkillCard;
