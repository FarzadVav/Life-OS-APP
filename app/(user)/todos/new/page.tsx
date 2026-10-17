"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useLocale } from "@/features/general/components/module/LocaleProvider/LocaleProvider";

import { Field, Form, Select } from "@base-ui/react";
import {
  CheckIcon,
  ChevronDownIcon,
  EditIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";

import { todos, TODO_TYPES } from "@/features/todos/constants";
import { TodoType, TodoAction } from "@/features/todos/types";
import TopBar from "@/features/general/components/static/TopBar/TopBar";
import { Button } from "@/features/general/components/ui/Button/Button";
import PageActionBtn from "@/features/general/components/module/PageActionBtn/PageActionBtn";
import PageWrapper from "@/features/general/components/static/PageWrapper/PageWrapper";
import Dialog from "@/features/general/components/ui/Dialog/Dialog";
import TimePickerDialog from "@/features/general/components/ui/TimePickerDialog";
import DayPickerDialog from "@/features/general/components/ui/DayPickerDialog";
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

      <Select.Root
        name="type"
        items={items}
        value={value}
        onValueChange={(nextValue) => {
          if (nextValue) {
            onChange(nextValue as TodoType);
          }
        }}
        required
      >
        <Select.Trigger
          render={
            <Button
              type="button"
              variant="outline"
              className="w-full justify-between rounded-component"
            >
              <Select.Value placeholder={t("todos.selectType")} />

              <Select.Icon>
                <ChevronDownIcon />
              </Select.Icon>
            </Button>
          }
        />

        <Select.Portal>
          <Select.Positioner className="z-small-overlay">
            <Select.Popup className="min-w-(--anchor-width) overflow-hidden rounded-component bg-card-thick p-1">
              <Select.List className="p-px">
                {items.map((item) => (
                  <Select.Item
                    key={item.value}
                    value={item.value}
                    nativeButton
                    render={
                      <Button
                        type="button"
                        variant="ghost"
                        className="w-full justify-between rounded-component"
                      >
                        <Select.ItemText>{item.label}</Select.ItemText>

                        <Select.ItemIndicator>
                          <CheckIcon />
                        </Select.ItemIndicator>
                      </Button>
                    }
                  />
                ))}
              </Select.List>
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>

      <Field.Error className="sub-text mt-0.5 text-foreground" />
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
    { value: "1", label: "1 · " + (t("missions.level1") || "Easy") },
    { value: "2", label: "2 · " + (t("missions.level2") || "Moderate") },
    { value: "3", label: "3 · " + (t("missions.level3") || "Challenging") },
    { value: "4", label: "4 · " + (t("missions.level4") || "Hard") },
    { value: "5", label: "5 · " + (t("missions.level5") || "Epic") },
  ];

  return (
    <Field.Root name="difficulty">
      <Field.Label className="mb-1 font-bold">
        {t("missions.difficulty") || "Difficulty"}
      </Field.Label>

      <Select.Root
        name="difficulty"
        items={items}
        value={String(value)}
        onValueChange={(nextValue) => {
          if (nextValue) {
            onChange(Number(nextValue));
          }
        }}
        required
      >
        <Select.Trigger
          render={
            <Button
              type="button"
              variant="outline"
              className="w-full justify-between rounded-component"
            >
              <Select.Value placeholder={t("missions.selectDifficulty") || "Select difficulty"} />

              <Select.Icon>
                <ChevronDownIcon />
              </Select.Icon>
            </Button>
          }
        />

        <Select.Portal>
          <Select.Positioner className="z-small-overlay">
            <Select.Popup className="min-w-(--anchor-width) overflow-hidden rounded-component bg-card-thick p-1">
              <Select.List className="p-px">
                {items.map((item) => (
                  <Select.Item
                    key={item.value}
                    value={item.value}
                    nativeButton
                    render={
                      <Button
                        type="button"
                        variant="ghost"
                        className="w-full justify-between rounded-component"
                      >
                        <Select.ItemText>{item.label}</Select.ItemText>

                        <Select.ItemIndicator>
                          <CheckIcon />
                        </Select.ItemIndicator>
                      </Button>
                    }
                  />
                ))}
              </Select.List>
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>

      <Field.Error className="sub-text mt-0.5 text-foreground" />
    </Field.Root>
  );
}

function NewTodoPage() {
  const { t, formatDate } = useLocale();
  const searchParams = useSearchParams();
  const editId = searchParams.get("editId");
  const typeParam = searchParams.get("type") || searchParams.get("category");
  const isEditMode = Boolean(editId);

  const resolveDefaultType = (param: string | null): TodoType => {
    const lower = param?.toLowerCase();
    if (lower === "upcoming") return "Upcoming";
    if (lower === "mission" || lower === "missions") return "Mission";
    return "Daily";
  };

  const [title, setTitle] = useState("");
  const [type, setType] = useState<TodoType>(() => resolveDefaultType(typeParam));
  const [dailyTime, setDailyTime] = useState<string>(getDefaultTime());
  const [targetDate, setTargetDate] = useState<Date | null>(new Date());
  const [difficulty, setDifficulty] = useState<number>(3);
  const [actions, setActions] = useState<TodoAction[]>([]);
  const [isDone, setIsDone] = useState(false);

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
        setIsDone(false);
      });
      return;
    }

    const todo = todos.find((item) => String(item.id) === editId);
    if (!todo) {
      return;
    }

    queueMicrotask(() => {
      setTitle(todo.title);
      setType(todo.type);
      setIsDone(todo.isDone);
      setDifficulty(todo.difficulty || 3);
      setActions(todo.actions || []);

      if (todo.type === "Daily") {
        setDailyTime(todo.deadline.includes(":") ? todo.deadline : "12:00");
      } else {
        setTargetDate(parseDate(todo.deadline) ?? new Date());
      }
    });
  }, [editId, typeParam]);

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
        <TopBar.HelpBtn position="right" />
      </TopBar>

      <Form
        className="w-full space-y-6"
        aria-label={isEditMode ? t("todos.editAria") : t("todos.createAria")}
        action={async () => {
          const deadline =
            type === "Daily" ? dailyTime : serializeDate(targetDate);

          const payload = {
            id: editId ? Number(editId) : undefined,
            title,
            type,
            deadline,
            difficulty: type === "Mission" ? difficulty : undefined,
            actions: type === "Mission" ? actions : undefined,
            isDone,
          };

          console.log(isEditMode ? "Update todo:" : "Create todo:", payload);

          await new Promise((resolve) => setTimeout(resolve, 500));
        }}
      >
        <Field.Root name="title">
          <Field.Label className="block font-bold">{t("common.title")}</Field.Label>

          <Field.Control
            required
            minLength={3}
            value={title}
            className="input"
            placeholder={
              type === "Mission"
                ? t("missions.titlePlaceholder") || "What is your main mission objective?"
                : t("todos.titlePlaceholder")
            }
            onChange={(event) => setTitle(event.target.value)}
          />

          <Field.Error className="sub-text mt-0.5 text-foreground" />
        </Field.Root>

        <TypeSelect value={type} onChange={setType} />

        <Field.Root name="deadline">
          <Field.Label className="mb-1 font-bold">{t("common.deadline")}</Field.Label>

          {type === "Daily" ? (
            <TimePickerDialog value={dailyTime} onChange={setDailyTime} />
          ) : (
            <DayPickerDialog value={targetDate} onChange={setTargetDate} />
          )}

          <input
            type="hidden"
            name="deadline"
            value={type === "Daily" ? dailyTime : serializeDate(targetDate)}
          />
        </Field.Root>

        {type === "Mission" && (
          <>
            <DifficultySelect
              value={difficulty}
              onChange={setDifficulty}
            />

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
                        <p className="truncate text-sm font-medium">{act.title}</p>
                        <p className="sub-text text-xs">{formatDate(act.deadline)}</p>
                      </div>

                      <div className="flex shrink-0 items-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          square
                          className="size-8"
                          onClick={() => openEditAction(act)}
                        >
                          <EditIcon className="size-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          square
                          className="size-8"
                          onClick={() => deleteAction(act.id)}
                        >
                          <Trash2Icon className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Field.Root>

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
          </>
        )}

        <PageActionBtn submit />
      </Form>
    </PageWrapper>
  );
}

export default NewTodoPage;
