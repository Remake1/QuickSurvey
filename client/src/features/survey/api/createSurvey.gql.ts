export const CREATE_SURVEY_MUTATION = `
mutation CreateSurvey($input: CreateSurveyInput!) {
  createSurvey(input: $input) {
    id
    title
    description
    status
    questions {
      id
      type
      title
      required
    }
    createdAt
  }
}
`;
