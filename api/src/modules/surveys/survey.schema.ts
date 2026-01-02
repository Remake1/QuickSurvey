import SchemaBuilder from '@pothos/core';
import type { PrismaClient } from '../../generated/prisma/client.ts';
import type { AuthUser } from '../../middleware/auth.middleware.ts';

// GraphQL Context type
export interface GraphQLContext {
    prisma: PrismaClient;
    user: AuthUser | null;
}

// Question shape types
interface BaseQuestionShape {
    id: string;
    title: string;
    required: boolean;
    type: string;
}

interface TextQuestionShape extends BaseQuestionShape {
    type: 'short_answer' | 'paragraph';
}

interface OptionsQuestionShape extends BaseQuestionShape {
    type: 'multiple_choice' | 'checkboxes' | 'dropdown';
    options: { id: string; text: string }[];
}

interface DateQuestionShape extends BaseQuestionShape {
    type: 'date';
}

interface ScaleQuestionShape extends BaseQuestionShape {
    type: 'linear_scale';
    min: number;
    max: number;
    minLabel?: string;
    maxLabel?: string;
}

type QuestionShape = TextQuestionShape | OptionsQuestionShape | DateQuestionShape | ScaleQuestionShape;

interface SurveyOwnerShape {
    id: string;
    email: string;
    name: string | null;
}

interface SurveyShape {
    id: string;
    title: string;
    description: string | null;
    questions: unknown;
    status: 'DRAFT' | 'PUBLISHED';
    owner: SurveyOwnerShape;
    createdAt: Date;
    updatedAt: Date;
}

// Answer shape for response submissions
interface AnswerShape {
    questionId: string;
    type: string;
    textValue?: string;
    choiceValue?: string;
    checkboxValues?: string[];
    dateValue?: string;
    scaleValue?: number;
}

// Survey response shape
interface SurveyResponseShape {
    id: string;
    surveyId: string;
    answers: unknown;
    createdAt: Date;
}

// Initialize Pothos Schema Builder with type mappings
export const builder = new SchemaBuilder<{
    Context: GraphQLContext;
    Objects: {
        Option: { id: string; text: string };
        TextQuestion: TextQuestionShape;
        OptionsQuestion: OptionsQuestionShape;
        DateQuestion: DateQuestionShape;
        ScaleQuestion: ScaleQuestionShape;
        SurveyOwner: SurveyOwnerShape;
        Survey: SurveyShape;
        Answer: AnswerShape;
        SurveyResponse: SurveyResponseShape;
    };
    Interfaces: {
        Question: QuestionShape;
    };
    Scalars: {
        DateTime: {
            Input: Date;
            Output: Date;
        };
    };
}>({});


// Add DateTime scalar
builder.scalarType('DateTime', {
    serialize: (value) => value.toISOString(),
    parseValue: (value) => new Date(value as string),
});

// ===== ENUMS =====

export const QuestionTypeEnum = builder.enumType('QuestionType', {
    values: [
        'short_answer',
        'paragraph',
        'multiple_choice',
        'checkboxes',
        'dropdown',
        'date',
        'linear_scale',
    ] as const,
});

export const SurveyStatusEnum = builder.enumType('SurveyStatus', {
    values: ['DRAFT', 'PUBLISHED'] as const,
});

// ===== TYPES =====

// Option type for choice-based questions
builder.objectType('Option', {
    fields: (t) => ({
        id: t.exposeID('id'),
        text: t.exposeString('text'),
    }),
});

// Question interface
builder.interfaceType('Question', {
    fields: (t) => ({
        id: t.exposeID('id'),
        title: t.exposeString('title'),
        required: t.exposeBoolean('required'),
        type: t.field({
            type: QuestionTypeEnum,
            resolve: (parent) => parent.type as typeof QuestionTypeEnum.$inferType,
        }),
    }),
    resolveType: (question) => {
        switch (question.type) {
            case 'short_answer':
            case 'paragraph':
                return 'TextQuestion';
            case 'multiple_choice':
            case 'checkboxes':
            case 'dropdown':
                return 'OptionsQuestion';
            case 'date':
                return 'DateQuestion';
            case 'linear_scale':
                return 'ScaleQuestion';
            default:
                return 'TextQuestion';
        }
    },
});

// Text question (short_answer, paragraph)
builder.objectType('TextQuestion', {
    interfaces: ['Question'],
    fields: (t) => ({
        id: t.exposeID('id'),
        title: t.exposeString('title'),
        required: t.exposeBoolean('required'),
        type: t.field({
            type: QuestionTypeEnum,
            resolve: (parent) => parent.type as typeof QuestionTypeEnum.$inferType,
        }),
    }),
});

// Options question (multiple_choice, checkboxes, dropdown)
builder.objectType('OptionsQuestion', {
    interfaces: ['Question'],
    fields: (t) => ({
        id: t.exposeID('id'),
        title: t.exposeString('title'),
        required: t.exposeBoolean('required'),
        type: t.field({
            type: QuestionTypeEnum,
            resolve: (parent) => parent.type as typeof QuestionTypeEnum.$inferType,
        }),
        options: t.field({
            type: ['Option'],
            resolve: (parent) => parent.options,
        }),
    }),
});

// Date question
builder.objectType('DateQuestion', {
    interfaces: ['Question'],
    fields: (t) => ({
        id: t.exposeID('id'),
        title: t.exposeString('title'),
        required: t.exposeBoolean('required'),
        type: t.field({
            type: QuestionTypeEnum,
            resolve: (parent) => parent.type as typeof QuestionTypeEnum.$inferType,
        }),
    }),
});

// Scale question (linear_scale)
builder.objectType('ScaleQuestion', {
    interfaces: ['Question'],
    fields: (t) => ({
        id: t.exposeID('id'),
        title: t.exposeString('title'),
        required: t.exposeBoolean('required'),
        type: t.field({
            type: QuestionTypeEnum,
            resolve: (parent) => parent.type as typeof QuestionTypeEnum.$inferType,
        }),
        min: t.exposeInt('min'),
        max: t.exposeInt('max'),
        minLabel: t.exposeString('minLabel', { nullable: true }),
        maxLabel: t.exposeString('maxLabel', { nullable: true }),
    }),
});

// Survey owner type
builder.objectType('SurveyOwner', {
    fields: (t) => ({
        id: t.exposeID('id'),
        email: t.exposeString('email'),
        name: t.exposeString('name', { nullable: true }),
    }),
});

// Survey type
export const SurveyRef = builder.objectRef<SurveyShape>('Survey');

builder.objectType(SurveyRef, {
    fields: (t) => ({
        id: t.exposeID('id'),
        title: t.exposeString('title'),
        description: t.exposeString('description', { nullable: true }),
        questions: t.field({
            type: ['Question'],
            resolve: (parent) => {
                const q = parent.questions;
                return (Array.isArray(q) ? q : []) as QuestionShape[];
            },
        }),
        status: t.field({
            type: SurveyStatusEnum,
            resolve: (parent) => parent.status,
        }),
        owner: t.field({
            type: 'SurveyOwner',
            resolve: (parent) => parent.owner,
        }),
        createdAt: t.field({
            type: 'DateTime',
            resolve: (parent) => parent.createdAt,
        }),
        updatedAt: t.field({
            type: 'DateTime',
            resolve: (parent) => parent.updatedAt,
        }),
    }),
});

// ===== INPUT TYPES =====

export const OptionInput = builder.inputType('OptionInput', {
    fields: (t) => ({
        id: t.id({ required: false }),
        text: t.string({ required: true }),
    }),
});

export const QuestionInput = builder.inputType('QuestionInput', {
    fields: (t) => ({
        id: t.id({ required: false }),
        title: t.string({ required: true }),
        required: t.boolean({ required: false, defaultValue: false }),
        type: t.field({ type: QuestionTypeEnum, required: true }),
        // For options-based questions
        options: t.field({ type: [OptionInput], required: false }),
        // For linear_scale questions
        min: t.int({ required: false }),
        max: t.int({ required: false }),
        minLabel: t.string({ required: false }),
        maxLabel: t.string({ required: false }),
    }),
});

export const CreateSurveyInput = builder.inputType('CreateSurveyInput', {
    fields: (t) => ({
        title: t.string({ required: true }),
        description: t.string({ required: false }),
        questions: t.field({ type: [QuestionInput], required: true }),
    }),
});

// ===== RESPONSE TYPES =====

// Answer type (flattened for simplicity)
builder.objectType('Answer', {
    fields: (t) => ({
        questionId: t.exposeID('questionId'),
        type: t.field({
            type: QuestionTypeEnum,
            resolve: (parent: AnswerShape) => parent.type as typeof QuestionTypeEnum.$inferType,
        }),
        textValue: t.string({
            nullable: true,
            resolve: (parent: AnswerShape) => parent.textValue ?? null,
        }),
        choiceValue: t.string({
            nullable: true,
            resolve: (parent: AnswerShape) => parent.choiceValue ?? null,
        }),
        checkboxValues: t.stringList({
            nullable: true,
            resolve: (parent: AnswerShape) => parent.checkboxValues ?? null,
        }),
        dateValue: t.string({
            nullable: true,
            resolve: (parent: AnswerShape) => parent.dateValue ?? null,
        }),
        scaleValue: t.int({
            nullable: true,
            resolve: (parent: AnswerShape) => parent.scaleValue ?? null,
        }),
    }),
});

// Survey Response type
export const SurveyResponseRef = builder.objectRef<SurveyResponseShape>('SurveyResponse');

builder.objectType(SurveyResponseRef, {
    fields: (t) => ({
        id: t.exposeID('id'),
        surveyId: t.exposeID('surveyId'),
        answers: t.field({
            type: ['Answer'],
            resolve: (parent) => {
                const answers = parent.answers;
                return (Array.isArray(answers) ? answers : []) as AnswerShape[];
            },
        }),
        createdAt: t.field({
            type: 'DateTime',
            resolve: (parent) => parent.createdAt,
        }),
    }),
});

// ===== RESPONSE INPUT TYPES =====

export const AnswerInput = builder.inputType('AnswerInput', {
    fields: (t) => ({
        questionId: t.id({ required: true }),
        type: t.field({ type: QuestionTypeEnum, required: true }),
        textValue: t.string({ required: false }),
        choiceValue: t.string({ required: false }),
        checkboxValues: t.stringList({ required: false }),
        dateValue: t.string({ required: false }),
        scaleValue: t.int({ required: false }),
    }),
});

export const SubmitResponseInput = builder.inputType('SubmitResponseInput', {
    fields: (t) => ({
        surveyId: t.id({ required: true }),
        answers: t.field({ type: [AnswerInput], required: true }),
    }),
});
