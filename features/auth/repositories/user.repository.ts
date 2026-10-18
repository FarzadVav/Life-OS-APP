import { EntityRepository } from '@mikro-orm/sqlite';
import type { User } from '@/db/entities';
import { verifyPassword, hashPassword } from '../lib/passwords';
import type { CreateUserData, UpdateUserData } from '../lib/definitions';

export type { CreateUserData, UpdateUserData };

export class UserRepository extends EntityRepository<User> {
  async findById(id: number): Promise<User | null> {
    return this.findOne({ id });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.findOne({ username });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.findOne({ email });
  }

  /**
   * Verifies username and password using the password verification utility.
   * Returns user if credentials match, otherwise null.
   */
  async verifyCredentials(username: string, password: string): Promise<User | null> {
    const cleanUsername = username.trim();
    const user = await this.findOne({ username: cleanUsername });
    if (!user || !user.password) {
      return null;
    }

    const isValid = verifyPassword(password, user.password);
    if (!isValid) {
      return null;
    }

    return user;
  }

  /**
   * Attempts to authenticate an existing user or creates a new user if not found.
   * - If user exists and password matches: returns { user, status: 'LOGGED_IN' }
   * - If user exists and password fails: returns { user: null, status: 'INVALID_CREDENTIALS' }
   * - If user does not exist: creates a new user and returns { user, status: 'CREATED' }
   */
  async loginOrCreate(
    username: string,
    password: string,
    options?: { locale?: string; colorScheme?: string },
  ): Promise<{
    user: User | null;
    status: 'LOGGED_IN' | 'CREATED' | 'INVALID_CREDENTIALS';
  }> {
    const cleanUsername = username.trim();
    const existingUser = await this.findOne({ username: cleanUsername });

    if (existingUser) {
      if (!existingUser.password) {
        return { user: null, status: 'INVALID_CREDENTIALS' };
      }

      const isValid = verifyPassword(password, existingUser.password);
      if (!isValid) {
        return { user: null, status: 'INVALID_CREDENTIALS' };
      }

      return { user: existingUser, status: 'LOGGED_IN' };
    }

    try {
      const hashedPassword = hashPassword(password);
      const newUser = this.create({
        username: cleanUsername,
        password: hashedPassword,
        locale: options?.locale ?? 'fa',
        colorScheme: options?.colorScheme ?? 'system',
      });
      await this.em.flush();
      return { user: newUser, status: 'CREATED' };
    } catch {
      return { user: null, status: 'INVALID_CREDENTIALS' };
    }
  }

  async createUser(data: CreateUserData): Promise<User> {
    const user = this.create({
      username: data.username.trim(),
      password: data.password,
      name: data.name?.trim(),
      email: data.email?.trim().toLowerCase(),
      locale: data.locale ?? 'fa',
      colorScheme: data.colorScheme ?? 'system',
    });
    await this.em.flush();
    return user;
  }

  async updateUser(id: number, data: UpdateUserData): Promise<User | null> {
    const user = await this.findOne({ id });
    if (!user) {
      return null;
    }

    this.assign(user, {
      ...(data.name !== undefined ? { name: data.name.trim() } : {}),
      ...(data.email !== undefined ? { email: data.email.trim().toLowerCase() } : {}),
      ...(data.locale !== undefined ? { locale: data.locale } : {}),
      ...(data.colorScheme !== undefined ? { colorScheme: data.colorScheme } : {}),
      ...(data.password !== undefined ? { password: data.password } : {}),
    });

    await this.em.flush();
    return user;
  }

  async updatePreferences(
    id: number,
    preferences: { locale?: string; colorScheme?: string },
  ): Promise<User | null> {
    const user = await this.findOne({ id });
    if (!user) {
      return null;
    }

    if (preferences.locale) {
      user.locale = preferences.locale;
    }
    if (preferences.colorScheme) {
      user.colorScheme = preferences.colorScheme;
    }

    await this.em.flush();
    return user;
  }

  async deleteUser(id: number): Promise<boolean> {
    const user = await this.findOne({ id });
    if (!user) {
      return false;
    }

    this.em.remove(user);
    await this.em.flush();
    return true;
  }
}
