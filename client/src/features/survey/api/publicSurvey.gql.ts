export const GET_PUBLIC_SURVEY_QUERY = `
  query GetPublicSurvey($id: ID!) {
    survey(id: $id) {
      id
      title
      description
      status
      questions {
        id
        title
        required
        type
        ... on OptionsQuestion {
          options {
            id
            text
          }
        }
        ... on ScaleQuestion {
          min
          max
          minLabel
          maxLabel
        }
      }
    }
  }
`;

export const SUBMIT_RESPONSE_MUTATION = `
  mutation SubmitResponse($input: SubmitResponseInput!) {
    submitResponse(input: $input) {
      id
    }
  }
`;
