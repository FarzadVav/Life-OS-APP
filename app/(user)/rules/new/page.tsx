"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useLocale } from "@/features/general/components/module/LocaleProvider/LocaleProvider";

import { Field, Form } from "@base-ui/react";

import { rules } from "@/features/rules/constants";
import TopBar from "@/features/general/components/static/TopBar/TopBar";
import PageActionBtn from "@/features/general/components/module/PageActionBtn/PageActionBtn";
import PageWrapper from "@/features/general/components/static/PageWrapper/PageWrapper";
import RepeatIntervalInput from "@/features/general/components/ui/RepeatIntervalInput";

function NewRulePage() {
  const { t } = useLocale();
  const searchParams = useSearchParams();
  const editId = searchParams.get("editId");
  const isEditMode = Boolean(editId);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [repeatInterval, setRepeatInterval] = useState("Every 1 Day");
  const [history, setHistory] = useState<{ date: string; isDone: boolean }[]>([]);

  useEffect(() => {
    if (!editId) {
      queueMicrotask(() => {
        setTitle("");
        setDescription("");
        setRepeatInterval("Every 1 Day");
        setHistory([]);
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
      setRepeatInterval(rule.repeatInterval || "Every 1 Day");
      setHistory(rule.history ?? []);
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
            repeatInterval,
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

          <Field.Error className="sub-text mt-0.5 text-foreground" />
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

          <Field.Error className="sub-text mt-0.5 text-foreground" />
        </Field.Root>

        <Field.Root name="repeatInterval">
          <Field.Label className="mb-2 block font-bold">Repeat Interval</Field.Label>

          <RepeatIntervalInput
            value={repeatInterval}
            onChange={(val) => setRepeatInterval(val)}
            name="repeatInterval"
          />

          <Field.Error className="sub-text mt-0.5 text-foreground" />
        </Field.Root>

        {isEditMode && history.length > 0 && (
          <section className="space-y-3">
            <h3 className="font-bold">Progress History</h3>
            <div className="space-y-2">
              {history.map((record, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-md bg-card p-3 text-sm">
                  <span>{new Date(record.date).toLocaleDateString()}</span>
                  <span className={record.isDone ? "text-foreground font-bold" : "sub-text font-bold"}>
                    {record.isDone ? "Did it" : "Didn't do it"}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        <PageActionBtn submit />
      </Form>
    </PageWrapper>
  );
}

export default NewRulePage;
