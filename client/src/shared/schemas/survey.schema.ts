import { z } from 'zod';
import { QuestionSchema } from './question.schema.ts';

// Survey status enum
export const SurveyStatusSchema = z.enum(['DRAFT', 'PUBLISHED']);

// Create survey input schema
export const CreateSurveySchema = z.object({
    title: z.string().min(1, 'Survey title is required').max(255, 'Title must be 255 characters or less'),
    description: z.string().max(2000, 'Description must be 2000 characters or less').optional(),
    questions: z.array(QuestionSchema).min(1, 'At least one question is required'),
});

// Update survey input schema (partial, for future use)
export const UpdateSurveySchema = z.object({
    title: z.string().min(1, 'Survey title is required').max(255).optional(),
    description: z.string().max(2000).optional(),
    questions: z.array(QuestionSchema).min(1).optional(),
    status: SurveyStatusSchema.optional(),
});

// Survey owner schema (minimal user info)
export const SurveyOwnerSchema = z.object({
    id: z.string(),
    name: z.string().nullable(),
    email: z.email(),
});

// Full survey response schema
export const SurveyResponseSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().nullable(),
    questions: z.array(QuestionSchema),
    status: SurveyStatusSchema,
    owner: SurveyOwnerSchema,
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

// Survey list item (lighter weight)
export const SurveyListItemSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().nullable(),
    status: SurveyStatusSchema,
    questionCount: z.number().int(),
    createdAt: z.coerce.date(),
});

// Inferred types
export type SurveyStatus = z.infer<typeof SurveyStatusSchema>;
export type CreateSurveyDto = z.infer<typeof CreateSurveySchema>;
export type UpdateSurveyDto = z.infer<typeof UpdateSurveySchema>;
export type SurveyOwner = z.infer<typeof SurveyOwnerSchema>;
export type SurveyResponse = z.infer<typeof SurveyResponseSchema>;
export type SurveyListItem = z.infer<typeof SurveyListItemSchema>;
