"use client";

import { cn } from "cn";
import { ComponentProps } from "react";
import { Button as BaseUIButton } from "@base-ui/react";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  [
    "relative",
    "inline-flex",
    "h-10",
    "shrink-0",
    "items-center",
    "justify-center",
    "gap-1.5",
    "rounded-full",
    "px-3",
    "text-sm",
    "whitespace-nowrap",
    "transition-all",
    "outline-none",
    "select-none",
    "disabled:pointer-events-none",
    "disabled:opacity-50",
    "focus-visible:ring-2",
    "focus-visible:ring-offset-2",
    "focus-visible:ring-offset-background",
    "active:blur-[1px]",
    "[&_svg]:size-5",
  ],
  {
    variants: {
      variant: {
        primary: ["bg-foreground", "text-background", "hover:bg-foreground/90"],

        ghost: ["hover:bg-foreground/5"],

        card: ["bg-card", "hover:bg-card/90"],
      },

      square: {
        true: "w-10 px-0",
        false: "",
      },
    },

    defaultVariants: {
      variant: "primary",
      square: false,
    },
  },
);

type ButtonProps = ComponentProps<typeof BaseUIButton> &
  VariantProps<typeof buttonVariants>;

function Button({
  square,
  variant,
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <BaseUIButton
      type={type}
      className={cn(
        buttonVariants({
          variant,
          square,
        }),
        className,
      )}
      {...props}
    />
  );
}

export { Button, buttonVariants };
export type { ButtonProps };
