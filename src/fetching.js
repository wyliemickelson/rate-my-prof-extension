import { QueryAllProfessors } from './graphql/QueryAllProfessors.js';
import { QuerySchools } from './graphql/QuerySchools.js';
import { GraphQLClient } from 'graphql-request'
import { API_URL, AUTHORIZATION_TOKEN } from './constants.js';

const client = new GraphQLClient(API_URL, {
  headers: {
    Authorization: AUTHORIZATION_TOKEN,
  }
})

export const FetchAllProfessors = async (schoolID) => {
  const res = await client.request(QueryAllProfessors, {
    query: {
      schoolID
    }
  })
  let professorList = res.search.teachers.edges
  professorList = professorList.map(prof => prof.node)
  console.log('Total professors found:', professorList.length)
  return professorList
}

export const FetchSchoolNames = async (text) => {
  const res = await client.request(QuerySchools, {
    query: {
      text
    }
  })
  let schoolList = res.newSearch.schools.edges
  schoolList = schoolList.map(school => school.node)
  console.log('Total schools found:', schoolList.length)
  return schoolList
}