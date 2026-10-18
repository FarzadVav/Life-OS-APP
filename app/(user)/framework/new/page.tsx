"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, useActionState } from "react";
import { useLocale } from "@/features/general/components/module/LocaleProvider/LocaleProvider";

import { Field, Form } from "@base-ui/react";
import { LoaderIcon, Trash2Icon } from "lucide-react";
import SelectDialog from "@/features/general/components/ui/SelectDialog";
import Dialog from "@/features/general/components/ui/Dialog/Dialog";
import { Button } from "@/features/general/components/ui/Button/Button";

import {
  FRAMEWORK_CATEGORIES,
  FRAMEWORK_SECTIONS,
  FrameworkCategory,
  FrameworkSection,
} from "@/features/framework/types";
import { useFrameworkItem } from "@/features/framework/hooks";
import {
  createFrameworkItemMutation,
  updateFrameworkItemMutation,
  deleteFrameworkItemMutation,
} from "@/features/framework/mutations";
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
        name="categorySelect"
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

      <Field.Error className="sub-text mt-0.5 text-foreground text-xs" />
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
        name="sectionSelect"
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

      <Field.Error className="sub-text mt-0.5 text-foreground text-xs" />
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

  const { item, isLoading: isItemLoading } = useFrameworkItem(
    editId ? Number(editId) : null,
  );

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
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Native form handling via React 19 useActionState + Base UI Form
  const [state, formAction, pending] = useActionState(
    isEditMode ? updateFrameworkItemMutation : createFrameworkItemMutation,
    null,
  );

  const singularSection = section.endsWith("s")
    ? section.slice(0, -1)
    : section;

  const backHref = `/framework?category=${encodeURIComponent(
    category.toLowerCase(),
  )}&section=${encodeURIComponent(section.toLowerCase())}`;

  // Navigate back to category upon success
  useEffect(() => {
    if (state?.success) {
      router.push(backHref);
      router.refresh();
    }
  }, [state?.success, backHref, router]);

  // Load existing framework item details if in edit mode
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

    if (item) {
      queueMicrotask(() => {
        setTitle(item.title);
        setCategory(item.category);
        setSection(item.section);
        setContent(item.content);
      });
    }
  }, [editId, item, categoryParam, sectionParam, resolveCategory, resolveSection]);

  const handleDelete = async () => {
    if (!editId) return;
    setIsDeleting(true);
    try {
      const res = await deleteFrameworkItemMutation(Number(editId));
      if (res.success) {
        setDeleteDialogOpen(false);
        router.push(backHref);
        router.refresh();
      }
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const pageTitle = isEditMode
    ? t("framework.editItem", {
        section:
          t(`framework.sections.${section.toLowerCase()}`) || singularSection,
      }) || `Edit ${singularSection}`
    : t("framework.newItemWithSection", {
        section:
          t(`framework.sections.${section.toLowerCase()}`) || singularSection,
      }) || `New ${singularSection}`;

  return (
    <PageWrapper>
      <TopBar>
        <TopBar.Title asTitle>{pageTitle}</TopBar.Title>
        <TopBar.Btn backIcon href={backHref} position="left" />

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

      {isEditMode && isItemLoading && !item ? (
        <div className="flex w-full items-center justify-center p-12 text-foreground/40 gap-2">
          <LoaderIcon className="size-5 animate-spin" />
          <span className="text-xs sub-text">{t("common.loading")}</span>
        </div>
      ) : (
        <Form
          id="framework-form"
          className="w-full space-y-6"
          aria-label={
            isEditMode
              ? t("framework.editAria") || "Edit framework item"
              : t("framework.createAria") || "Create framework item"
          }
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

          {/* Hidden inputs to pass data to Server Action */}
          {isEditMode && <input type="hidden" name="id" value={editId ?? ""} />}
          <input type="hidden" name="category" value={category} />
          <input type="hidden" name="section" value={section} />
          <input type="hidden" name="content" value={content} />

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
                t(`framework.placeholder.${section.toLowerCase()}`) ||
                `Title for this ${singularSection.toLowerCase()}...`
              }
              onChange={(event) => setTitle(event.target.value)}
            />

            <Field.Error className="sub-text mt-0.5 text-foreground text-xs" />
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

            <Field.Error className="sub-text mt-0.5 text-foreground text-xs" />
          </Field.Root>

          <PageActionBtn submit disabled={pending} form="framework-form" />
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
              {t("framework.confirmDelete") ||
                "Are you sure you want to delete this framework item?"}
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

export default NewFrameworkItemPage;
