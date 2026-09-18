"use client";

import { cn } from "cn";
import { ViewTransition } from "react";
import { PlusIcon } from "lucide-react";
import { useScrollDirection } from "@mantine/hooks";

import { Button, ButtonProps } from "../../ui/Button";
import useLink from "@/features/general/hooks/useLink";

type CreateLinkProps = Omit<ButtonProps, "children"> & {
  name: string;
  href: string;
};

function CreateLink({ className, name, href, onClick, ...p }: CreateLinkProps) {
  const direction = useScrollDirection();

  const { navigate } = useLink();

  return (
    <>
      {["unknown", "up"].includes(direction) ? (
        <ViewTransition>
          <Button
            variant={"default"}
            onClick={(ev) => navigate(href, onClick, ev)}
            className={cn(
              "w-max max-w-full rounded-full fixed z-10 bottom-22 left-1/2 -translate-x-1/2",
              className,
            )}
            {...p}
          >
            <span>{name}</span>
            <PlusIcon />
          </Button>
        </ViewTransition>
      ) : null}
    </>
  );
}

export default CreateLink;
