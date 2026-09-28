"use client";

import { cn } from "cn";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { useFormStatus } from "react-dom";

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

  const computedChildren = children || submit ? "Submit" : null;

  return (
    <Button
      id="create-btn"
      variant={"card"}
      nativeButton={!href}
      disabled={disabled || pending}
      type={submit ? "submit" : "button"}
      render={href ? <Link href={href} /> : undefined}
      className={cn(
        "glass fixed bottom-21 left-1/2 -translate-x-1/2 min-w-1/2",
        className,
      )}
      {...p}
    >
      {withPlusIcon ? <PlusIcon /> : null}
      {withPlusIcon ? <span>{computedChildren}</span> : computedChildren}
    </Button>
  );
}

export default CreateBtn;
