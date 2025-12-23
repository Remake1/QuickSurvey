import { MY_SURVEYS_QUERY } from './mySurveys.gql.ts';
import { type SurveyListItem, type SurveyStatus } from '@quicksurvey/shared/schemas/survey.schema.ts';

interface RawSurvey {
    id: string;
    title: string;
    description: string | null;
    status: SurveyStatus;
    questions: { id: string }[];
    createdAt: string;
}

interface MySurveysResponse {
    data: {
        mySurveys: RawSurvey[];
    };
    errors?: { message: string }[];
}

export async function fetchMySurveys(): Promise<SurveyListItem[]> {
    const res = await fetch('/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
            query: MY_SURVEYS_QUERY,
        }),
    });

    if (!res.ok) {
        throw new Error('Failed to fetch surveys');
    }

    const result = (await res.json()) as MySurveysResponse;
    const { data, errors } = result;

    if (errors) {
        throw new Error(errors[0].message);
    }

    return data.mySurveys.map((survey) => ({
        id: survey.id,
        title: survey.title,
        description: survey.description,
        status: survey.status,
        questionCount: survey.questions.length,
        createdAt: new Date(survey.createdAt),
    }));
}
