/* eslint-disable import/prefer-default-export */
/* eslint-disable consistent-return */
import { notification } from 'antd'
import { gql } from 'apollo-boost'
import client from '../apollo/config'

export async function getTargets(payload) {
  return client
    .query({
      query: gql`
        {
          getsession(id: "U2Vzc2lvblR5cGU6Mg==") {
            sessionName {
              id
              name
            }
            duration
            targets {
              edgeCount
              edges {
                node {
                  id
                  targetId {
                    domain {
                      domain
                    }
                  }
                  targetAllcatedDetails {
                    id
                    targetName
                    DailyTrials
                  }
                }
              }
            }
          }
          getSessionRecordings(ChildSession: "Q2hpbGRTZXNzaW9uVHlwZToy") {
            edges {
              node {
                id
                durationStart
                durationEnd
                ChildSession {
                  id
                  sessionDate
                }
                targets {
                  id
                }
                sessionRecord {
                  edges {
                    node {
                      id
                      entryTime
                      trial
                      durationStart
                      durationEnd
                      sd {
                        id
                        sd
                      }
                      step {
                        id
                        step
                      }
                      promptCode {
                        id
                        promptName
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `,
    })
    .then(result => result)
    .catch(error => {
      error.graphQLErrors.map(item => {
        return notification.error({
          message: 'Somthing want wrong loading session',
          description: item.message,
        })
      })
    })
}
