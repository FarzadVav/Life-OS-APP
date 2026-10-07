"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useLocale } from "@/features/general/components/module/LocaleProvider/LocaleProvider";

import { Field, Form, Select } from "@base-ui/react";
import { CheckIcon, ChevronDownIcon, PlusIcon } from "lucide-react";

import { skills, skillsMastery } from "@/features/skills/constants";
import { SkillType, SkillCategory } from "@/features/skills/types";
import { useSkillCategories } from "@/features/skills/categories";
import TopBar from "@/features/general/components/static/TopBar/TopBar";
import { Button } from "@/features/general/components/ui/Button/Button";
import PageActionBtn from "@/features/general/components/module/PageActionBtn/PageActionBtn";
import PageWrapper from "@/features/general/components/static/PageWrapper/PageWrapper";

function TypeSelect({
  value,
  onChange,
  categories,
}: {
  value: SkillType | null;
  onChange: (value: SkillType) => void;
  categories: SkillCategory[];
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
          render={<Link href="/skills/categories" />}
        >
          <span className="sub-text">{t("skills.noCategories")}</span>
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
              <Select.Value placeholder={t("skills.selectCategory")} />

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

function MasterySelect({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (value: number) => void;
}) {
  const { t } = useLocale();
  return (
    <Field.Root name="level">
      <Field.Label className="mb-1 font-bold">{t("skills.currentMastery")}</Field.Label>

      <Select.Root
        name="level"
        items={skillsMastery}
        value={value ? String(value) : undefined}
        onValueChange={(nextValue) => {
          if (nextValue) {
            onChange(Number(nextValue));
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
              <Select.Value placeholder={t("skills.selectMasteryLevel")} />

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
                {skillsMastery.map((item) => (
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

function NewSkillPage() {
  const { t } = useLocale();
  const searchParams = useSearchParams();
  const editId = searchParams.get("editId");
  const isEditMode = Boolean(editId);
  const { categories } = useSkillCategories();

  const [title, setTitle] = useState("");
  const [type, setType] = useState<SkillType | null>(null);
  const [level, setLevel] = useState<number | null>(3);
  const [content, setContent] = useState("");

  useEffect(() => {
    if (!editId) {
      queueMicrotask(() => {
        setTitle("");
        setType(null);
        setLevel(3);
        setContent("");
      });
      return;
    }

    const skill = skills.find((item) => String(item.id) === editId);
    if (!skill) {
      return;
    }

    queueMicrotask(() => {
      setTitle(skill.title);
      setType(skill.type ?? null);
      setLevel(skill.level);
      setContent(skill.content);
    });
  }, [editId]);

  return (
    <PageWrapper>
      <TopBar>
        <TopBar.Title asTitle>
          {isEditMode ? t("skills.edit") : t("skills.new")}
        </TopBar.Title>
        <TopBar.Btn backIcon href="/skills" position="left" />
        <TopBar.HelpBtn position="right" />
      </TopBar>

      <Form
        className="w-full space-y-6"
        aria-label={isEditMode ? t("skills.editAria") : t("skills.createAria")}
        action={async () => {
          const payload = {
            id: editId ? Number(editId) : undefined,
            title,
            type,
            level,
            content,
            createdAt: new Date().toISOString(),
          };

          console.log(isEditMode ? "Update skill:" : "Create skill:", payload);

          await new Promise((resolve) => setTimeout(resolve, 500));
        }}
      >
        <Field.Root name="title">
          <Field.Label className="block font-bold">{t("skills.skillTitle")}</Field.Label>

          <Field.Control
            required
            minLength={3}
            value={title}
            className="input"
            placeholder={t("skills.skillTitlePlaceholder")}
            onChange={(event) => setTitle(event.target.value)}
          />

          <Field.Error className="sub-text mt-0.5 text-red-400" />
        </Field.Root>

        <TypeSelect
          value={type}
          onChange={setType}
          categories={categories}
        />

        <MasterySelect value={level} onChange={setLevel} />

        <Field.Root name="content">
          <Field.Label className="block font-bold">
            Playbook / Content
          </Field.Label>

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
            placeholder={t("skills.playbookPlaceholder")}
            onChange={(event) => setContent(event.target.value)}
          />

          <Field.Error className="sub-text mt-0.5 text-red-400" />
        </Field.Root>

        <PageActionBtn submit />
      </Form>
    </PageWrapper>
  );
}

export default NewSkillPage;
