"use client";

import Link from "next/link";
import {
  CalendarDaysIcon,
  CheckIcon,
  ChevronRightIcon,
  CircleIcon,
  ClockIcon,
  TagIcon,
} from "lucide-react";

import { Todo } from "../../types";
import Drawer from "@/features/general/components/ui/Drawer/Drawer";
import { Button } from "@/features/general/components/ui/Button/Button";
import Switch from "@/features/general/components/ui/Switch/Switch";
import { useLocale } from "@/features/general/components/module/LocaleProvider/LocaleProvider";

type TodoCardProps = {
  todo: Todo;
  onToggle?: (id: number) => void;
};

function TodoCard({ todo, onToggle }: TodoCardProps) {
  const isDaily = todo.type === "Daily";
  const { formatDeadline, t } = useLocale();

  return (
    <Drawer
      nativeButton={false}
      trigger={
        <div
          key={todo.id}
          className="group w-full rounded-component bg-card p-3 transition-opacity hover:opacity-90 cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label={todo.isDone ? t("todos.markIncomplete") : t("todos.markComplete")}
              onClick={(e) => {
                e.stopPropagation();
                onToggle?.(todo.id);
              }}
              className="shrink-0 transition-transform active:scale-90"
            >
              {todo.isDone ? (
                <div className="flex size-5 items-center justify-center rounded-component bg-foreground">
                  <CheckIcon className="size-3.5 text-background" />
                </div>
              ) : (
                <CircleIcon className="size-5 muted-text group-hover:text-foreground" />
              )}
            </button>

            <div className="min-w-0 flex-1">
              <p
                className={`font-medium transition-all ${
                  todo.isDone ? "line-through muted-text" : ""
                }`}
              >
                {todo.title}
              </p>

              <div className="mt-1 flex items-center gap-2 text-xs sub-text">
                <span className="flex items-center gap-1">
                  {isDaily ? (
                    <ClockIcon className="size-3" />
                  ) : (
                    <CalendarDaysIcon className="size-3" />
                  )}
                  {formatDeadline(todo.deadline, isDaily)}
                </span>
                <span>•</span>
                <span>{todo.type}</span>
              </div>
            </div>

            <span className="shrink-0 rounded-component bg-card-thick px-2.5 py-0.5 text-xs font-medium">
              {todo.type}
            </span>
          </div>
        </div>
      }
    >
      <Drawer.Title className="title">{todo.title}</Drawer.Title>

      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-component bg-background p-3">
          <div className="flex items-center gap-2 sub-text">
            <TagIcon className="size-4" />
            <span>{t("common.type")}</span>
          </div>
          <p className="mt-2 font-medium">{todo.type}</p>
        </div>

        <div className="rounded-component bg-background p-3">
          <div className="flex items-center gap-2 sub-text">
            {isDaily ? (
              <ClockIcon className="size-4" />
            ) : (
              <CalendarDaysIcon className="size-4" />
            )}
            <span>{t("common.deadline")}</span>
          </div>
          <p className="mt-2 font-medium">
            {formatDeadline(todo.deadline, isDaily)}
          </p>
        </div>

        <div className="rounded-component bg-background p-3">
          <div className="flex items-center gap-2 sub-text">
            <CheckIcon className="size-4" />
            <span>{t("common.status")}</span>
          </div>
          <p
            className={`mt-2 font-medium ${
              todo.isDone ? "text-foreground" : "sub-text"
            }`}
          >
            {todo.isDone ? t("todos.completed") : t("todos.inProgress")}
          </p>
        </div>
      </div>

      <label className="rounded-component bg-background p-3 flex items-center justify-between cursor-pointer select-none">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-foreground">
            {todo.isDone ? t("todos.markAsIncomplete") : t("todos.markAsCompleted")}
          </span>
          <span className="sub-text text-xs">
            {todo.isDone ? t("todos.completed") : t("todos.inProgress")}
          </span>
        </div>
        <Switch
          checked={todo.isDone}
          onCheckedChange={() => onToggle?.(todo.id)}
          aria-label={todo.isDone ? t("todos.markAsIncomplete") : t("todos.markAsCompleted")}
        />
      </label>

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
                  href={`/todos/new?editId=${todo.id}`}
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

export default TodoCard;
