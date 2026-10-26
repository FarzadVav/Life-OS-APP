import { LucideIcon } from "lucide-react";

/**
 * State returned by form-driven mutations (delete, toggle, record).
 * Doubles as the `useActionState` initial state, hence the `undefined` member.
 */
export type ActionResult = {
  success: boolean;
  error?: string;
} | undefined;

export type NavigationLink = {
  href: string;
  Icon: LucideIcon;
  matchPathname: string;
};
