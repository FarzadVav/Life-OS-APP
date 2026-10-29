/**
 * Errors that carry an authorization verdict. Kept free of Next.js and session
 * imports so the repository layer can throw them without becoming request-aware.
 */

export class AuthenticationError extends Error {
  readonly code = 'UNAUTHENTICATED';

  constructor(message = 'Authentication required.') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

/**
 * Raised when a client-supplied reference id (e.g. lifeAreaId) does not belong to
 * the acting user. Distinct from owning the target row, which stays a "not found".
 */
export class ForbiddenReferenceError extends Error {
  readonly code = 'FORBIDDEN_REFERENCE';

  constructor(
    readonly field: string,
    readonly id: number,
    message?: string,
  ) {
    super(message ?? `You are not authorized to reference ${field} ${id}.`);
    this.name = 'ForbiddenReferenceError';
  }
}

/**
 * Raised when a client assigns a reference that exists and is owned but is
 * archived, i.e. inactive life areas may be kept on existing records yet never
 * chosen for a new one.
 */
export class InactiveReferenceError extends Error {
  readonly code = 'INACTIVE_REFERENCE';

  constructor(
    readonly field: string,
    readonly id: number,
    message?: string,
  ) {
    super(message ?? `${field} ${id} is not active.`);
    this.name = 'InactiveReferenceError';
  }
}
