"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useLocale } from "@/features/general/components/module/LocaleProvider/LocaleProvider";

import { Field, Form, Select } from "@base-ui/react";
import { CheckIcon, ChevronDownIcon } from "lucide-react";

import { rules, RULE_CATEGORIES } from "@/features/rules/constants";
import { RuleCategory } from "@/features/rules/types";
import TopBar from "@/features/general/components/static/TopBar/TopBar";
import { Button } from "@/features/general/components/ui/Button/Button";
import CreateBtn from "@/features/general/components/module/CreateBtn/CreateBtn";
import PageWrapper from "@/features/general/components/static/PageWrapper/PageWrapper";

function CategorySelect({
  value,
  onChange,
}: {
  value: RuleCategory | null;
  onChange: (value: RuleCategory) => void;
}) {
  return (
    <Field.Root name="category">
      <Field.Label className="mb-1 font-bold">Category</Field.Label>

      <Select.Root
        name="category"
        items={RULE_CATEGORIES}
        value={value ?? undefined}
        onValueChange={(nextValue) => {
          if (nextValue) {
            onChange(nextValue as RuleCategory);
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
              <Select.Value placeholder="Select category" />

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
                {RULE_CATEGORIES.map((item) => (
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

function NewRulePage() {
  const { t } = useLocale();
  const searchParams = useSearchParams();
  const editId = searchParams.get("editId");
  const isEditMode = Boolean(editId);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<RuleCategory | null>("Discipline");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!editId) {
      queueMicrotask(() => {
        setTitle("");
        setCategory("Discipline");
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
      setCategory(rule.category);
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
      </TopBar>

      <Form
        className="w-full space-y-6"
        aria-label={isEditMode ? "Edit rule" : "Create new rule"}
        action={async () => {
          const payload = {
            id: editId ? Number(editId) : undefined,
            title,
            category,
            description,
            createdAt: new Date().toISOString(),
          };

          console.log(isEditMode ? "Update rule:" : "Create rule:", payload);

          await new Promise((resolve) => setTimeout(resolve, 500));
        }}
      >
        <Field.Root name="title">
          <Field.Label className="block font-bold">Rule / Principle</Field.Label>

          <Field.Control
            required
            minLength={3}
            value={title}
            className="input"
            placeholder="e.g. No phone in the first hour of waking up..."
            onChange={(event) => setTitle(event.target.value)}
          />

          <Field.Error className="sub-text mt-0.5 text-red-400" />
        </Field.Root>

        <CategorySelect value={category} onChange={setCategory} />

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
            placeholder="Why does this rule exist? What triggers it?"
            onChange={(event) => setDescription(event.target.value)}
          />

          <Field.Error className="sub-text mt-0.5 text-red-400" />
        </Field.Root>

        <CreateBtn submit />
      </Form>
    </PageWrapper>
  );
}

export default NewRulePage;
