"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { useLocale } from "@/features/general/components/module/LocaleProvider/LocaleProvider";

import { Field, Form } from "@base-ui/react";
import {
  EditIcon,
  LoaderIcon,
  PlusIcon,
  Repeat2Icon,
  Trash2Icon,
} from "lucide-react";

import { TODO_TYPES } from "@/features/todos/constants";
import { TodoType, TodoAction, TodoDiscipline } from "@/features/todos/types";
import { useTodo } from "@/features/todos/hooks";
import { createTodoMutation, updateTodoMutation, deleteTodoMutation } from "@/features/todos/mutations";
import TopBar from "@/features/general/components/static/TopBar/TopBar";
import { Button } from "@/features/general/components/ui/Button/Button";
import PageActionBtn from "@/features/general/components/module/PageActionBtn/PageActionBtn";
import PageWrapper from "@/features/general/components/static/PageWrapper/PageWrapper";
import Dialog from "@/features/general/components/ui/Dialog/Dialog";
import TimePickerDialog from "@/features/general/components/ui/TimePickerDialog";
import DayPickerDialog from "@/features/general/components/ui/DayPickerDialog";
import RepeatIntervalInput from "@/features/general/components/ui/RepeatIntervalInput";
import SelectDialog from "@/features/general/components/ui/SelectDialog";
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
        ? t("todos.today") || "Daily"
        : item.value === "Upcoming"
          ? t("todos.upcoming") || "Upcoming"
          : t("todos.missions") || "Mission",
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
    { value: 1, label: "1 · " + (t("missions.level1") || "Easy") },
    { value: 2, label: "2 · " + (t("missions.level2") || "Moderate") },
    { value: 3, label: "3 · " + (t("missions.level3") || "Challenging") },
    { value: 4, label: "4 · " + (t("missions.level4") || "Hard") },
    { value: 5, label: "5 · " + (t("missions.level5") || "Epic") },
  ];

  return (
    <Field.Root name="difficulty">
      <Field.Label className="mb-1 font-bold">
        {t("missions.difficulty") || "Time and Energy Cost"}
      </Field.Label>

      <SelectDialog
        name="difficultySelect"
        items={items}
        value={value}
        onChange={(next) => onChange(Number(next))}
        title={t("missions.difficulty") || "Time and Energy Cost"}
        placeholder={t("missions.selectDifficulty") || "Select Time and Energy Cost"}
        required
      />

      <Field.Error className="sub-text mt-0.5 text-foreground text-xs" />
    </Field.Root>
  );
}

function NewTodoPage() {
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
  const [type, setType] = useState<TodoType>(() =>
    resolveDefaultType(typeParam),
  );
  const [dailyTime, setDailyTime] = useState<string>(getDefaultTime());
  const [targetDate, setTargetDate] = useState<Date | null>(new Date());
  const [difficulty, setDifficulty] = useState<number>(3);
  const [actions, setActions] = useState<TodoAction[]>([]);
  const [disciplines, setDisciplines] = useState<TodoDiscipline[]>([]);
  const [isDone, setIsDone] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
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

  // Dialog state for adding/editing mission discipline
  const [disciplineDialogOpen, setDisciplineDialogOpen] = useState(false);
  const [disciplineDraft, setDisciplineDraft] = useState<{
    id: number | null;
    title: string;
    repeatInterval: string;
    history?: { date: string; isDone: boolean }[];
  }>({
    id: null,
    title: "",
    repeatInterval: "Every 1 Day",
    history: [],
  });

  // Native form handling via React 19 useActionState + Base UI Form
  const [state, formAction, pending] = useActionState(
    isEditMode ? updateTodoMutation : createTodoMutation,
    null,
  );

  // When mutation succeeds, navigate back to home and refresh
  useEffect(() => {
    if (state?.success) {
      router.push("/");
      router.refresh();
    }
  }, [state?.success, router]);

  // Load existing todo details if in edit mode
  useEffect(() => {
    if (!editId) {
      const resolved = resolveDefaultType(typeParam);
      queueMicrotask(() => {
        setTitle("");
        setType(resolved);
        setDailyTime(getDefaultTime());
        setTargetDate(new Date());
        setDifficulty(3);
        setActions([]);
        setDisciplines([]);
        setIsDone(false);
      });
      return;
    }

    if (todo) {
      queueMicrotask(() => {
        setTitle(todo.title);
        setType(todo.type);
        setIsDone(todo.isDone);
        setDifficulty(todo.difficulty || 3);
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

  const handleDelete = async () => {
    if (!editId) return;
    setIsDeleting(true);
    try {
      const res = await deleteTodoMutation(Number(editId));
      if (res.success) {
        setDeleteDialogOpen(false);
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setIsDeleting(false);
    }
  };

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
      repeatInterval: "Every 1 Day",
      history: [],
    });
    setDisciplineDialogOpen(true);
  };

  const openEditDiscipline = (discipline: TodoDiscipline) => {
    setDisciplineDraft({
      id: discipline.id,
      title: discipline.title,
      repeatInterval: discipline.repeatInterval || "Every 1 Day",
      history: discipline.history,
    });
    setDisciplineDialogOpen(true);
  };

  const saveDiscipline = () => {
    const nextTitle = disciplineDraft.title.trim();
    const nextInterval = disciplineDraft.repeatInterval.trim() || "Every 1 Day";
    if (!nextTitle) return;

    if (disciplineDraft.id !== null) {
      setDisciplines((prev) =>
        prev.map((d) =>
          d.id === disciplineDraft.id
            ? { ...d, title: nextTitle, repeatInterval: nextInterval }
            : d,
        ),
      );
    } else {
      setDisciplines((prev) => [
        ...prev,
        {
          id: Date.now() + Math.floor(Math.random() * 1000),
          title: nextTitle,
          repeatInterval: nextInterval,
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
              ? t("missions.edit") || "Edit Mission"
              : t("todos.edit")
            : type === "Mission"
              ? t("todos.newMission") || "New Mission"
              : t("todos.new")}
        </TopBar.Title>
        <TopBar.Btn backIcon href="/" position="left" />

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
          <TopBar.HelpBtn position="right" />
        )}
      </TopBar>

      {isEditMode && isTodoLoading && !todo ? (
        <div className="flex w-full items-center justify-center p-12 text-foreground/40 gap-2">
          <LoaderIcon className="size-5 animate-spin" />
          <span className="text-xs sub-text">{t("common.loading")}</span>
        </div>
      ) : (
        <Form
          className="w-full space-y-6"
          aria-label={isEditMode ? t("todos.editAria") : t("todos.createAria")}
          action={formAction}
          errors={state?.errors}
        >
          {state?.errors?.general && (
            <div
              role="alert"
              className="p-3 text-xs rounded-component bg-foreground/5 border border-foreground/15 text-foreground leading-relaxed"
            >
              {state.errors.general.join(", ")}
            </div>
          )}

          {/* Hidden inputs to pass composite state to Server Action */}
          {isEditMode && <input type="hidden" name="id" value={editId ?? ""} />}
          <input type="hidden" name="type" value={type} />
          <input
            type="hidden"
            name="deadline"
            value={type === "Daily" ? dailyTime : serializeDate(targetDate)}
          />
          <input type="hidden" name="isDone" value={String(isDone)} />
          {type === "Mission" && (
            <>
              <input type="hidden" name="difficulty" value={difficulty} />
              <input
                type="hidden"
                name="actions"
                value={JSON.stringify(actions)}
              />
              <input
                type="hidden"
                name="disciplines"
                value={JSON.stringify(disciplines)}
              />
            </>
          )}

          <Field.Root name="title">
            <Field.Label className="block font-bold">
              {t("common.title")}
            </Field.Label>

            <Field.Control
              required
              minLength={3}
              name="title"
              value={title}
              disabled={pending}
              className="input"
              placeholder={
                type === "Mission"
                  ? t("missions.titlePlaceholder") ||
                    "What is your main mission objective?"
                  : t("todos.titlePlaceholder")
              }
              onChange={(event) => setTitle(event.target.value)}
            />

            <Field.Error className="sub-text mt-0.5 text-foreground text-xs" />
          </Field.Root>

          <TypeSelect value={type} onChange={setType} />

          <Field.Root name="deadline">
            <Field.Label className="mb-1 font-bold">
              {t("common.deadline")}
            </Field.Label>

            {type === "Daily" ? (
              <TimePickerDialog value={dailyTime} onChange={setDailyTime} />
            ) : (
              <DayPickerDialog value={targetDate} onChange={setTargetDate} />
            )}

            <Field.Error className="sub-text mt-0.5 text-foreground text-xs" />
          </Field.Root>

          {type === "Mission" && (
            <>
              <DifficultySelect value={difficulty} onChange={setDifficulty} />

              {/* Actions Section */}
              <Field.Root name="actions">
                <div className="flex items-center justify-between mb-2">
                  <Field.Label className="font-bold">
                    {t("missions.actionsLabel") || "Actions"}
                  </Field.Label>
                  <span className="sub-text text-xs">
                    {actions.length} {t("missions.actionsLabel") || "actions"}
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
                  <span>{t("missions.newAction") || "Add Action"}</span>
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
                    {t("missions.disciplines") || "Disciplines"}
                  </Field.Label>
                  <span className="sub-text text-xs">
                    {disciplines.length}{" "}
                    {t("missions.disciplines") || "disciplines"}
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
                  <span>{t("missions.newDiscipline") || "Add Discipline"}</span>
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
                          <p className="sub-text text-xs flex items-center gap-1 mt-0.5">
                            <Repeat2Icon className="size-3" />
                            <span>{d.repeatInterval}</span>
                          </p>
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
                        ? t("missions.editAction") || "Edit Action"
                        : t("missions.newAction") || "Add Action"}
                    </Dialog.Title>
                    <Dialog.Description className="sub-text text-xs mt-1">
                      {t("missions.createActionDesc") ||
                        "Define a concrete, actionable milestone."}
                    </Dialog.Description>
                  </div>

                  <Field.Root name="actionTitle">
                    <Field.Label className="mb-1 font-bold text-xs">
                      {t("common.title")}
                    </Field.Label>
                    <Field.Control
                      required
                      minLength={2}
                      className="input"
                      value={actionDraft.title}
                      placeholder={
                        t("missions.actionTitlePlaceholder") ||
                        "e.g. Complete architecture design"
                      }
                      onChange={(e) =>
                        setActionDraft((d) => ({ ...d, title: e.target.value }))
                      }
                    />
                  </Field.Root>

                  <Field.Root name="actionDeadline">
                    <Field.Label className="mb-1 font-bold text-xs">
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
                        ? t("missions.editDiscipline") || "Edit Discipline"
                        : t("missions.newDiscipline") || "New Discipline"}
                    </Dialog.Title>
                    <Dialog.Description className="sub-text text-xs mt-1">
                      {disciplineDraft.id !== null
                        ? t("missions.editDisciplineDesc") ||
                          "Edit the discipline title and interval."
                        : t("missions.createDisciplineDesc") ||
                          "Define a repeated behavior supporting this mission."}
                    </Dialog.Description>
                  </div>

                  <Field.Root name="disciplineTitle">
                    <Field.Label className="mb-1 font-bold text-xs">
                      {t("common.title")}
                    </Field.Label>
                    <Field.Control
                      required
                      minLength={3}
                      className="input"
                      value={disciplineDraft.title}
                      placeholder={
                        t("missions.disciplineTitlePlaceholder") ||
                        "e.g. Work on core product daily"
                      }
                      onChange={(e) =>
                        setDisciplineDraft((d) => ({
                          ...d,
                          title: e.target.value,
                        }))
                      }
                    />
                  </Field.Root>

                  <Field.Root name="disciplineRepeatInterval">
                    <Field.Label className="mb-1 font-bold text-xs">
                      Repeat Interval
                    </Field.Label>
                    <RepeatIntervalInput
                      value={disciplineDraft.repeatInterval}
                      onChange={(val) =>
                        setDisciplineDraft((d) => ({
                          ...d,
                          repeatInterval: val,
                        }))
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

          <PageActionBtn submit disabled={pending} />
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
              {t("common.confirm") || "Are you sure you want to delete this item?"}
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
            <Button
              type="button"
              variant="primary"
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {isDeleting ? t("common.loading") : t("common.delete")}
            </Button>
          </div>
        </div>
      </Dialog>
    </PageWrapper>
  );
}

export default NewTodoPage;
