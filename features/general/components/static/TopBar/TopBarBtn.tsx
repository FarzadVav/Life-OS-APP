"use client";

import { useRouter } from "next/navigation";
import { ChevronLeftIcon } from "lucide-react";

import { cn } from "@/features/general/lib/utils";
import { Button, ButtonClickEvent, ButtonProps } from "../../ui/button";

type WithGoBack = {
  goBack?: boolean;
  href?: never;
};

type WithHref = {
  goBack?: never;
  href?: string;
};

type MergedType = WithGoBack | WithHref;

type TopBarBackBtnProps = ButtonProps &
  MergedType & {
    position: "left" | "right";
  };

function TopBarBtn({
  href,
  goBack,
  onClick,
  variant,
  children,
  position,
  className,
  ...p
}: TopBarBackBtnProps) {
  const router = useRouter();

  const handleClick = (ev: ButtonClickEvent) => {
    if (goBack) {
      router.back();

      return;
    }

    if (href?.trim()) {
      router.push(href);

      return;
    }

    onClick?.(ev);
  };

  return (
    <Button
      onClick={handleClick}
      variant={variant || "ghost"}
      className={cn(
        "rounded-full size-11 absolute top-0.5",
        position === "left" ? "left-0.5" : "right-0.5",
        className,
      )}
      {...p}
    >
      {children ||
        (goBack ? (
          <ChevronLeftIcon
            className={position === "left" ? "" : "-scale-x-100"}
          />
        ) : null)}
    </Button>
  );
}

export default TopBarBtn;
