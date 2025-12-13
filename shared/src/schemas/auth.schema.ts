import { z } from 'zod';

// Registration schema
export const RegisterSchema = z.object({
    email: z.email('Invalid email format'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    name: z.string().min(2, 'Name must be at least 2 characters').max(24, 'Name must be at most 24 characters').optional(),
});

// Login schema
export const LoginSchema = z.object({
    email: z.email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
});

// User response schema (excludes password)
export const UserResponseSchema = z.object({
    id: z.string(),
    email: z.email(),
    name: z.string().nullable(),
    createdAt: z.coerce.date(),
});

// Error response schema
export const ErrorResponseSchema = z.object({
    error: z.string(),
});

// Success message schema
export const SuccessMessageSchema = z.object({
    message: z.string(),
});

// Inferred types
export type RegisterDto = z.infer<typeof RegisterSchema>;
export type LoginDto = z.infer<typeof LoginSchema>;
export type UserResponse = z.infer<typeof UserResponseSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
export type SuccessMessage = z.infer<typeof SuccessMessageSchema>;
