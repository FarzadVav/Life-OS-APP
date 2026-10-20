"use client";

import { EditIcon, Trash2Icon, CompassIcon } from "lucide-react";
import type { LifeArea } from "../../types";
import Drawer from "@/features/general/components/ui/Drawer/Drawer";
import { Button } from "@/features/general/components/ui/Button/Button";
import { useLocale } from "@/features/general/components/module/LocaleProvider/LocaleProvider";

export interface LifeAreaCardProps {
  lifeArea: LifeArea;
  onEdit: (lifeArea: LifeArea) => void;
  onDelete: (id: number) => void;
}

export function LifeAreaCard({
  lifeArea,
  onEdit,
  onDelete,
}: LifeAreaCardProps) {
  const { t } = useLocale();

  // Strip HTML tags for clean card text preview
  const plainVision = lifeArea.vision
    ? lifeArea.vision.replace(/<[^>]*>?/gm, "").trim()
    : "";

  return (
    <Drawer
      nativeButton={false}
      trigger={
        <div className="group w-full rounded-container bg-card p-4 transition-all hover:bg-card/80 border border-foreground/5 shadow-xs cursor-pointer">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="size-8 rounded-container bg-foreground/10 flex items-center justify-center shrink-0">
                <CompassIcon className="size-4 text-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-sm truncate text-foreground">
                  {lifeArea.title}
                </h4>
                {plainVision ? (
                  <p className="sub-text text-xs line-clamp-2 mt-1 leading-relaxed">
                    {plainVision}
                  </p>
                ) : (
                  <p className="sub-text text-xs italic mt-1 text-foreground/40">
                    {t("lifeAreas.visionPlaceholder")}
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
                onClick={() => onEdit(lifeArea)}
              >
                <EditIcon className="size-3.5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                square
                className="size-8 text-foreground/70 hover:text-destructive"
                aria-label={t("common.delete")}
                onClick={() => onDelete(lifeArea.id)}
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
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-container bg-foreground/10 flex items-center justify-center">
              <CompassIcon className="size-5 text-foreground" />
            </div>
            <div>
              <Drawer.Title className="title">{lifeArea.title}</Drawer.Title>
              <p className="sub-text text-xs">{t("lifeAreas.visionLabel")}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              variant="outline"
              onClick={() => onEdit(lifeArea)}
              className="h-8 px-3 text-xs gap-1.5"
            >
              <EditIcon className="size-3.5" />
              <span>{t("common.edit")}</span>
            </Button>
            <Button
              type="button"
              variant="ghost"
              square
              onClick={() => onDelete(lifeArea.id)}
              className="size-8 text-destructive hover:bg-destructive/10"
            >
              <Trash2Icon className="size-3.5" />
            </Button>
          </div>
        </div>

        <div className="rounded-container bg-background/60 p-4 border border-foreground/10">
          {lifeArea.vision ? (
            <div
              className="tiptap-content text-sm leading-relaxed text-foreground select-text"
              dangerouslySetInnerHTML={{ __html: lifeArea.vision }}
            />
          ) : (
            <p className="sub-text text-sm italic">
              {t("lifeAreas.visionPlaceholder")}
            </p>
          )}
        </div>
      </div>
    </Drawer>
  );
}

export default LifeAreaCard;
