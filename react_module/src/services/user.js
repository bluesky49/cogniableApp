/* eslint-disable no-unused-vars */
import { GraphQLClient } from 'graphql-request'
import firebase from 'firebase/app'
import { notification } from 'antd'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'
import { gql } from 'apollo-boost'
import client from '../config'
import apolloClient from '../apollo/config'

const firebaseConfig = {
  apiKey: 'AIzaSyAE5G0RI2LwzwTBizhJbnRKIKbiXQIA1dY',
  authDomain: 'cleanui-72a42.firebaseapp.com',
  databaseURL: 'https://cleanui-72a42.firebaseio.com',
  projectId: 'cleanui-72a42',
  storageBucket: 'cleanui-72a42.appspot.com',
  messagingSenderId: '583382839121',
}

const firebaseApp = firebase.initializeApp(firebaseConfig)
const firebaseAuth = firebase.auth
export default firebaseApp

export async function login(payload) {
  const query = `mutation TokenAuth($username: String!, $password: String!) {
    tokenAuth(input: {username: $username, password: $password}) {
      token,
      user
      {
        id,
        groups
        {
          edges {
            node {
              id,
              name
              }
      }
      }
    }
    }
  }`
  const variables = {
    username: payload.username,
    password: payload.password,
  }

  return client
    .request(query, variables)
    .then(data => {
      localStorage.setItem('token', JSON.stringify(data.tokenAuth.token))
      localStorage.setItem('role', JSON.stringify(data.tokenAuth.user.groups.edges[0].node.name))
      localStorage.setItem('database', JSON.stringify('india'))
      return data
    })
    .catch(err => {
      notification.error({
        message: err.response.errors[0].message,
        description: err.response.errors[0].message,
      })
    })
}

export async function StudentIdFromUserId(payload) {
  return apolloClient
    .query({
      query: gql`{
          students (parent:"${payload}")  {
            edges {
              node {
                id, firstname,
              }
            }
          }
        }`,
    })
    .then(result => {
      return result
    })
    .catch(error => {
      error.graphQLErrors.map(item => {
        return notification.error({
          message: 'Somthing want wrong',
          description: item.message,
        })
      })
    })
}

export async function GetUserDetailsByUsername(payload) {
  return apolloClient
    .query({
      query: gql`{
        getuser(username:"${payload}") {
          edges {
            node {
              id, username,
                groups {
                  edges {
                    node {
                      id, name
                    }
                  }
                }
              }
            }
          }
        }`,
    })
    .then(result => {
      return result
    })
    .catch(error => {
      error.graphQLErrors.map(item => {
        return notification.error({
          message: 'Somthing want wrong',
          description: item.message,
        })
      })
    })
}

export async function RefreshToken() {
  if (localStorage.getItem('token') === null || !localStorage.getItem('token')) {
    return false
  }

  const query = `mutation RefreshToken($token: String!) {
        refreshToken(input: {token: $token}) {
          token
          payload
        }
      }`
  const variables = {
    token: JSON.parse(localStorage.getItem('token')),
  }

  return client
    .request(query, variables)
    .then(data => {
      localStorage.setItem('database', JSON.stringify('india'))
      localStorage.setItem('token', JSON.stringify(data.refreshToken.token))
      return data
    })
    .catch(err => {
      return err
    })
}

export async function logout() {
  return firebaseAuth()
    .signOut()
    .then(() => true)
}
