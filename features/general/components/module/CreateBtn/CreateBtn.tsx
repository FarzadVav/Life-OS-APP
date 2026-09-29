"use client";

import { cn } from "cn";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { LoaderIcon, PlusIcon } from "lucide-react";

import { Button, ButtonProps } from "../../ui/Button/Button";

type CreateLinkBtn = ButtonProps & {
  href?: string;
  submit?: boolean;
  withPlusIcon?: boolean;
};

function CreateBtn({
  href,
  submit,
  children,
  disabled,
  className,
  withPlusIcon,
  ...p
}: CreateLinkBtn) {
  const { pending } = useFormStatus();

  const isDisabled = disabled || pending;

  const computedChildren = children || (submit ? "Submit" : null);

  return (
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
      {withPlusIcon ? <PlusIcon /> : null}
      {withPlusIcon ? <span>{computedChildren}</span> : computedChildren}

      {pending && (
        <span className="absolute inset-0 flex items-center justify-center rounded-full bg-foreground text-background">
          <LoaderIcon className="animate-spin" />
        </span>
      )}
    </Button>
  );
}

export default CreateBtn;
