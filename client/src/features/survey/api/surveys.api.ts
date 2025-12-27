import { MY_SURVEYS_QUERY } from './mySurveys.gql.ts';
import { PUBLISH_SURVEY_MUTATION, UNPUBLISH_SURVEY_MUTATION } from './surveyStatus.gql.ts';
import { CREATE_SURVEY_MUTATION } from './createSurvey.gql.ts';
import { type SurveyListItem, type SurveyStatus, type CreateSurveyDto } from '@quicksurvey/shared/schemas/survey.schema.ts';

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

interface StatusMutationResponse {
    data: {
        publishSurvey?: { id: string; status: SurveyStatus };
        unpublishSurvey?: { id: string; status: SurveyStatus };
    };
    errors?: { message: string }[];
}

export async function publishSurvey(id: string): Promise<void> {
    const res = await fetch('/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
            query: PUBLISH_SURVEY_MUTATION,
            variables: { id },
        }),
    });

    if (!res.ok) {
        throw new Error('Failed to publish survey');
    }

    const result = (await res.json()) as StatusMutationResponse;
    if (result.errors) {
        throw new Error(result.errors[0].message);
    }
}

export async function unpublishSurvey(id: string): Promise<void> {
    const res = await fetch('/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
            query: UNPUBLISH_SURVEY_MUTATION,
            variables: { id },
        }),
    });

    if (!res.ok) {
        throw new Error('Failed to unpublish survey');
    }

    const result = (await res.json()) as StatusMutationResponse;
    if (result.errors) {
        throw new Error(result.errors[0].message);
    }
}

interface CreateSurveyResponse {
    data: {
        createSurvey: {
            id: string;
            title: string;
            description: string | null;
            status: SurveyStatus;
        };
    };
    errors?: { message: string }[];
}

export async function createSurvey(input: CreateSurveyDto): Promise<{ id: string }> {
    const res = await fetch('/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
            query: CREATE_SURVEY_MUTATION,
            variables: { input },
        }),
    });

    if (!res.ok) {
        throw new Error('Failed to create survey');
    }

    const result = (await res.json()) as CreateSurveyResponse;
    if (result.errors) {
        throw new Error(result.errors[0].message);
    }

    return { id: result.data.createSurvey.id };
}
