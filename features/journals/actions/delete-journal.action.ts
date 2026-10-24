"use client";

import { useActionState } from "react";

import { deleteJournalMutation } from "../mutations";
import type { ActionResult } from "@/features/general/lib/types";

/** Delete a journal via its server mutation, then run `onDeleted` when it succeeds. */
export function useDeleteJournalAction(onDeleted?: () => void) {
  const [state, action, isPending] = useActionState(
    async (prevState: ActionResult, formData: FormData) => {
      const result = await deleteJournalMutation(prevState, formData);

      if (result?.success) onDeleted?.();

      return result;
    },
    undefined,
  );

  return { state, action, isPending };
}
