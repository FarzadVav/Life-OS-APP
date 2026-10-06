"use client";

import Link from "next/link";
import {
  CalendarDaysIcon,
  ChevronRightIcon,
  ClockIcon,
  FileTextIcon,
  TagIcon,
} from "lucide-react";

import { Journal } from "../../types";
import Drawer from "@/features/general/components/ui/Drawer/Drawer";
import { Button } from "@/features/general/components/ui/Button/Button";

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return isNaN(date.getTime())
    ? dateStr
    : date.toLocaleDateString("fa-IR", {
        numberingSystem: "latn",
      });
}

function formatTime(dateStr: string) {
  const date = new Date(dateStr);
  return isNaN(date.getTime())
    ? ""
    : date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
}

type JournalCardProps = {
  journal: Journal;
};

function JournalCard({ journal }: JournalCardProps) {
  return (
    <Drawer
      nativeButton={false}
      trigger={
        <div
          key={journal.id}
          className="w-full rounded-component bg-card p-3 transition-opacity hover:opacity-90 cursor-pointer"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="font-bold line-clamp-1 flex-1">{journal.title}</p>
            {journal.type ? (
              <span className="shrink-0 rounded-full bg-card-thick px-2.5 py-0.5 text-xs font-medium">
                {journal.type}
              </span>
            ) : null}
          </div>

          <p className="mt-1.5 line-clamp-2 sub-text text-sm">
            {journal.content}
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
        <div className="rounded-component bg-background p-3">
          <div className="flex items-center gap-2 sub-text">
            <TagIcon className="size-4" />
            <span>Type</span>
          </div>
          <p className="mt-2 font-medium">{journal.type || "General"}</p>
        </div>

        <div className="rounded-component bg-background p-3">
          <div className="flex items-center gap-2 sub-text">
            <CalendarDaysIcon className="size-4" />
            <span>Date</span>
          </div>
          <p className="mt-2 font-medium">{formatDate(journal.createdAt)}</p>
        </div>

        <div className="rounded-component bg-background p-3">
          <div className="flex items-center gap-2 sub-text">
            <ClockIcon className="size-4" />
            <span>Time</span>
          </div>
          <p className="mt-2 font-medium">{formatTime(journal.createdAt)}</p>
        </div>
      </div>

      <section className="space-y-2">
        <div className="flex items-center gap-2 sub-text">
          <FileTextIcon className="size-4" />
          <span className="font-bold">Content</span>
        </div>

        <div className="rounded-component bg-background p-4 text-sm leading-relaxed whitespace-pre-wrap">
          {journal.content}
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
                  href={`/journals/new?editId=${journal.id}`}
                >
                  <span>Edit</span>
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

export default JournalCard;
