"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useLocale } from "@/features/general/components/module/LocaleProvider/LocaleProvider";

import { Field, Form } from "@base-ui/react";
import SelectDialog from "@/features/general/components/ui/SelectDialog";

import {
  addJournal,
  getJournal,
  updateJournal,
  useJournals,
} from "@/features/journals/items";
import { JournalType, JOURNAL_CATEGORIES } from "@/features/journals/types";
import TopBar from "@/features/general/components/static/TopBar/TopBar";
import PageActionBtn from "@/features/general/components/module/PageActionBtn/PageActionBtn";
import PageWrapper from "@/features/general/components/static/PageWrapper/PageWrapper";
import { RichTextarea } from "@/features/general/components/ui/RichTextEditor";

function TypeSelect({
  value,
  onChange,
}: {
  value: JournalType | null;
  onChange: (value: JournalType) => void;
}) {
  const { t } = useLocale();

  const items = JOURNAL_CATEGORIES.map((cat) => ({
    value: cat,
    label: t(`journals.categories.${cat.toLowerCase()}`) || cat,
  }));

  return (
    <Field.Root name="type">
      <Field.Label className="mb-1 font-bold">{t("common.category")}</Field.Label>

      <SelectDialog
        name="type"
        items={items}
        value={value ?? undefined}
        onChange={(nextValue) => {
          if (nextValue) {
            onChange(nextValue as JournalType);
          }
        }}
        title={t("common.category")}
        placeholder={t("journals.selectCategory")}
        required
      />

      <Field.Error className="sub-text mt-0.5 text-foreground" />
    </Field.Root>
  );
}

function NewJournalPage() {
  const { t } = useLocale();
  const searchParams = useSearchParams();
  const editId = searchParams.get("editId");
  const categoryParam = searchParams.get("category") || searchParams.get("type");
  const isEditMode = Boolean(editId);

  const router = useRouter();
  useJournals();

  const resolveCategory = useCallback(
    (param: string | null): JournalType => {
      if (!param) return "Logs";
      const matched = JOURNAL_CATEGORIES.find(
        (c) => c.toLowerCase() === param.toLowerCase(),
      );
      return matched ?? "Logs";
    },
    [],
  );

  const [title, setTitle] = useState("");
  const [type, setType] = useState<JournalType>(() =>
    resolveCategory(categoryParam),
  );
  const [content, setContent] = useState("");

  useEffect(() => {
    if (!editId) {
      queueMicrotask(() => {
        setTitle("");
        setType(resolveCategory(categoryParam));
        setContent("");
      });
      return;
    }

    const journal = getJournal(Number(editId));
    if (!journal) {
      return;
    }

    queueMicrotask(() => {
      setTitle(journal.title);
      setType(journal.type ?? "Logs");
      setContent(journal.content);
    });
  }, [editId, categoryParam, resolveCategory]);

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
          const targetCategory = type ?? "Logs";
          if (isEditMode && editId) {
            updateJournal(Number(editId), {
              title,
              type: targetCategory,
              content,
            });
          } else {
            addJournal({
              title,
              type: targetCategory,
              content,
            });
          }

          router.push(`/journals/${targetCategory.toLowerCase()}`);
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

          <Field.Error className="sub-text mt-0.5 text-foreground" />
        </Field.Root>

        <TypeSelect
          value={type}
          onChange={setType}
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

          <Field.Error className="sub-text mt-0.5 text-foreground" />
        </Field.Root>

        <PageActionBtn submit />
      </Form>
    </PageWrapper>
  );
}

export default NewJournalPage;
