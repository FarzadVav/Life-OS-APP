"use client";

import { cn } from "cn";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon } from "lucide-react";

import { Button, ButtonProps } from "../../ui/Button/Button";

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
    backIcon?: boolean;
  };

function TopBarBtn({
  href,
  color,
  goBack,
  onClick,
  variant,
  children,
  backIcon,
  position,
  className,
  ...p
}: TopBarBackBtnProps) {
  const router = useRouter();

  const handleClick: ButtonProps["onClick"] = (ev) => {
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
      square
      onClick={handleClick}
      variant={variant || "ghost"}
      color={color || "foreground"}
      className={cn(
        "absolute",
        position === "left" ? "left-0" : "right-0",
        className,
      )}
      {...p}
    >
      {backIcon ? (
        <ChevronLeftIcon
          className={position === "left" ? "" : "-scale-x-100"}
        />
      ) : (
        children
      )}
    </Button>
  );
}

export default TopBarBtn;
