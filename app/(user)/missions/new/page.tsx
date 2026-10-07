"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import DayPickerDialog from "@/features/general/components/ui/DayPickerDialog";
import { useLocale } from "@/features/general/components/module/LocaleProvider/LocaleProvider";
import { Field, Form, Select } from "@base-ui/react";
import { CheckIcon, ChevronDownIcon, Trash2Icon, EditIcon } from "lucide-react";

import { missions } from "@/features/missions/constants";
import Dialog from "@/features/general/components/ui/Dialog/Dialog";
import TopBar from "@/features/general/components/static/TopBar/TopBar";
import { Button } from "@/features/general/components/ui/Button/Button";
import PageActionBtn from "@/features/general/components/module/PageActionBtn/PageActionBtn";
import PageWrapper from "@/features/general/components/static/PageWrapper/PageWrapper";
import type {
  MissionAction,
  MissionDiscipline,
} from "@/features/missions/types";
import { parseDate, serializeDate } from "@/features/general/lib/utils";
import RepeatIntervalInput from "@/features/general/components/ui/RepeatIntervalInput";

function createId(): number {
  return Date.now() + Math.floor(Math.random() * 1000);
}

type ActionState = {
  id: number;
  title: string;
  deadline: Date | null;
  isDone: boolean;
};

type ActionDraft = {
  id: number | null;
  title: string;
  deadline: Date | null;
};

type DisciplineDraft = {
  id: number | null;
  title: string;
  repeatInterval: string;
  history?: { date: string; isDone: boolean }[];
};


function DifficultySelect({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (value: number | null) => void;
}) {
  const { t } = useLocale();
  const items = ["1", "2", "3", "4", "5"].map((value) => ({
    value,
    label: `${value} · ${t(`missions.level${value}`)}`,
  }));

  return (
    <Field.Root>
      <Field.Label className="mb-1 font-bold">{t("missions.difficulty")}</Field.Label>

      <Select.Root
        name="difficulty"
        items={items}
        value={value === null ? null : String(value)}
        onValueChange={(nextValue) => {
          onChange(nextValue === null ? null : Number(nextValue));
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
              <Select.Value placeholder={t("missions.selectDifficulty")} />

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

function NewMissionPage() {
  const { formatDate, t } = useLocale();
  const searchParams = useSearchParams();

  const editId = searchParams.get("editId");
  const isEditMode = Boolean(editId);

  const [title, setTitle] = useState("");
  const [missionDeadline, setMissionDeadline] = useState<Date | null>(null);
  const [difficulty, setDifficulty] = useState<number | null>(null);

  const [actions, setActions] = useState<ActionState[]>([]);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionDeleteDialogOpen, setActionDeleteDialogOpen] = useState(false);
  const [actionToDelete, setActionToDelete] = useState<ActionState | null>(
    null,
  );

  const [actionDraft, setActionDraft] = useState<ActionDraft>({
    id: null,
    title: "",
    deadline: null,
  });

  const [disciplines, setDisciplines] = useState<MissionDiscipline[]>([]);
  const [disciplineDialogOpen, setDisciplineDialogOpen] = useState(false);
  const [disciplineDeleteDialogOpen, setDisciplineDeleteDialogOpen] =
    useState(false);
  const [disciplineToDelete, setDisciplineToDelete] =
    useState<MissionDiscipline | null>(null);

  const [disciplineDraft, setDisciplineDraft] = useState<DisciplineDraft>({
    id: null,
    title: "",
    repeatInterval: "Every 1 Day",
  });

  useEffect(() => {
    if (!editId) {
      queueMicrotask(() => {
        setTitle("");
        setMissionDeadline(null);
        setDifficulty(null);
        setActions([]);
        setDisciplines([]);
      });

      return;
    }

    const mission = missions.find((item) => String(item.id) === editId);

    if (!mission) {
      return;
    }

    queueMicrotask(() => {
      setTitle(mission.title);
      setMissionDeadline(parseDate(mission.deadline));
      setDifficulty(mission.difficulty);

      setActions(
        mission.actions.map((action) => ({
          id: action.id,
          title: action.title,
          deadline: parseDate(action.deadline),
          isDone: action.isDone,
        })),
      );

      setDisciplines(
        mission.disciplines.map((discipline) => ({
          id: discipline.id,
          title: discipline.title,
          repeatInterval: discipline.repeatInterval,
          history: discipline.history || [],
        })),
      );
    });
  }, [editId]);

  function openNewAction() {
    setActionDraft({
      id: null,
      title: "",
      deadline: null,
    });

    setActionDeleteDialogOpen(false);
    setActionToDelete(null);
    setActionDialogOpen(true);
  }

  function openEditAction(action: ActionState) {
    setActionDraft({
      id: action.id,
      title: action.title,
      deadline: action.deadline,
    });

    setActionDeleteDialogOpen(false);
    setActionToDelete(null);
    setActionDialogOpen(true);
  }

  function openDeleteAction(action: ActionState) {
    setActionToDelete(action);
    setActionDeleteDialogOpen(true);
  }

  function closeActionDialog() {
    setActionDialogOpen(false);
    setActionDeleteDialogOpen(false);
    setActionToDelete(null);
  }

  function saveAction() {
    const nextTitle = actionDraft.title.trim();
    const nextDeadline = actionDraft.deadline;
    const actionId = actionDraft.id;

    if (!nextTitle || !nextDeadline) {
      return;
    }

    if (actionId !== null) {
      setActions((current) =>
        current.map((action) =>
          action.id === actionId
            ? {
              ...action,
              title: nextTitle,
              deadline: nextDeadline,
            }
            : action,
        ),
      );
    } else {
      setActions((current) => [
        ...current,
        {
          id: createId(),
          title: nextTitle,
          deadline: nextDeadline,
          isDone: false,
        },
      ]);
    }

    closeActionDialog();
  }

  function deleteAction() {
    if (!actionToDelete) {
      return;
    }

    setActions((current) =>
      current.filter((action) => action.id !== actionToDelete.id),
    );

    closeActionDialog();
  }

  function openNewDiscipline() {
    setDisciplineDraft({
      id: null,
      title: "",
      repeatInterval: "Every 1 Day",
      history: [],
    });

    setDisciplineDeleteDialogOpen(false);
    setDisciplineToDelete(null);
    setDisciplineDialogOpen(true);
  }

  function openEditDiscipline(discipline: MissionDiscipline) {
    setDisciplineDraft({
      id: discipline.id,
      title: discipline.title,
      repeatInterval: discipline.repeatInterval || "Every 1 Day",
      history: discipline.history,
    });

    setDisciplineDeleteDialogOpen(false);
    setDisciplineToDelete(null);
    setDisciplineDialogOpen(true);
  }

  function openDeleteDiscipline(discipline: MissionDiscipline) {
    setDisciplineToDelete(discipline);
    setDisciplineDeleteDialogOpen(true);
  }

  function closeDisciplineDialog() {
    setDisciplineDialogOpen(false);
    setDisciplineDeleteDialogOpen(false);
    setDisciplineToDelete(null);
  }

  function saveDiscipline() {
    const nextTitle = disciplineDraft.title.trim();
    const nextRepeatInterval = disciplineDraft.repeatInterval.trim() || "Every 1 Day";
    const disciplineId = disciplineDraft.id;

    if (!nextTitle) {
      return;
    }

    if (disciplineId !== null) {
      setDisciplines((current) =>
        current.map((discipline) =>
          discipline.id === disciplineId
            ? {
              ...discipline,
              title: nextTitle,
              repeatInterval: nextRepeatInterval,
            }
            : discipline,
        ),
      );
    } else {
      setDisciplines((current) => [
        ...current,
        {
          id: createId(),
          title: nextTitle,
          repeatInterval: nextRepeatInterval,
          history: disciplineDraft.history || [],
        },
      ]);
    }

    closeDisciplineDialog();
  }

  function deleteDiscipline() {
    if (!disciplineToDelete) {
      return;
    }

    setDisciplines((current) =>
      current.filter((discipline) => discipline.id !== disciplineToDelete.id),
    );

    closeDisciplineDialog();
  }

  return (
    <PageWrapper>
      <TopBar>
        <TopBar.Title asTitle>
          {isEditMode ? t("missions.edit") : t("missions.new")}
        </TopBar.Title>

        <TopBar.Btn backIcon href="/missions" position="left" />
        <TopBar.HelpBtn position="right" />
      </TopBar>

      <Form
        className="w-full space-y-6"
        aria-label={isEditMode ? t("missions.editAria") : t("missions.createAria")}
        action={async () => {
          const payload = {
            id: editId ? Number(editId) : undefined,
            title,
            difficulty,
            deadline: serializeDate(missionDeadline),

            actions: actions.map(
              (action): MissionAction => ({
                id: action.id,
                title: action.title,
                deadline: serializeDate(action.deadline),
                isDone: action.isDone,
              }),
            ),

            disciplines: disciplines.map(
              (discipline): MissionDiscipline => ({
                id: discipline.id,
                title: discipline.title,
                repeatInterval: discipline.repeatInterval,
                history: discipline.history,
              }),
            ),
          };

          console.log(
            isEditMode ? "Update mission:" : "Create mission:",
            payload,
          );

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
            placeholder={t("missions.titlePlaceholder")}
            pattern=".*[A-Za-z].*"
            onChange={(event) => setTitle(event.target.value)}
          />

          <Field.Error className="sub-text mt-0.5 text-foreground" />
        </Field.Root>

        <DifficultySelect value={difficulty} onChange={setDifficulty} />

        <Field.Root name="deadline">
          <Field.Label className="mb-1 font-bold">{t("common.deadline")}</Field.Label>

          <DayPickerDialog
            value={missionDeadline}
            onChange={setMissionDeadline}
          />

          <input
            type="hidden"
            name="deadline"
            value={serializeDate(missionDeadline)}
          />
        </Field.Root>

        <Field.Root name="actions">
          <Field.Label className="mb-1 font-bold">{t("missions.actionsLabel")}</Field.Label>

          <Dialog
            open={actionDialogOpen}
            onOpenChange={(open) => {
              if (!open) {
                closeActionDialog();
                return;
              }

              setActionDialogOpen(true);
            }}
            trigger={
              <Button
                type="button"
                variant="outline"
                onClick={openNewAction}
                className="w-full justify-start rounded-component"
              >
                Add action
              </Button>
            }
          >
            <div>
              <Dialog.Title className="font-bold">
                {actionDraft.id !== null ? t("missions.editAction") : t("missions.newAction")}
              </Dialog.Title>

              <Dialog.Description className="sub-text mt-1">
                {actionDraft.id !== null
                  ? t("missions.editActionDesc")
                  : t("missions.createActionDesc")}
              </Dialog.Description>
            </div>

            <Field.Root name="actionTitle">
              <Field.Label className="mb-1 font-bold">{t("common.title")}</Field.Label>

              <Field.Control
                required
                minLength={3}
                className="input"
                value={actionDraft.title}
                placeholder={t("missions.actionTitlePlaceholder")}
                onChange={(event) =>
                  setActionDraft((current) => ({
                    ...current,
                    title: event.target.value,
                  }))
                }
              />

              <Field.Error className="sub-text mt-0.5 text-foreground" />
            </Field.Root>

            <Field.Root name="actionDeadline">
              <Field.Label className="mb-1 font-bold">{t("common.deadline")}</Field.Label>

              <DayPickerDialog
                value={actionDraft.deadline}
                onChange={(date) =>
                  setActionDraft((current) => ({
                    ...current,
                    deadline: date,
                  }))
                }
              />
            </Field.Root>

            <div className="flex items-center justify-end gap-3">
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
                disabled={
                  actionDraft.title.trim().length < 3 ||
                  actionDraft.deadline === null
                }
              >
                {actionDraft.id !== null ? t("common.save") : t("common.add")}
              </Button>
            </div>
          </Dialog>

          {actions.length > 0 && (
            <div className="mt-1 space-y-2">
              {actions.map((action) => (
                <div
                  key={action.id}
                  className="flex items-center gap-3 rounded-component bg-card p-3"
                >
                  <p className="truncate font-medium">{action.title}</p>

                  <p className="sub-text text-sm">
                    {formatDate(action.deadline)}
                  </p>

                  <div className="ms-auto flex shrink-0 items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => openEditAction(action)}
                    >
                      <EditIcon />
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => openDeleteAction(action)}
                    >
                      <Trash2Icon />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <input
            type="hidden"
            name="actions"
            value={JSON.stringify(
              actions.map((action) => ({
                id: action.id,
                title: action.title,
                deadline: serializeDate(action.deadline),
                isDone: action.isDone,
              })),
            )}
          />
        </Field.Root>

        <Dialog
          open={actionDeleteDialogOpen}
          onOpenChange={(open) => {
            setActionDeleteDialogOpen(open);

            if (!open) {
              setActionToDelete(null);
            }
          }}
        >
          <Dialog.Title className="font-bold">{t("missions.deleteAction")}</Dialog.Title>

          <Dialog.Description className="sub-text mt-1">
            {actionToDelete
              ? t("missions.deleteActionDesc", { title: actionToDelete.title })
              : ""}
          </Dialog.Description>

          <div className="mt-6 flex justify-end gap-3">
            <Dialog.Close
              render={
                <Button type="button" variant="ghost">
                  {t("common.cancel")}
                </Button>
              }
            />

            <Button type="button" variant="primary" onClick={deleteAction}>
              {t("common.delete")}
            </Button>
          </div>
        </Dialog>

        <Field.Root name="disciplines">
          <Field.Label className="mb-1 font-bold">{t("missions.disciplines")}</Field.Label>

          <Dialog
            open={disciplineDialogOpen}
            onOpenChange={(open) => {
              if (!open) {
                closeDisciplineDialog();
                return;
              }

              setDisciplineDialogOpen(true);
            }}
            trigger={
              <Button
                type="button"
                variant="outline"
                onClick={openNewDiscipline}
                className="w-full justify-start rounded-component"
              >
                Add discipline
              </Button>
            }
          >
            <div className="relative z-front flex min-h-0 flex-col gap-6">
              <div>
                <Dialog.Title className="font-bold">
                  {disciplineDraft.id !== null
                    ? t("missions.editDiscipline")
                    : t("missions.newDiscipline")}
                </Dialog.Title>

                <Dialog.Description className="sub-text mt-1">
                  {disciplineDraft.id !== null
                    ? t("missions.editDisciplineDesc")
                    : t("missions.createDisciplineDesc")}
                </Dialog.Description>
              </div>

              <Field.Root name="disciplineTitle">
                <Field.Label className="mb-1 font-bold">{t("common.title")}</Field.Label>

                <Field.Control
                  required
                  minLength={3}
                  className="input"
                  value={disciplineDraft.title}
                  placeholder={t("missions.disciplineTitlePlaceholder")}
                  onChange={(event) =>
                    setDisciplineDraft((current) => ({
                      ...current,
                      title: event.target.value,
                    }))
                  }
                />

                <Field.Error className="sub-text mt-0.5 text-foreground" />
              </Field.Root>

              <Field.Root name="disciplineRepeatInterval">
                <Field.Label className="mb-2 block font-bold">Repeat Interval</Field.Label>

                <RepeatIntervalInput
                  value={disciplineDraft.repeatInterval}
                  onChange={(val) =>
                    setDisciplineDraft((current) => ({
                      ...current,
                      repeatInterval: val,
                    }))
                  }
                />

                <Field.Error className="sub-text mt-0.5 text-foreground" />
              </Field.Root>

              <div className="flex items-center justify-end gap-3">
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
                  {disciplineDraft.id !== null ? t("common.save") : t("common.add")}
                </Button>
              </div>
            </div>
          </Dialog>

          {disciplines.length > 0 && (
            <div className="mt-1 space-y-2">
              {disciplines.map((discipline) => (
                <div key={discipline.id} className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 rounded-component bg-card p-3">
                    <p className="min-w-0 truncate font-medium">
                      {discipline.title}
                    </p>

                    <div className="ms-auto flex shrink-0 items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => openEditDiscipline(discipline)}
                      >
                        <EditIcon />
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => openDeleteDiscipline(discipline)}
                      >
                        <Trash2Icon />
                      </Button>
                    </div>
                  </div>
                  {isEditMode && discipline.history && discipline.history.length > 0 && (
                    <div className="rounded-component bg-card p-3 space-y-2">
                      <p className="font-bold text-sm">Progress History</p>
                      {discipline.history.map((record, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm">
                          <span>{new Date(record.date).toLocaleDateString()}</span>
                          <span className={record.isDone ? "text-foreground font-bold" : "sub-text font-bold"}>
                            {record.isDone ? "Did it" : "Didn't do it"}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <input
            type="hidden"
            name="disciplines"
            value={JSON.stringify(disciplines)}
          />
        </Field.Root>

        <Dialog
          open={disciplineDeleteDialogOpen}
          onOpenChange={(open) => {
            setDisciplineDeleteDialogOpen(open);

            if (!open) {
              setDisciplineToDelete(null);
            }
          }}
        >
          <Dialog.Title className="font-bold">{t("missions.deleteDiscipline")}</Dialog.Title>

          <Dialog.Description className="sub-text">
            {disciplineToDelete
              ? t("missions.deleteDisciplineDesc", { title: disciplineToDelete.title })
              : t("missions.deleteDisciplineFallback")}
          </Dialog.Description>

          <div className="flex items-center justify-end gap-3">
            <Dialog.Close
              render={
                <Button type="button" variant="ghost">
                  {t("common.cancel")}
                </Button>
              }
            />

            <Button type="button" variant="primary" onClick={deleteDiscipline}>
              {t("common.delete")}
            </Button>
          </div>
        </Dialog>

        <PageActionBtn submit />
      </Form>
    </PageWrapper>
  );
}

export default NewMissionPage;
