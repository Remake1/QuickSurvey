import { describe, expect, it } from 'vitest';
import { fetchPublicSurvey, submitSurveyResponse } from '../publicSurvey.api.ts';
import type { SubmitResponseDto } from '@quicksurvey/shared/schemas/response.schema.ts';

function installGraphqlBodyCapture() {
    const originalFetch = globalThis.fetch;
    let lastGraphqlBody: { query: string; variables?: unknown } | null = null;

    globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
        if (url.includes('/graphql')) {
            const body = init?.body;
            if (typeof body === 'string') {
                lastGraphqlBody = JSON.parse(body) as { query: string; variables?: unknown };
            }
        }
        return originalFetch(input, init);
    };

    return {
        getLastBody: () => {
            if (!lastGraphqlBody) throw new Error('No GraphQL request body captured');
            return lastGraphqlBody;
        },
        restore: () => {
            globalThis.fetch = originalFetch;
        },
    };
}

describe('fetchPublicSurvey', () => {
    it('returns survey for existing id', async () => {
        const survey = await fetchPublicSurvey('survey_2');

        expect(survey).toHaveProperty('id', 'survey_2');
        expect(survey).toHaveProperty('title');
        expect(survey).toHaveProperty('questions');
        expect(Array.isArray(survey.questions)).toBe(true);
        expect(survey.questions.length).toBeGreaterThan(0);
    });

    it('throws Survey not found when server returns null survey', async () => {
        await expect(fetchPublicSurvey('missing_survey')).rejects.toThrow('Survey not found');
    });

    it('throws when server responds with non-ok status', async () => {
        const originalFetch = globalThis.fetch;
        globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
            const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
            if (url.includes('/graphql')) return new Response(null, { status: 500 });
            return originalFetch(input, init);
        };

        try {
            await expect(fetchPublicSurvey('survey_2')).rejects.toThrow('Failed to fetch survey');
        } finally {
            globalThis.fetch = originalFetch;
        }
    });
});

describe('submitSurveyResponse', () => {
    it('submits response for published survey and returns response id', async () => {
        const input: SubmitResponseDto = {
            surveyId: 'survey_2',
            answers: [
                {
                    questionId: crypto.randomUUID(),
                    type: 'short_answer',
                    value: 'hello',
                },
            ],
        };

        const res = await submitSurveyResponse(input);
        expect(res).toHaveProperty('id');
        expect(typeof res.id).toBe('string');
    });

    it('transforms answers into GraphQL input fields by answer type', async () => {
        const capture = installGraphqlBodyCapture();

        try {
            const input: SubmitResponseDto = {
                surveyId: 'survey_2',
                answers: [
                    { questionId: crypto.randomUUID(), type: 'short_answer', value: 'a' },
                    { questionId: crypto.randomUUID(), type: 'paragraph', value: 'b' },
                    { questionId: crypto.randomUUID(), type: 'multiple_choice', value: crypto.randomUUID() },
                    { questionId: crypto.randomUUID(), type: 'dropdown', value: crypto.randomUUID() },
                    { questionId: crypto.randomUUID(), type: 'checkboxes', value: [crypto.randomUUID()] },
                    { questionId: crypto.randomUUID(), type: 'date', value: '2026-01-01' },
                    { questionId: crypto.randomUUID(), type: 'linear_scale', value: 3 },
                ],
            };

            const res = await submitSurveyResponse(input);
            expect(res).toHaveProperty('id');

            const body = capture.getLastBody();
            const vars = (body.variables ?? {}) as { input?: { surveyId?: string; answers?: unknown[] } };

            expect(vars.input?.surveyId).toBe('survey_2');
            expect(Array.isArray(vars.input?.answers)).toBe(true);

            const answers = (vars.input?.answers ?? []) as unknown[];
            expect(answers).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ type: 'short_answer', textValue: 'a' }),
                    expect.objectContaining({ type: 'paragraph', textValue: 'b' }),
                    expect.objectContaining({ type: 'multiple_choice', choiceValue: expect.any(String) }),
                    expect.objectContaining({ type: 'dropdown', choiceValue: expect.any(String) }),
                    expect.objectContaining({ type: 'checkboxes', checkboxValues: expect.any(Array) }),
                    expect.objectContaining({ type: 'date', dateValue: '2026-01-01' }),
                    expect.objectContaining({ type: 'linear_scale', scaleValue: 3 }),
                ])
            );
        } finally {
            capture.restore();
        }
    });

    it('throws when submitting response to draft survey', async () => {
        const input: SubmitResponseDto = {
            surveyId: 'survey_1',
            answers: [
                {
                    questionId: crypto.randomUUID(),
                    type: 'short_answer',
                    value: 'hello',
                },
            ],
        };

        await expect(submitSurveyResponse(input)).rejects.toThrow('Survey is not published');
    });

    it('throws when server responds with non-ok status', async () => {
        const originalFetch = globalThis.fetch;
        globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
            const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
            if (url.includes('/graphql')) return new Response(null, { status: 500 });
            return originalFetch(input, init);
        };

        try {
            const input: SubmitResponseDto = {
                surveyId: 'survey_2',
                answers: [
                    {
                        questionId: crypto.randomUUID(),
                        type: 'short_answer',
                        value: 'hello',
                    },
                ],
            };

            await expect(submitSurveyResponse(input)).rejects.toThrow('Failed to submit response');
        } finally {
            globalThis.fetch = originalFetch;
        }
    });
});
