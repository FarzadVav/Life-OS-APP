import { cn } from "cn";
import Link from "next/link";
import { PlusIcon } from "lucide-react";

import { Button, ButtonProps } from "../../ui/Button/Button";

type CreateLinkBtn = ButtonProps & {
  href?: string;
  withPlusIcon?: boolean;
};

function CreateBtn({
  href,
  color,
  variant,
  children,
  className,
  withPlusIcon,
  ...p
}: CreateLinkBtn) {
  return (
    <Button
      id="create-btn"
      variant={variant || "soft"}
      color={color || "foreground"}
      render={href ? <Link href={href} /> : undefined}
      className={cn(
        "glass fixed bottom-25 left-1/2 -translate-x-1/2",
        className,
      )}
      {...p}
    >
      {withPlusIcon ? <PlusIcon /> : null}
      {withPlusIcon ? <span>{children}</span> : children}
    </Button>
  );
}

export default CreateBtn;
