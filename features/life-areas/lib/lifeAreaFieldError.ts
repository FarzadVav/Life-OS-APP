import {
  ForbiddenReferenceError,
  InactiveReferenceError,
} from '@/features/general/lib/errors';

/**
 * Message for the lifeAreaId form field when a reference was refused, or null
 * when the error belongs to the caller's normal handling.
 */
export function lifeAreaFieldError(error: unknown): string | null {
  if (error instanceof ForbiddenReferenceError) {
    return 'This value is not available to you.';
  }

  if (error instanceof InactiveReferenceError) {
    return 'This life area is not active.';
  }

  return null;
}
