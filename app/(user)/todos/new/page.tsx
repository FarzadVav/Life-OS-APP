"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useLocale } from "@/features/general/components/module/LocaleProvider/LocaleProvider";

import { Field, Form, Select } from "@base-ui/react";
import { CheckIcon, ChevronDownIcon } from "lucide-react";

import { todos, TODO_TYPES } from "@/features/todos/constants";
import { TodoType } from "@/features/todos/types";
import TopBar from "@/features/general/components/static/TopBar/TopBar";
import { Button } from "@/features/general/components/ui/Button/Button";
import PageActionBtn from "@/features/general/components/module/PageActionBtn/PageActionBtn";
import PageWrapper from "@/features/general/components/static/PageWrapper/PageWrapper";
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
  return (
    <Field.Root name="type">
      <Field.Label className="mb-1 font-bold">{t("common.type")}</Field.Label>

      <Select.Root
        name="type"
        items={TODO_TYPES}
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
                {TODO_TYPES.map((item) => (
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
  const { t } = useLocale();
  const searchParams = useSearchParams();
  const editId = searchParams.get("editId");
  const typeParam = searchParams.get("type") || searchParams.get("category");
  const isEditMode = Boolean(editId);

  const defaultType: TodoType =
    typeParam?.toLowerCase() === "upcoming" ? "Upcoming" : "Daily";

  const [title, setTitle] = useState("");
  const [type, setType] = useState<TodoType>(defaultType);
  const [dailyTime, setDailyTime] = useState<string>(getDefaultTime());
  const [upcomingDate, setUpcomingDate] = useState<Date | null>(new Date());
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (!editId) {
      const resolvedType: TodoType =
        typeParam?.toLowerCase() === "upcoming" ? "Upcoming" : "Daily";

      queueMicrotask(() => {
        setTitle("");
        setType(resolvedType);
        setDailyTime(getDefaultTime());
        setUpcomingDate(new Date());
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

      if (todo.type === "Daily") {
        setDailyTime(todo.deadline.includes(":") ? todo.deadline : "12:00");
      } else {
        setUpcomingDate(parseDate(todo.deadline) ?? new Date());
      }
    });
  }, [editId, typeParam]);

  return (
    <PageWrapper>
      <TopBar>
        <TopBar.Title asTitle>
          {isEditMode ? t("todos.edit") : t("todos.new")}
        </TopBar.Title>
        <TopBar.Btn backIcon href="/" position="left" />
        <TopBar.HelpBtn position="right" />
      </TopBar>

      <Form
        className="w-full space-y-6"
        aria-label={isEditMode ? t("todos.editAria") : t("todos.createAria")}
        action={async () => {
          const deadline =
            type === "Daily" ? dailyTime : serializeDate(upcomingDate);

          const payload = {
            id: editId ? Number(editId) : undefined,
            title,
            type,
            deadline,
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
            placeholder={t("todos.titlePlaceholder")}
            onChange={(event) => setTitle(event.target.value)}
          />

          <Field.Error className="sub-text mt-0.5 text-foreground" />
        </Field.Root>

        <TypeSelect
          value={type}
          onChange={(newType) => {
            setType(newType);
          }}
        />

        <Field.Root name="deadline">
          <Field.Label className="mb-1 font-bold">{t("common.deadline")}</Field.Label>

          {type === "Daily" ? (
            <TimePickerDialog value={dailyTime} onChange={setDailyTime} />
          ) : (
            <DayPickerDialog
              value={upcomingDate}
              onChange={setUpcomingDate}
            />
          )}

          <input
            type="hidden"
            name="deadline"
            value={type === "Daily" ? dailyTime : serializeDate(upcomingDate)}
          />
        </Field.Root>

        <PageActionBtn submit />
      </Form>
    </PageWrapper>
  );
}

export default NewTodoPage;
