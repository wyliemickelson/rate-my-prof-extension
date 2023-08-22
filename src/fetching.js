import { QueryAllProfessors } from '../graphql/QueryAllProfessors.js';
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
  const response = await client.request(QueryAllProfessors, {
    query: {
      schoolID
    }
  })
  let professorList = response.search.teachers.edges
  professorList = professorList.map(prof => prof.node)
  // cacheProfessorList(professorList)
  console.log(util.inspect(professorList, false, null, true))
  console.log('Total professors found:', professorList.length)
}

const cacheProfessorList = (professors) => {
  fs.truncate('professors.json', 0, () => console.log('cleared cache'))
  let jsonList = JSON.stringify(professors)
  fs.writeFile('professors.json', jsonList, 'utf8', () => console.log('saved professors to cache'))
}