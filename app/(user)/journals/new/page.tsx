"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useLocale } from "@/features/general/components/module/LocaleProvider/LocaleProvider";

import { Field, Form, Select } from "@base-ui/react";
import { CheckIcon, ChevronDownIcon, PlusIcon } from "lucide-react";

import { journals } from "@/features/journals/constants";
import { JournalType, JournalCategory } from "@/features/journals/types";
import { useJournalCategories } from "@/features/journals/categories";
import TopBar from "@/features/general/components/static/TopBar/TopBar";
import { Button } from "@/features/general/components/ui/Button/Button";
import PageActionBtn from "@/features/general/components/module/PageActionBtn/PageActionBtn";
import PageWrapper from "@/features/general/components/static/PageWrapper/PageWrapper";
import { RichTextarea } from "@/features/general/components/ui/RichTextEditor";

function TypeSelect({
  value,
  onChange,
  categories,
}: {
  value: JournalType | null;
  onChange: (value: JournalType) => void;
  categories: JournalCategory[];
}) {
  const { t } = useLocale();
  if (categories.length === 0) {
    return (
      <Field.Root name="type">
        <Field.Label className="mb-1 font-bold">{t("common.category")}</Field.Label>

        <Button
          nativeButton={false}
          variant="outline"
          className="w-full justify-between rounded-md"
          render={<Link href="/journals/categories" />}
        >
          <span className="sub-text">{t("journals.noCategories")}</span>
          <PlusIcon className="size-4" />
        </Button>
      </Field.Root>
    );
  }

  const items = categories.map((cat) => ({
    value: cat.name,
    label: cat.name,
  }));

  return (
    <Field.Root name="type">
      <Field.Label className="mb-1 font-bold">{t("common.category")}</Field.Label>

      <Select.Root
        name="type"
        items={items}
        value={value ?? undefined}
        onValueChange={(nextValue) => {
          if (nextValue) {
            onChange(nextValue);
          }
        }}
      >
        <Select.Trigger
          render={
            <Button
              type="button"
              variant="outline"
              className="w-full justify-between rounded-md"
            >
              <Select.Value placeholder={t("journals.selectCategory")} />

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
                {items.map((item) => (
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
  const { t } = useLocale();
  const searchParams = useSearchParams();
  const editId = searchParams.get("editId");
  const isEditMode = Boolean(editId);
  const { categories } = useJournalCategories();

  const [title, setTitle] = useState("");
  const [type, setType] = useState<JournalType | null>(null);
  const [content, setContent] = useState("");

  useEffect(() => {
    if (!editId) {
      queueMicrotask(() => {
        setTitle("");
        setType(null);
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
      setType(journal.type ?? null);
      setContent(journal.content);
    });
  }, [editId]);

  return (
    <PageWrapper>
      <TopBar>
        <TopBar.Title asTitle>
          {isEditMode ? t("journals.edit") : t("journals.new")}
        </TopBar.Title>
        <TopBar.Btn backIcon href="/journals" position="left" />
        <TopBar.HelpBtn position="right" />
      </TopBar>

      <Form
        className="w-full space-y-6"
        aria-label={isEditMode ? t("journals.editAria") : t("journals.createAria")}
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
          <Field.Label className="block font-bold">{t("common.title")}</Field.Label>

          <Field.Control
            required
            minLength={3}
            value={title}
            className="input"
            placeholder={t("journals.titlePlaceholder")}
            onChange={(event) => setTitle(event.target.value)}
          />

          <Field.Error className="sub-text mt-0.5 text-red-400" />
        </Field.Root>

        <TypeSelect
          value={type}
          onChange={setType}
          categories={categories}
        />

        <Field.Root name="content">
          <Field.Label className="block font-bold">{t("common.content")}</Field.Label>

          <RichTextarea
            name="content"
            value={content}
            onChange={setContent}
            placeholder={t("journals.contentPlaceholder")}
            title={t("common.content")}
            required
            minLength={5}
          />

          <Field.Error className="sub-text mt-0.5 text-red-400" />
        </Field.Root>

        <PageActionBtn submit />
      </Form>
    </PageWrapper>
  );
}

export default NewJournalPage;
