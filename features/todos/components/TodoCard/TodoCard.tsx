"use client";

import Link from "next/link";
import { useEffect, useActionState, useRef } from "react";
import { Field } from "@base-ui/react";
import {
  CalendarDaysIcon,
  CheckIcon,
  ChevronRightIcon,
  CircleIcon,
  ClockIcon,
  CompassIcon,
  TagIcon,
  Trash2Icon,
} from "lucide-react";

import { Todo } from "../../types";
import { deleteTodoMutation, toggleTodoMutation } from "../../mutations";
import Drawer from "@/features/general/components/ui/Drawer/Drawer";
import { Button } from "@/features/general/components/ui/Button/Button";
import Switch from "@/features/general/components/ui/Switch/Switch";
import { useLocale } from "@/features/general/components/module/LocaleProvider/LocaleProvider";

type TodoCardProps = {
  todo: Todo;
  /** Called after a toggle/delete server action succeeds so the list can revalidate. */
  onMutated?: () => void;
};

function TodoCard({ todo, onMutated }: TodoCardProps) {
  const isDaily = todo.type === "Daily";
  const { formatDeadline, t } = useLocale();

  const toggleFormRef = useRef<HTMLFormElement>(null);

  const [toggleState, toggleAction, isToggling] = useActionState(
    toggleTodoMutation,
    undefined,
  );
  const [deleteState, deleteAction, isDeleting] = useActionState(
    deleteTodoMutation,
    undefined,
  );

  useEffect(() => {
    if (toggleState?.success || deleteState?.success) {
      onMutated?.();
    }
  }, [toggleState, deleteState, onMutated]);

  return (
    <Drawer
      nativeButton={false}
      trigger={
        <div
          key={todo.id}
          className="group w-full rounded-container bg-card p-3 transition-opacity hover:opacity-90 cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <form
              action={toggleAction}
              className="shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <Field.Root className="hidden" name="id">
                <Field.Control type="hidden" name="id" value={todo.id} />
              </Field.Root>
              <Button
                type="submit"
                variant="ghost"
                aria-label={
                  todo.isDone ? t("todos.markIncomplete") : t("todos.markComplete")
                }
                disabled={isToggling}
                className="h-auto w-auto p-0 rounded-none hover:bg-transparent shrink-0 transition-transform active:scale-90 [&_svg]:size-auto"
              >
                {todo.isDone ? (
                  <div className="flex size-5 items-center justify-center rounded-container bg-foreground">
                    <CheckIcon className="size-3.5 text-background" />
                  </div>
                ) : (
                  <CircleIcon className="size-5 muted-text group-hover:text-foreground" />
                )}
              </Button>
            </form>

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
                {todo.lifeArea?.title && (
                  <>
                    <span>•</span>
                    <span className="truncate max-w-[110px] text-foreground font-medium">
                      {todo.lifeArea.title}
                    </span>
                  </>
                )}
              </div>
            </div>

            <span className="shrink-0 rounded-container bg-card-thick px-2.5 py-0.5 text-xs font-medium">
              {todo.type}
            </span>
          </div>
        </div>
      }
    >
      <Drawer.Title className="title">{todo.title}</Drawer.Title>

      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-container bg-background p-3">
          <div className="flex items-center gap-2 sub-text">
            <TagIcon className="size-4" />
            <span>{t("common.type")}</span>
          </div>
          <p className="mt-2 font-medium">{todo.type}</p>
        </div>

        <div className="rounded-container bg-background p-3">
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

        <div className="rounded-container bg-background p-3">
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

        {todo.lifeArea?.title && (
          <div className="col-span-3 rounded-container bg-background p-3">
            <div className="flex items-center gap-2 sub-text">
              <CompassIcon className="size-4" />
              <span>{t("lifeAreas.title") || "Life Area"}</span>
            </div>
            <p className="mt-2 font-medium">{todo.lifeArea.title}</p>
          </div>
        )}
      </div>

      <form ref={toggleFormRef} action={toggleAction}>
        <Field.Root className="hidden" name="id">
          <Field.Control type="hidden" name="id" value={todo.id} />
        </Field.Root>
        <label className="rounded-container bg-background p-3 flex items-center justify-between cursor-pointer select-none">
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
            disabled={isToggling}
            onCheckedChange={() => toggleFormRef.current?.requestSubmit()}
            aria-label={
              todo.isDone ? t("todos.markAsIncomplete") : t("todos.markAsCompleted")
            }
          />
        </label>
      </form>

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

export default TodoCard;
