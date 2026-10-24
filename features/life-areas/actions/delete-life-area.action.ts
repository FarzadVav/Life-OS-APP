"use client";

import { useActionState } from "react";

import { deleteLifeAreaMutation } from "../mutations";
import type { ActionResult } from "@/features/general/lib/types";

/** Delete a life area via its server mutation, then run `onDeleted` when it succeeds. */
export function useDeleteLifeAreaAction(onDeleted?: () => void) {
  const [state, action, isPending] = useActionState(
    async (prevState: ActionResult, formData: FormData) => {
      const result = await deleteLifeAreaMutation(prevState, formData);

      if (result?.success) onDeleted?.();

      return result;
    },
    undefined,
  );

  return { state, action, isPending };
}
