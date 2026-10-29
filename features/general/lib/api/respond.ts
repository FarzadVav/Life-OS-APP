import { NextResponse } from 'next/server';

import { AuthenticationError, ForbiddenReferenceError, InactiveReferenceError } from '../errors';

/**
 * Maps an authorization error to its HTTP response, or returns null when the
 * error belongs to the caller's normal handling.
 */
export function authzResponse(error: unknown): NextResponse | null {
  if (error instanceof AuthenticationError) {
    return NextResponse.json(
      { message: 'Unauthenticated' },
      { status: 401, headers: { 'Cache-Control': 'no-store, max-age=0' } },
    );
  }

  if (error instanceof ForbiddenReferenceError) {
    return NextResponse.json(
      {
        message: `Invalid ${error.field}`,
        errors: { [error.field]: ['This value is not available to you.'] },
      },
      { status: 403 },
    );
  }

  if (error instanceof InactiveReferenceError) {
    return NextResponse.json(
      {
        message: `Inactive ${error.field}`,
        errors: { [error.field]: ['This life area is not active.'] },
      },
      { status: 400 },
    );
  }

  return null;
}
