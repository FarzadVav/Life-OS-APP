"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { DayPicker, enUS } from "@daypicker/persian";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { Dialog, Field, Form, Select } from "@base-ui/react";
import "@daypicker/react/style.css";

import TopBar from "@/features/general/components/static/TopBar/TopBar";
import { Button } from "@/features/general/components/ui/Button/Button";
import CreateBtn from "@/features/general/components/module/CreateBtn/CreateBtn";
import PageWrapper from "@/features/general/components/static/PageWrapper/PageWrapper";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

type MissionAction = {
  id: number;
  title: string;
  deadline: string;
  isDone: boolean;
};

type MissionDiscipline = {
  id: number;
  title: string;
  repeatInterval: string;
};

type Mission = {
  id: number;
  title: string;
  deadline: string;
  difficulty: number;
  actions: MissionAction[];
  disciplines: MissionDiscipline[];
};

type Action = {
  id: string;
  title: string;
  deadline: Date;
};

type Discipline = {
  id: string;
  title: string;
  repeatInterval?: string;
};

type ActionDraft = {
  id?: string;
  title: string;
  deadline?: Date;
};

type DisciplineDraft = {
  id?: string;
  title: string;
};

/* -------------------------------------------------------------------------- */
/* Mock data                                                                  */
/* -------------------------------------------------------------------------- */

const missions: Mission[] = [
  {
    id: 1,
    title: "Build and launch my SaaS",
    deadline: "2026-12-20",
    difficulty: 5,
    actions: [
      {
        id: 1,
        title: "Finalize MVP feature set",
        deadline: "2026-10-15",
        isDone: true,
      },
      {
        id: 2,
        title: "Build landing page",
        deadline: "2026-10-25",
        isDone: true,
      },
      {
        id: 3,
        title: "Implement payment system",
        deadline: "2026-11-05",
        isDone: false,
      },
      {
        id: 4,
        title: "Deploy production version",
        deadline: "2026-11-20",
        isDone: false,
      },
      {
        id: 5,
        title: "Acquire first 10 customers",
        deadline: "2026-12-20",
        isDone: false,
      },
    ],
    disciplines: [
      {
        id: 1,
        title: "Work on the product every day",
        repeatInterval: "Daily",
      },
      {
        id: 2,
        title: "Talk to potential customers",
        repeatInterval: "3 times / week",
      },
      {
        id: 3,
        title: "Publish business-related content",
        repeatInterval: "2 times / week",
      },
    ],
  },
  {
    id: 2,
    title: "Reach B2 English level",
    deadline: "2027-01-15",
    difficulty: 4,
    actions: [
      {
        id: 1,
        title: "Finish Vocabulary in Use B2",
        deadline: "2026-11-15",
        isDone: true,
      },
      {
        id: 2,
        title: "Read the first English book",
        deadline: "2026-11-30",
        isDone: false,
      },
      {
        id: 3,
        title: "Read the second English book",
        deadline: "2026-12-20",
        isDone: false,
      },
      {
        id: 4,
        title: "Finish B2 grammar review",
        deadline: "2027-01-05",
        isDone: false,
      },
    ],
    disciplines: [
      {
        id: 1,
        title: "English study",
        repeatInterval: "Daily",
      },
      {
        id: 2,
        title: "Watch English content",
        repeatInterval: "Daily",
      },
    ],
  },
  {
    id: 3,
    title: "Reach 20 pull-ups",
    deadline: "2026-11-30",
    difficulty: 4,
    actions: [
      {
        id: 1,
        title: "Reach 12 strict pull-ups",
        deadline: "2026-10-20",
        isDone: true,
      },
      {
        id: 2,
        title: "Reach 15 strict pull-ups",
        deadline: "2026-11-05",
        isDone: false,
      },
      {
        id: 3,
        title: "Reach 18 strict pull-ups",
        deadline: "2026-11-20",
        isDone: false,
      },
      {
        id: 4,
        title: "Reach 20 strict pull-ups",
        deadline: "2026-11-30",
        isDone: false,
      },
    ],
    disciplines: [
      {
        id: 1,
        title: "Pull-up training",
        repeatInterval: "3 times / week",
      },
      {
        id: 2,
        title: "Track bodyweight",
        repeatInterval: "Weekly",
      },
    ],
  },
  {
    id: 4,
    title: "Build my personal brand",
    deadline: "2027-02-01",
    difficulty: 5,
    actions: [
      {
        id: 1,
        title: "Define personal positioning",
        deadline: "2026-10-20",
        isDone: false,
      },
      {
        id: 2,
        title: "Build portfolio website",
        deadline: "2026-11-10",
        isDone: false,
      },
      {
        id: 3,
        title: "Prepare first 10 content ideas",
        deadline: "2026-11-20",
        isDone: false,
      },
      {
        id: 4,
        title: "Publish first case study",
        deadline: "2026-12-01",
        isDone: false,
      },
      {
        id: 5,
        title: "Build professional network",
        deadline: "2027-01-15",
        isDone: false,
      },
    ],
    disciplines: [
      {
        id: 1,
        title: "Create or document something",
        repeatInterval: "3 times / week",
      },
      {
        id: 2,
        title: "Reach out to people",
        repeatInterval: "2 times / week",
      },
    ],
  },
  {
    id: 5,
    title: "Read 6 English books",
    deadline: "2027-01-01",
    difficulty: 3,
    actions: [
      {
        id: 1,
        title: "Choose six books",
        deadline: "2026-10-10",
        isDone: true,
      },
      {
        id: 2,
        title: "Finish book #1",
        deadline: "2026-10-31",
        isDone: false,
      },
      {
        id: 3,
        title: "Finish book #2",
        deadline: "2026-11-15",
        isDone: false,
      },
      {
        id: 4,
        title: "Finish book #3",
        deadline: "2026-11-30",
        isDone: false,
      },
      {
        id: 5,
        title: "Finish book #4",
        deadline: "2026-12-15",
        isDone: false,
      },
      {
        id: 6,
        title: "Finish book #5",
        deadline: "2026-12-25",
        isDone: false,
      },
      {
        id: 7,
        title: "Finish book #6",
        deadline: "2027-01-01",
        isDone: false,
      },
    ],
    disciplines: [
      {
        id: 1,
        title: "Read English",
        repeatInterval: "Daily",
      },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const dialogPopupClass = `
  bg-card
  fixed
  left-1/2
  top-1/2
  -translate-x-1/2
  -translate-y-1/2
  w-max
  max-w-[calc(100vw-1.5rem)]
  max-h-[calc(100dvh-2rem)]
  flex
  flex-col
  gap-6
  p-3
  rounded-component
  scale-[calc(1-0.1*var(--nested-dialogs))]
  transition-all
  data-ending-style:translate-y-full
  data-ending-style:opacity-0
  data-starting-style:translate-y-full
  data-starting-style:opacity-0
`;

const dialogBackdropClass = `
  fixed
  inset-0
  min-h-dvh
  bg-background
  opacity-90
  transition-opacity
  duration-300
  data-ending-style:opacity-0
  data-starting-style:opacity-0
  supports-[-webkit-touch-callout:none]:absolute
`;

function createId() {
  return (Math.random() * 999999).toString();
}

function parseDate(date?: string) {
  if (!date) {
    return undefined;
  }

  return new Date(`${date}T00:00:00`);
}

function formatDate(date?: Date) {
  if (!date) {
    return "Not set";
  }

  return date.toLocaleDateString("fa-IR", {
    numberingSystem: "latn",
  });
}

function serializeDate(date?: Date) {
  if (!date) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/* -------------------------------------------------------------------------- */
/* Date Picker Dialog                                                         */
/* -------------------------------------------------------------------------- */

type DatePickerDialogProps = {
  value?: Date;
  onChange: (date: Date | undefined) => void;
};

function DatePickerDialog({ value, onChange }: DatePickerDialogProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  return (
    <Dialog.Root>
      <Dialog.Trigger
        render={
          <Button
            type="button"
            variant="outline"
            className="w-full justify-start rounded-md"
          >
            Deadline: {formatDate(value)}
          </Button>
        }
      />

      <Dialog.Portal>
        <Dialog.Backdrop className={dialogBackdropClass} />

        <Dialog.Popup className={dialogPopupClass}>
          <div className="relative z-10">
            <DayPicker
              animate
              dir="ltr"
              mode="single"
              locale={enUS}
              numerals="latn"
              selected={value}
              onSelect={(date) => {
                onChange(date);
                closeRef.current?.click();
              }}
            />

            <div className="mt-6 flex justify-center">
              <Dialog.Close
                ref={closeRef}
                render={<Button variant="ghost">Close</Button>}
              />
            </div>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/* -------------------------------------------------------------------------- */
/* Difficulty Select                                                          */
/* -------------------------------------------------------------------------- */

const difficultyItems = [
  {
    value: "1",
    label: "1 · Very easy",
  },
  {
    value: "2",
    label: "2 · Easy",
  },
  {
    value: "3",
    label: "3 · Moderate",
  },
  {
    value: "4",
    label: "4 · Hard",
  },
  {
    value: "5",
    label: "5 · Very hard",
  },
];

function DifficultySelect({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (value: number | null) => void;
}) {
  return (
    <Field.Root>
      <Field.Label className="mb-1 font-bold">Difficulty</Field.Label>

      <Select.Root
        name="difficulty"
        items={difficultyItems}
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
              className="w-full justify-between rounded-md"
            >
              <Select.Value placeholder="Select difficulty" />

              <Select.Icon>
                <ChevronDownIcon />
              </Select.Icon>
            </Button>
          }
        />

        <Select.Portal>
          <Select.Positioner className="z-100">
            <Select.Popup className="min-w-(--anchor-width) overflow-hidden rounded-md bg-card-thick p-1">
              <Select.List className="p-px">
                {difficultyItems.map((item) => (
                  <Select.Item
                    key={item.value}
                    value={item.value}
                    render={
                      <Button
                        type="button"
                        variant="ghost"
                        className="w-full justify-between rounded-md"
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

      <Field.Error className="sub-text mt-0.5 text-red-400" />
    </Field.Root>
  );
}

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

function NewMissionPage() {
  const searchParams = useSearchParams();

  const editId = searchParams.get("editId");
  const isEditMode = Boolean(editId);

  const [title, setTitle] = useState("");
  const [missionDeadline, setMissionDeadline] = useState<Date>();
  const [difficulty, setDifficulty] = useState<number | null>(null);

  const [actions, setActions] = useState<Action[]>([]);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionDeleteDialogOpen, setActionDeleteDialogOpen] = useState(false);
  const [actionToDelete, setActionToDelete] = useState<Action | null>(null);
  const [actionDraft, setActionDraft] = useState<ActionDraft>({
    title: "",
  });

  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [disciplineDialogOpen, setDisciplineDialogOpen] = useState(false);
  const [disciplineDeleteDialogOpen, setDisciplineDeleteDialogOpen] =
    useState(false);
  const [disciplineToDelete, setDisciplineToDelete] =
    useState<Discipline | null>(null);
  const [disciplineDraft, setDisciplineDraft] = useState<DisciplineDraft>({
    title: "",
  });

  /* ------------------------------------------------------------------------ */
  /* Load mission when editing                                                */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!editId) {
      queueMicrotask(() => {
        setTitle("");
        setMissionDeadline(undefined);
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
          id: String(action.id),
          title: action.title,
          deadline: parseDate(action.deadline)!,
        })),
      );

      setDisciplines(
        mission.disciplines.map((discipline) => ({
          id: String(discipline.id),
          title: discipline.title,
          repeatInterval: discipline.repeatInterval,
        })),
      );
    });
  }, [editId]);

  /* ------------------------------------------------------------------------ */
  /* Actions                                                                  */
  /* ------------------------------------------------------------------------ */

  function openNewAction() {
    setActionDraft({
      title: "",
      deadline: undefined,
    });

    setActionDeleteDialogOpen(false);
    setActionToDelete(null);
    setActionDialogOpen(true);
  }

  function openEditAction(action: Action) {
    setActionDraft({
      id: action.id,
      title: action.title,
      deadline: action.deadline,
    });

    setActionDeleteDialogOpen(false);
    setActionToDelete(null);
    setActionDialogOpen(true);
  }

  function openDeleteAction(action: Action) {
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

    if (!nextTitle || !actionDraft.deadline) {
      return;
    }

    if (actionDraft.id) {
      setActions((current) =>
        current.map((action) =>
          action.id === actionDraft.id
            ? {
                id: action.id,
                title: nextTitle,
                deadline: actionDraft.deadline!,
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
          deadline: actionDraft.deadline!,
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

  /* ------------------------------------------------------------------------ */
  /* Disciplines                                                              */
  /* ------------------------------------------------------------------------ */

  function openNewDiscipline() {
    setDisciplineDraft({
      title: "",
    });

    setDisciplineDeleteDialogOpen(false);
    setDisciplineToDelete(null);
    setDisciplineDialogOpen(true);
  }

  function openEditDiscipline(discipline: Discipline) {
    setDisciplineDraft({
      id: discipline.id,
      title: discipline.title,
    });

    setDisciplineDeleteDialogOpen(false);
    setDisciplineToDelete(null);
    setDisciplineDialogOpen(true);
  }

  function openDeleteDiscipline(discipline: Discipline) {
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

    if (!nextTitle) {
      return;
    }

    if (disciplineDraft.id) {
      setDisciplines((current) =>
        current.map((discipline) =>
          discipline.id === disciplineDraft.id
            ? {
                ...discipline,
                title: nextTitle,
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

  /* ------------------------------------------------------------------------ */
  /* Render                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <PageWrapper>
      <TopBar>
        <TopBar.Title asTitle>
          {isEditMode ? "Edit Mission" : "New Mission"}
        </TopBar.Title>

        <TopBar.Btn backIcon href="/missions" position="left" />
      </TopBar>

      <Form
        className="w-full space-y-6"
        aria-label={isEditMode ? "Edit mission" : "Create new mission"}
        action={async () => {
          const payload = {
            id: editId ?? undefined,
            title,
            difficulty,
            deadline: serializeDate(missionDeadline),
            actions: actions.map((action) => ({
              id: action.id,
              title: action.title,
              deadline: serializeDate(action.deadline),
            })),
            disciplines,
          };

          console.log(
            isEditMode ? "Update mission:" : "Create mission:",
            payload,
          );

          await new Promise((resolve) => setTimeout(resolve, 500));
        }}
      >
        {/* ---------------------------------------------------------------- */}
        {/* Title                                                            */}
        {/* ---------------------------------------------------------------- */}

        <Field.Root name="title">
          <Field.Label className="block font-bold">Title</Field.Label>

          <Field.Control
            required
            minLength={3}
            pattern=".*[A-Za-z].*"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Title..."
            className="h-10 w-full rounded-md border px-3"
          />

          <Field.Error className="sub-text mt-0.5 text-red-400" />
        </Field.Root>

        {/* ---------------------------------------------------------------- */}
        {/* Difficulty                                                       */}
        {/* ---------------------------------------------------------------- */}

        <DifficultySelect value={difficulty} onChange={setDifficulty} />

        {/* ---------------------------------------------------------------- */}
        {/* Deadline                                                         */}
        {/* ---------------------------------------------------------------- */}

        <Field.Root name="deadline">
          <Field.Label className="mb-1 font-bold">Deadline</Field.Label>

          <DatePickerDialog
            value={missionDeadline}
            onChange={setMissionDeadline}
          />

          <input
            type="hidden"
            name="deadline"
            value={serializeDate(missionDeadline)}
          />
        </Field.Root>

        {/* ---------------------------------------------------------------- */}
        {/* Actions                                                          */}
        {/* ---------------------------------------------------------------- */}

        <Dialog.Root
          open={actionDialogOpen}
          onOpenChange={(open) => {
            if (!open) {
              closeActionDialog();
              return;
            }

            setActionDialogOpen(true);
          }}
        >
          <Field.Root name="actions">
            <Field.Label className="mb-1 font-bold">Actions</Field.Label>

            <Dialog.Trigger
              render={
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start rounded-md"
                  onClick={openNewAction}
                >
                  Add action
                </Button>
              }
            />

            {actions.length > 0 && (
              <div className="mt-1 space-y-2">
                {actions.map((action) => (
                  <div
                    key={action.id}
                    className="flex items-center gap-3 rounded-md bg-card p-3"
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
                        Edit
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => openDeleteAction(action)}
                      >
                        Delete
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
                })),
              )}
            />
          </Field.Root>

          <Dialog.Portal>
            <Dialog.Backdrop className={dialogBackdropClass} />

            <Dialog.Popup className={dialogPopupClass}>
              <div className="flex flex-col gap-1">
                <Dialog.Title className="text-base font-bold">
                  {actionDraft.id ? "Edit action" : "New action"}
                </Dialog.Title>

                <Dialog.Description className="sub-text">
                  {actionDraft.id
                    ? "Edit the action details"
                    : "Create an action for this mission"}
                </Dialog.Description>
              </div>

              <Field.Root name="actionTitle">
                <Field.Label className="mb-1 font-bold">Title</Field.Label>

                <Field.Control
                  required
                  minLength={3}
                  value={actionDraft.title}
                  onChange={(event) =>
                    setActionDraft((current) => ({
                      ...current,
                      title: event.target.value,
                    }))
                  }
                  placeholder="Action title..."
                  className="h-10 w-full rounded-md border px-3"
                />

                <Field.Error className="sub-text mt-0.5 text-red-400" />
              </Field.Root>

              <Field.Root name="actionDeadline">
                <Field.Label className="mb-1 font-bold">Deadline</Field.Label>

                <DatePickerDialog
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
                      Cancel
                    </Button>
                  }
                />

                <Button
                  type="button"
                  variant="primary"
                  disabled={
                    actionDraft.title.trim().length < 3 || !actionDraft.deadline
                  }
                  onClick={saveAction}
                >
                  {actionDraft.id ? "Save" : "Add"}
                </Button>
              </div>
            </Dialog.Popup>
          </Dialog.Portal>
        </Dialog.Root>

        {/* ---------------------------------------------------------------- */}
        {/* Delete Action                                                    */}
        {/* ---------------------------------------------------------------- */}

        <Dialog.Root
          open={actionDeleteDialogOpen}
          onOpenChange={(open) => {
            setActionDeleteDialogOpen(open);

            if (!open) {
              setActionToDelete(null);
            }
          }}
        >
          <Dialog.Portal>
            <Dialog.Backdrop className={dialogBackdropClass} />

            <Dialog.Popup className={dialogPopupClass}>
              <Dialog.Title className="font-bold">Delete action?</Dialog.Title>

              <Dialog.Description className="sub-text mt-1">
                {actionToDelete
                  ? `"${actionToDelete.title}" will be removed from this mission`
                  : ""}
              </Dialog.Description>

              <div className="mt-6 flex justify-end gap-3">
                <Dialog.Close
                  render={
                    <Button type="button" variant="ghost">
                      Cancel
                    </Button>
                  }
                />

                <Button type="button" variant="primary" onClick={deleteAction}>
                  Delete
                </Button>
              </div>
            </Dialog.Popup>
          </Dialog.Portal>
        </Dialog.Root>

        {/* ---------------------------------------------------------------- */}
        {/* Disciplines                                                      */}
        {/* ---------------------------------------------------------------- */}

        <Dialog.Root
          open={disciplineDialogOpen}
          onOpenChange={(open) => {
            if (!open) {
              closeDisciplineDialog();
              return;
            }

            setDisciplineDialogOpen(true);
          }}
        >
          <Field.Root name="disciplines">
            <Field.Label className="mb-1 font-bold">Disciplines</Field.Label>

            <Dialog.Trigger
              render={
                <Button
                  type="button"
                  variant="outline"
                  onClick={openNewDiscipline}
                  className="w-full justify-start rounded-md"
                >
                  Add discipline
                </Button>
              }
            />

            {disciplines.length > 0 && (
              <div className="mt-1 space-y-2">
                {disciplines.map((discipline) => (
                  <div
                    key={discipline.id}
                    className="flex items-center gap-3 rounded-md bg-card p-3"
                  >
                    <p className="min-w-0 truncate font-medium">
                      {discipline.title}
                    </p>

                    <div className="ms-auto flex shrink-0 items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => openEditDiscipline(discipline)}
                      >
                        Edit
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => openDeleteDiscipline(discipline)}
                      >
                        Delete
                      </Button>
                    </div>
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

          <Dialog.Portal>
            <Dialog.Backdrop className={dialogBackdropClass} />

            <Dialog.Popup className={dialogPopupClass}>
              <div className="relative z-10 flex min-h-0 flex-col gap-6">
                <div className="flex flex-col gap-1">
                  <Dialog.Title className="text-base font-bold">
                    {disciplineDraft.id ? "Edit discipline" : "New discipline"}
                  </Dialog.Title>

                  <Dialog.Description className="sub-text">
                    {disciplineDraft.id
                      ? "Edit the discipline title"
                      : "Create a discipline for this mission"}
                  </Dialog.Description>
                </div>

                <Field.Root name="disciplineTitle">
                  <Field.Label className="mb-1 font-bold">Title</Field.Label>

                  <Field.Control
                    required
                    minLength={3}
                    value={disciplineDraft.title}
                    onChange={(event) =>
                      setDisciplineDraft((current) => ({
                        ...current,
                        title: event.target.value,
                      }))
                    }
                    placeholder="Discipline title..."
                    className="h-10 w-full rounded-md border px-3"
                  />

                  <Field.Error className="sub-text mt-0.5 text-red-400" />
                </Field.Root>

                <div className="flex items-center justify-end gap-3">
                  <Dialog.Close
                    render={
                      <Button type="button" variant="ghost">
                        Cancel
                      </Button>
                    }
                  />

                  <Button
                    type="button"
                    variant="primary"
                    disabled={disciplineDraft.title.trim().length < 3}
                    onClick={saveDiscipline}
                  >
                    {disciplineDraft.id ? "Save" : "Add"}
                  </Button>
                </div>
              </div>
            </Dialog.Popup>
          </Dialog.Portal>
        </Dialog.Root>

        {/* ---------------------------------------------------------------- */}
        {/* Delete Discipline                                                */}
        {/* ---------------------------------------------------------------- */}

        <Dialog.Root
          open={disciplineDeleteDialogOpen}
          onOpenChange={(open) => {
            setDisciplineDeleteDialogOpen(open);

            if (!open) {
              setDisciplineToDelete(null);
            }
          }}
        >
          <Dialog.Portal>
            <Dialog.Backdrop className={dialogBackdropClass} />

            <Dialog.Popup className={dialogPopupClass}>
              <Dialog.Title className="text-base font-bold">
                Delete discipline?
              </Dialog.Title>

              <Dialog.Description className="sub-text">
                {disciplineToDelete
                  ? `"${disciplineToDelete.title}" will be removed from this mission`
                  : "This discipline will be removed from this mission"}
              </Dialog.Description>

              <div className="flex items-center justify-end gap-3">
                <Dialog.Close
                  render={
                    <Button type="button" variant="ghost">
                      Cancel
                    </Button>
                  }
                />

                <Button
                  type="button"
                  variant="primary"
                  onClick={deleteDiscipline}
                >
                  Delete
                </Button>
              </div>
            </Dialog.Popup>
          </Dialog.Portal>
        </Dialog.Root>

        {/* ---------------------------------------------------------------- */}
        {/* Submit                                                           */}
        {/* ---------------------------------------------------------------- */}

        <CreateBtn submit />
      </Form>
    </PageWrapper>
  );
}

export default NewMissionPage;
