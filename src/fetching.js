import { QueryAllProfessors } from '../graphql/QueryAllProfessors.js';
import { GraphQLClient } from 'graphql-request'
import { API_URL, AUTHORIZATION_TOKEN, WWUID } from './constants.js';
import util from 'util'
import fs from 'fs';

const client = new GraphQLClient(API_URL, {
  headers: {
    Authorization: AUTHORIZATION_TOKEN,
  }
})

const FetchAllProfessors = async (schoolID) => {
  // const response = await fetch(API_URL, {
  //   method: "POST",
  //   headers: {
  //     Authorization: AUTHORIZATION_TOKEN,
  //   },
  //   body: JSON.stringify({
  //     query: QueryAllProfessors,
  //     variables: {
  //       query: {
  //           schoolID,
  //       }
  //   }
  //   }),
  // })

  const response = await client.request(QueryAllProfessors, {
    query: {
      schoolID
    }
  })
  // console.log(response)
  let professorList = response.search.teachers.edges
  // const data = await response.json()
  // let professorList = data.data.search.teachers.edges
  professorList = professorList.map(prof => prof.node)
  console.log('Total professors: ', professorList.length)
  // cacheProfessorList(professorList)
  console.log(util.inspect(professorList, false, null, true))
}

const cacheProfessorList = (professors) => {
  // remove previously cached data
  fs.truncate('professors.json', 0, () => console.log('cleared cache'))
  let jsonList = JSON.stringify(professors)
  fs.writeFile('professors.json', jsonList, 'utf8', () => console.log('saved professors to cache'))
}

FetchAllProfessors(WWUID)