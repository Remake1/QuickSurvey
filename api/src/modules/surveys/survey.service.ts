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
     * Find all surveys by owner
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
};
