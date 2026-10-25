"use client";

import { useActionState, useEffect, useMemo } from "react";
import Field from "@/features/general/components/ui/Field";
import {
  EditIcon,
  Trash2Icon,
  Repeat2Icon,
  CompassIcon,
  CheckCircle2Icon,
  XCircleIcon,
  CalendarDaysIcon,
} from "lucide-react";

import type { Habit } from "../../types";
import { recordHabitMutation } from "../../mutations";
import Drawer from "@/features/general/components/ui/Drawer/Drawer";
import { Button } from "@/features/general/components/ui/Button/Button";
import { useLocale } from "@/features/general/components/module/LocaleProvider/LocaleProvider";

export interface HabitCardProps {
  habit: Habit;
  onEdit: (habit: Habit) => void;
  onRequestDelete: (id: number) => void;
  onRecorded?: () => void;
}

export function HabitCard({
  habit,
  onEdit,
  onRequestDelete,
  onRecorded,
}: HabitCardProps) {
  const { t } = useLocale();

  const [recordState, recordAction, isRecording] = useActionState(
    recordHabitMutation,
    undefined,
  );

  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const todayStatus = useMemo(() => {
    const history = habit.history || [];
    const entry = history.find((h) => h.date === todayStr);
    return entry !== undefined ? entry.isDone : null;
  }, [habit.history, todayStr]);

  const completedCount = useMemo(() => {
    return (habit.history || []).filter((h) => h.isDone).length;
  }, [habit.history]);

  useEffect(() => {
    if (recordState?.success) {
      onRecorded?.();
    }
  }, [recordState, onRecorded]);

  return (
    <Drawer
      nativeButton={false}
      trigger={
        <div className="group w-full rounded-container bg-card p-4 transition-all hover:bg-card/80 border border-foreground/5 shadow-xs cursor-pointer">
          <div className="flex flex-col gap-3">
            {/* Top row: Icon, Title, Badges, Edit/Delete */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5 min-w-0 flex-1">
                <div className="size-8 rounded-container bg-foreground/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Repeat2Icon className="size-4 text-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold text-sm truncate text-foreground">
                      {habit.title}
                    </h4>
                    {habit.lifeArea && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] bg-foreground/10 text-foreground/80 font-medium">
                        <CompassIcon className="size-3" />
                        <span className="truncate max-w-[120px]">
                          {habit.lifeArea.title}
                        </span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-1 text-xs sub-text">
                    <span className="flex items-center gap-1">
                      <Repeat2Icon className="size-3" />
                      <span>{habit.repeatInterval}</span>
                    </span>
                    {completedCount > 0 && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <CheckCircle2Icon className="size-3 text-foreground/70" />
                          <span>{completedCount}</span>
                        </span>
                      </>
                    )}
                  </div>

                  {habit.description && (
                    <p className="sub-text text-xs line-clamp-2 mt-1.5 leading-relaxed">
                      {habit.description}
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
                  onClick={() => onEdit(habit)}
                >
                  <EditIcon className="size-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  square
                  className="size-8 text-foreground/70 hover:text-destructive"
                  aria-label={t("common.delete")}
                  onClick={() => onRequestDelete(habit.id)}
                >
                  <Trash2Icon className="size-3.5" />
                </Button>
              </div>
            </div>

            {/* Bottom row: I Do / I Don't Do Buttons (exactly like mission discipline) */}
            <form
              action={recordAction}
              className="flex items-center gap-2 pt-1 border-t border-foreground/5"
              onClick={(e) => e.stopPropagation()}
            >
              <Field type="hidden" name="id" value={habit.id} />
              <Button
                type="submit"
                name="isDone"
                value="true"
                variant={todayStatus === true ? "primary" : "outline"}
                disabled={isRecording}
                className={`flex-1 justify-center py-1.5 h-8 text-xs font-medium rounded-component transition-all ${
                  todayStatus === true
                    ? "bg-foreground text-background font-semibold"
                    : "bg-card-thick text-foreground hover:bg-card-thick/80 border-foreground/20"
                }`}
              >
                <CheckCircle2Icon className="size-3.5 me-1.5" />
                <span>{t("missions.iDo") || "I Do"}</span>
              </Button>

              <Button
                type="submit"
                name="isDone"
                value="false"
                variant={todayStatus === false ? "primary" : "ghost"}
                disabled={isRecording}
                className={`flex-1 justify-center py-1.5 h-8 text-xs rounded-component transition-all ${
                  todayStatus === false
                    ? "bg-destructive text-destructive-foreground font-semibold"
                    : "text-foreground/60 hover:text-foreground"
                }`}
              >
                <XCircleIcon className="size-3.5 me-1.5" />
                <span>{t("missions.iDontDo") || "I Don't Do"}</span>
              </Button>
            </form>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Drawer Header */}
        <div className="flex items-center justify-between gap-3 border-b border-foreground/10 pb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="size-9 rounded-container bg-foreground/10 flex items-center justify-center shrink-0">
              <Repeat2Icon className="size-5 text-foreground" />
            </div>
            <div className="min-w-0">
              <Drawer.Title className="title truncate">{habit.title}</Drawer.Title>
              <div className="flex items-center gap-2 mt-0.5 text-xs sub-text">
                <span>{habit.repeatInterval}</span>
                {habit.lifeArea && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <CompassIcon className="size-3" />
                      <span>{habit.lifeArea.title}</span>
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onEdit(habit)}
              className="h-8 px-3 text-xs gap-1.5"
            >
              <EditIcon className="size-3.5" />
              <span>{t("common.edit")}</span>
            </Button>
            <Button
              type="button"
              variant="ghost"
              square
              onClick={() => onRequestDelete(habit.id)}
              className="size-8 text-destructive hover:bg-destructive/10"
            >
              <Trash2Icon className="size-3.5" />
            </Button>
          </div>
        </div>

        {/* Description */}
        {habit.description && (
          <div className="rounded-container bg-background/60 p-4 border border-foreground/10">
            <p className="text-sm leading-relaxed text-foreground select-text whitespace-pre-wrap">
              {habit.description}
            </p>
          </div>
        )}

        {/* Today's Check-in Action inside Drawer */}
        <div className="rounded-container bg-card p-4 border border-foreground/10 space-y-2.5">
          <h4 className="text-xs font-bold text-foreground">
            {t("habits.todayCheckin") || "Today's Action"}
          </h4>
          <form action={recordAction} className="flex items-center gap-2">
            <Field type="hidden" name="id" value={habit.id} />
            <Button
              type="submit"
              name="isDone"
              value="true"
              variant={todayStatus === true ? "primary" : "outline"}
              disabled={isRecording}
              className={`flex-1 justify-center py-2 h-9 text-xs font-medium rounded-component ${
                todayStatus === true
                  ? "bg-foreground text-background font-semibold"
                  : "bg-card-thick text-foreground border-foreground/20"
              }`}
            >
              <CheckCircle2Icon className="size-4 me-1.5" />
              <span>{t("missions.iDo") || "I Do"}</span>
            </Button>
            <Button
              type="submit"
              name="isDone"
              value="false"
              variant={todayStatus === false ? "primary" : "ghost"}
              disabled={isRecording}
              className={`flex-1 justify-center py-2 h-9 text-xs rounded-component ${
                todayStatus === false
                  ? "bg-destructive text-destructive-foreground font-semibold"
                  : "text-foreground/60 hover:text-foreground"
              }`}
            >
              <XCircleIcon className="size-4 me-1.5" />
              <span>{t("missions.iDontDo") || "I Don't Do"}</span>
            </Button>
          </form>
        </div>

        {/* Recent History summary */}
        {habit.history && habit.history.length > 0 && (
          <div className="rounded-container bg-card p-4 border border-foreground/10 space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-foreground">
                {t("habits.historyTitle") || "Recent Check-ins"}
              </h4>
              <span className="text-xs sub-text">
                {completedCount} / {habit.history.length} {t("common.done") || "Done"}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto scrollbar-thin">
              {[...habit.history]
                .reverse()
                .slice(0, 14)
                .map((entry) => (
                  <span
                    key={entry.id}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium ${
                      entry.isDone
                        ? "bg-foreground/10 text-foreground"
                        : "bg-destructive/10 text-destructive line-through"
                    }`}
                  >
                    <CalendarDaysIcon className="size-3" />
                    <span>{entry.date}</span>
                  </span>
                ))}
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
}

export default HabitCard;
