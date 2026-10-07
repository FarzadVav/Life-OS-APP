"use client";

import { PropsWithChildren, ReactElement } from "react";
import { Dialog as BaseUIDialog } from "@base-ui/react";
import { cn } from "cn";

type LocalDialogProps = PropsWithChildren & {
  trigger?: ReactElement;
  nativeButton?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
};

function LocalDialog({
  children,
  trigger,
  nativeButton,
  open,
  onOpenChange,
  className,
}: LocalDialogProps) {
  return (
    <BaseUIDialog.Root open={open} onOpenChange={onOpenChange}>
      {trigger ? (
        <BaseUIDialog.Trigger render={trigger} nativeButton={nativeButton} />
      ) : null}

      <BaseUIDialog.Portal>
        <BaseUIDialog.Backdrop
          forceRender
          className={
            "fixed inset-0 min-h-dvh bg-background opacity-90 transition-opacity duration-300 data-ending-style:opacity-0 data-starting-style:opacity-0 data-nested:opacity-40 supports-[-webkit-touch-callout:none]:absolute z-big-overlay"
          }
        />

        <BaseUIDialog.Popup
          className={cn(
            "bg-card fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-max max-w-[calc(100vw-1.5rem)] max-h-[calc(100dvh-2rem)] flex flex-col gap-6 p-3 rounded-container scale-[calc(1-0.1*var(--nested-dialogs,0))] transition-all data-ending-style:translate-y-full data-ending-style:opacity-0 data-starting-style:translate-y-full data-starting-style:opacity-0 z-big-overlay",
            className,
          )}
        >
          {children}
        </BaseUIDialog.Popup>
      </BaseUIDialog.Portal>
    </BaseUIDialog.Root>
  );
}

const Dialog = Object.assign(LocalDialog, {
  Close: BaseUIDialog.Close,
  Title: BaseUIDialog.Title,
  Description: BaseUIDialog.Description,
  Trigger: BaseUIDialog.Trigger,
  Root: BaseUIDialog.Root,
  Portal: BaseUIDialog.Portal,
  Backdrop: BaseUIDialog.Backdrop,
  Popup: BaseUIDialog.Popup,
});

export default Dialog;
