import { QueryAllProfessors } from '../graphql/QueryAllProfessors.js';
import { QuerySchools } from '../graphql/QuerySchools.js';
import { GraphQLClient } from 'graphql-request'
import { API_URL, AUTHORIZATION_TOKEN } from './constants.js';
import util from 'util'
import fs from 'fs';

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
  // cacheProfessorList(professorList)
  console.log(util.inspect(professorList, false, null, true))
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
  console.log(util.inspect(schoolList, false, null, true))
  console.log('Total schools found:', schoolList.length)
  return schoolList
}

const cacheProfessorList = (professors) => {
  fs.truncate('professors.json', 0, () => console.log('cleared cache'))
  let jsonList = JSON.stringify(professors)
  fs.writeFile('professors.json', jsonList, 'utf8', () => console.log('saved professors to cache'))
}