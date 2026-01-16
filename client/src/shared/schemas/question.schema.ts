import { z } from 'zod';

// Base question fields shared by all question types
const BaseQuestionSchema = z.object({
    id: z.uuid().default(() => crypto.randomUUID()),
    title: z.string().min(1, 'Question title is required'),
    required: z.boolean().default(false),
});

// Text-based questions (short_answer, paragraph)
export const ShortAnswerQuestionSchema = BaseQuestionSchema.extend({
    type: z.literal('short_answer'),
});

export const ParagraphQuestionSchema = BaseQuestionSchema.extend({
    type: z.literal('paragraph'),
});

// Option for choice-based questions
export const OptionSchema = z.object({
    id: z.uuid().default(() => crypto.randomUUID()),
    text: z.string().min(1, 'Option text is required'),
});

// Options-based questions (multiple_choice, checkboxes, dropdown)
const OptionsBaseSchema = BaseQuestionSchema.extend({
    options: z.array(OptionSchema).min(1, 'At least one option is required'),
});

export const MultipleChoiceQuestionSchema = OptionsBaseSchema.extend({
    type: z.literal('multiple_choice'),
});

export const CheckboxesQuestionSchema = OptionsBaseSchema.extend({
    type: z.literal('checkboxes'),
});

export const DropdownQuestionSchema = OptionsBaseSchema.extend({
    type: z.literal('dropdown'),
});

// Date question
export const DateQuestionSchema = BaseQuestionSchema.extend({
    type: z.literal('date'),
});

// Linear scale question
export const LinearScaleQuestionSchema = BaseQuestionSchema.extend({
    type: z.literal('linear_scale'),
    min: z.number().int().min(0).max(1).default(1),
    max: z.number().int().min(2).max(10).default(5),
    minLabel: z.string().optional(),
    maxLabel: z.string().optional(),
});

// Discriminated union for all question types
export const QuestionSchema = z.discriminatedUnion('type', [
    ShortAnswerQuestionSchema,
    ParagraphQuestionSchema,
    MultipleChoiceQuestionSchema,
    CheckboxesQuestionSchema,
    DropdownQuestionSchema,
    DateQuestionSchema,
    LinearScaleQuestionSchema,
]);

// Question types enum
export const QuestionTypeSchema = z.enum([
    'short_answer',
    'paragraph',
    'multiple_choice',
    'checkboxes',
    'dropdown',
    'date',
    'linear_scale',
]);

// Inferred types
export type Question = z.infer<typeof QuestionSchema>;
export type QuestionType = z.infer<typeof QuestionTypeSchema>;
export type Option = z.infer<typeof OptionSchema>;

export type ShortAnswerQuestion = z.infer<typeof ShortAnswerQuestionSchema>;
export type ParagraphQuestion = z.infer<typeof ParagraphQuestionSchema>;
export type MultipleChoiceQuestion = z.infer<typeof MultipleChoiceQuestionSchema>;
export type CheckboxesQuestion = z.infer<typeof CheckboxesQuestionSchema>;
export type DropdownQuestion = z.infer<typeof DropdownQuestionSchema>;
export type DateQuestion = z.infer<typeof DateQuestionSchema>;
export type LinearScaleQuestion = z.infer<typeof LinearScaleQuestionSchema>;
