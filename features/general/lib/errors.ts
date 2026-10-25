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
