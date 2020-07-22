/* eslint-disable import/prefer-default-export */
const { default: gql } = require('graphql-tag')

export const GET_STUDENT = gql`
  query {
    students {
      edges {
        node {
          id
          firstname
          parent {
            id
          }
        }
      }
    }
  }
`

export const GET_STAFF = gql`
  query {
    staffs {
      edges {
        node {
          id
          name
          user {
            id
          }
        }
      }
    }
  }
`

export const GET_MESSAGE = gql`
  query($secondUser: ID!) {
    userthread(secondUser: $secondUser) {
      firstUser {
        id
        name
      }
      secondUser {
        id
        name
      }
      chatmessageSet {
        edges {
          node {
            user {
              id
            }
            message
            timestamp
          }
        }
      }
    }
  }
`

// export const GET_CLINIC = gql`

// `
