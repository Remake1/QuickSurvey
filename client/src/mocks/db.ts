import type { AuthDb, DbUser } from './auth.handlers.ts';
import type { DbSurvey, DbSurveyResponse, GraphqlDb } from './graphql.handlers.ts';

export type MockDb = AuthDb & GraphqlDb;

export function createMockDb(): MockDb {
    return {
        usersByEmail: new Map<string, DbUser>(),
        surveysById: new Map<string, DbSurvey>(),
        surveyResponsesBySurveyId: new Map<string, DbSurveyResponse[]>(),
    };
}

