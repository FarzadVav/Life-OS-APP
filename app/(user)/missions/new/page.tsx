"use client";

import { useState } from "react";
import { DayPicker, enUS } from "@daypicker/persian";
import { Dialog, Field, Form, Select } from "@base-ui/react";
import "@daypicker/react/style.css";

import TopBar from "@/features/general/components/static/TopBar/TopBar";
import { Button } from "@/features/general/components/ui/Button/Button";
import CreateBtn from "@/features/general/components/module/CreateBtn/CreateBtn";
import PageWrapper from "@/features/general/components/static/PageWrapper/PageWrapper";

type Action = {
  id: string;
  title: string;
  deadline: Date;
};

type Discipline = {
  id: string;
  title: string;
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

const dialogPopupClass = `
  fixed
  top-[calc(50%+1.25rem*var(--nested-dialogs))]
  left-1/2
  -mt-8
  flex
  w-[calc(100vw-1.5rem)]
  max-w-md
  -translate-x-1/2
  -translate-y-1/2
  flex-col
  gap-6
  scale-[calc(1-0.1*var(--nested-dialogs))]
  rounded-component
  border
  border-foreground
  bg-card-thick
  p-4
  text-foreground
  shadow-[0.25rem_0.25rem_0]
  shadow-black/12
  transition-[top,scale,opacity]
  duration-100
  ease-out
  after:absolute
  after:inset-0
  after:pointer-events-none
  after:bg-black/5
  after:opacity-0
  after:transition-opacity
  after:duration-100
  after:ease-out
  data-ending-style:top-[calc(50%+0.25rem+1.25rem*var(--nested-dialogs))]
  data-ending-style:scale-[0.96]
  data-ending-style:opacity-0
  data-nested-dialog-open:after:opacity-100
  data-starting-style:top-[calc(50%+0.25rem+1.25rem*var(--nested-dialogs))]
  data-starting-style:scale-[0.96]
  data-starting-style:opacity-0
`;

const topLevelDialogPopupClass = `
  ${dialogPopupClass}
  max-h-[calc(100dvh-2rem)]
`;

function createId() {
  return crypto.randomUUID();
}

function formatDate(date?: Date) {
  if (!date) {
    return "Not set";
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
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
  label?: string;
};

function DatePickerDialog({
  value,
  onChange,
  label = "Deadline",
}: DatePickerDialogProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger
        render={
          <Button
            type="button"
            variant="card"
            className="w-full justify-start rounded-md"
          >
            {label}: {formatDate(value)}
          </Button>
        }
      />

      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 min-h-dvh bg-background opacity-90 transition-opacity duration-300 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-[-webkit-touch-callout:none]:absolute" />

        <Dialog.Popup className={topLevelDialogPopupClass}>
          <div className="relative z-10">
            <DayPicker
              animate
              dir="ltr"
              mode="single"
              locale={enUS}
              numerals="latn"
              selected={value}
              onSelect={onChange}
            />

            <div className="mt-6 flex justify-center">
              <Dialog.Close render={<Button variant="card">Close</Button>} />
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
      <Field.Label className="mb-1 block font-bold">Difficulty</Field.Label>

      <Select.Root
        name="difficulty"
        items={difficultyItems}
        value={value === null ? null : String(value)}
        onValueChange={(nextValue) => {
          onChange(nextValue === null ? null : Number(nextValue));
        }}
        required
      >
        <Select.Trigger className="flex h-10 w-full items-center justify-between rounded-md border px-3 text-left">
          <Select.Value placeholder="Select difficulty" />

          <Select.Icon>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M4 6h8l-4 4.5z" />
            </svg>
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Positioner className="z-100">
            <Select.Popup className="min-w-[var(--anchor-width)] overflow-hidden rounded-md border bg-card-thick p-1 shadow-lg">
              <Select.List>
                {difficultyItems.map((item) => (
                  <Select.Item
                    key={item.value}
                    value={item.value}
                    className="flex cursor-pointer items-center justify-between rounded-sm px-3 py-2 outline-none data-highlighted:bg-card"
                  >
                    <Select.ItemText>{item.label}</Select.ItemText>

                    <Select.ItemIndicator>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        aria-hidden="true"
                      >
                        <path d="m3 8.5 3.25 3.25L13 5" />
                      </svg>
                    </Select.ItemIndicator>
                  </Select.Item>
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
  const [missionDeadline, setMissionDeadline] = useState<Date>();

  const [difficulty, setDifficulty] = useState<number | null>(null);

  /* ---------------------------------------------------------------------- */
  /* Actions                                                                 */
  /* ---------------------------------------------------------------------- */

  const [actions, setActions] = useState<Action[]>([]);

  const [actionDialogOpen, setActionDialogOpen] = useState(false);

  const [actionDeleteDialogOpen, setActionDeleteDialogOpen] = useState(false);

  const [actionToDelete, setActionToDelete] = useState<Action | null>(null);

  const [actionDraft, setActionDraft] = useState<ActionDraft>({
    title: "",
  });

  /* ---------------------------------------------------------------------- */
  /* Disciplines                                                             */
  /* ---------------------------------------------------------------------- */

  const [disciplines, setDisciplines] = useState<Discipline[]>([]);

  const [disciplineDialogOpen, setDisciplineDialogOpen] = useState(false);

  const [disciplineDeleteDialogOpen, setDisciplineDeleteDialogOpen] =
    useState(false);

  const [disciplineToDelete, setDisciplineToDelete] =
    useState<Discipline | null>(null);

  const [disciplineDraft, setDisciplineDraft] = useState<DisciplineDraft>({
    title: "",
  });

  /* ---------------------------------------------------------------------- */
  /* Action handlers                                                         */
  /* ---------------------------------------------------------------------- */

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
    const title = actionDraft.title.trim();

    if (!title || !actionDraft.deadline) {
      return;
    }

    if (actionDraft.id) {
      setActions((current) =>
        current.map((action) =>
          action.id === actionDraft.id
            ? {
                id: action.id,
                title,
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
          title,
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

  /* ---------------------------------------------------------------------- */
  /* Discipline handlers                                                     */
  /* ---------------------------------------------------------------------- */

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
    const title = disciplineDraft.title.trim();

    if (!title) {
      return;
    }

    if (disciplineDraft.id) {
      setDisciplines((current) =>
        current.map((discipline) =>
          discipline.id === disciplineDraft.id
            ? {
                id: discipline.id,
                title,
              }
            : discipline,
        ),
      );
    } else {
      setDisciplines((current) => [
        ...current,
        {
          id: createId(),
          title,
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
        <TopBar.Title asTitle>New Mission</TopBar.Title>

        <TopBar.Btn backIcon href="/missions" position="left" />
      </TopBar>

      <Form
        className="w-full space-y-6"
        aria-label="Create new mission"
        action={async () => {
          return await new Promise((resolveInner) => {
            setTimeout(resolveInner, 5000);
          });
        }}
      >
        {/* ---------------------------------------------------------------- */}
        {/* Mission title                                                    */}
        {/* ---------------------------------------------------------------- */}

        <Field.Root name="title">
          <Field.Label className="block font-bold">Title</Field.Label>

          <Field.Control
            required
            minLength={3}
            defaultValue=""
            pattern=".*[A-Za-z].*"
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
        {/* Mission deadline                                                 */}
        {/* ---------------------------------------------------------------- */}

        <Field.Root name="deadline">
          <Field.Label className="mb-1 block font-bold">Deadline</Field.Label>

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

        {/* ================================================================= */}
        {/* ACTIONS                                                           */}
        {/* ================================================================= */}

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
            <Field.Label className="mb-1 block font-bold">Actions</Field.Label>

            {/* ------------------------------------------------------------ */}
            {/* Add Action button                                             */}
            {/* ------------------------------------------------------------ */}

            <Dialog.Trigger
              render={
                <Button
                  type="button"
                  variant="card"
                  className="w-full justify-start rounded-md"
                  onClick={openNewAction}
                >
                  Add action
                </Button>
              }
            />

            {/* ------------------------------------------------------------ */}
            {/* Action list on page                                           */}
            {/* ------------------------------------------------------------ */}

            {actions.length > 0 && (
              <div className="mt-2 space-y-2">
                {actions.map((action) => (
                  <div
                    key={action.id}
                    className="flex items-center justify-between gap-3 rounded-md bg-card p-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">{action.title}</p>

                      <p className="sub-text text-sm">
                        Deadline: {formatDate(action.deadline)}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-1">
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

          {/* -------------------------------------------------------------- */}
          {/* Action dialog                                                   */}
          {/* -------------------------------------------------------------- */}

          <Dialog.Portal>
            <Dialog.Backdrop className="fixed inset-0 min-h-dvh bg-background opacity-90 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-[-webkit-touch-callout:none]:absolute" />

            <Dialog.Popup className={topLevelDialogPopupClass}>
              <div className="relative z-10 flex min-h-0 flex-col gap-6">
                <div className="flex flex-col gap-1">
                  <Dialog.Title className="text-base font-bold">
                    {actionDraft.id ? "Edit action" : "New action"}
                  </Dialog.Title>

                  <Dialog.Description className="sub-text">
                    {actionDraft.id
                      ? "Edit the action details."
                      : "Create an action for this mission."}
                  </Dialog.Description>
                </div>

                <Field.Root name="actionTitle">
                  <Field.Label className="block font-bold">Title</Field.Label>

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
                    className="mt-1 h-10 w-full rounded-md border px-3"
                  />

                  <Field.Error className="sub-text mt-0.5 text-red-400" />
                </Field.Root>

                <Field.Root name="actionDeadline">
                  <Field.Label className="mb-1 block font-bold">
                    Deadline
                  </Field.Label>

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
                      actionDraft.title.trim().length < 3 ||
                      !actionDraft.deadline
                    }
                    onClick={saveAction}
                  >
                    {actionDraft.id ? "Save changes" : "Add action"}
                  </Button>
                </div>
              </div>
            </Dialog.Popup>
          </Dialog.Portal>
        </Dialog.Root>

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
            <Dialog.Backdrop className="fixed inset-0 min-h-dvh bg-background opacity-90 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0" />

            <Dialog.Popup className="fixed top-1/2 left-1/2 z-50 w-[calc(100vw-1.5rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-component bg-card-thick p-4">
              <Dialog.Title className="font-bold">Delete action?</Dialog.Title>

              <Dialog.Description className="sub-text mt-1">
                {actionToDelete
                  ? `"${actionToDelete.title}" will be removed from this mission.`
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

        {/* ================================================================= */}
        {/* DISCIPLINES                                                       */}
        {/* ================================================================= */}

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
            <Field.Label className="mb-1 block font-bold">
              Disciplines
            </Field.Label>

            {/* ------------------------------------------------------------ */}
            {/* Add Discipline button                                         */}
            {/* ------------------------------------------------------------ */}

            <Dialog.Trigger
              render={
                <Button
                  type="button"
                  variant="card"
                  className="w-full justify-start rounded-md"
                  onClick={openNewDiscipline}
                >
                  Add discipline
                </Button>
              }
            />

            {/* ------------------------------------------------------------ */}
            {/* Discipline list on page                                      */}
            {/* ------------------------------------------------------------ */}

            {disciplines.length > 0 && (
              <div className="mt-2 space-y-2">
                {disciplines.map((discipline) => (
                  <div
                    key={discipline.id}
                    className="flex items-center justify-between gap-3 rounded-md bg-card p-3"
                  >
                    <p className="min-w-0 truncate font-medium">
                      {discipline.title}
                    </p>

                    <div className="flex shrink-0 items-center gap-1">
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

          {/* -------------------------------------------------------------- */}
          {/* Discipline dialog                                               */}
          {/* -------------------------------------------------------------- */}

          <Dialog.Portal>
            <Dialog.Backdrop className="fixed inset-0 min-h-dvh bg-background opacity-90 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-[-webkit-touch-callout:none]:absolute" />

            <Dialog.Popup className={topLevelDialogPopupClass}>
              <div className="relative z-10 flex min-h-0 flex-col gap-6">
                <div className="flex flex-col gap-1">
                  <Dialog.Title className="text-base font-bold">
                    {disciplineDraft.id ? "Edit discipline" : "New discipline"}
                  </Dialog.Title>

                  <Dialog.Description className="sub-text">
                    {disciplineDraft.id
                      ? "Edit the discipline title."
                      : "Create a discipline for this mission."}
                  </Dialog.Description>
                </div>

                <Field.Root name="disciplineTitle">
                  <Field.Label className="block font-bold">Title</Field.Label>

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
                    className="mt-1 h-10 w-full rounded-md border px-3"
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
                    {disciplineDraft.id ? "Save changes" : "Add discipline"}
                  </Button>
                </div>
              </div>
            </Dialog.Popup>
          </Dialog.Portal>
        </Dialog.Root>

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
            {/* Intentionally no Backdrop here. */}

            <Dialog.Popup className={dialogPopupClass}>
              <div className="relative z-10 flex flex-col gap-1">
                <Dialog.Title className="text-base font-bold">
                  Delete discipline?
                </Dialog.Title>

                <Dialog.Description className="sub-text">
                  {disciplineToDelete
                    ? `"${disciplineToDelete.title}" will be removed from this mission.`
                    : "This discipline will be removed from this mission."}
                </Dialog.Description>
              </div>

              <div className="relative z-10 flex items-center justify-end gap-3">
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
        {/* Locked                                                            */}
        {/* --------   {/* --------
        <Field.Root name="isLocked">
          <Field.Label className="flex items-center gap-3">
            Is locked?
            <Switch.Root
              checked={isLocked}
              onCheckedChange={setIsLocked}
              className="flex h-5 w-9 shrink-0 rounded-full border border-foreground bg-card p-0.5 transition-colors duration-150 ease-[ease] data-checked:bg-foreground focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-foreground"
            >
              <Switch.Thumb className="size-3.5 rounded-full bg-foreground transition-[translate,background-color] duration-150 ease-[ease] data-checked:translate-x-4 data-checked:bg-background" />
            </Switch.Root>
          </Field.Label>
        </Field.Root>

        {/* ---------------------------------------------------------------- */}
        {/* Submit                                                            */}
        {/* ---------------------------------------------------------------- */}

        <CreateBtn submit />
      </Form>
    </PageWrapper>
  );
}

export default NewMissionPage;
