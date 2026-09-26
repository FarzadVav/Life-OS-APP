import { Field, Form, Switch } from "@base-ui/react";

import TopBar from "@/features/general/components/static/TopBar/TopBar";
import CreateBtn from "@/features/general/components/module/CreateBtn/CreateBtn";
import PageWrapper from "@/features/general/components/static/PageWrapper/PageWrapper";

function NewTodoPage() {
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

        <Field.Root name="restartOnFailure">
          <Field.Label className="flex items-center gap-3">
            Is locked?
            <Switch.Root className="flex h-5 w-9 shrink-0 border bg-card p-0.5 transition-colors duration-150 ease-[ease] border-foreground data-checked:bg-foreground focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-foreground rounded-full">
              <Switch.Thumb className="size-3.5 bg-foreground transition-[translate,background-color] duration-150 ease-[ease] data-checked:translate-x-4 data-checked:bg-background rounded-full" />
            </Switch.Root>
          </Field.Label>
        </Field.Root>

        <CreateBtn href="/actions/new">
          Submit
        </CreateBtn>
      </Form>
    </PageWrapper>
  );
}

export default NewTodoPage;
