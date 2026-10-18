import crypto from 'node:crypto';

/**
 * Hashes a plain-text password using Node.js crypto scrypt.
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

/**
 * Verifies a plain-text password against a stored password.
 * Supports both hashed passwords (salt:hash) and plain text (for initial seed data).
 */
export function verifyPassword(password: string, stored: string): boolean {
  if (!stored) {
    return false;
  }

  // Fallback for plain-text seed credentials (e.g. 'password123')
  if (!stored.includes(':')) {
    return password === stored;
  }

  const [salt, key] = stored.split(':');
  if (!salt || !key) {
    return false;
  }

  try {
    const keyBuffer = Buffer.from(key, 'hex');
    const derivedKey = crypto.scryptSync(password, salt, 64);
    return crypto.timingSafeEqual(keyBuffer, derivedKey);
  } catch {
    return false;
  }
}
