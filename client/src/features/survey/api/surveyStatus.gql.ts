export const PUBLISH_SURVEY_MUTATION = `
mutation PublishSurvey($id: ID!) {
  publishSurvey(id: $id) {
    id
    status
  }
}
`;

export const UNPUBLISH_SURVEY_MUTATION = `
mutation UnpublishSurvey($id: ID!) {
  unpublishSurvey(id: $id) {
    id
    status
  }
}
`;
