"use client";

import { cn } from "cn";
import { ComponentProps } from "react";
import { Button as BaseUIButton } from "@base-ui/react";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  [
    "relative h-10 shrink-0 rounded-full px-4 [&_svg]:size-5",
    "inline-flex items-center justify-center gap-1.5",
    "whitespace-nowrap outline-none select-none",
    "disabled:pointer-events-none disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-foreground",
          "text-background",
          "hover:bg-foreground/90",
          "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        ],
        ghost: ["hover:bg-foreground/5", "focus-visible:ring-1 focus-visible:bg-foreground/5"],
        outline: ["border hover:bg-foreground/5"],
        card: ["bg-card [.bg-card_&]:bg-card-thick", "hover:bg-card/90 [.bg-card_&]:hover:bg-card-thick/90"],
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
