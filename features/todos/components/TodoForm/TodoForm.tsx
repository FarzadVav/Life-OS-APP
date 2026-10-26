"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { useLocale } from "@/features/general/components/module/LocaleProvider/LocaleProvider";

import { Form } from "@base-ui/react";
import Field from "@/features/general/components/ui/Field";
import {
  EditIcon,
  LoaderIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";

import { TODO_TYPES } from "@/features/todos/constants";
import {
  TodoType,
  TodoAction,
  TodoDiscipline,
  CreateTodoSchema,
  UpdateTodoSchema,
} from "@/features/todos/types";
import { useTodo } from "@/features/todos/hooks";
import { useLifeAreas } from "@/features/life-areas/hooks";
import {
  createTodoMutation,
  deleteTodoMutation,
  updateTodoMutation,
} from "@/features/todos/mutations";
import TopBar from "@/features/general/components/static/TopBar/TopBar";
import HelpDialog from "@/features/general/components/module/HelpDialog/HelpDialog";
import { Button } from "@/features/general/components/ui/Button/Button";
import PageActionBtn from "@/features/general/components/module/PageActionBtn/PageActionBtn";
import PageWrapper from "@/features/general/components/static/PageWrapper/PageWrapper";
import Dialog from "@/features/general/components/ui/Dialog/Dialog";
import Skeleton from "@/features/general/components/ui/Skeleton";
import TimePickerDialog from "@/features/general/components/ui/TimePickerDialog";
import DayPickerDialog from "@/features/general/components/ui/DayPickerDialog";
import SelectDialog from "@/features/general/components/ui/SelectDialog";
import { RichTextarea } from "@/features/general/components/ui/RichTextEditor";
import {
  getDefaultTime,
  parseDate,
  serializeDate,
} from "@/features/general/lib/utils";

function TypeSelect({
  value,
  onChange,
}: {
  value: TodoType;
  onChange: (value: TodoType) => void;
}) {
  const { t } = useLocale();

  const items = TODO_TYPES.map((item) => ({
    value: item.value,
    label:
      item.value === "Daily"
        ? t("todos.today")
        : item.value === "Upcoming"
          ? t("todos.upcoming")
          : t("missions.title"),
  }));

  return (
    <Field.Root name="type">
      <Field.Label className="mb-1 font-bold">{t("common.type")}</Field.Label>

      <SelectDialog
        name="typeSelect"
        items={items}
        value={value}
        onChange={(next) => onChange(next as TodoType)}
        title={t("common.type")}
        placeholder={t("todos.selectType")}
        required
      />

      <Field.Error className="sub-text mt-0.5 text-foreground text-xs" />
    </Field.Root>
  );
}

function DifficultySelect({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  const { t } = useLocale();
  const items = [
    { value: 1, label: "1 · " + t("missions.level1") },
    { value: 2, label: "2 · " + t("missions.level2") },
    { value: 3, label: "3 · " + t("missions.level3") },
    { value: 4, label: "4 · " + t("missions.level4") },
    { value: 5, label: "5 · " + t("missions.level5") },
  ];

  return (
    <Field.Root name="difficulty">
      <Field.Label className="mb-1 font-bold">
        {t("missions.difficulty")}
      </Field.Label>

      <SelectDialog
        name="difficultySelect"
        items={items}
        value={value}
        onChange={(next) => onChange(Number(next))}
        title={t("missions.difficulty")}
        placeholder={t("missions.selectDifficulty")}
        required
      />

      <Field.Error className="sub-text mt-0.5 text-foreground text-xs" />
    </Field.Root>
  );
}

function LifeAreaSelect({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (value: number | null) => void;
}) {
  const { t } = useLocale();
  const { lifeAreas = [] } = useLifeAreas();

  const items = [
    { value: "none", label: t("lifeAreas.none") },
    ...lifeAreas.map((la) => ({
      value: String(la.id),
      label: la.title,
    })),
  ];

  return (
    <Field.Root name="lifeAreaId">
      <Field.Label className="mb-1 font-bold">
        {t("lifeAreas.title")}
      </Field.Label>

      <SelectDialog
        name="lifeAreaSelect"
        items={items}
        value={value ? String(value) : "none"}
        onChange={(next) =>
          onChange(next === "none" || !next ? null : Number(next))
        }
        title={t("lifeAreas.selectLifeArea")}
        placeholder={t("lifeAreas.selectLifeArea")}
      />

      <Field.Error className="sub-text mt-0.5 text-foreground text-xs" />
    </Field.Root>
  );
}

export function TodoForm() {
  const { t, formatDate } = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("editId");
  const typeParam = searchParams.get("type") || searchParams.get("category");
  const isEditMode = Boolean(editId);

  const { todo, isLoading: isTodoLoading } = useTodo(editId ? Number(editId) : null);

  const resolveDefaultType = (param: string | null): TodoType => {
    const lower = param?.toLowerCase();
    if (lower === "upcoming") return "Upcoming";
    if (lower === "mission" || lower === "missions") return "Mission";
    return "Daily";
  };

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<TodoType>(() =>
    resolveDefaultType(typeParam),
  );
  const [dailyTime, setDailyTime] = useState<string>(getDefaultTime());
  const [targetDate, setTargetDate] = useState<Date | null>(new Date());
  const [difficulty, setDifficulty] = useState<number>(3);
  const [actions, setActions] = useState<TodoAction[]>([]);
  const [disciplines, setDisciplines] = useState<TodoDiscipline[]>([]);
  const [isDone, setIsDone] = useState(false);
  const [lifeAreaId, setLifeAreaId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Dialog state for adding/editing mission action
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionDraft, setActionDraft] = useState<{
    id: number | null;
    title: string;
    deadline: Date | null;
  }>({
    id: null,
    title: "",
    deadline: new Date(),
  });

  const [disciplineDialogOpen, setDisciplineDialogOpen] = useState(false);
  const [disciplineDraft, setDisciplineDraft] = useState<{
    id: number | null;
    title: string;
    lifeAreaId?: number | null;
    history?: { date: string; isDone: boolean }[];
  }>({
    id: null,
    title: "",
    lifeAreaId: null,
    history: [],
  });

  // Native form handling via React 19 useActionState + Base UI Form
  const [state, formAction, pending] = useActionState(
    isEditMode ? updateTodoMutation : createTodoMutation,
    null,
  );

  const [deleteState, removeTodoAction, isDeleting] = useActionState(
    deleteTodoMutation,
    undefined,
  );

  // When mutation succeeds, navigate back to home and refresh
  useEffect(() => {
    if (state?.success) {
      router.push("/todos");
      router.refresh();
    }
  }, [state?.success, router]);

  useEffect(() => {
    if (!deleteState?.success) return;

    router.push("/todos");
    router.refresh();
  }, [deleteState, router]);

  // Load existing todo details if in edit mode
  useEffect(() => {
    if (!editId) {
      const resolved = resolveDefaultType(typeParam);
      queueMicrotask(() => {
        setTitle("");
        setDescription("");
        setType(resolved);
        setDailyTime(getDefaultTime());
        setTargetDate(new Date());
        setDifficulty(3);
        setLifeAreaId(null);
        setActions([]);
        setDisciplines([]);
        setIsDone(false);
      });
      return;
    }

    if (todo) {
      queueMicrotask(() => {
        setTitle(todo.title);
        setDescription(todo.description || "");
        setType(todo.type);
        setIsDone(todo.isDone);
        setDifficulty(todo.difficulty || 3);
        setLifeAreaId(todo.lifeAreaId ?? null);
        setActions(todo.actions || []);
        setDisciplines(todo.disciplines || []);

        if (todo.type === "Daily") {
          setDailyTime(todo.deadline.includes(":") ? todo.deadline : "12:00");
        } else {
          setTargetDate(parseDate(todo.deadline) ?? new Date());
        }
      });
    }
  }, [editId, todo, typeParam]);

  const openNewAction = () => {
    setActionDraft({
      id: null,
      title: "",
      deadline: new Date(),
    });
    setActionDialogOpen(true);
  };

  const openEditAction = (action: TodoAction) => {
    setActionDraft({
      id: action.id,
      title: action.title,
      deadline: parseDate(action.deadline) || new Date(),
    });
    setActionDialogOpen(true);
  };

  const saveAction = () => {
    if (!actionDraft.title.trim()) return;

    if (actionDraft.id !== null) {
      setActions((prev) =>
        prev.map((act) =>
          act.id === actionDraft.id
            ? {
                ...act,
                title: actionDraft.title.trim(),
                deadline: serializeDate(actionDraft.deadline),
              }
            : act,
        ),
      );
    } else {
      setActions((prev) => [
        ...prev,
        {
          id: Date.now() + Math.floor(Math.random() * 1000),
          title: actionDraft.title.trim(),
          deadline: serializeDate(actionDraft.deadline),
          isDone: false,
        },
      ]);
    }
    setActionDialogOpen(false);
  };

  const deleteAction = (actionId: number) => {
    setActions((prev) => prev.filter((a) => a.id !== actionId));
  };

  const openNewDiscipline = () => {
    setDisciplineDraft({
      id: null,
      title: "",
      lifeAreaId: lifeAreaId,
      history: [],
    });
    setDisciplineDialogOpen(true);
  };

  const openEditDiscipline = (discipline: TodoDiscipline) => {
    setDisciplineDraft({
      id: discipline.id,
      title: discipline.title,
      lifeAreaId: discipline.lifeAreaId ?? lifeAreaId,
      history: discipline.history,
    });
    setDisciplineDialogOpen(true);
  };

  const saveDiscipline = () => {
    const nextTitle = disciplineDraft.title.trim();
    if (!nextTitle) return;

    if (disciplineDraft.id !== null) {
      setDisciplines((prev) =>
        prev.map((d) =>
          d.id === disciplineDraft.id
            ? { ...d, title: nextTitle, lifeAreaId: disciplineDraft.lifeAreaId }
            : d,
        ),
      );
    } else {
      setDisciplines((prev) => [
        ...prev,
        {
          id: Date.now() + Math.floor(Math.random() * 1000),
          title: nextTitle,
          lifeAreaId: disciplineDraft.lifeAreaId,
          history: [],
        },
      ]);
    }
    setDisciplineDialogOpen(false);
  };

  const deleteDiscipline = (disciplineId: number) => {
    setDisciplines((prev) => prev.filter((d) => d.id !== disciplineId));
  };

  return (
    <PageWrapper>
      <TopBar>
        <TopBar.Title asTitle>
          {isEditMode
            ? type === "Mission"
              ? t("missions.edit")
              : t("todos.edit")
            : type === "Mission"
              ? t("missions.new")
              : t("todos.new")}
        </TopBar.Title>
        <TopBar.Btn backIcon href="/todos" position="left" />

        {isEditMode ? (
          <TopBar.Btn
            position="right"
            onClick={() => setDeleteDialogOpen(true)}
            aria-label={t("common.delete")}
            className="text-foreground/70 hover:text-foreground"
          >
            <Trash2Icon className="size-5" />
          </TopBar.Btn>
        ) : (
          <HelpDialog position="right" />
        )}
      </TopBar>

      {isEditMode && isTodoLoading && !todo ? (
        <div className="w-full space-y-4">
          <Skeleton className="h-12" />
          <Skeleton className="h-32" />
          <Skeleton className="h-12" />
        </div>
      ) : (
        <Form
          id="todo-form"
          className="w-full space-y-6"
          aria-label={isEditMode ? t("todos.edit") : t("todos.new")}
          action={formAction}
          errors={state?.errors}
        >
          {/* Hidden fields to pass composite state to Server Action */}
          {isEditMode && <Field type="hidden" name="id" value={editId ?? ""} />}
          <Field type="hidden" name="type" value={type} />
          <Field type="hidden" name="description" value={description} />
          <Field
            type="hidden"
            name="deadline"
            value={type === "Daily" ? dailyTime : serializeDate(targetDate)}
          />
          <Field type="hidden" name="isDone" value={String(isDone)} />
          {type === "Mission" && (
            <>
              <Field type="hidden" name="difficulty" value={difficulty} />
              <Field
                type="hidden"
                name="actions"
                value={JSON.stringify(actions)}
              />
              <Field
                type="hidden"
                name="disciplines"
                value={JSON.stringify(disciplines)}
              />
            </>
          )}

          <Field
            name="title"
            label={t("common.title")}
            required
            minLength={3}
            value={title}
            disabled={pending}
            placeholder={
              type === "Mission"
                ? t("missions.titlePlaceholder")
                : t("todos.titlePlaceholder")
            }
            onChange={(event) => setTitle(event.target.value)}
            schema={isEditMode ? UpdateTodoSchema : CreateTodoSchema}
          />

          <Field.Root
            name="description"
            schema={isEditMode ? UpdateTodoSchema : CreateTodoSchema}
          >
            <Field.Label className="mb-1 font-bold">
              {t("common.description")}
            </Field.Label>

            <RichTextarea
              name="description"
              value={description}
              onChange={setDescription}
              placeholder={t("todos.descPlaceholder")}
              title={t("common.description")}
            />

            <Field.Error className="sub-text mt-0.5 text-foreground text-xs" />
          </Field.Root>

          <TypeSelect value={type} onChange={setType} />

          <LifeAreaSelect value={lifeAreaId} onChange={setLifeAreaId} />

          <Field.Root name="deadline">
            <Field.Label className="mb-1">
              {t("common.deadline")}
            </Field.Label>

            {type === "Daily" ? (
              <TimePickerDialog value={dailyTime} onChange={setDailyTime} />
            ) : (
              <DayPickerDialog value={targetDate} onChange={setTargetDate} />
            )}

            <Field.Error />
          </Field.Root>

          {type === "Mission" && (
            <>
              <DifficultySelect value={difficulty} onChange={setDifficulty} />

              {/* Actions Section */}
              <Field.Root name="actions">
                <div className="flex items-center justify-between mb-2">
                  <Field.Label className="font-bold">
                    {t("missions.actionsLabel")}
                  </Field.Label>
                  <span className="sub-text text-xs">
                    {actions.length} {t("missions.actionsLabel")}
                  </span>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={openNewAction}
                  disabled={pending}
                  className="w-full justify-center gap-1.5 rounded-component"
                >
                  <PlusIcon className="size-4" />
                  <span>{t("missions.newAction")}</span>
                </Button>

                {actions.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {actions.map((act) => (
                      <div
                        key={act.id}
                        className="flex items-center justify-between gap-3 rounded-component bg-card p-3"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {act.title}
                          </p>
                          <p className="sub-text text-xs">
                            {formatDate(act.deadline)}
                          </p>
                        </div>

                        <div className="flex shrink-0 items-center gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            square
                            className="size-8"
                            onClick={() => openEditAction(act)}
                            disabled={pending}
                          >
                            <EditIcon className="size-3.5" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            square
                            className="size-8"
                            onClick={() => deleteAction(act.id)}
                            disabled={pending}
                          >
                            <Trash2Icon className="size-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Field.Root>

              {/* Disciplines Section */}
              <Field.Root name="disciplines">
                <div className="flex items-center justify-between mb-2">
                  <Field.Label className="font-bold">
                    {t("missions.disciplines")}
                  </Field.Label>
                  <span className="sub-text text-xs">
                    {disciplines.length} {t("missions.disciplines")}
                  </span>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={openNewDiscipline}
                  disabled={pending}
                  className="w-full justify-center gap-1.5 rounded-component"
                >
                  <PlusIcon className="size-4" />
                  <span>{t("missions.newDiscipline")}</span>
                </Button>

                {disciplines.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {disciplines.map((d) => (
                      <div
                        key={d.id}
                        className="flex items-center justify-between gap-3 rounded-component bg-card p-3"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{d.title}</p>
                          {d.lifeArea?.title && (
                            <p className="sub-text text-xs flex items-center gap-1 mt-0.5">
                              <span>{d.lifeArea.title}</span>
                            </p>
                          )}
                        </div>

                        <div className="flex shrink-0 items-center gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            square
                            className="size-8"
                            onClick={() => openEditDiscipline(d)}
                            disabled={pending}
                          >
                            <EditIcon className="size-3.5" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            square
                            className="size-8"
                            onClick={() => deleteDiscipline(d.id)}
                            disabled={pending}
                          >
                            <Trash2Icon className="size-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Field.Root>

              {/* Action Dialog */}
              <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
                <div className="p-1 space-y-4">
                  <div>
                    <Dialog.Title className="font-bold">
                      {actionDraft.id !== null
                        ? t("missions.editAction")
                        : t("missions.newAction")}
                    </Dialog.Title>
                    <Dialog.Description className="sub-text text-xs mt-1">
                      {t("missions.createActionDesc")}
                    </Dialog.Description>
                  </div>

                  <Field
                    name="actionTitle"
                    label={t("common.title")}
                    labelSize="sm"
                    required
                    minLength={2}
                    value={actionDraft.title}
                    placeholder={t("missions.actionTitlePlaceholder")}
                    onChange={(e) =>
                      setActionDraft((d) => ({ ...d, title: e.target.value }))
                    }
                  />

                  <Field.Root name="actionDeadline">
                    <Field.Label size="sm">
                      {t("common.deadline")}
                    </Field.Label>
                    <DayPickerDialog
                      value={actionDraft.deadline}
                      onChange={(date) =>
                        setActionDraft((d) => ({ ...d, deadline: date }))
                      }
                    />
                  </Field.Root>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <Dialog.Close
                      render={
                        <Button type="button" variant="ghost">
                          {t("common.cancel")}
                        </Button>
                      }
                    />
                    <Button
                      type="button"
                      variant="primary"
                      onClick={saveAction}
                      disabled={actionDraft.title.trim().length < 2}
                    >
                      {actionDraft.id !== null
                        ? t("common.save")
                        : t("common.add")}
                    </Button>
                  </div>
                </div>
              </Dialog>

              {/* Discipline Dialog */}
              <Dialog
                open={disciplineDialogOpen}
                onOpenChange={setDisciplineDialogOpen}
              >
                <div className="p-1 space-y-4">
                  <div>
                    <Dialog.Title className="font-bold">
                      {disciplineDraft.id !== null
                        ? t("missions.editDiscipline")
                        : t("missions.newDiscipline")}
                    </Dialog.Title>
                    <Dialog.Description className="sub-text text-xs mt-1">
                      {disciplineDraft.id !== null
                        ? t("missions.editDisciplineDesc")
                        : t("missions.createDisciplineDesc")}
                    </Dialog.Description>
                  </div>

                  <Field
                    name="disciplineTitle"
                    label={t("common.title")}
                    labelSize="sm"
                    required
                    minLength={3}
                    value={disciplineDraft.title}
                    placeholder={t("missions.disciplineTitlePlaceholder")}
                    onChange={(e) =>
                      setDisciplineDraft((d) => ({
                        ...d,
                        title: e.target.value,
                      }))
                    }
                  />

                  <LifeAreaSelect
                    value={disciplineDraft.lifeAreaId ?? null}
                    onChange={(val) =>
                      setDisciplineDraft((d) => ({ ...d, lifeAreaId: val }))
                    }
                  />

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <Dialog.Close
                      render={
                        <Button type="button" variant="ghost">
                          {t("common.cancel")}
                        </Button>
                      }
                    />
                    <Button
                      type="button"
                      variant="primary"
                      onClick={saveDiscipline}
                      disabled={disciplineDraft.title.trim().length < 3}
                    >
                      {disciplineDraft.id !== null
                        ? t("common.save")
                        : t("common.add")}
                    </Button>
                  </div>
                </div>
              </Dialog>
            </>
          )}

          <Field.FormError
            errors={state?.errors}
            knownFields={["title", "description", "type", "deadline", "lifeAreaId", "difficulty", "actions", "disciplines"]}
          />

          <PageActionBtn submit disabled={pending} form="todo-form" />
        </Form>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <div className="p-1 space-y-4">
          <div>
            <Dialog.Title className="font-bold">
              {t("common.delete")}
            </Dialog.Title>
            <Dialog.Description className="sub-text text-xs mt-1">
              {t("common.deleteConfirm")}
            </Dialog.Description>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Dialog.Close
              render={
                <Button type="button" variant="ghost" disabled={isDeleting}>
                  {t("common.cancel")}
                </Button>
              }
            />
            <form
              action={removeTodoAction}
              onSubmit={() => setDeleteDialogOpen(false)}>
              <Field type="hidden" name="id" value={editId ?? ""} />
              <Button
                type="submit"
                variant="primary"
                disabled={isDeleting || !isEditMode}
                className="bg-red-600 text-white hover:bg-red-700">
                {isDeleting ? t("common.loading") : t("common.delete")}
              </Button>
            </form>
          </div>
        </div>
      </Dialog>
    </PageWrapper>
  );
}

export default TodoForm;
