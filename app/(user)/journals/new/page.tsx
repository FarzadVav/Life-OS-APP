"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Field, Form, Select } from "@base-ui/react";
import { CheckIcon, ChevronDownIcon } from "lucide-react";

import { journals, JOURNAL_TYPES } from "@/features/journals/constants";
import { JournalType } from "@/features/journals/types";
import TopBar from "@/features/general/components/static/TopBar/TopBar";
import { Button } from "@/features/general/components/ui/Button/Button";
import CreateBtn from "@/features/general/components/module/CreateBtn/CreateBtn";
import PageWrapper from "@/features/general/components/static/PageWrapper/PageWrapper";

function TypeSelect({
  value,
  onChange,
}: {
  value: JournalType | null;
  onChange: (value: JournalType) => void;
}) {
  return (
    <Field.Root name="type">
      <Field.Label className="mb-1 font-bold">Type</Field.Label>

      <Select.Root
        name="type"
        items={JOURNAL_TYPES}
        value={value ?? undefined}
        onValueChange={(nextValue) => {
          if (nextValue) {
            onChange(nextValue as JournalType);
          }
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
              <Select.Value placeholder="Select type" />

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
                {JOURNAL_TYPES.map((item) => (
                  <Select.Item
                    key={item.value}
                    value={item.value}
                    nativeButton
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

function NewJournalPage() {
  const searchParams = useSearchParams();
  const editId = searchParams.get("editId");
  const isEditMode = Boolean(editId);

  const [title, setTitle] = useState("");
  const [type, setType] = useState<JournalType | null>("Thoughts");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (!editId) {
      queueMicrotask(() => {
        setTitle("");
        setType("Thoughts");
        setContent("");
      });
      return;
    }

    const journal = journals.find((item) => String(item.id) === editId);
    if (!journal) {
      return;
    }

    queueMicrotask(() => {
      setTitle(journal.title);
      setType(journal.type);
      setContent(journal.content);
    });
  }, [editId]);

  return (
    <PageWrapper>
      <TopBar>
        <TopBar.Title asTitle>
          {isEditMode ? "Edit Journal" : "New Journal"}
        </TopBar.Title>
        <TopBar.Btn backIcon href="/journals" position="left" />
      </TopBar>

      <Form
        className="w-full space-y-6"
        aria-label={isEditMode ? "Edit journal" : "Create new journal"}
        action={async () => {
          const payload = {
            id: editId ? Number(editId) : undefined,
            title,
            type,
            content,
            createdAt: new Date().toISOString(),
          };

          console.log(
            isEditMode ? "Update journal:" : "Create journal:",
            payload,
          );

          await new Promise((resolve) => setTimeout(resolve, 500));
        }}
      >
        <Field.Root name="title">
          <Field.Label className="block font-bold">Title</Field.Label>

          <Field.Control
            required
            minLength={3}
            value={title}
            className="input"
            placeholder="Journal title..."
            onChange={(event) => setTitle(event.target.value)}
          />

          <Field.Error className="sub-text mt-0.5 text-red-400" />
        </Field.Root>

        <TypeSelect value={type} onChange={setType} />

        <Field.Root name="content">
          <Field.Label className="block font-bold">Content</Field.Label>

          <Field.Control
            required
            minLength={5}
            value={content}
            render={
              <textarea
                rows={6}
                className="w-full rounded-md border p-3 text-sm focus:outline-none"
              />
            }
            placeholder="Write your thoughts, observations or plans here..."
            onChange={(event) => setContent(event.target.value)}
          />

          <Field.Error className="sub-text mt-0.5 text-red-400" />
        </Field.Root>

        <CreateBtn submit />
      </Form>
    </PageWrapper>
  );
}

export default NewJournalPage;
