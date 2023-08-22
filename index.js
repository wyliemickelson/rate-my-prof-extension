import { gql, GraphQLClient } from 'graphql-request'
import { QueryProfessorData } from './gql-queries.js';

const API_URL = "https://www.ratemyprofessors.com/graphql"
const AUTHORIZATION_TOKEN = "Basic dGVzdDp0ZXN0";

const client = new GraphQLClient(API_URL, {
  headers: {
    authorization: AUTHORIZATION_TOKEN
  },
  fetch
})

const FetchProfessorData = async (id) => {
  const res = await client.request(QueryProfessorData, { id })
  console.log(res)
} 

FetchProfessorData('VGVhY2hlci0yMzU=')