"use client";

import { cn } from "cn";
import Link from "next/link";
import { useMounted } from "@mantine/hooks";
import { createPortal, useFormStatus } from "react-dom";
import { CheckIcon, LoaderIcon, PlusIcon } from "lucide-react";

import { Button, ButtonProps } from "../../ui/Button/Button";

type CreateLinkBtn = ButtonProps & {
  href?: string;
  submit?: boolean;
};

function CreateBtn({
  href,
  submit,
  children,
  disabled,
  className,
  ...p
}: CreateLinkBtn) {
  const isMounted = useMounted();
  const { pending } = useFormStatus();

  const isDisabled = disabled || pending;

  const computedChildren = children || (submit ? "Submit" : null);

  if (!isMounted) {
    return <Button id="create-btn" />;
  }

  return createPortal(
    <>
      <Button
        id="create-btn"
        variant={"primary"}
        nativeButton={!href}
        disabled={isDisabled}
        type={submit ? "submit" : "button"}
        render={href ? <Link href={href} /> : undefined}
        className={cn("fixed bottom-21 left-1/2 -translate-x-1/2", className)}
        {...p}
      >
        {submit ? null : <PlusIcon />}
        <span>{computedChildren}</span>
        {submit ? <CheckIcon /> : null}

        {pending && (
          <span className="absolute inset-0 flex items-center justify-center rounded-full bg-foreground text-background">
            <LoaderIcon className="animate-spin" />
          </span>
        )}
      </Button>
    </>,
    document.body,
  );
}

export default CreateBtn;
