"use client";

import Link from "next/link";
import { useEffect, useActionState } from "react";
import { Field } from "@base-ui/react";
import { motion } from "motion/react";
import {
  CalendarDaysIcon,
  CalendarIcon,
  CheckIcon,
  ChevronRightIcon,
  CircleIcon,
  CompassIcon,
  GaugeIcon,
  Repeat2Icon,
  Trash2Icon,
} from "lucide-react";

import { Todo, TodoAction, TodoDiscipline } from "../../types";
import {
  deleteTodoMutation,
  recordDisciplineMutation,
  toggleActionMutation,
} from "../../mutations";
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

/**
 * A single mission action: completing it is a form submission, never an onClick call.
 */
function MissionActionRow({
  action,
  onMutated,
}: {
  action: TodoAction;
  onMutated?: () => void;
}) {
  const { formatDate } = useLocale();
  const [state, toggleAction, isToggling] = useActionState(
    toggleActionMutation,
    undefined,
  );

  useEffect(() => {
    if (state?.success) {
      onMutated?.();
    }
  }, [state, onMutated]);

  return (
    <form action={toggleAction}>
      <Field.Root className="hidden" name="id">
        <Field.Control type="hidden" name="id" value={action.id} />
      </Field.Root>
      <Button
        type="submit"
        variant="ghost"
        disabled={isToggling}
        className={`h-auto w-full justify-start rounded-container bg-background p-3 text-left whitespace-normal transition-opacity hover:bg-background cursor-pointer [&_svg]:size-auto ${
          action.isDone ? "opacity-60" : ""
        }`}
      >
        <div className="shrink-0">
          {action.isDone ? (
            <div className="flex size-5 items-center justify-center rounded-container bg-foreground">
              <CheckIcon className="size-3.5 text-background" />
            </div>
          ) : (
            <CircleIcon className="size-5 sub-text" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p
            className={`font-medium text-sm ${
              action.isDone ? "line-through sub-text" : ""
            }`}
          >
            {action.title}
          </p>

          <div className="mt-1 flex items-center gap-1.5 sub-text text-xs">
            <CalendarIcon className="size-3" />
            <span>{formatDate(action.deadline)}</span>
          </div>
        </div>
      </Button>
    </form>
  );
}

/**
 * A mission discipline check-in: "I Do" and "I Don't Do" are two submit buttons
 * of the same form, distinguished by their `isDone` value.
 */
function MissionDisciplineRow({
  discipline,
  onMutated,
}: {
  discipline: TodoDiscipline;
  onMutated?: () => void;
}) {
  const { t } = useLocale();
  const [state, recordAction, isRecording] = useActionState(
    recordDisciplineMutation,
    undefined,
  );

  useEffect(() => {
    if (state?.success) {
      onMutated?.();
    }
  }, [state, onMutated]);

  return (
    <div className="flex flex-col gap-3 rounded-container bg-background p-3">
      <div className="flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-component bg-card">
          <Repeat2Icon className="size-4" />
        </div>

        <div className="flex-1 h-10 flex justify-between items-start flex-col">
          <p className="text-sm font-medium">{discipline.title}</p>
          <p className="sub-text text-xs flex items-center gap-1.5">
            <span>{discipline.repeatInterval}</span>
            {discipline.lifeArea?.title && (
              <span>• {discipline.lifeArea.title}</span>
            )}
          </p>
        </div>
      </div>

      <form action={recordAction} className="flex gap-2 w-full mt-1">
        <Field.Root className="hidden" name="id">
          <Field.Control type="hidden" name="id" value={discipline.id} />
        </Field.Root>
        <Button
          type="submit"
          name="isDone"
          value="true"
          variant="outline"
          disabled={isRecording}
          className="flex-1 justify-center py-1.5 h-auto text-xs bg-card-thick text-foreground hover:bg-card-thick/80 border-foreground/20"
        >
          {t("missions.iDo") || "I Do"}
        </Button>
        <Button
          type="submit"
          name="isDone"
          value="false"
          variant="ghost"
          disabled={isRecording}
          className="flex-1 justify-center py-1.5 h-auto text-xs text-foreground/60 hover:text-foreground"
        >
          {t("missions.iDontDo") || "I Don't Do"}
        </Button>
      </form>
    </div>
  );
}

type TodoMissionCardProps = {
  todo: Todo;
  /** Called after any mission action/discipline check-in succeeds so the list can revalidate. */
  onMutated?: () => void;
};

function TodoMissionCard({ todo, onMutated }: TodoMissionCardProps) {
  const { formatDate, t } = useLocale();

  const [deleteState, deleteAction, isDeleting] = useActionState(
    deleteTodoMutation,
    undefined,
  );

  useEffect(() => {
    if (deleteState?.success) {
      onMutated?.();
    }
  }, [deleteState, onMutated]);

  const actions = todo.actions || [];
  const disciplines = todo.disciplines || [];
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
                {todo.lifeArea?.title && (
                  <>
                    <span className="sub-text">•</span>
                    <span className="sub-text text-foreground font-medium truncate max-w-[110px]">
                      {todo.lifeArea.title}
                    </span>
                  </>
                )}
                {disciplines.length > 0 && (
                  <>
                    <span className="sub-text">•</span>
                    <span className="sub-text flex items-center gap-1">
                      <Repeat2Icon className="size-3" />
                      {disciplines.length}
                    </span>
                  </>
                )}
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

      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-container bg-background p-3">
          <div className="flex items-center gap-2 sub-text">
            <CalendarDaysIcon className="size-4" />
            <span className="text-xs">{t("common.deadline")}</span>
          </div>
          <p className="mt-2 text-xs font-medium">{formatDate(todo.deadline)}</p>
        </div>

        <div className="rounded-container bg-background p-3">
          <div className="flex items-center gap-2 sub-text">
            <GaugeIcon className="size-4" />
            <span className="text-xs truncate">{t("missions.difficulty") || "Time and Energy Cost"}</span>
          </div>
          <div className="mt-3">
            <Difficulty value={todo.difficulty || 3} />
          </div>
        </div>

        <div className="rounded-container bg-background p-3">
          <div className="flex items-center gap-2 sub-text">
            <CheckIcon className="size-4" />
            <span className="text-xs">{t("missions.actionsLabel") || "Actions"}</span>
          </div>
          <p className="mt-2 text-xs font-medium">{totalActions}</p>
        </div>

        {todo.lifeArea?.title && (
          <div className="col-span-3 rounded-container bg-background p-3">
            <div className="flex items-center gap-2 sub-text">
              <CompassIcon className="size-4" />
              <span className="text-xs">{t("lifeAreas.title") || "Life Area"}</span>
            </div>
            <p className="mt-2 text-xs font-medium">{todo.lifeArea.title}</p>
          </div>
        )}
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
              <MissionActionRow
                key={action.id}
                action={action}
                onMutated={onMutated}
              />
            ))}
          </div>
        </section>
      )}

      {disciplines.length > 0 && (
        <section className="space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm">
                {t("missions.disciplines") || "Disciplines"}
              </h3>
              <span className="sub-text text-xs">{disciplines.length}</span>
            </div>
            <p className="sub-text mt-0.5 text-xs">
              {t("missions.disciplinesSubtitle") ||
                "Repeated behaviors that support the mission"}
            </p>
          </div>

          <div className="space-y-2">
            {disciplines.map((discipline) => (
              <MissionDisciplineRow
                key={discipline.id}
                discipline={discipline}
                onMutated={onMutated}
              />
            ))}
          </div>
        </section>
      )}

      <div className="flex gap-2">
        <form action={deleteAction}>
          <Field.Root className="hidden" name="id">
            <Field.Control type="hidden" name="id" value={todo.id} />
          </Field.Root>
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
                  href={`/todos/new?editId=${todo.id}`}
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

export default TodoMissionCard;
