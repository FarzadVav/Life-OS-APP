import { EntityRepository } from '@mikro-orm/sqlite';
import { User } from '@/db/entities';

export interface CreateUserData {
  username: string;
  password: string;
  name?: string;
  email?: string;
  locale?: string;
  colorScheme?: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  locale?: string;
  colorScheme?: string;
  password?: string;
}

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
