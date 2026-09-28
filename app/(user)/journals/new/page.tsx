"use client";

import { Field, Form, Select } from "@base-ui/react";
import { CheckIcon, ChevronDownIcon } from "lucide-react";

import { NextPageProps } from "@/features/general/lib/types";
import { JOURNAL_TYPES } from "@/features/journals/constants";
import TopBar from "@/features/general/components/static/TopBar/TopBar";
import CreateBtn from "@/features/general/components/module/CreateBtn/CreateBtn";
import PageWrapper from "@/features/general/components/static/PageWrapper/PageWrapper";

const SELECT_JOURNAL_TYPES = Object.keys(JOURNAL_TYPES).map((item) => ({
  label: item,
  value: item,
}));

async function NewJournalPage({ searchParams }: NextPageProps) {
  const sp = await searchParams;

  const type = sp.type || "Journal";

  return (
    <PageWrapper>
      <TopBar>
        <TopBar.Title asTitle>New {type}</TopBar.Title>
        <TopBar.Btn backIcon href="/journals" position="left" />
      </TopBar>

      <Form
        aria-label="Create new journal"
        className={"space-y-6"}
        action={async () => {
          return await new Promise((resolveInner) => {
            setTimeout(resolveInner, 5_000);
          });
        }}
      >
        <Field.Root name="title">
          <Field.Label className={"block font-bold"}>Title</Field.Label>
          <Field.Control
            required
            minLength={3}
            defaultValue=""
            pattern=".*[A-Za-z].*"
            placeholder="Title..."
            className={"border px-3 h-10 w-full rounded-md"}
          />
          <Field.Error className={"sub-text text-red-400 mt-0.5"} />
        </Field.Root>

        <Field.Root name="content">
          <Field.Label className={"block font-bold"}>Content</Field.Label>
          <Field.Control
            required
            minLength={3}
            defaultValue=""
            render={<textarea />}
            pattern=".*[A-Za-z].*"
            placeholder="Content..."
            className={"border px-3 py-1.5 h-32 w-full rounded-md"}
          />
          <Field.Error className={"sub-text text-red-400 mt-0.5"} />
        </Field.Root>

        <Field.Root name="serverType">
          <Select.Root
            required
            items={SELECT_JOURNAL_TYPES}
            defaultValue={type || SELECT_JOURNAL_TYPES[0].value}
          >
            <div className="w-full space-y-1">
              <Select.Label
                className={
                  "cursor-default block font-bold text-neutral-950 dark:text-white"
                }
              >
                Select Type
              </Select.Label>
              <Select.Trigger className="w-4/5 flex h-8 min-w-40 cursor-default items-center justify-between gap-3 border border-neutral-950 bg-white pl-2 pr-1 text-sm font-normal text-neutral-950 select-none hover:not-data-disabled:bg-neutral-100 active:not-data-disabled:bg-neutral-200 data-disabled:border-neutral-500 data-disabled:text-neutral-500 data-pressed:bg-neutral-100 focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-neutral-950 dark:focus-visible:outline-white dark:border-white dark:bg-neutral-950 dark:text-white dark:hover:not-data-disabled:bg-neutral-800 dark:active:not-data-disabled:bg-neutral-700 dark:data-disabled:border-neutral-400 dark:data-disabled:text-neutral-400 dark:data-pressed:bg-neutral-800">
                <Select.Value
                  className={
                    "data-placeholder:text-neutral-500 dark:data-placeholder:text-neutral-400"
                  }
                />
                <Select.Icon>
                  <ChevronDownIcon />
                </Select.Icon>
              </Select.Trigger>
            </div>
            <Select.Portal>
              <Select.Positioner className={"outline-none select-none z-10"}>
                <Select.Popup
                  className={
                    "group min-w-(--anchor-width) origin-(--transform-origin) border border-neutral-950 bg-white bg-clip-padding text-neutral-950 shadow-[0.25rem_0.25rem_0] shadow-black/12 transition-[scale,opacity] duration-100 ease-out data-[side=none]:min-w-[calc(var(--anchor-width)+1.75rem)] data-[side=none]:translate-y-px data-ending-style:scale-[0.98] data-ending-style:opacity-0 data-[side=none]:data-ending-style:transition-none data-starting-style:scale-[0.98] data-starting-style:opacity-0 data-[side=none]:data-starting-style:scale-100 data-[side=none]:data-starting-style:opacity-100 data-[side=none]:data-starting-style:transition-none dark:border-white dark:bg-neutral-950 dark:text-white dark:shadow-none"
                  }
                >
                  <Select.ScrollUpArrow
                    className={
                      "top-0 z-1 flex h-4 w-full cursor-default items-center justify-center bg-white text-center text-xs before:absolute data-[side=none]:before:-top-full before:left-0 before:h-full before:w-full before:content-[''] dark:bg-neutral-950"
                    }
                  />
                  <Select.List
                    className={
                      "relative max-h-(--available-height) overflow-y-auto py-1 scroll-py-6"
                    }
                  >
                    {SELECT_JOURNAL_TYPES.map(({ label, value }) => {
                      return (
                        <Select.Item
                          key={value}
                          value={value}
                          className={
                            "grid cursor-default grid-cols-[1rem_1fr] items-center gap-2 py-1.5 pr-4 pl-2.5 text-sm outline-none select-none group-data-[side=none]:pr-12 data-highlighted:bg-neutral-950 data-highlighted:text-white dark:data-highlighted:bg-white dark:data-highlighted:text-neutral-950"
                          }
                        >
                          <Select.ItemIndicator className={"col-start-1"}>
                            <CheckIcon />
                          </Select.ItemIndicator>
                          <Select.ItemText className={"col-start-2"}>
                            {label}
                          </Select.ItemText>
                        </Select.Item>
                      );
                    })}
                  </Select.List>
                  <Select.ScrollDownArrow
                    className={
                      "bottom-0 z-1 flex h-4 w-full cursor-default items-center justify-center bg-white text-center text-xs before:absolute before:left-0 before:h-full before:w-full before:content-[''] data-[side=none]:before:-bottom-full dark:bg-neutral-950"
                    }
                  />
                </Select.Popup>
              </Select.Positioner>
            </Select.Portal>
          </Select.Root>
          <Field.Error />
        </Field.Root>

        <CreateBtn submit />
      </Form>
    </PageWrapper>
  );
}

export default NewJournalPage;
