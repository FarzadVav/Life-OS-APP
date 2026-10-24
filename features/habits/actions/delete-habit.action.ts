"use client";

import { useActionState } from "react";

import { deleteHabitMutation } from "../mutations";
import type { ActionResult } from "@/features/general/lib/types";

/** Delete a habit via its server mutation, then run `onDeleted` when it succeeds. */
export function useDeleteHabitAction(onDeleted?: () => void) {
  const [state, action, isPending] = useActionState(
    async (prevState: ActionResult, formData: FormData) => {
      const result = await deleteHabitMutation(prevState, formData);

      if (result?.success) onDeleted?.();

      return result;
    },
    undefined,
  );

  return { state, action, isPending };
}
