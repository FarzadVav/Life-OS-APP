"use client";

import { cn } from "cn";
import Link from "next/link";
import { ReactNode } from "react";
import { useMounted } from "@mantine/hooks";
import { createPortal, useFormStatus } from "react-dom";
import { CheckIcon, LoaderIcon, PlusIcon } from "lucide-react";

import { Button, ButtonProps } from "../../ui/Button/Button";
import { useLocale } from "../LocaleProvider/LocaleProvider";

type PageActionBtnProps = ButtonProps & {
  href?: string;
  submit?: boolean;
  icon?: ReactNode;
};

function PageActionBtn({
  href,
  submit,
  icon,
  children,
  disabled,
  className,
  variant = "primary",
  ...p
}: PageActionBtnProps) {
  const isMounted = useMounted();
  const { pending } = useFormStatus();
  const { t } = useLocale();

  const isDisabled = disabled || pending;

  const computedChildren = children || (submit ? t("common.submit") : null);

  if (!isMounted) {
    return <Button id="page-action-btn" className="hidden" />;
  }

  const leftIcon =
    icon !== undefined ? icon : !submit ? <PlusIcon /> : null;

  return createPortal(
    <>
      <Button
        id="page-action-btn"
        variant={variant}
        nativeButton={!href}
        disabled={isDisabled}
        type={submit ? "submit" : "button"}
        render={href ? <Link href={href} /> : undefined}
        className={cn("fixed bottom-21 left-1/2 -translate-x-1/2", className)}
        {...p}
      >
        {leftIcon}
        {computedChildren && <span>{computedChildren}</span>}
        {submit ? <CheckIcon /> : null}

        {pending && (
          <span className="absolute inset-0 flex items-center justify-center rounded-component bg-foreground text-background">
            <LoaderIcon className="animate-spin" />
          </span>
        )}
      </Button>
    </>,
    document.body,
  );
}

export default PageActionBtn;
export type { PageActionBtnProps };
