"use client";

import { EditIcon, Trash2Icon, SparklesIcon, CompassIcon } from "lucide-react";
import type { Skill } from "../../types";
import Drawer from "@/features/general/components/ui/Drawer/Drawer";
import { Button } from "@/features/general/components/ui/Button/Button";
import { useLocale } from "@/features/general/components/module/LocaleProvider/LocaleProvider";

export interface SkillCardProps {
  skill: Skill;
  onEdit: (skill: Skill) => void;
  onRequestDelete: (id: number) => void;
}

export function SkillCard({ skill, onEdit, onRequestDelete }: SkillCardProps) {
  const { t } = useLocale();

  // Strip HTML tags for clean card text preview
  const plainContent = skill.content
    ? skill.content.replace(/<[^>]*>?/gm, "").trim()
    : "";

  return (
    <Drawer
      nativeButton={false}
      trigger={
        <div className="group w-full rounded-container bg-card p-4 transition-all hover:bg-card/80 border border-foreground/5 shadow-xs cursor-pointer">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="size-8 rounded-container bg-foreground/10 flex items-center justify-center shrink-0">
                <SparklesIcon className="size-4 text-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-bold text-sm truncate text-foreground">
                    {skill.title}
                  </h4>
                  {skill.lifeArea && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] bg-foreground/10 text-foreground/80 font-medium">
                      <CompassIcon className="size-3" />
                      <span className="truncate max-w-[120px]">{skill.lifeArea.title}</span>
                    </span>
                  )}
                </div>
                {plainContent ? (
                  <p className="sub-text text-xs line-clamp-2 mt-1 leading-relaxed">
                    {plainContent}
                  </p>
                ) : (
                  <p className="sub-text text-xs italic mt-1 text-foreground/40">
                    {t("skills.contentPlaceholder")}
                  </p>
                )}
              </div>
            </div>

            <div
              className="flex items-center gap-1 shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                type="button"
                variant="ghost"
                square
                className="size-8 text-foreground/70 hover:text-foreground"
                aria-label={t("common.edit")}
                onClick={() => onEdit(skill)}
              >
                <EditIcon className="size-3.5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                square
                className="size-8 text-foreground/70 hover:text-destructive"
                aria-label={t("common.delete")}
                onClick={() => onRequestDelete(skill.id)}
              >
                <Trash2Icon className="size-3.5" />
              </Button>
            </div>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3 border-b border-foreground/10 pb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="size-9 rounded-container bg-foreground/10 flex items-center justify-center shrink-0">
              <SparklesIcon className="size-5 text-foreground" />
            </div>
            <div className="min-w-0">
              <Drawer.Title className="title truncate">{skill.title}</Drawer.Title>
              {skill.lifeArea ? (
                <div className="flex items-center gap-1.5 mt-0.5">
                  <CompassIcon className="size-3 text-foreground/60" />
                  <span className="sub-text text-xs">{skill.lifeArea.title}</span>
                </div>
              ) : (
                <p className="sub-text text-xs">{t("skills.contentLabel")}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onEdit(skill)}
              className="h-8 px-3 text-xs gap-1.5"
            >
              <EditIcon className="size-3.5" />
              <span>{t("common.edit")}</span>
            </Button>
            <Button
              type="button"
              variant="ghost"
              square
              onClick={() => onRequestDelete(skill.id)}
              className="size-8 text-destructive hover:bg-destructive/10"
            >
              <Trash2Icon className="size-3.5" />
            </Button>
          </div>
        </div>

        <div className="rounded-container bg-background/60 p-4 border border-foreground/10">
          {skill.content ? (
            <div
              className="tiptap-content text-sm leading-relaxed text-foreground select-text"
              dangerouslySetInnerHTML={{ __html: skill.content }}
            />
          ) : (
            <p className="sub-text text-sm italic">
              {t("skills.contentPlaceholder")}
            </p>
          )}
        </div>
      </div>
    </Drawer>
  );
}

export default SkillCard;
