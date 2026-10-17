"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useLocale } from "@/features/general/components/module/LocaleProvider/LocaleProvider";

import { Field, Form } from "@base-ui/react";
import SelectDialog from "@/features/general/components/ui/SelectDialog";

import {
  FRAMEWORK_CATEGORIES,
  FRAMEWORK_SECTIONS,
  FrameworkCategory,
  FrameworkSection,
} from "@/features/framework/types";
import {
  addFrameworkItem,
  getFrameworkItem,
  updateFrameworkItem,
  useFrameworkItems,
} from "@/features/framework/items";
import TopBar from "@/features/general/components/static/TopBar/TopBar";
import PageActionBtn from "@/features/general/components/module/PageActionBtn/PageActionBtn";
import PageWrapper from "@/features/general/components/static/PageWrapper/PageWrapper";
import { RichTextarea } from "@/features/general/components/ui/RichTextEditor";

function CategorySelect({
  value,
  onChange,
}: {
  value: FrameworkCategory;
  onChange: (value: FrameworkCategory) => void;
}) {
  const { t } = useLocale();

  const items = FRAMEWORK_CATEGORIES.map((cat) => ({
    value: cat,
    label: t(`framework.categories.${cat.toLowerCase()}`) || cat,
  }));

  return (
    <Field.Root name="category">
      <Field.Label className="mb-1 font-bold">
        {t("common.category")}
      </Field.Label>

      <SelectDialog
        name="category"
        items={items}
        value={value}
        onChange={(nextValue) => {
          if (nextValue) {
            onChange(nextValue as FrameworkCategory);
          }
        }}
        title={t("common.category")}
        placeholder={t("framework.selectCategory") || "Select category"}
        required
      />

      <Field.Error className="sub-text mt-0.5 text-foreground" />
    </Field.Root>
  );
}

function SectionSelect({
  value,
  onChange,
}: {
  value: FrameworkSection;
  onChange: (value: FrameworkSection) => void;
}) {
  const { t } = useLocale();

  const items = FRAMEWORK_SECTIONS.map((sec) => ({
    value: sec,
    label: t(`framework.sections.${sec.toLowerCase()}`) || sec,
  }));

  return (
    <Field.Root name="section">
      <Field.Label className="mb-1 font-bold">
        {t("framework.section") || "Section"}
      </Field.Label>

      <SelectDialog
        name="section"
        items={items}
        value={value}
        onChange={(nextValue) => {
          if (nextValue) {
            onChange(nextValue as FrameworkSection);
          }
        }}
        title={t("framework.section") || "Section"}
        placeholder={t("framework.selectSection") || "Select section"}
        required
      />

      <Field.Error className="sub-text mt-0.5 text-foreground" />
    </Field.Root>
  );
}

function NewFrameworkItemPage() {
  const { t } = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("editId");
  const categoryParam = searchParams.get("category");
  const sectionParam = searchParams.get("section");
  const isEditMode = Boolean(editId);

  // We use useFrameworkItems so any changes are hooked into reactive store
  useFrameworkItems();

  const resolveCategory = useCallback(
    (param: string | null): FrameworkCategory => {
      if (!param) return "Career";
      const found = FRAMEWORK_CATEGORIES.find(
        (c) => c.toLowerCase() === param.toLowerCase(),
      );
      return found ?? "Career";
    },
    [],
  );

  const resolveSection = useCallback(
    (param: string | null): FrameworkSection => {
      if (!param) return "Visions";
      const found = FRAMEWORK_SECTIONS.find(
        (s) => s.toLowerCase() === param.toLowerCase(),
      );
      return found ?? "Visions";
    },
    [],
  );

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<FrameworkCategory>(() =>
    resolveCategory(categoryParam),
  );
  const [section, setSection] = useState<FrameworkSection>(() =>
    resolveSection(sectionParam),
  );
  const [content, setContent] = useState("");

  useEffect(() => {
    if (!editId) {
      queueMicrotask(() => {
        setTitle("");
        setCategory(resolveCategory(categoryParam));
        setSection(resolveSection(sectionParam));
        setContent("");
      });
      return;
    }

    const item = getFrameworkItem(Number(editId));
    if (!item) {
      return;
    }

    queueMicrotask(() => {
      setTitle(item.title);
      setCategory(item.category);
      setSection(item.section);
      setContent(item.content);
    });
  }, [editId, categoryParam, sectionParam, resolveCategory, resolveSection]);

  const singularSection = section.endsWith("s")
    ? section.slice(0, -1)
    : section;

  const pageTitle = isEditMode
    ? t("framework.editItem", {
        section:
          t(`framework.sections.${section.toLowerCase()}`) || singularSection,
      }) || `Edit ${singularSection}`
    : t("framework.newItemWithSection", {
        section:
          t(`framework.sections.${section.toLowerCase()}`) || singularSection,
      }) || `New ${singularSection}`;

  const backHref = `/framework?category=${encodeURIComponent(
    category.toLowerCase(),
  )}&section=${encodeURIComponent(section.toLowerCase())}`;

  return (
    <PageWrapper>
      <TopBar>
        <TopBar.Title asTitle>{pageTitle}</TopBar.Title>
        <TopBar.Btn backIcon href={backHref} position="left" />
        <TopBar.HelpBtn position="right" />
      </TopBar>

      <Form
        className="w-full space-y-6"
        aria-label={
          isEditMode
            ? t("framework.editAria") || "Edit framework item"
            : t("framework.createAria") || "Create framework item"
        }
        action={async () => {
          if (!title.trim()) return;

          if (isEditMode && editId) {
            updateFrameworkItem(Number(editId), {
              title,
              content,
              category,
              section,
            });
          } else {
            addFrameworkItem({
              title,
              content,
              category,
              section,
            });
          }

          router.push(backHref);
        }}
      >
        <Field.Root name="title">
          <Field.Label className="block font-bold">
            {t("common.title")}
          </Field.Label>

          <Field.Control
            required
            minLength={3}
            value={title}
            className="input"
            placeholder={
              t(`framework.placeholder.${section.toLowerCase()}`) ||
              `Title for this ${singularSection.toLowerCase()}...`
            }
            onChange={(event) => setTitle(event.target.value)}
          />

          <Field.Error className="sub-text mt-0.5 text-foreground" />
        </Field.Root>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CategorySelect value={category} onChange={setCategory} />
          <SectionSelect value={section} onChange={setSection} />
        </div>

        <Field.Root name="content">
          <Field.Label className="block font-bold">
            {t("common.content")}
          </Field.Label>

          <RichTextarea
            name="content"
            value={content}
            onChange={setContent}
            placeholder={
              t("framework.contentPlaceholder") ||
              "Write in detail using the rich text editor..."
            }
            title={pageTitle}
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

export default NewFrameworkItemPage;
