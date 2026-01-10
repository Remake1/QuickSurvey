import { describe, expect, it } from 'vitest';
import { createSurvey, fetchMySurveys, fetchSurveyResponses, publishSurvey, unpublishSurvey } from '../surveys.api.ts';
import type { CreateSurveyDto } from '@quicksurvey/shared/schemas/survey.schema.ts';

// MSW server is configured globally via src/test/setup.ts

describe('fetchMySurveys', () => {
    it('returns surveys with questionCount and Date createdAt', async () => {
        const surveys = await fetchMySurveys();

        expect(surveys.length).toBeGreaterThan(0);
        expect(surveys[0]).toHaveProperty('id');
        expect(surveys[0]).toHaveProperty('questionCount');
        expect(surveys[0].createdAt).toBeInstanceOf(Date);
    });

    it('throws when server responds with non-ok status', async () => {
        const originalFetch = globalThis.fetch;
        globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
            const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
            if (url.includes('/graphql')) {
                return new Response(null, { status: 500 });
            }
            return originalFetch(input, init);
        };

        try {
            await expect(fetchMySurveys()).rejects.toThrow('Failed to fetch surveys');
        } finally {
            globalThis.fetch = originalFetch;
        }
    });
});

describe('createSurvey', () => {
    it('returns id for a valid create survey input', async () => {
        const input: CreateSurveyDto = {
            title: 'New Survey',
            description: 'Desc',
            questions: [
                {
                    id: 'q_1',
                    type: 'short_answer',
                    title: 'What is your name?',
                    required: true,
                },
            ],
        };

        const result = await createSurvey(input);

        expect(result).toHaveProperty('id');
        expect(typeof result.id).toBe('string');
        expect(result.id.length).toBeGreaterThan(0);
    });

    it('throws when server returns GraphQL errors', async () => {
        const input = {
            title: '',
            description: null,
            questions: [],
        } as unknown as CreateSurveyDto;

        await expect(createSurvey(input)).rejects.toThrow('Title is required');
    });

    it('throws when server responds with non-ok status', async () => {
        const originalFetch = globalThis.fetch;
        globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
            const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
            if (url.includes('/graphql')) {
                return new Response(null, { status: 500 });
            }
            return originalFetch(input, init);
        };

        try {
            const input: CreateSurveyDto = {
                title: 'X',
                questions: [],
            };
            await expect(createSurvey(input)).rejects.toThrow('Failed to create survey');
        } finally {
            globalThis.fetch = originalFetch;
        }
    });
});

describe('publishSurvey', () => {
    it('resolves for existing survey id', async () => {
        await expect(publishSurvey('survey_1')).resolves.toBeUndefined();
    });

    it('throws for missing survey id', async () => {
        await expect(publishSurvey('missing_survey')).rejects.toThrow('Survey not found');
    });
});

describe('unpublishSurvey', () => {
    it('resolves for existing survey id', async () => {
        await expect(unpublishSurvey('survey_2')).resolves.toBeUndefined();
    });

    it('throws for missing survey id', async () => {
        await expect(unpublishSurvey('missing_survey')).rejects.toThrow('Survey not found');
    });
});

describe('fetchSurveyResponses', () => {
    it('returns responses with Date createdAt', async () => {
        const responses = await fetchSurveyResponses('survey_2');

        expect(responses.length).toBeGreaterThan(0);
        expect(responses[0].surveyId).toBe('survey_2');
        expect(responses[0].createdAt).toBeInstanceOf(Date);
        expect(Array.isArray(responses[0].answers)).toBe(true);
    });

    it('returns empty list when survey has no responses', async () => {
        const responses = await fetchSurveyResponses('survey_1');
        expect(responses).toEqual([]);
    });

    it('throws when server responds with non-ok status', async () => {
        const originalFetch = globalThis.fetch;
        globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
            const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
            if (url.includes('/graphql')) {
                return new Response(null, { status: 500 });
            }
            return originalFetch(input, init);
        };

        try {
            await expect(fetchSurveyResponses('survey_2')).rejects.toThrow('Failed to fetch survey responses');
        } finally {
            globalThis.fetch = originalFetch;
        }
    });
});
