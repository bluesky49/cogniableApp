/* eslint-disable import/prefer-default-export */
/* eslint-disable consistent-return */
import { notification } from 'antd'
import { gql } from 'apollo-boost'
import client from '../apollo/config'

export async function getTargets(payload) {
  const { learner } = payload
  return client
    .query({
      query: gql`{
            targetAllocates(
                studentId:"${learner}"
            )
            {
                edges {
                    node {
                        id,
                        time, 
                        goalName,
                        targetInstr,
                        targetStatus{
                            statusName
                        },
                        targetAllcatedDetails{ 
                            id, 
                            targetName, 
                            dateBaseline, 
                            DailyTrials, 
                            consecutiveDays,
                        },
                        videos{
                            edges{
                                node{
                                    id,
                                    url
                                }
                            }
                        },
                        sd{
                            edges{
                                node{
                                    id,
                                    sd
                                }
                            }
                        },
                        steps{
                            edges{
                                node{
                                    id,
                                    step
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
