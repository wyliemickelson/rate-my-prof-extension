import { gql, request, GraphQLClient } from 'graphql-request'
import { QueryProfessorData, QueryTeacherSearch } from './gql-queries.js';
import util from 'util'
import fs from 'fs';


const API_URL = "https://www.ratemyprofessors.com/graphql"
const AUTHORIZATION_TOKEN = "Basic dGVzdDp0ZXN0";

const client = new GraphQLClient(API_URL, {
  headers: {
    authorization: AUTHORIZATION_TOKEN
  }
})

// WWU School ID
const WWUID = 'U2Nob29sLTExODQ='
const FetchAllProfessors = async (schoolID) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: AUTHORIZATION_TOKEN,
    },
    body: JSON.stringify({
      query: QueryTeacherSearch,
      variables: {
        query: {
            text: "",
            schoolID,
            fallback: true,
            departmentID: null
        },
        schoolID
    }
    }),
  });
  const data = await response.json()
  let professorList = data.data.search.teachers.edges
  professorList = professorList.map(prof => prof.node)
  console.log('Total professors: ', professorList.length)
  cacheProfessorList(professorList)
  // console.log(util.inspect(professorList, false, null, true))
}

const cacheProfessorList = (professors) => {
  // remove previously cached data
  fs.truncate('professors.json', 0, () => console.log('cleared cache'))
  let jsonList = JSON.stringify(professors)
  fs.writeFile('professors.json', jsonList, 'utf8', () => console.log('saved professors to cache'))
}

FetchAllProfessors(WWUID)