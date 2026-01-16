import { z } from 'zod';

// ===== ANSWER SCHEMAS =====

// Text-based answers (short_answer, paragraph)
export const TextAnswerSchema = z.object({
    questionId: z.string().uuid(),
    type: z.enum(['short_answer', 'paragraph']),
    value: z.string(),
});

// Single choice answers (multiple_choice, dropdown)
export const ChoiceAnswerSchema = z.object({
    questionId: z.string().uuid(),
    type: z.enum(['multiple_choice', 'dropdown']),
    value: z.string().uuid(), // selected option ID
});

// Multiple choice answers (checkboxes)
export const CheckboxAnswerSchema = z.object({
    questionId: z.string().uuid(),
    type: z.literal('checkboxes'),
    value: z.array(z.string().uuid()), // selected option IDs
});

// Date answer
export const DateAnswerSchema = z.object({
    questionId: z.string().uuid(),
    type: z.literal('date'),
    value: z.string(), // ISO 8601 date string
});

// Linear scale answer
export const ScaleAnswerSchema = z.object({
    questionId: z.string().uuid(),
    type: z.literal('linear_scale'),
    value: z.number().int(),
});

// Discriminated union of all answer types
export const AnswerSchema = z.discriminatedUnion('type', [
    TextAnswerSchema,
    ChoiceAnswerSchema,
    CheckboxAnswerSchema,
    DateAnswerSchema,
    ScaleAnswerSchema,
]);

// ===== SUBMIT RESPONSE SCHEMA =====

export const SubmitResponseSchema = z.object({
    surveyId: z.string(),
    answers: z.array(AnswerSchema),
});

// ===== RESPONSE OUTPUT SCHEMAS =====

export const SurveyResponseOutputSchema = z.object({
    id: z.string(),
    surveyId: z.string(),
    answers: z.array(AnswerSchema),
    createdAt: z.coerce.date(),
});

// ===== INFERRED TYPES =====

export type TextAnswer = z.infer<typeof TextAnswerSchema>;
export type ChoiceAnswer = z.infer<typeof ChoiceAnswerSchema>;
export type CheckboxAnswer = z.infer<typeof CheckboxAnswerSchema>;
export type DateAnswer = z.infer<typeof DateAnswerSchema>;
export type ScaleAnswer = z.infer<typeof ScaleAnswerSchema>;
export type Answer = z.infer<typeof AnswerSchema>;
export type SubmitResponseDto = z.infer<typeof SubmitResponseSchema>;
export type SurveyResponseOutput = z.infer<typeof SurveyResponseOutputSchema>;
