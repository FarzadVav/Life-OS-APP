"use client";

import Link from "next/link";
import { useEffect, useActionState } from "react";
import Field from "@/features/general/components/ui/Field";
import {
  CalendarDaysIcon,
  ChevronRightIcon,
  ClockIcon,
  FileTextIcon,
  TagIcon,
  Trash2Icon,
} from "lucide-react";

import { Journal } from "../../types";
import { deleteJournalMutation } from "../../mutations";
import Drawer from "@/features/general/components/ui/Drawer/Drawer";
import { Button } from "@/features/general/components/ui/Button/Button";
import { useLocale } from "@/features/general/components/module/LocaleProvider/LocaleProvider";
import { stripHtml } from "@/features/general/lib/richText";
import { RichTextResult } from "@/features/general/components/ui/RichTextEditor";

type JournalCardProps = {
  journal: Journal;
  onDeleted?: () => void;
};

function JournalCard({ journal, onDeleted }: JournalCardProps) {
  const { formatDate, formatTime, t } = useLocale();

  const [deleteState, deleteAction, isDeleting] = useActionState(
    deleteJournalMutation,
    undefined,
  );

  useEffect(() => {
    if (deleteState?.success) {
      onDeleted?.();
    }
  }, [deleteState, onDeleted]);

  return (
    <Drawer
      nativeButton={false}
      trigger={
        <div
          key={journal.id}
          className="w-full rounded-container bg-card p-3 transition-opacity hover:opacity-90 cursor-pointer"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="font-bold line-clamp-1 flex-1">{journal.title}</p>
            {journal.type ? (
              <span className="shrink-0 rounded-container bg-card-thick px-2.5 py-0.5 text-xs font-medium">
                {journal.type}
              </span>
            ) : null}
          </div>

          <p className="mt-1.5 line-clamp-2 sub-text text-sm">
            {stripHtml(journal.content)}
          </p>

          <div className="mt-3 flex items-center justify-between text-xs sub-text">
            <span className="flex items-center gap-1">
              <CalendarDaysIcon className="size-3.5" />
              {formatDate(journal.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              <ClockIcon className="size-3.5" />
              {formatTime(journal.createdAt)}
            </span>
          </div>
        </div>
      }
    >
      <Drawer.Title className="title">{journal.title}</Drawer.Title>

      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-container bg-background p-3">
          <div className="flex items-center gap-2 sub-text">
            <TagIcon className="size-4" />
            <span>{t("common.type")}</span>
          </div>
          <p className="mt-2 font-medium">{journal.type || t("common.general")}</p>
        </div>

        <div className="rounded-container bg-background p-3">
          <div className="flex items-center gap-2 sub-text">
            <CalendarDaysIcon className="size-4" />
            <span>{t("common.date")}</span>
          </div>
          <p className="mt-2 font-medium">{formatDate(journal.createdAt)}</p>
        </div>

        <div className="rounded-container bg-background p-3">
          <div className="flex items-center gap-2 sub-text">
            <ClockIcon className="size-4" />
            <span>{t("common.time")}</span>
          </div>
          <p className="mt-2 font-medium">{formatTime(journal.createdAt)}</p>
        </div>
      </div>

      <section className="space-y-2">
        <div className="flex items-center gap-2 sub-text">
          <FileTextIcon className="size-4" />
          <span className="font-bold">{t("common.content")}</span>
        </div>

        <RichTextResult
          content={journal.content}
          placeholder={t("journals.contentPlaceholder") || "No content"}
          containerClassName="bg-background p-4"
        />
      </section>

      <div className="flex gap-2">
        <form action={deleteAction}>
          <Field type="hidden" name="id" value={journal.id} />
          <Drawer.Close
            render={
              <Button
                type="submit"
                variant="card"
                square
                disabled={isDeleting}
                className="size-10 justify-center text-foreground/70 hover:text-foreground"
                aria-label={t("common.delete")}
              >
                <Trash2Icon className="size-4" />
              </Button>
            }
          />
        </form>

        <Drawer.Close
          render={
            <Button
              type="button"
              variant="card"
              className="flex-1 justify-center"
            >
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
              className="flex-1 justify-center"
              render={
                <Link
                  className="flex flex-1 items-center justify-center gap-1"
                  href={`/journals/new?editId=${journal.id}`}
                >
                  <span>{t("common.edit")}</span>
                  <ChevronRightIcon className="size-4" />
                </Link>
              }
            />
          }
        />
      </div>
    </Drawer>
  );
}

export default JournalCard;
