"use client";

import { useRouter } from "next/navigation";
import { ChevronLeftIcon } from "lucide-react";

import { cn } from "@/features/general/lib/utils";
import { Button, ButtonClickEvent, ButtonProps } from "../../ui/button";

type TopBarBackBtnProps = ButtonProps & {
  goBack?: boolean | string;
};

function TopBarBackBtn({
  goBack,
  onClick,
  variant,
  children,
  className,
  ...p
}: TopBarBackBtnProps) {
  const router = useRouter();

  const handleClick = (ev: ButtonClickEvent) => {
    if (typeof goBack === "boolean" && goBack) {
      router.back();

      return;
    }

    if (typeof goBack === "string" && goBack.trim().length) {
      router.push(goBack);

      return;
    }

    onClick?.(ev);
  };

  return (
    <Button
      onClick={handleClick}
      variant={variant || "ghost"}
      className={cn(
        "rounded-full size-11 absolute ltr:left-0.5 rtl:right-0.5 top-0.5",
        className,
      )}
      {...p}
    >
      {children || <ChevronLeftIcon className="rtl:-scale-x-100" />}
    </Button>
  );
}

export default TopBarBackBtn;
