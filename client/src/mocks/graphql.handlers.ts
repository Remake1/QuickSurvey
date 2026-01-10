import { http, HttpResponse } from 'msw';
import type { Answer } from '@/features/survey/api/surveys.api.ts';

export type SurveyStatus = 'DRAFT' | 'PUBLISHED';

export type DbSurvey = {
    id: string;
    title: string;
    description: string | null;
    status: SurveyStatus;
    questions: { id: string }[];
    createdAt: string; // ISO
};

export type DbSurveyResponse = {
    id: string;
    surveyId: string;
    answers: Answer[];
    createdAt: string; // ISO
};

export type GraphqlDb = {
    surveysById: Map<string, DbSurvey>;
    surveyResponsesBySurveyId: Map<string, DbSurveyResponse[]>;
};

export function seedSurveysIfNeeded(db: GraphqlDb) {
    if (db.surveysById.size > 0) return;

    const now = new Date().toISOString();

    const s1: DbSurvey = {
        id: 'survey_1',
        title: 'My Draft Survey',
        description: 'Draft description',
        status: 'DRAFT',
        questions: [{ id: 'q1' }, { id: 'q2' }],
        createdAt: now,
    };

    const s2: DbSurvey = {
        id: 'survey_2',
        title: 'My Published Survey',
        description: null,
        status: 'PUBLISHED',
        questions: [{ id: 'q1' }],
        createdAt: now,
    };

    db.surveysById.set(s1.id, s1);
    db.surveysById.set(s2.id, s2);

    db.surveyResponsesBySurveyId.set('survey_2', [
        {
            id: 'resp_1',
            surveyId: 'survey_2',
            answers: [
                {
                    questionId: 'q1',
                    type: 'short_answer',
                    textValue: 'hello',
                    choiceValue: null,
                    checkboxValues: null,
                    dateValue: null,
                    scaleValue: null,
                },
            ],
            createdAt: now,
        },
    ]);
}

export function isGraphQLOperation(query: string, operationName: string) {
    return query.includes(`query ${operationName}`) || query.includes(`mutation ${operationName}`);
}

function asRecord(value: unknown): Record<string, unknown> {
    return (value && typeof value === 'object') ? (value as Record<string, unknown>) : {};
}

export function createGraphqlHandlers(db: GraphqlDb) {
    return [
        http.post('/graphql', async ({ request }) => {
            seedSurveysIfNeeded(db);

            const body = (await request.json().catch(() => null)) as
                | { query?: string; variables?: unknown }
                | null;

            const query = body?.query ?? '';
            const variables = asRecord(body?.variables);

            if (!query) {
                return HttpResponse.json({ errors: [{ message: 'Missing query' }] }, { status: 400 });
            }

            // === Public survey: GetPublicSurvey ===
            if (isGraphQLOperation(query, 'GetPublicSurvey')) {
                const id = typeof variables.id === 'string' ? variables.id : undefined;
                const survey = id ? db.surveysById.get(id) : undefined;

                if (!survey) {
                    return HttpResponse.json({ data: { survey: null } });
                }

                // Provide a minimal Question shape matching the client's expectations.
                // Note: This is a mock; we only include fields the UI queries.
                const questions = survey.questions.map((q, idx) => {
                    const qId = q.id;
                    if (idx === 0) {
                        return {
                            id: qId,
                            title: 'Public Question',
                            required: true,
                            type: 'short_answer',
                        };
                    }

                    return {
                        id: qId,
                        title: `Question ${idx + 1}`,
                        required: false,
                        type: 'paragraph',
                    };
                });

                return HttpResponse.json({
                    data: {
                        survey: {
                            id: survey.id,
                            title: survey.title,
                            description: survey.description,
                            status: survey.status,
                            questions,
                        },
                    },
                });
            }

            // === Public survey: SubmitResponse ===
            if (isGraphQLOperation(query, 'SubmitResponse')) {
                const input = asRecord(variables.input);
                const surveyId = typeof input.surveyId === 'string' ? input.surveyId : undefined;
                const answers = Array.isArray(input.answers) ? (input.answers as Answer[]) : [];

                if (!surveyId) {
                    return HttpResponse.json({ errors: [{ message: 'surveyId is required' }] });
                }

                const survey = db.surveysById.get(surveyId);
                if (!survey) {
                    return HttpResponse.json({ errors: [{ message: 'Survey not found' }] });
                }

                if (survey.status !== 'PUBLISHED') {
                    return HttpResponse.json({ errors: [{ message: 'Survey is not published' }] });
                }

                const now = new Date().toISOString();
                const created = {
                    id: `resp_${Math.random().toString(16).slice(2)}`,
                    surveyId,
                    answers,
                    createdAt: now,
                };

                const existing = db.surveyResponsesBySurveyId.get(surveyId) ?? [];
                db.surveyResponsesBySurveyId.set(surveyId, [created, ...existing]);

                return HttpResponse.json({
                    data: {
                        submitResponse: { id: created.id },
                    },
                });
            }

            if (isGraphQLOperation(query, 'MySurveys')) {
                return HttpResponse.json({
                    data: {
                        mySurveys: Array.from(db.surveysById.values()).map((s) => ({
                            id: s.id,
                            title: s.title,
                            description: s.description,
                            status: s.status,
                            questions: s.questions,
                            createdAt: s.createdAt,
                        })),
                    },
                });
            }

            if (isGraphQLOperation(query, 'CreateSurvey')) {
                const input = asRecord(variables.input);
                const title = input.title;

                if (typeof title !== 'string' || title.length === 0) {
                    return HttpResponse.json({ errors: [{ message: 'Title is required' }] });
                }

                const now = new Date().toISOString();

                const rawQuestions = Array.isArray(input.questions) ? input.questions : [];
                const questions = rawQuestions.map((q, idx) => {
                    const qRec = asRecord(q);
                    const qId = typeof qRec.id === 'string' && qRec.id.length > 0 ? qRec.id : `q_${idx + 1}`;
                    return { id: qId };
                });

                const created: DbSurvey = {
                    id: `survey_${Math.random().toString(16).slice(2)}`,
                    title,
                    description: typeof input.description === 'string' ? input.description : null,
                    status: 'DRAFT',
                    questions,
                    createdAt: now,
                };

                db.surveysById.set(created.id, created);

                return HttpResponse.json({
                    data: {
                        createSurvey: {
                            id: created.id,
                            title: created.title,
                            description: created.description,
                            status: created.status,
                            questions: created.questions.map((q) => ({ id: q.id })),
                            createdAt: created.createdAt,
                        },
                    },
                });
            }

            if (isGraphQLOperation(query, 'PublishSurvey')) {
                const id = typeof variables.id === 'string' ? variables.id : undefined;
                const survey = id ? db.surveysById.get(id) : undefined;
                if (!survey) {
                    return HttpResponse.json({ errors: [{ message: 'Survey not found' }] });
                }

                survey.status = 'PUBLISHED';
                db.surveysById.set(survey.id, survey);

                return HttpResponse.json({
                    data: {
                        publishSurvey: { id: survey.id, status: survey.status },
                    },
                });
            }

            if (isGraphQLOperation(query, 'UnpublishSurvey')) {
                const id = typeof variables.id === 'string' ? variables.id : undefined;
                const survey = id ? db.surveysById.get(id) : undefined;
                if (!survey) {
                    return HttpResponse.json({ errors: [{ message: 'Survey not found' }] });
                }

                survey.status = 'DRAFT';
                db.surveysById.set(survey.id, survey);

                return HttpResponse.json({
                    data: {
                        unpublishSurvey: { id: survey.id, status: survey.status },
                    },
                });
            }

            if (isGraphQLOperation(query, 'SurveyResponses')) {
                const surveyId = typeof variables.surveyId === 'string' ? variables.surveyId : undefined;
                const responses = surveyId ? db.surveyResponsesBySurveyId.get(surveyId) ?? [] : [];

                return HttpResponse.json({
                    data: {
                        surveyResponses: responses.map((r) => ({
                            id: r.id,
                            surveyId: r.surveyId,
                            answers: r.answers,
                            createdAt: r.createdAt,
                        })),
                    },
                });
            }

            return HttpResponse.json({ errors: [{ message: 'Unknown operation' }] });
        }),
    ];
}
