import { cn } from "cn";
import Link from "next/link";
import { ComponentProps } from "react";
import { PlusCircleIcon } from "lucide-react";

import { Button } from "../../ui/Button/Button";

function EmptyAlert({
  href,
  alert,
  className,
}: ComponentProps<"div"> & {
  alert: string;
  href?: string;
}) {
  return (
    <div
      className={cn(
        "w-full flex gap-3 p-6 rounded-container border-2 border-dashed flex-col justify-center items-center",
        className,
      )}>
      <p className="title">{alert}</p>
      {href ? (
        <Button
          square
          variant={"primary"}
          nativeButton={false}
          render={
            <Link href={href}>
              <PlusCircleIcon />
            </Link>
          }
        />
      ) : null}
    </div>
  );
}

export default EmptyAlert;
