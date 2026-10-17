"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  CalendarDaysIcon,
  CalendarIcon,
  CheckIcon,
  ChevronRightIcon,
  CircleIcon,
  GaugeIcon,
} from "lucide-react";

import { Todo } from "../../types";
import Drawer from "@/features/general/components/ui/Drawer/Drawer";
import { Button } from "@/features/general/components/ui/Button/Button";
import { useLocale } from "@/features/general/components/module/LocaleProvider/LocaleProvider";

function Difficulty({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className={`h-1.5 w-1/5 rounded-full ${
            index < value ? "bg-foreground" : "bg-card-thick"
          }`}
        />
      ))}
    </div>
  );
}

type TodoMissionCardProps = {
  todo: Todo;
  onToggleAction?: (todoId: number, actionId: number) => void;
};

function TodoMissionCard({ todo, onToggleAction }: TodoMissionCardProps) {
  const { formatDate, t } = useLocale();

  const actions = todo.actions || [];
  const totalActions = actions.length;
  const completedActions = actions.filter((a) => a.isDone).length;
  const progress =
    totalActions > 0 ? Math.round((completedActions / totalActions) * 100) : 0;

  return (
    <Drawer
      nativeButton={false}
      trigger={
        <div
          key={todo.id}
          className="w-full rounded-container bg-card p-3 transition-opacity hover:opacity-90 cursor-pointer"
        >
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="font-bold">{todo.title}</p>
                <span className="shrink-0 rounded-container bg-card-thick px-2.5 py-0.5 text-xs font-medium">
                  {t("todos.missions") || "Mission"}
                </span>
              </div>

              <div className="mt-1 flex items-center gap-2">
                <span className="sub-text text-sm">
                  {t("dates.to")} {formatDate(todo.deadline)}
                </span>
                <span className="sub-text">•</span>
                <span className="sub-text">{progress}%</span>
              </div>
            </div>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-container bg-card-thick">
            <motion.div
              initial={{ width: 6 }}
              className="h-full rounded-container bg-foreground"
              transition={{ duration: 0.6, ease: "easeOut" }}
              animate={{ width: progress ? `${progress}%` : 6 }}
            />
          </div>
        </div>
      }
    >
      <Drawer.Title className="title">{todo.title}</Drawer.Title>

      <div className="rounded-container bg-background p-3">
        <div className="flex items-center justify-between">
          <span className="font-bold">{t("common.progress")}</span>
          <span className="sub-text text-sm">
            {completedActions} / {totalActions}
          </span>
        </div>

        <div className="h-1.5 overflow-hidden rounded-container bg-card mt-1.5">
          <motion.div
            initial={{ width: 0 }}
            className="h-full rounded-container bg-foreground"
            transition={{ duration: 0.6, ease: "easeOut" }}
            animate={{ width: progress ? `${progress}%` : 6 }}
          />
        </div>

        <p className="sub-text mt-1.5 text-xs">{progress}% completed</p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <div className="rounded-container bg-background p-3">
          <div className="flex items-center gap-2 sub-text">
            <CalendarDaysIcon className="size-4" />
            <span>{t("common.deadline")}</span>
          </div>
          <p className="mt-2 text-sm font-medium">{formatDate(todo.deadline)}</p>
        </div>

        <div className="rounded-container bg-background p-3">
          <div className="flex items-center gap-2 sub-text">
            <GaugeIcon className="size-4" />
            <span>{t("missions.difficulty") || "Difficulty"}</span>
          </div>
          <div className="mt-3">
            <Difficulty value={todo.difficulty || 3} />
          </div>
        </div>

        <div className="rounded-container bg-background p-3 col-span-2 sm:col-span-1">
          <div className="flex items-center gap-2 sub-text">
            <CheckIcon className="size-4" />
            <span>{t("missions.actionsLabel") || "Actions"}</span>
          </div>
          <p className="mt-2 text-sm font-medium">{totalActions}</p>
        </div>
      </div>

      {totalActions > 0 && (
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm">
              {t("missions.actionsLabel") || "Actions"}
            </h3>
            <span className="sub-text text-xs">
              {completedActions}/{totalActions}
            </span>
          </div>

          <div className="space-y-2">
            {actions.map((action) => (
              <div
                key={action.id}
                role="button"
                tabIndex={0}
                onClick={() => onToggleAction?.(todo.id, action.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onToggleAction?.(todo.id, action.id);
                  }
                }}
                className="flex items-start gap-3 rounded-container bg-background p-3 transition-opacity hover:bg-background/90 cursor-pointer"
              >
                <div className="translate-y-0.5 shrink-0">
                  {action.isDone ? (
                    <div className="flex size-5 items-center justify-center rounded-container bg-foreground">
                      <CheckIcon className="size-3.5 text-background" />
                    </div>
                  ) : (
                    <CircleIcon className="size-5 muted-text" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm ${
                      action.isDone ? "muted-text line-through" : ""
                    }`}
                  >
                    {action.title}
                  </p>

                  <div className="mt-1 flex items-center gap-1.5 sub-text text-xs">
                    <CalendarIcon className="size-3" />
                    <span>{formatDate(action.deadline)}</span>
                  </div>
                </div>
              </div>
            ))}
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
              className="w-full justify-center"
              render={
                <Link
                  className="flex flex-1"
                  href={`/todos/new?editId=${todo.id}&type=mission`}
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

export default TodoMissionCard;
