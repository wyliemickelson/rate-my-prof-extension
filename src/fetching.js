import { QueryAllProfessors } from './graphql/QueryAllProfessors.js';
import { QuerySchools } from './graphql/QuerySchools.js';
import { GraphQLClient } from 'graphql-request'
import { API_URL, AUTHORIZATION_TOKEN } from './constants.js';
import { cache } from './cache.js';

const client = new GraphQLClient(API_URL, {
  headers: {
    Authorization: AUTHORIZATION_TOKEN,
  }
})

export const FetchAllProfessors = async (schoolID) => {
  // cant use graphqlclient due to problems with xmlhttprequest on background script
  return await fetch(API_URL, {
    method: 'POST',
    headers: {
      Authorization: AUTHORIZATION_TOKEN,
    },
    body: JSON.stringify({
      query: QueryAllProfessors,
      variables: {
        query: {
          text: "",
          schoolID,
        },
        schoolID,
      }
    })
  }).then(res => res.json())
    .then(async (res) => {
      await cache.updateLastSaved(new Date().toLocaleString())
      let professorList = res.data.search.teachers.edges
      professorList = professorList.map(prof => prof.node)
      console.log('Total professors found:', professorList.length)
      return professorList
    }).catch(e => console.error(`Unable to fetch professors: ${e.stack}`))
}

export const FetchSchoolNames = async (text) => {
  return await client.request(QuerySchools, {
    query: {
      text
    }
  }).then(res => {
    let schoolList = res.newSearch.schools.edges
    schoolList = schoolList.map(school => school.node)
    console.log('Total schools found:', schoolList.length)
    return schoolList
  }).catch(e => console.error(`Unable to fetch school names: ${e.stack}`))
}