"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useLocale } from "@/features/general/components/module/LocaleProvider/LocaleProvider";

import { Field, Form } from "@base-ui/react";

import { rules } from "@/features/rules/constants";
import TopBar from "@/features/general/components/static/TopBar/TopBar";
import PageActionBtn from "@/features/general/components/module/PageActionBtn/PageActionBtn";
import PageWrapper from "@/features/general/components/static/PageWrapper/PageWrapper";

function NewRulePage() {
  const { t } = useLocale();
  const searchParams = useSearchParams();
  const editId = searchParams.get("editId");
  const isEditMode = Boolean(editId);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!editId) {
      queueMicrotask(() => {
        setTitle("");
        setDescription("");
      });
      return;
    }

    const rule = rules.find((item) => String(item.id) === editId);
    if (!rule) {
      return;
    }

    queueMicrotask(() => {
      setTitle(rule.title);
      setDescription(rule.description ?? "");
    });
  }, [editId]);

  return (
    <PageWrapper>
      <TopBar>
        <TopBar.Title asTitle>
          {isEditMode ? t("rules.edit") : t("rules.new")}
        </TopBar.Title>
        <TopBar.Btn backIcon href="/rules" position="left" />
        <TopBar.HelpBtn position="right" />
      </TopBar>

      <Form
        className="w-full space-y-6"
        aria-label={isEditMode ? t("rules.editAria") : t("rules.createAria")}
        action={async () => {
          const payload = {
            id: editId ? Number(editId) : undefined,
            title,
            description,
            createdAt: new Date().toISOString(),
          };

          console.log(isEditMode ? "Update rule:" : "Create rule:", payload);

          await new Promise((resolve) => setTimeout(resolve, 500));
        }}
      >
        <Field.Root name="title">
          <Field.Label className="block font-bold">{t("rules.ruleLabel")}</Field.Label>

          <Field.Control
            required
            minLength={3}
            value={title}
            className="input"
            placeholder={t("rules.rulePlaceholder")}
            onChange={(event) => setTitle(event.target.value)}
          />

          <Field.Error className="sub-text mt-0.5 text-red-400" />
        </Field.Root>

        <Field.Root name="description">
          <Field.Label className="block font-bold">
            Rationale & Boundary (Optional)
          </Field.Label>

          <Field.Control
            value={description}
            render={
              <textarea
                rows={4}
                className="w-full rounded-md border p-3 text-sm focus:outline-none"
              />
            }
            placeholder={t("rules.whyLabel")}
            onChange={(event) => setDescription(event.target.value)}
          />

          <Field.Error className="sub-text mt-0.5 text-red-400" />
        </Field.Root>

        <PageActionBtn submit />
      </Form>
    </PageWrapper>
  );
}

export default NewRulePage;
