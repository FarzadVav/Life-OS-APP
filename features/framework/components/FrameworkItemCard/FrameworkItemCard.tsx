"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronRightIcon, Trash2Icon, EditIcon } from "lucide-react";

import { FrameworkItem } from "../../types";
import Drawer from "@/features/general/components/ui/Drawer/Drawer";
import Dialog from "@/features/general/components/ui/Dialog/Dialog";
import { Button } from "@/features/general/components/ui/Button/Button";
import { RichTextViewer } from "@/features/general/components/ui/RichTextEditor";
import { stripHtml } from "@/features/general/lib/richText";
import { useLocale } from "@/features/general/components/module/LocaleProvider/LocaleProvider";

type FrameworkItemCardProps = {
  item: FrameworkItem;
  onDelete?: (id: number) => void;
};

export function FrameworkItemCard({ item, onDelete }: FrameworkItemCardProps) {
  const { formatDate, t } = useLocale();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const excerpt = stripHtml(item.content);

  const handleDelete = () => {
    onDelete?.(item.id);
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <Drawer
        nativeButton={false}
        trigger={
          <div
            key={item.id}
            className="w-full rounded-container bg-card p-3 transition-opacity hover:opacity-90 cursor-pointer"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="font-bold text-sm leading-snug">{item.title}</p>
              <span className="shrink-0 rounded-container bg-card-thick px-2.5 py-0.5 text-xs font-medium">
                {t(`framework.sections.${item.section.toLowerCase()}`) ||
                  item.section}
              </span>
            </div>

            {excerpt ? (
              <p className="sub-text mt-1.5 line-clamp-2 text-xs leading-relaxed">
                {excerpt}
              </p>
            ) : null}

            <div className="mt-2.5 flex items-center gap-2 text-xs sub-text">
              <span>
                {t(`framework.categories.${item.category.toLowerCase()}`) ||
                  item.category}
              </span>
              <span>•</span>
              <span>{formatDate(item.createdAt)}</span>
            </div>
          </div>
        }
      >
        <div className="flex items-start justify-between gap-2">
          <Drawer.Title className="title">{item.title}</Drawer.Title>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-container bg-card-thick px-2.5 py-1 text-xs font-semibold">
            {t(`framework.categories.${item.category.toLowerCase()}`) ||
              item.category}
          </span>
          <span className="rounded-container bg-card-thick px-2.5 py-1 text-xs font-semibold">
            {t(`framework.sections.${item.section.toLowerCase()}`) ||
              item.section}
          </span>
          <span className="sub-text text-xs ms-auto">
            {formatDate(item.createdAt)}
          </span>
        </div>

        <div className="rounded-container bg-background p-4 min-h-[140px] border border-foreground/5">
          <RichTextViewer content={item.content} />
        </div>

        <div className="flex items-center gap-2 pt-1">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setDeleteDialogOpen(true)}
            className="gap-1.5 text-xs text-foreground/70 hover:text-foreground"
          >
            <Trash2Icon className="size-4" />
            <span>{t("common.delete") || "Delete"}</span>
          </Button>

          <div className="ms-auto flex gap-2">
            <Drawer.Close
              render={
                <Button type="button" variant="card">
                  {t("common.close") || "Close"}
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
                  render={
                    <Link
                      className="flex items-center gap-1 px-4"
                      href={`/framework/new?editId=${item.id}&category=${encodeURIComponent(item.category)}&section=${encodeURIComponent(item.section)}`}
                    >
                      <EditIcon className="size-3.5" />
                      <span>{t("common.edit")}</span>
                      <ChevronRightIcon className="size-3.5" />
                    </Link>
                  }
                />
              }
            />
          </div>
        </div>
      </Drawer>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <div className="p-1 space-y-4">
          <Dialog.Title className="font-bold">
            {t("common.delete") || "Delete"}
          </Dialog.Title>
          <Dialog.Description className="sub-text text-xs">
            {t("framework.confirmDelete") ||
              "Are you sure you want to delete this framework item?"}
          </Dialog.Description>
          <div className="flex items-center justify-end gap-2 pt-2">
            <Dialog.Close
              render={
                <Button type="button" variant="ghost">
                  {t("common.cancel")}
                </Button>
              }
            />
            <Button type="button" variant="primary" onClick={handleDelete}>
              {t("common.delete")}
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
}

export default FrameworkItemCard;
