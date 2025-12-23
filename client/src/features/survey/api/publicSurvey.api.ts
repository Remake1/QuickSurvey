import { GET_PUBLIC_SURVEY_QUERY, SUBMIT_RESPONSE_MUTATION } from './publicSurvey.gql.ts';
import { type Question } from '@quicksurvey/shared/schemas/question.schema.ts';
import { type SubmitResponseDto } from '@quicksurvey/shared/schemas/response.schema.ts';

interface PublicSurveyResponse {
    data: {
        survey: {
            id: string;
            title: string;
            description: string | null;
            status: 'DRAFT' | 'PUBLISHED';
            questions: Question[];
        } | null;
    };
    errors?: { message: string }[];
}

interface SubmitResponseResponse {
    data: {
        submitResponse: {
            id: string;
        };
    };
    errors?: { message: string }[];
}

export async function fetchPublicSurvey(id: string) {
    const res = await fetch('/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: GET_PUBLIC_SURVEY_QUERY,
            variables: { id },
        }),
    });

    if (!res.ok) {
        throw new Error('Failed to fetch survey');
    }

    const result = (await res.json()) as PublicSurveyResponse;
    const { data, errors } = result;

    if (errors) {
        throw new Error(errors[0].message);
    }

    if (!data.survey) {
        throw new Error('Survey not found');
    }

    return data.survey;
}


export async function submitSurveyResponse(input: SubmitResponseDto) {
    // Transform DTO to GraphQL Input format
    const gqlInput = {
        surveyId: input.surveyId,
        answers: input.answers.map(answer => {
            const base = {
                questionId: answer.questionId,
                type: answer.type,
            };

            switch (answer.type) {
                case 'short_answer':
                case 'paragraph':
                    return { ...base, textValue: answer.value };
                case 'multiple_choice':
                case 'dropdown':
                    return { ...base, choiceValue: answer.value };
                case 'checkboxes':
                    return { ...base, checkboxValues: answer.value };
                case 'date':
                    return { ...base, dateValue: answer.value };
                case 'linear_scale':
                    return { ...base, scaleValue: answer.value };
                default:
                    return base;
            }
        })
    };

    const res = await fetch('/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: SUBMIT_RESPONSE_MUTATION,
            variables: { input: gqlInput },
        }),
    });


    if (!res.ok) {
        throw new Error('Failed to submit response');
    }

    const result = (await res.json()) as SubmitResponseResponse;
    const { data, errors } = result;

    if (errors) {
        throw new Error(errors[0].message);
    }

    return data.submitResponse;
}
