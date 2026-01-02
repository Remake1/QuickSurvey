import type { PrismaClient } from '../../generated/prisma/client.ts';
import { CreateSurveySchema } from '@quicksurvey/shared';

// Flexible input type - Zod will validate and transform
interface SurveyCreateInput {
    title: string;
    description?: string | null;
    questions: unknown[];
}

export const surveyService = {
    /**
     * Create a new survey
     */
    async create(
        input: SurveyCreateInput,
        ownerId: string,
        prisma: PrismaClient
    ) {
        // Validate input with Zod schema
        const validated = CreateSurveySchema.parse(input);

        const survey = await prisma.survey.create({
            data: {
                title: validated.title,
                description: validated.description ?? null,
                questions: validated.questions as unknown as object,
                ownerId,
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                    },
                },
            },
        });

        return survey;
    },

    /**
     * Find survey by ID
     */
    async findById(id: string, prisma: PrismaClient) {
        const survey = await prisma.survey.findUnique({
            where: { id },
            include: {
                owner: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                    },
                },
            },
        });

        return survey;
    },

    /**
     * Find all survey by owner
     */
    async findByOwner(ownerId: string, prisma: PrismaClient) {
        const surveys = await prisma.survey.findMany({
            where: { ownerId },
            include: {
                owner: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return surveys;
    },

    /**
     * Update survey status (publish/unpublish)
     */
    async updateStatus(
        id: string,
        status: 'DRAFT' | 'PUBLISHED',
        ownerId: string,
        prisma: PrismaClient
    ) {
        // Verify ownership
        const existing = await prisma.survey.findUnique({
            where: { id },
        });

        if (!existing) {
            throw new Error('Survey not found');
        }

        if (existing.ownerId !== ownerId) {
            throw new Error('Not authorized to update this survey');
        }

        const survey = await prisma.survey.update({
            where: { id },
            data: { status },
            include: {
                owner: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                    },
                },
            },
        });

        return survey;
    },

    // ===== RESPONSE METHODS =====

    /**
     * Submit a response to a published survey
     */
    async submitResponse(
        input: {
            surveyId: string;
            answers: Array<{
                questionId: string;
                type: string;
                textValue?: string;
                choiceValue?: string;
                checkboxValues?: string[];
                dateValue?: string;
                scaleValue?: number;
            }>;
        },
        prisma: PrismaClient
    ) {
        // Fetch survey
        const survey = await prisma.survey.findUnique({
            where: { id: input.surveyId },
        });

        if (!survey) {
            throw new Error('Survey not found');
        }

        // Only allow responses to published surveys
        if (survey.status !== 'PUBLISHED') {
            throw new Error('Survey is not published');
        }

        // Get questions from survey
        const questions = survey.questions as Array<{
            id: string;
            title: string;
            required: boolean;
            type: string;
            options?: Array<{ id: string; text: string }>;
            min?: number;
            max?: number;
        }>;

        // Create a map of answers by questionId
        const answerMap = new Map(input.answers.map((a) => [a.questionId, a]));

        // Validate each question
        for (const question of questions) {
            const answer = answerMap.get(question.id);

            // Check required questions
            if (question.required && !answer) {
                throw new Error(`Question "${question.title}" is required`);
            }

            if (answer) {
                // Validate answer type matches question type
                if (answer.type !== question.type) {
                    throw new Error(
                        `Answer type mismatch for question "${question.title}"`
                    );
                }

                // Type-specific validation
                switch (question.type) {
                    case 'short_answer':
                    case 'paragraph':
                        if (
                            question.required &&
                            (!answer.textValue || answer.textValue.trim() === '')
                        ) {
                            throw new Error(
                                `Question "${question.title}" requires a text answer`
                            );
                        }
                        break;

                    case 'multiple_choice':
                    case 'dropdown':
                        if (answer.choiceValue) {
                            const validOption = question.options?.some(
                                (o) => o.id === answer.choiceValue
                            );
                            if (!validOption) {
                                throw new Error(
                                    `Invalid option selected for question "${question.title}"`
                                );
                            }
                        } else if (question.required) {
                            throw new Error(
                                `Question "${question.title}" requires a selection`
                            );
                        }
                        break;

                    case 'checkboxes':
                        if (answer.checkboxValues && answer.checkboxValues.length > 0) {
                            for (const optionId of answer.checkboxValues) {
                                const validOption = question.options?.some(
                                    (o) => o.id === optionId
                                );
                                if (!validOption) {
                                    throw new Error(
                                        `Invalid option selected for question "${question.title}"`
                                    );
                                }
                            }
                        } else if (question.required) {
                            throw new Error(
                                `Question "${question.title}" requires at least one selection`
                            );
                        }
                        break;

                    case 'date':
                        if (question.required && !answer.dateValue) {
                            throw new Error(
                                `Question "${question.title}" requires a date`
                            );
                        }
                        break;

                    case 'linear_scale':
                        if (answer.scaleValue != null) {
                            const min = question.min ?? 1;
                            const max = question.max ?? 5;
                            if (answer.scaleValue < min || answer.scaleValue > max) {
                                throw new Error(
                                    `Answer for "${question.title}" must be between ${min} and ${max}`
                                );
                            }
                        } else if (question.required) {
                            throw new Error(
                                `Question "${question.title}" requires a scale value`
                            );
                        }
                        break;
                }
            }
        }

        // Check for answers to non-existent questions
        for (const answer of input.answers) {
            const questionExists = questions.some((q) => q.id === answer.questionId);
            if (!questionExists) {
                throw new Error(`Answer provided for unknown question`);
            }
        }

        // Create the response
        const response = await prisma.surveyResponse.create({
            data: {
                surveyId: input.surveyId,
                answers: input.answers as unknown as object,
            },
        });

        return response;
    },

    /**
     * Get all responses for a survey (owner only)
     */
    async getResponses(
        surveyId: string,
        ownerId: string,
        prisma: PrismaClient
    ) {
        // Verify ownership
        const survey = await prisma.survey.findUnique({
            where: { id: surveyId },
        });

        if (!survey) {
            throw new Error('Survey not found');
        }

        if (survey.ownerId !== ownerId) {
            throw new Error('Not authorized to view responses for this survey');
        }

        const responses = await prisma.surveyResponse.findMany({
            where: { surveyId },
            orderBy: { createdAt: 'desc' },
        });

        return responses;
    },
};
