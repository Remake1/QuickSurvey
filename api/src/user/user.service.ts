import { Injectable } from '@nestjs/common';
import type { User } from '@prisma/client';
import * as argon2 from 'argon2';
import { PrismaService } from '../shared/prisma/prisma.service';
import type { CreateUserInput, SafeUser } from './models/user.types';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}

    /**
     * Find user by email
     */
    async findByEmail(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    /**
     * Find user by ID
     */
    async findById(id: number): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { id },
        });
    }

    /**
     * Create a new user with hashed password
     */
    async create(input: CreateUserInput): Promise<SafeUser> {
        const hashedPassword = await argon2.hash(input.password);
        const user = await this.prisma.user.create({
            data: {
                email: input.email,
                name: input.name,
                password: hashedPassword,
            },
        });
        return this.excludePassword(user);
    }

    /**
     * Remove password from user object
     */
    excludePassword(user: User): SafeUser {
        const { password: _, ...safeUser } = user;
        return safeUser;
    }
}
