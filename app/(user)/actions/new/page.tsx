"use client";

import { useState } from "react";
import { DayPicker, enUS } from "@daypicker/persian";
import { Dialog, Field, Form, Switch } from "@base-ui/react";
import "@daypicker/react/style.css";

import TopBar from "@/features/general/components/static/TopBar/TopBar";
import { Button } from "@/features/general/components/ui/Button/Button";
import CreateBtn from "@/features/general/components/module/CreateBtn/CreateBtn";
import PageWrapper from "@/features/general/components/static/PageWrapper/PageWrapper";

function NewTodoPage() {
  const [selected, setSelected] = useState<Date>();

  return (
    <PageWrapper>
      <TopBar>
        <TopBar.Title asTitle>New Action</TopBar.Title>
        <TopBar.Btn backIcon href="/actions" position="left" />
      </TopBar>

      <Form aria-label="Create new action" className={"space-y-6"}>
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

        <Field.Root name="description">
          <Field.Label className={"block font-bold"}>Description</Field.Label>
          <Field.Control
            required
            minLength={3}
            defaultValue=""
            render={<textarea />}
            pattern=".*[A-Za-z].*"
            placeholder="Description..."
            className={"border px-3 py-1.5 h-32 w-full rounded-md"}
          />
          <Field.Error className={"sub-text text-red-400 mt-0.5"} />
        </Field.Root>

        <Dialog.Root>
          <Dialog.Trigger
            render={
              <Button
                outline
                color={"foreground"}
                variant={"ghost"}
                className={"rounded-md w-full justify-start"}
              >
                Deadline: Not set
              </Button>
            }
          />
          <Dialog.Portal>
            <Dialog.Backdrop className="fixed inset-0 min-h-dvh bg-background opacity-50 transition-opacity duration-500 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-[-webkit-touch-callout:none]:absolute" />
            <Dialog.Popup className="fixed top-1/2 left-1/2 w-96 rounded-component space-y-6 max-w-[calc(100vw-1.5rem)] -translate-x-1/2 -translate-y-1/2 bg-card p-3 transition-[translate,opacity] duration-300 data-ending-style:translate-y-full data-ending-style:opacity-0 data-starting-style:translate-y-full data-starting-style:opacity-0">
              <DayPicker
                animate
                dir="ltr"
                mode="single"
                locale={enUS}
                numerals="latn"
                className="w-full"
                selected={selected}
                onSelect={setSelected}
                footer={
                  selected
                    ? `Selected: ${selected.toLocaleDateString()}`
                    : "Pick a day"
                }
              />

              <Dialog.Close
                render={
                  <Button outline color={"foreground"} variant={"ghost"}>
                    Close
                  </Button>
                }
              />
            </Dialog.Popup>
          </Dialog.Portal>
        </Dialog.Root>

        <Field.Root name="restartOnFailure">
          <Field.Label className="flex items-center gap-3">
            Is locked?
            <Switch.Root className="flex h-5 w-9 shrink-0 border bg-card p-0.5 transition-colors duration-150 ease-[ease] border-foreground data-checked:bg-foreground focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-foreground rounded-full">
              <Switch.Thumb className="size-3.5 bg-foreground transition-[translate,background-color] duration-150 ease-[ease] data-checked:translate-x-4 data-checked:bg-background rounded-full" />
            </Switch.Root>
          </Field.Label>
        </Field.Root>

        <CreateBtn>Submit</CreateBtn>
      </Form>
    </PageWrapper>
  );
}

export default NewTodoPage;
