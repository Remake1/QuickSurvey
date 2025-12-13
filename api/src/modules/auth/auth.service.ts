import type { PrismaClient } from '../../generated/prisma/client.ts';
import type { RegisterDto, LoginDto, UserResponse } from '@quicksurvey/shared';
import { password } from '../../lib/password.ts';

export const authService = {
    /**
     * Register a new user
     */
    async register(data: RegisterDto, prisma: PrismaClient): Promise<UserResponse> {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        // Hash password
        const hashedPassword = await password.hash(data.password);

        // Create user
        const user = await prisma.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                name: data.name ?? null,
            },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
            },
        });

        return user;
    },

    /**
     * Login a user
     */
    async login(data: LoginDto, prisma: PrismaClient): Promise<UserResponse> {
        // Find user
        const user = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (!user) {
            throw new Error('Invalid email or password');
        }

        // Verify password
        const isValid = await password.verify(data.password, user.password);
        if (!isValid) {
            throw new Error('Invalid email or password');
        }

        return {
            id: user.id,
            email: user.email,
            name: user.name,
            createdAt: user.createdAt,
        };
    },

    /**
     * Get current user by ID
     */
    async getCurrentUser(userId: string, prisma: PrismaClient): Promise<UserResponse | null> {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
            },
        });

        return user;
    },
};
