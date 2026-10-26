"use client";

import { useMemo, useEffect, useActionState } from "react";
import Field from "@/features/general/components/ui/Field";
import {
  CalendarDaysIcon,
  CheckCircle2Icon,
  CompassIcon,
  Repeat2Icon,
  Trash2Icon,
  XCircleIcon,
} from "lucide-react";
import type { Habit } from "../../types";
import { recordHabitMutation } from "../../mutations";
import CardDrawer from "@/features/general/components/ui/CardDrawer/CardDrawer";
import { Button } from "@/features/general/components/ui/Button/Button";
import { useLocale } from "@/features/general/components/module/LocaleProvider/LocaleProvider";

export interface HabitCardProps {
  habit: Habit;
  onEdit?: (habit: Habit) => void;
  onRequestDelete: (id: number) => void;
  onRecorded?: () => void;
}

export function HabitCard({
  habit,
  onRequestDelete,
  onRecorded,
}: HabitCardProps) {
  const { t } = useLocale();

  const [recordState, recordAction, isRecording] = useActionState(
    recordHabitMutation,
    undefined,
  );

  const todayStr = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }, []);

  const todayStatus = useMemo(() => {
    const todayEntry = (habit.history || []).find((h) => h.date === todayStr);
    return todayEntry ? todayEntry.isDone : null;
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
    <CardDrawer
      title={habit.title}
      description={habit.description}
      date={
        <span className="flex items-center gap-1">
          <Repeat2Icon className="size-3" />
          <span>{habit.repeatInterval}</span>
        </span>
      }
      icon={
        <div className="size-8 rounded-container bg-foreground/10 flex items-center justify-center shrink-0">
          <Repeat2Icon className="size-4 text-foreground" />
        </div>
      }
      editHref={`/habits/new?editId=${habit.id}`}
      content={
        <div className="space-y-4">
          {habit.lifeArea && (
            <div className="flex items-center gap-1.5 sub-text text-xs">
              <CompassIcon className="size-3 text-foreground/60" />
              <span>{habit.lifeArea.title}</span>
            </div>
          )}

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
              {t("habits.todayCheckin")}
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
                <span>{t("missions.iDo")}</span>
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
                <span>{t("missions.iDontDo")}</span>
              </Button>
            </form>
          </div>

          {/* Recent History summary */}
          {habit.history && habit.history.length > 0 && (
            <div className="rounded-container bg-card p-4 border border-foreground/10 space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-foreground">
                  {t("habits.historyTitle")}
                </h4>
                <span className="text-xs sub-text">
                  {completedCount} / {habit.history.length} {t("common.done")}
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
      }
      actions={
        <Button
          type="button"
          variant="card"
          square
          aria-label={t("common.delete")}
          onClick={() => onRequestDelete(habit.id)}
        >
          <Trash2Icon className="size-4 text-destructive" />
        </Button>
      }
    />
  );
}

export default HabitCard;
