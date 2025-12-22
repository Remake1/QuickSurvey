import { surveyService } from './survey.service.ts';
import {
    builder,
    SurveyRef,
    SurveyResponseRef,
    CreateSurveyInput,
    SubmitResponseInput,
    type GraphQLContext,
} from './survey.schema.ts';

// ===== QUERIES =====

builder.queryType({
    fields: (t) => ({
        survey: t.field({
            type: SurveyRef,
            nullable: true,
            args: {
                id: t.arg.id({ required: true }),
            },
            resolve: async (_parent, args, context: GraphQLContext) => {
                const survey = await surveyService.findById(
                    args.id as string,
                    context.prisma
                );

                if (!survey) {
                    return null;
                }

                // If draft, only owner can view
                if (survey.status === 'DRAFT') {
                    if (!context.user || context.user.id !== survey.ownerId) {
                        throw new Error('Not authorized to view this survey');
                    }
                }

                return survey;
            },
        }),

        mySurveys: t.field({
            type: [SurveyRef],
            resolve: async (_parent, _args, context: GraphQLContext) => {
                if (!context.user) {
                    throw new Error('Authentication required');
                }

                return surveyService.findByOwner(context.user.id, context.prisma);
            },
        }),

        surveyResponses: t.field({
            type: [SurveyResponseRef],
            args: {
                surveyId: t.arg.id({ required: true }),
            },
            resolve: async (_parent, args, context: GraphQLContext) => {
                if (!context.user) {
                    throw new Error('Authentication required');
                }

                return surveyService.getResponses(
                    args.surveyId as string,
                    context.user.id,
                    context.prisma
                );
            },
        }),
    }),
});

// ===== MUTATIONS =====

builder.mutationType({
    fields: (t) => ({
        createSurvey: t.field({
            type: SurveyRef,
            args: {
                input: t.arg({ type: CreateSurveyInput, required: true }),
            },
            resolve: async (_parent, args, context: GraphQLContext) => {
                if (!context.user) {
                    throw new Error('Authentication required');
                }

                // Transform input - Zod schema will handle ID generation and validation
                const input = {
                    title: args.input.title,
                    description: args.input.description ?? undefined,
                    questions: args.input.questions.map((q) => {
                        const base = {
                            id: q.id ?? undefined,
                            title: q.title,
                            required: q.required ?? false,
                            type: q.type,
                        };

                        // Add type-specific fields
                        if (q.options) {
                            return {
                                ...base,
                                options: q.options.map((o) => ({
                                    id: o.id ?? undefined,
                                    text: o.text,
                                })),
                            };
                        }

                        if (q.type === 'linear_scale') {
                            return {
                                ...base,
                                min: q.min ?? 1,
                                max: q.max ?? 5,
                                minLabel: q.minLabel ?? undefined,
                                maxLabel: q.maxLabel ?? undefined,
                            };
                        }

                        return base;
                    }),
                };

                return surveyService.create(input, context.user.id, context.prisma);
            },
        }),

        publishSurvey: t.field({
            type: SurveyRef,
            args: {
                id: t.arg.id({ required: true }),
            },
            resolve: async (_parent, args, context: GraphQLContext) => {
                if (!context.user) {
                    throw new Error('Authentication required');
                }

                return surveyService.updateStatus(
                    args.id as string,
                    'PUBLISHED',
                    context.user.id,
                    context.prisma
                );
            },
        }),

        unpublishSurvey: t.field({
            type: SurveyRef,
            args: {
                id: t.arg.id({ required: true }),
            },
            resolve: async (_parent, args, context: GraphQLContext) => {
                if (!context.user) {
                    throw new Error('Authentication required');
                }

                return surveyService.updateStatus(
                    args.id as string,
                    'DRAFT',
                    context.user.id,
                    context.prisma
                );
            },
        }),

        submitResponse: t.field({
            type: SurveyResponseRef,
            args: {
                input: t.arg({ type: SubmitResponseInput, required: true }),
            },
            resolve: async (_parent, args, context: GraphQLContext) => {
                // No authentication required - anyone can submit to published surveys
                const input = {
                    surveyId: args.input.surveyId as string,
                    answers: args.input.answers.map((a) => ({
                        questionId: a.questionId as string,
                        type: a.type,
                        textValue: a.textValue ?? undefined,
                        choiceValue: a.choiceValue ?? undefined,
                        checkboxValues: a.checkboxValues ?? undefined,
                        dateValue: a.dateValue ?? undefined,
                        scaleValue: a.scaleValue ?? undefined,
                    })),
                };

                return surveyService.submitResponse(input, context.prisma);
            },
        }),
    }),
});

// Build and export the schema
export const schema = builder.toSchema();
