import { z } from 'zod';

export const RegisterSchema = z.object({
    email: z.email('Invalid email format'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type RegisterDto = z.infer<typeof RegisterSchema>;
