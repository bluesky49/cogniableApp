import { gql } from 'apollo-boost'
import { notification } from 'antd'
import client from '../../../apollo/config'

export const getDomainByProgramArea = (programArea = 'UHJvZ3JhbUFyZWFUeXBlOjQ') => {
  return client
    .query({
      query: gql`
          query{
            programDetails(id:"${programArea}="){
              id,
              name,
              domain{
                edges{
                  node{
                    id,
                    domain
                  }
                }
              }
            }
          }
        `,
    })
    .then(result => result)
}

export const getPatients = (studentId = 'U3R1ZGVudFR5cGU6OTI=') => {
  return client
    .query({
      query: gql`
          query {
            student(id: "${studentId}") {
              programArea {
                edges {
                  node {
                    id
                    name
                  }
                }
              }
            }
          }
        `,
    })
    .then(result => result)
}

export const getLongTermGoals = (
  student = 'U3R1ZGVudFR5cGU6OTM=',
  program = 'UHJvZ3JhbUFyZWFUeXBlOjE=',
) => {
  return client
    .query({
      query: gql`
          query {
            longTerm(student: "${student}", program: "${program}") {
              edges {
                node {
                  id
                  goalName
                  description
                  dateInitialted
                  dateEnd
                  student {
                    id
                    firstname
                  }
                  responsibility {
                    id
                    name
                  }
                  goalStatus {
                    id
                    status
                  }
                  shorttermgoalSet {
                    edges {
                      node {
                        id
                        goalName
                        dateInitialted
                        dateEnd
                        description
                        assessment {
                          id
                          name
                        }
                        responsibility {
                          id
                          name
                        }
                        goalStatus {
                          id
                          status
                        }
                        targetAllocateSet {
                          edges {
                            node {
                              id
                              goalName
                              targetStatus {
                                id
                                statusName
                              }
                              targetAllcatedDetails {
                                id
                                targetName
                              }
                            }
                          }
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
}

export const getShortTermGoals = (longTermGoal = 'TG9uZ1Rlcm1UeXBlOjEy') => {
  return client
    .query({
      query: gql`
          query{
            shortTerm(longTerm:"${longTermGoal}") {
              edges {
                node {
                  id,
                  goalName,
                  description,
                  dateInitialted,
                  dateEnd,
                  isActive,
                  longTerm{
                    id,
                    goalName
                  }
                  targetAllocateSet {
                    edges {
                      node {
                        id,
                        targetStatus{
                          id,
                          statusName
                        },
                        targetAllcatedDetails{
                          id,
                          targetName
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
}

export const getTargetAreaByDoimain = (domain = 'RG9tYWluVHlwZTo4') => {
  return client
    .query({
      query: gql`
          query{
            targetArea(domain:"${domain}"){
              edges{
                node{
                  id,
                  Area
                }
              }
            }
          }
        `,
    })
    .then(result => result)
}

export const suggestTarget = (
  domain = 'RG9tYWluVHlwZTo4',
  targetArea = 'VGFyZ2V0QXJlYVR5cGU6Mjg3',
) => {
  return client
    .query({
      query: gql`
          query{
            target(domain:"${domain}", targetArea:"${targetArea}"){
                edges{
                    node{
                        id,
                        domain{
                            id,
                            domain
                        },
                        targetArea{
                            id,
                            Area
                        }
                        targetMain{
                            id,
                            targetName
                        }
                    }
                }
            }
        }
        `,
    })
    .then(result => result)
}

export const getGoalStatus = () => {
  return client
    .query({
      query: gql`
        query {
          goalStatus {
            id
            status
          }
        }
      `,
    })
    .then(result => result)
}

export const getGoalResponsibility = () => {
  return client
    .query({
      query: gql`
        query {
          goalResponsibility {
            id
            name
          }
        }
      `,
    })
    .then(result => result)
}

export const alreadyAlloctedTarget = (
  studentId = 'U3R1ZGVudFR5cGU6MTYz',
  targetStatus = 'U3RhdHVzVHlwZToz',
  targetIdDomain = 'RG9tYWluVHlwZToxMQ==',
) => {
  return client
    .query({
      query: gql`
          query {targetAllocates(studentId:"${studentId}", targetStatus:"${targetStatus}", targetId_Domain:"${targetIdDomain}") {
            edges {
              node {
                id,
                time,
                targetInstr,
                date,
                objective,
                targetStatus{
                  id,
                  statusName
                }
                sessionSet{
                  edges{
                    node{
                      id,
                      sessionName{
                        id,
                        name
                      }
                    }
                  }
                },
                targetId{
                  id,
                  domain{
                    id,
                    domain
                  }
                }
                targetAllcatedDetails{
                  id,
                  targetName,
                  dateBaseline,
                  DailyTrials,
                  consecutiveDays,
                  targetType{
                    id,
                    typeTar
                  }
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
                },
              }
            }
        }}
        `,
    })
    .then(result => result)
}

export async function createLongTermGoal(
  student,
  goalName,
  description,
  dateInitialted,
  dateEnd,
  responsibility,
  goalStatus,
  programArea,
) {
  return client
    .mutate({
      mutation: gql`mutation {
        createLongTerm(input:{goalData:{student:"${student}", goalName:"${goalName}", description:"${description}", dateInitialted:"${dateInitialted}", dateEnd:"${dateEnd}", responsibility:"${responsibility}", goalStatus:"${goalStatus}", programArea:"${programArea}"}})
           {
                 details{
                     id,
                     goalName,
                     description,
                     dateInitialted,
                     dateEnd,
                     program{
                         id,
                         name
                     }
                     responsibility{
                         id,
                         name
                     }
                     goalStatus{
                       id,
                       status
                     },
                     student{
                         id,
                         firstname
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

export async function updateLongTermGoal(
  student,
  goalName,
  description,
  dateInitialted,
  dateEnd,
  responsibility,
  goalStatus,
  programArea,
  goalId,
) {
  return client
    .mutate({
      mutation: gql`mutation {
        updateLongTerm(input:{goalData:{id:"${goalId}", goalName:"${goalName}", description:"${description}", dateInitialted:"${dateInitialted}", dateEnd:"${dateEnd}", responsibility:"${responsibility}", goalStatus:"${goalStatus}", programArea:"${programArea}"}})
           {
                details{
                   id,
                   goalName,
                   description,
                   dateInitialted,
                   dateEnd,
                   program{
                       id,
                       name
                   },
                   responsibility{
                       id,
                       name
                   }
                   goalStatus{
                     id,
                     status
                   },
                   student{
                       id,
                       firstname
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

export async function createShortTermGoal(
  longTerm,
  student,
  goalName,
  description,
  dateInitialted,
  dateEnd,
  assessment,
  responsibility,
  goalStatus,
) {
  return client
    .mutate({
      mutation: gql`mutation {
        createShortTerm(input:{goalData:{longTerm:"${longTerm}", goalName:"${goalName}", dateInitialted:"${dateInitialted}", dateEnd:"${dateEnd}", assessment:"", responsibility:"${responsibility}", goalStatus:"${goalStatus}"}})
           {
               details{
                   id,
                   goalName,
                   dateInitialted,
                   dateEnd,
                   longTerm{
                       id,
                       goalName
                   },
                   assessment{
                       id,
                       name
                   },
                   responsibility{
                       id,
                       name
                   },
                   goalStatus{
                       id,
                       status
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

export async function updateShortTermGoal(
  longTerm,
  student,
  goalName,
  description,
  dateInitialted,
  dateEnd,
  assessment,
  responsibility,
  goalStatus,
  goalId,
) {
  // createShortTerm(input:{goalData:{longTerm:"${longTerm}", goalName:"${goalName}", dateInitialted:"${dateInitialted}", dateEnd:"${dateEnd}", assessment:"R29hbHNBc3Nlc3NtZW50VHlwZTox", responsibility:"${responsibility}", goalStatus:"${goalStatus}"}})

  return client
    .mutate({
      mutation: gql`mutation {
        updateShortTerm(input:{goalData:{id:"${goalId}", longTerm:"${longTerm}", goalName:"${goalName}", dateInitialted:"${dateInitialted}", dateEnd:"${dateEnd}", assessment:"R29hbHNBc3Nlc3NtZW50VHlwZTox", responsibility:"${responsibility}", goalStatus:"${goalStatus}"}})
           {
               details{
                   id,
                   goalName,
                   dateInitialted,
                   dateEnd,
                   longTerm{
                       id,
                       goalName
                   },
                   assessment{
                       id,
                       name
                   },
                   responsibility{
                       id,
                       name
                   },
                   goalStatus{
                       id,
                       status
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