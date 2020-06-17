/* eslint-disable import/prefer-default-export */
/* eslint-disable consistent-return */
import { notification } from 'antd'
import { gql } from 'apollo-boost'
import apolloClient from '../apollo/config'

export async function getData(payload) {
  return apolloClient
    .query({
      query: gql`
      `,
    })
    .then(result => result)
    .catch(error => {
      error.graphQLErrors.map(item => {
        return notification.error({
          message: 'Somthing went wrong loading Data',
          description: item.message,
        })
      })
    })
}
