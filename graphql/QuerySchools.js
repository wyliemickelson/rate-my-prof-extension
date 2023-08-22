import { gql } from 'graphql-request'

export const QuerySchools = gql`
query ($query: SchoolSearchQuery!) {
  newSearch {
    schools(query: $query, first: 15) {
      edges {
        node {
          ... on School {
            id
            legacyId
            name
            city
            state
            numRatings
            avgRatingRounded
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
}
`