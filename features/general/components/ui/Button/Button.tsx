"use client";

import { cn } from "cn";
import { Loader2 } from "lucide-react";
import { ComponentProps } from "react";
import { useFormStatus } from "react-dom";
import { Button as BaseUIButton } from "@base-ui/react";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  [
    "inline-flex",
    "h-10",
    "shrink-0",
    "items-center",
    "justify-center",
    "gap-2",
    "rounded-full",
    "px-4",
    "text-sm",
    "whitespace-nowrap",
    "transition-colors",
    "outline-none",
    "select-none",
    "disabled:pointer-events-none",
    "disabled:opacity-50",
    "focus-visible:ring-2",
    "focus-visible:ring-offset-2",
    "focus-visible:ring-offset-background",
    "transition-all",
    "active:blur-[1px]",
    "[&_svg]:size-5",
  ],
  {
    variants: {
      variant: {
        fill: "",
        soft: "",
        ghost: "",
      },

      color: {
        primary: "",
        foreground: "",
      },

      outline: {
        true: "border",
        false: "border-transparent",
      },

      square: {
        true: "w-10 px-0",
        false: "",
      },
    },

    compoundVariants: [
      // Primary
      {
        variant: "fill",
        color: "primary",
        outline: false,
        className: [
          "bg-primary",
          "text-primary-foreground",
          "hover:bg-primary/90",
        ],
      },
      {
        variant: "fill",
        color: "primary",
        outline: true,
        className: [
          "border-primary",
          "bg-primary",
          "text-primary-foreground",
          "hover:bg-primary/90",
        ],
      },

      {
        variant: "soft",
        color: "primary",
        outline: false,
        className: ["bg-primary/10", "text-primary", "hover:bg-primary/15"],
      },
      {
        variant: "soft",
        color: "primary",
        outline: true,
        className: [
          "border-primary/20",
          "bg-primary/10",
          "text-primary",
          "hover:bg-primary/15",
        ],
      },

      {
        variant: "ghost",
        color: "primary",
        outline: false,
        className: ["text-primary", "hover:bg-primary/5"],
      },
      {
        variant: "ghost",
        color: "primary",
        outline: true,
        className: ["border-primary/10", "text-primary", "hover:bg-primary/5"],
      },

      // Foreground
      {
        variant: "fill",
        color: "foreground",
        outline: false,
        className: [
          "bg-foreground",
          "text-background",
          "hover:bg-foreground/90",
        ],
      },
      {
        variant: "fill",
        color: "foreground",
        outline: true,
        className: [
          "border-foreground",
          "bg-foreground",
          "text-background",
          "hover:bg-foreground/90",
        ],
      },

      {
        variant: "soft",
        color: "foreground",
        outline: false,
        className: [
          "bg-foreground/10",
          "text-foreground",
          "hover:bg-foreground/15",
        ],
      },
      {
        variant: "soft",
        color: "foreground",
        outline: true,
        className: [
          "bg-foreground/10",
          "text-foreground",
          "border-foreground/20",
          "hover:bg-foreground/15",
        ],
      },

      {
        variant: "ghost",
        color: "foreground",
        outline: false,
        className: ["text-foreground", "hover:bg-foreground/5"],
      },
      {
        variant: "ghost",
        color: "foreground",
        outline: true,
        className: ["text-foreground", "hover:bg-foreground/5"],
      },
    ],

    defaultVariants: {
      variant: "fill",
      color: "primary",
      outline: false,
      square: false,
    },
  },
);

type ButtonProps = ComponentProps<typeof BaseUIButton> &
  VariantProps<typeof buttonVariants>;

function Button({
  className,
  variant,
  color,
  outline,
  square,
  disabled,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  const { pending } = useFormStatus();

  const isDisabled = disabled || pending;

  return (
    <BaseUIButton
      type={type}
      className={cn(
        buttonVariants({
          variant,
          color,
          outline,
          square,
        }),
        pending && "[&>*:not(.button-loader)]:invisible",
        className,
      )}
      disabled={isDisabled}
      aria-disabled={isDisabled || undefined}
      aria-busy={pending || undefined}
      {...props}
    >
      {children}

      {pending && (
        <Loader2
          aria-hidden="true"
          className="button-loader absolute size-4 animate-spin"
        />
      )}
    </BaseUIButton>
  );
}

export { Button, buttonVariants };
export type { ButtonProps };
