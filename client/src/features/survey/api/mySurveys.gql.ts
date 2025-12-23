export const MY_SURVEYS_QUERY = `
query MySurveys {
  mySurveys {
    id
    title
    description
    status
    questions {
      id
    }
    createdAt
  }
}
`