"use client";

import { EditIcon, Trash2Icon, CompassIcon } from "lucide-react";

import type { LifeArea } from "../../types";
import Drawer from "@/features/general/components/ui/Drawer/Drawer";
import { Button } from "@/features/general/components/ui/Button/Button";
import { useLocale } from "@/features/general/components/module/LocaleProvider/LocaleProvider";
import Link from "next/link";

export interface LifeAreaCardProps {
  lifeArea: LifeArea;
}

export function LifeAreaCard({ lifeArea }: LifeAreaCardProps) {
  const { t } = useLocale();

  return (
    <Drawer
      nativeButton={false}
      trigger={
        <div className="group card card-action items-center justify-between">
          <p className="title">{lifeArea.title}</p>

          <Button
            square
            type="button"
            variant="ghost"
            aria-label={t("common.edit")}
            render={
              <Link href={`/profile/new-life-are?editId=${lifeArea.id}`}>
                <EditIcon />
              </Link>
            }
          />
        </div>
      }>
      <Drawer.Title className="title">{lifeArea.title}</Drawer.Title>

      <div className="rounded-container bg-background p-3">
        {lifeArea.vision ? (
          <div
            className="tiptap-content"
            dangerouslySetInnerHTML={{ __html: lifeArea.vision }}
          />
        ) : (
          <p>{t("lifeAreas.visionPlaceholder")}</p>
        )}
      </div>

      <Button
        type="button"
        className={"w-full"}
        aria-label={t("common.edit")}
        render={
          <Link href={`/profile/new-life-are?editId=${lifeArea.id}`}>
            <EditIcon />
            <span>{t("common.edit")}</span>
          </Link>
        }
      />
    </Drawer>
  );
}

export default LifeAreaCard;
