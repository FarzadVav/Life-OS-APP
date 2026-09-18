"use client";

import { cn } from "cn";
import { ViewTransition } from "react";
import { PlusIcon } from "lucide-react";
import { useScrollDirection } from "@mantine/hooks";

import { Button, ButtonProps } from "../../ui/Button";
import useLink from "@/features/general/hooks/useLink";
import { FeaturesAreas } from "@/features/general/lib/types";

type CreateFeatureLinkProps = Omit<ButtonProps, "children"> & {
  featureArea: FeaturesAreas;
};

function CreateFeatureLink({
  onClick,
  className,
  featureArea,
  ...p
}: CreateFeatureLinkProps) {
  const direction = useScrollDirection();

  const { navigate } = useLink();

  return (
    <>
      {["unknown", "up"].includes(direction) ? (
        <ViewTransition>
          <Button
            variant={"default"}
            onClick={(ev) => navigate(`/${featureArea}/new`, onClick, ev)}
            className={cn(
              "w-max max-w-full rounded-full fixed z-10 bottom-22 left-1/2 -translate-x-1/2",
              className,
            )}
            {...p}
          >
            <span className="capitalize">new {featureArea}</span>
            <PlusIcon />
          </Button>
        </ViewTransition>
      ) : null}
    </>
  );
}

export default CreateFeatureLink;
