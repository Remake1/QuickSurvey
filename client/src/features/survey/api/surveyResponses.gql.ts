export const SURVEY_RESPONSES_QUERY = `
  query SurveyResponses($surveyId: ID!) {
    surveyResponses(surveyId: $surveyId) {
      id
      surveyId
      answers {
        questionId
        type
        textValue
        choiceValue
        checkboxValues
        dateValue
        scaleValue
      }
      createdAt
    }
  }
`;
