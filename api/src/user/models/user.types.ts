import type { User } from '@prisma/client';

/**
 * User data without sensitive fields
 */
export type SafeUser = Omit<User, 'password'>;

/**
 * Input for creating a new user
 */
export interface CreateUserInput {
    readonly email: string;
    readonly name: string;
    readonly password: string;
}
