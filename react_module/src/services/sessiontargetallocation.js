// import { GraphQLClient } from 'graphql-request'
/* eslint-disable no-else-return */
/* eslint-disable import/prefer-default-export */
/* eslint-disable  array-callback-return */

import { notification } from 'antd'
import { gql } from 'apollo-boost'
import apolloClient from '../apollo/config'

export async function getAllocatedTargets(payload) {
  return apolloClient
    .query({
      query: gql`
        query {
            targetAllocates(studentId:"${payload.studentId}", targetStatus:"U3RhdHVzVHlwZToz") { 
                edges {
                    node {
                        id,
                        targetInstr, 
                        targetAllcatedDetails{
                            id,
                            targetName,
                        }   
                    }
                }
            },
            student(id:"${payload.studentId}") {
                family{
                    id,
                    members{
                        edges {
                            node {
                                id,
                                memberName,
                                relationship{
                                    id,
                                    name
                                },
                            }
                        }
                    }
                }
            }
            GetStudentSession(studentId:"${payload.studentId}") {
                edges {
                    node {
                        id
                        itemRequired,
                        duration,
                        feedback,
                        rating,
                        sessionName {
                            id
                            name
                        }
                        instruction{
                            edges{
                                node{
                                    id,
                                    instruction
                                }
                            }
                        }
                        sessionHost {
                            edges{
                                node{
                                    id,
                                    memberName,
                                    timeSpent {
                                        edges {
                                            node {
                                                id
                                                sessionName {
                                                    id
                                                    name
                                                }
                                                duration
                                            }
                                        }
                                    }
                                    relationship {
                                        id
                                        name
                                    }
                                }
                            }
                        },                        
                        targets{
                            edges{
                                node{
                                    id,
                                    time, 
                                    targetInstr,
                                    date,
                                    targetAllcatedDetails{
                                        id,
                                        targetName,
                                    },
                                }
                            }
                        }
                    }
                }
            }
        }`,
    })
    .then(result => result)
    .catch(error => {
      error.graphQLErrors.map(item => {
        return notification.error({
          message: 'Somthing want wrong',
          description: item.message,
        })
      })
    })
}

export async function updateSessionTargets(payload) {
  return apolloClient
    .mutate({
      mutation: gql`mutation {
            updateSessionTargets(input:{
                sessionId:"${payload.id}", 
                targetsList:[${payload.targetList}]
            })
            { 
                status
                session {
                    id
                    itemRequired,
                    duration,
                    feedback,
                    rating,
                    sessionName {
                        id
                        name
                    }
                    instruction{
                        edges{
                            node{
                                id,
                                instruction
                            }
                        }
                    }
                    sessionHost {
                        edges{
                            node{
                                id,
                                memberName,
                                timeSpent {
                                    edges {
                                        node {
                                            id
                                            sessionName {
                                                id
                                                name
                                            }
                                            duration
                                        }
                                    }
                                }
                                relationship {
                                    id
                                    name
                                }
                            }
                        }
                    },                        
                    targets{
                        edges{
                            node{
                                id,
                                time, 
                                targetInstr,
                                date,
                                targetAllcatedDetails{
                                    id,
                                    targetName,
                                },
                            }
                        }
                    }
                }
            }
        }`,
    })
    .then(result => result)
    .catch(error => {
      error.graphQLErrors.map(item => {
        return notification.error({
          message: 'Somthing want wrong',
          description: item.message,
        })
      })
    })
}

export async function updateSessionDetails(objects) {
  const { payload, sessionObject } = objects

  const inst = []
  const host = []
  if (payload.values.names.length > 0) {
    payload.values.names.map(item => {
      inst.push(`"${item}"`)
    })
  }

  if (payload.values.hosts.length > 0) {
    payload.values.hosts.map(item => {
      host.push(`"${item}"`)
    })
  }

  return apolloClient
    .mutate({
      mutation: gql`mutation {
            updateMasterSession(input:{
                pk:"${sessionObject.id}",
                duration:"${sessionObject.duration}", 
                itemRequired:"${payload.values.items}", 
                instruction:[${inst}],
                sessionHost:[${host}]
            })
            { 
                details {
                    id
                    itemRequired,
                    duration,
                    feedback,
                    rating,
                    sessionName {
                        id
                        name
                    }
                    instruction{
                        edges{
                            node{
                                id,
                                instruction
                            }
                        }
                    }
                    sessionHost {
                        edges{
                            node{
                                id,
                                memberName,
                                timeSpent {
                                    edges {
                                        node {
                                            id
                                            sessionName {
                                                id
                                                name
                                            }
                                            duration
                                        }
                                    }
                                }
                                relationship {
                                    id
                                    name
                                }
                            }
                        }
                    },                        
                    targets{
                        edges{
                            node{
                                id,
                                time, 
                                targetInstr,
                                date,
                                targetAllcatedDetails{
                                    id,
                                    targetName,
                                },
                            }
                        }
                    }
                }
            }
        }`,
    })
    .then(result => result)
    .catch(error => {
      error.graphQLErrors.map(item => {
        return notification.error({
          message: 'Somthing want wrong',
          description: item.message,
        })
      })
    })
}
