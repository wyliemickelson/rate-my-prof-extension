import { gql } from 'graphql-request'

export const QueryAllProfessors = gql`
query ($query: TeacherSearchQuery!) {
  search: newSearch {
    teachers(query: $query) {
      edges {
        node {
          ... on Teacher {
              id
              department
              legacyId
              firstName
              lastName
              avgRating
              numRatings
              avgDifficulty
              wouldTakeAgainPercent
              department
              school {
                name
                  id
              }
          }
        }
      }
    }
  }
}
`