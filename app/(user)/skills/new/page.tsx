"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Field, Form, Select } from "@base-ui/react";
import { CheckIcon, ChevronDownIcon } from "lucide-react";

import {
  skills,
  SKILL_TYPES,
  skillsMastery,
} from "@/features/skills/constants";
import { SkillType } from "@/features/skills/types";
import TopBar from "@/features/general/components/static/TopBar/TopBar";
import { Button } from "@/features/general/components/ui/Button/Button";
import CreateBtn from "@/features/general/components/module/CreateBtn/CreateBtn";
import PageWrapper from "@/features/general/components/static/PageWrapper/PageWrapper";

function TypeSelect({
  value,
  onChange,
}: {
  value: SkillType | null;
  onChange: (value: SkillType) => void;
}) {
  return (
    <Field.Root name="type">
      <Field.Label className="mb-1 font-bold">Type</Field.Label>

      <Select.Root
        name="type"
        items={SKILL_TYPES}
        value={value ?? undefined}
        onValueChange={(nextValue) => {
          if (nextValue) {
            onChange(nextValue as SkillType);
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
                {SKILL_TYPES.map((item) => (
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
  onChange: (value: number | null) => void;
}) {
  return (
    <Field.Root name="level">
      <Field.Label className="mb-1 font-bold">Mastery Level</Field.Label>

      <Select.Root
        name="level"
        items={skillsMastery}
        value={value === null ? null : String(value)}
        onValueChange={(nextValue) => {
          onChange(nextValue === null ? null : Number(nextValue));
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
              <Select.Value placeholder="Select mastery level" />

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
  const searchParams = useSearchParams();
  const editId = searchParams.get("editId");
  const isEditMode = Boolean(editId);

  const [title, setTitle] = useState("");
  const [type, setType] = useState<SkillType | null>("Playbooks");
  const [level, setLevel] = useState<number | null>(3);
  const [content, setContent] = useState("");

  useEffect(() => {
    if (!editId) {
      queueMicrotask(() => {
        setTitle("");
        setType("Playbooks");
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
      setType(skill.type);
      setLevel(skill.level);
      setContent(skill.content);
    });
  }, [editId]);

  return (
    <PageWrapper>
      <TopBar>
        <TopBar.Title asTitle>
          {isEditMode ? "Edit Skill" : "New Skill"}
        </TopBar.Title>
        <TopBar.Btn backIcon href="/skills" position="left" />
      </TopBar>

      <Form
        className="w-full space-y-6"
        aria-label={isEditMode ? "Edit skill" : "Create new skill"}
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
          <Field.Label className="block font-bold">Skill Title</Field.Label>

          <Field.Control
            required
            minLength={3}
            value={title}
            className="input"
            placeholder="e.g. High-Leverage Negotiation, React Compiler..."
            onChange={(event) => setTitle(event.target.value)}
          />

          <Field.Error className="sub-text mt-0.5 text-red-400" />
        </Field.Root>

        <TypeSelect value={type} onChange={setType} />

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
            placeholder="Write key steps, mental models, notes, or heuristics..."
            onChange={(event) => setContent(event.target.value)}
          />

          <Field.Error className="sub-text mt-0.5 text-red-400" />
        </Field.Root>

        <CreateBtn submit />
      </Form>
    </PageWrapper>
  );
}

export default NewSkillPage;
