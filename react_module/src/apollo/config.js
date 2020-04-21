/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-unused-expressions */
import { ApolloClient } from 'apollo-boost';
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";

// const cache = new InMemoryCache();
const token = ""

if(!localStorage.getItem('token')===null || localStorage.getItem('token'))
{
  const token = JSON.parse(localStorage.getItem('token'))
}

// const database  = JSON.parse(localStorage.getItem('database'))
const link = new HttpLink({
  headers: {
    "Accept": "application/json",
    // "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Authorization": `JWT ${token}`,
    "database": 'india',

 },
  uri: "https://development.cogniable.us/apis/graphql",
});

export default new ApolloClient({
    link,
    cache: new InMemoryCache(),
    // credentials: 'include',
  });
