/* eslint-disable object-shorthand */
import { gql } from 'apollo-boost'
import { notification } from 'antd'
import client from '../../../apollo/config'

export const getDomainByProgramArea = (programArea) => {
  return client
    .query({
      query: gql`
          query{
            programDetails(id:"${programArea}"){
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

export const getPatients = (studentId) => {
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
  student,
  program,
  status
) => {
  return client
    .query({
      query: gql`
          query GetLongTermGoals (
            $student: ID!,
            $program: ID!,
            $status: ID
          ) {
            longTerm(student: $student, program: $program, goalStatus: $status) {
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
                  shorttermgoalSet (goalStatus: $status) {
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
                              id,
                time,
                targetInstr,
                date,
                objective,
                targetStatus{
                  id,
                  statusName
                }
                masteryCriteria{
                  id,
                  name
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
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        `,
        variables: {
          student: student,
          program: program,
          status: status
        }
    })
    .then(result => result)
}

export const getShortTermGoals = (longTermGoal) => {
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

export const getTargetAreaByDoimain = (domain) => {
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
  domain,
  targetArea,
  studentId
) => {
  // console.log(domain, targetArea)
  return client
    .query({
      query: gql`
          query{
            target(domain:"${domain}", targetArea:"${targetArea}", student: "${studentId}"){
                edges{
                    node{
                        id,
                        allocatedTar
                        domain{
                            id,
                            domain
                        },
                        targetArea{
                            id,
                            Area
                        }
                        targetInstr
                        video
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

export const getTargetDetailsOptions = () => {
  return client
    .query({
      query: gql`
        {
          targetStatus {
            id
            statusName
          }
          types {
            id
            typeTar
          }
          promptCodes {
            id
            promptName
          }
          masteryCriteria {
            id
            name
          }
          domain {
            edges {
              node {
                domain
                id
              }
            }
          }
          goalsProgramArea {
            id
            name
          }
        }
      `,
    })
    .then(result => result)
    .catch(error => error)
}

export const getSearchSd = text => {
  return client
    .query({
      query: gql`
      query GetStimulus (
        $text: String!
      ){
          targetSd(first:8, sd_Icontains: $text){
            edges {
              node {
                id,
                sd
              }
            }
          }
        }
      `,
      variables: {text: text}
    })
    .then(result => result)
    .catch(error => error)
}

export const getSearchSteps = text => {
  return client
    .query({
      query: gql`
      query GetSteps (
        $text: String!
      ){
          targetStep(first:8, step_Icontains: $text)
            {edges {
              node {
                id,
                step
              }
            }
          }
        }
      `,
      variables: {text: text}
    })
    .then(result => result)
    .catch(error => error)
}


export const getSearchTargets = text => {
  return client
    .query({
      query: gql`
      query GetTargets (
        $text: String!,
        $studentId: ID!
      ){
        target(first:8, student: $studentId, targetMain_TargetName_Icontains: $text){
          edges{
            node{
              id,
              allocatedTar
              domain{
                id,
                domain
              },
              targetArea{
                id,
                Area
              }
              video
              targetInstr
              targetMain{
                id,
                targetName
              }
            }
          }
        }
      }`,
      variables: {text: text, studentId: localStorage.getItem('studentId')}
    })
    .then(result => result)
    .catch(error => error)
}


export const alreadyAlloctedTarget = (
  studentId,
  targetStatus = 'U3RhdHVzVHlwZToz',
  targetIdDomain,
) => {
  return client
    .query({
      query: gql`
          query {targetAllocates(studentId:"${studentId}", targetId_Domain:"${targetIdDomain}") {
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
                masteryCriteria{
                  id,
                  name
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


export const getStudentSettings = (
  studentId = localStorage.getItem('studentId'),
) => {
  return client
    .query({
      query: gql`query ($studentId: ID!)  {
        getAllocateTargetSettings(student: $studentId){
          edges {
            node {
              id
              dailyTrials
              consecutiveDays
              student{
                id
                firstname
              }
              targetType{
                id
                typeTar
              }
              masteryCriteria{
                id
                name
              }
              status{
                id
                statusName
              }
            }
          }
        }
      }`,
      fetchPolicy: 'network-only',
      variables: {
        studentId: studentId
      }
    })
    .then(result => result)
    .catch(error => {
      error.graphQLErrors.map(item => {
        return notification.error({
          message: 'Somthing went wrong',
          description: item.message,
        })
      })
    })
}

// export async function createLongTermGoal(
//   student,
//   goalName,
//   description,
//   dateInitialted,
//   dateEnd,
//   responsibility,
//   goalStatus,
//   programArea,
// ) {
//   return client
//     .mutate({
//       mutation: gql`mutation {
//         createLongTerm(input:{goalData:{student:"${student}", goalName:"${goalName}", description:"${description}", dateInitialted:"${dateInitialted}", dateEnd:"${dateEnd}", responsibility:"${responsibility}", goalStatus:"${goalStatus}", programArea:"${programArea}"}})
//            {
//                  details{
//                      id,
//                      goalName,
//                      description,
//                      dateInitialted,
//                      dateEnd,
//                      program{
//                          id,
//                          name
//                      }
//                      responsibility{
//                          id,
//                          name
//                      }
//                      goalStatus{
//                        id,
//                        status
//                      },
//                      student{
//                          id,
//                          firstname
//                      }
                     
//                  }
//              }
//       }`,
//     })
//     .then(result => result)
//     .catch(error => {
//       error.graphQLErrors.map(item => {
//         return notification.error({
//           message: 'Somthing went wrong',
//           description: item.message,
//         })
//       })
//     })
// }

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
  return client.mutate({
      mutation: gql`mutation CreateLongTerm (
        $student: ID!
        $goalName: String!
        $description: String!
        $dateInitialted: Date!
        $dateEnd: Date!
        $responsibility: ID!
        $goalStatus: ID!
        $programArea: ID!
      ) {
        createLongTerm(input:{goalData:{student:$student, goalName:$goalName, description:$description, dateInitialted:$dateInitialted, dateEnd:$dateEnd, responsibility: $responsibility, goalStatus:$goalStatus, programArea:$programArea}})
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
      variables: {
        student,
        goalName,
        description,
        dateInitialted,
        dateEnd,
        responsibility,
        goalStatus,
        programArea,
      }
    })
    .then(result => result)
    .catch(error => {
      error.graphQLErrors.map(item => {
        return notification.error({
          message: 'Somthing went wrong',
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
      mutation: gql`mutation UpdateLongTerm (
        $goalId: ID!,
        $goalName: String!
        $description: String!
        $dateInitialted: Date!
        $dateEnd: Date!
        $responsibility: ID!
        $goalStatus: ID!
        $programArea: ID!

      ) {
        updateLongTerm(input:{
          goalData:{
            id: $goalId, 
            goalName: $goalName, 
            description: $description, 
            dateInitialted: $dateInitialted, 
            dateEnd: $dateEnd, 
            responsibility: $responsibility, 
            goalStatus: $goalStatus, 
            programArea: $programArea
          }
        })
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
                   },
                   goalStatus{
                     id,
                     status
                   },
                   student{
                       id,
                       firstname
                   },
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
    }`,
    variables : {
      goalName: goalName,
      description: description,
      dateInitialted: dateInitialted,
      dateEnd: dateEnd,
      responsibility: responsibility,
      goalStatus: goalStatus,
      programArea: programArea,
      goalId: goalId,
    }
    })
    .then(result => result)
    .catch(error => {
      error.graphQLErrors.map(item => {
        return notification.error({
          message: 'Somthing went wrong',
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
  responsibility,
  goalStatus,
) {
  return client
    .mutate({
      mutation: gql`mutation CreateShortTerm (
        $goalName: String!
        $description: String!
        $dateInitialted: Date!
        $dateEnd: Date!
        $responsibility: ID!
        $goalStatus: ID!
        $longTerm: ID!
      ) {
        createShortTerm(input:{
          goalData:{
            longTerm: $longTerm, 
            goalName: $goalName, 
            description: $description, 
            dateInitialted: $dateInitialted, 
            dateEnd: $dateEnd,  
            responsibility: $responsibility, 
            goalStatus: $goalStatus
          }
        })
           {
               details{
                   id,
                   goalName,
                   dateInitialted,
                   description,
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
    variables : {
      goalName: goalName,
      description: description,
      dateInitialted: dateInitialted,
      dateEnd: dateEnd,
      responsibility: responsibility,
      goalStatus: goalStatus,
      longTerm: longTerm,
    }
    })
    .then(result => result)
    .catch(error => {
      error.graphQLErrors.map(item => {
        return notification.error({
          message: 'Somthing went wrong',
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
  responsibility,
  goalStatus,
  goalId,
) {
  return client
    .mutate({
      mutation: gql`mutation UpdateShortTerm (
        $goalId: ID!
        $goalName: String!
        $description: String!
        $dateInitialted: Date!
        $dateEnd: Date!
        $responsibility: ID!
        $goalStatus: ID!
        $longTerm: ID!
      ) {
        updateShortTerm(input:{
          goalData:{
            id: $goalId, 
            longTerm: $longTerm, 
            goalName: $goalName, 
            description: $description, 
            dateInitialted: $dateInitialted, 
            dateEnd: $dateEnd, 
            responsibility: $responsibility, 
            goalStatus: $goalStatus
          }
        })
           {
               details{
                   id,
                   goalName,
                   description,
                   dateInitialted,
                   dateEnd,
                   longTerm{
                       id,
                       goalName
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
    variables : {
      goalName: goalName,
      description: description,
      dateInitialted: dateInitialted,
      dateEnd: dateEnd,
      responsibility: responsibility,
      goalStatus: goalStatus,
      longTerm: longTerm,
      goalId: goalId,
    }
    })
    .then(result => result)
    .catch(error => {
      error.graphQLErrors.map(item => {
        return notification.error({
          message: 'Somthing went wrong',
          description: item.message,
        })
      })
    })
}

export async function createTargetAllocate(
  shortTerm,
  targetId,
  studentId,
  targetStatus,
  objective,
  date = '2020-04-08',
  targetInstr,
  masteryCriteria,
  targetName,
  dailyTrials,
  consecutiveDays,
  targetType,
  promptCodes = [],
  sd = [],
  steps = [],
  video,
  settingsDefault,
) {
  const Query1 = `mutation CreateTargetAllocate (
    $studentId: ID!
    $shortTerm: ID!
    $targetId: ID!
    $targetStatus: ID!
    $targetInstr: String!
    $date: Date!
    $masteryCriteria: ID!
    $targetName: String!
    $dailyTrials: Int!
    $consecutiveDays: Int!
    $targetType: ID!
    $sd: [String]
    $steps: [String]
    $video: [String]
    $default: Boolean
  ) 
  {
    createTargetAllocate(input:{
      makeDefault: $default,
      targetData:{
        shortTerm: $shortTerm, 
        targetId: $targetId,
        studentId: $studentId, 
        targetStatus: $targetStatus, 
        objective: "", 
        date: $date, 
        targetInstr: $targetInstr, 
        goodPractices: "", 
        precaution: "", 
        gernalizationCriteria: "", 
        masteryCriteria: $masteryCriteria, 
        targetName: $targetName, 
        DailyTrials: $dailyTrials, 
        consecutiveDays: $consecutiveDays, 
        targetType: $targetType, 
        promptCodes:[], 
        sd: $sd, 
        steps: $steps, 
        videos: $video,
        }
      })
      {
      
        targetName,
          target {
            id, date, targetInstr, 
            targetStatus{
              id, statusName
            }
            sessionSet{
              edges{
                node{
                                id
                            }
                        }
                    }
                    targetId{
                        id,
                        domain{
                            id,
                            domain
                        }
                    }
                    masteryCriteria{
                      id,
                      name
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
    }`
    const Query2 = `mutation CreateTargetAllocate (
      $studentId: ID!
      $shortTerm: ID!
      $targetStatus: ID!
      $targetInstr: String!
      $date: Date!
      $masteryCriteria: ID!
      $targetName: String!
      $dailyTrials: Int!
      $consecutiveDays: Int!
      $targetType: ID!
      $sd: [String]
      $steps: [String]
      $video: [String]
      $default: Boolean
    ) 
    {
      createTargetAllocate(input:{
        makeDefault: $default,
        targetData:{
          shortTerm: $shortTerm, 
          studentId: $studentId, 
          targetStatus: $targetStatus, 
          objective: "", 
          date: $date, 
          targetInstr: $targetInstr, 
          goodPractices: "", 
          precaution: "", 
          gernalizationCriteria: "", 
          masteryCriteria: $masteryCriteria, 
          targetName: $targetName, 
          DailyTrials: $dailyTrials, 
          consecutiveDays: $consecutiveDays, 
          targetType: $targetType, 
          promptCodes:[], 
          sd: $sd, 
          steps: $steps, 
          videos: $video,
          
          }
        })
        {
          
          targetName,
            target {
              id, 
              date, 
              targetInstr, 
              targetStatus{
                id, statusName
              }
              sessionSet{
                edges{
                  node{
                                  id
                              }
                          }
                      }
                      masteryCriteria{
                        id,
                        name
                      }
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
      }`
  let mu = ''
  if (targetId === ''){
    mu = Query2
  }
  else{
    mu = Query1
  }
  return client
    .mutate({
      mutation: gql`
        ${mu}
      `,
      variables : {
        studentId: studentId,
        shortTerm: shortTerm,
        targetId: targetId,
        targetStatus:targetStatus,
        targetInstr: targetInstr,
        date: date,
        masteryCriteria: masteryCriteria,
        targetName: targetName,
        dailyTrials: dailyTrials,
        consecutiveDays: consecutiveDays,
        targetType: targetType,
        sd: sd,
        steps: steps,
        video: video,
        default: settingsDefault
      }
    })
    .then(result => result)
    .catch(error => {
      console.log('error==>', error)
      error.graphQLErrors.map(item => {
        return notification.error({
          message: 'Somthing went wrong',
          description: item.message,
        })
      })
    })
}


export async function updateAllocatedTarget(
  targetId,
  targetStatus,
  targetInstr,
  masteryCriteria,
  targetName,
  dailyTrials,
  consecutiveDays,
  targetType,
  sd = [],
  steps = [],
  video
) {
  return client
    .mutate({
      mutation: gql`mutation UpdateShortTerm (
        $targetAllocatedId: ID!
        $targetStatus: ID!
        $targetInstr: String!
        $masteryCriteria: ID!
        $targetName: String!
        $dailyTrials: Int!
        $consecutiveDays: Int!
        $targetType: ID!
        $sd: [String]
        $steps: [String]
        $video: [String]
      ) {
        updateTargetAllocate(input:{pk: $targetAllocatedId, 
          targetData:{
            targetStatus: $targetStatus,   
            targetInstr: $targetInstr,
            goodPractices:"<p></p>", 
            precaution:"<p></p>", 
            gernalizationCriteria:"<p></p>", 
            masteryCriteria: $masteryCriteria, 
            targetName: $targetName,
            DailyTrials: $dailyTrials, 
            consecutiveDays: $consecutiveDays, 
            targetType: $targetType, 
            promptCodes:[], 
            sd: $sd, 
            steps: $steps,
            videos: $video
          }
        })
        {
          
          targetName,
          target{
              id,
              date,
              targetInstr,
              targetStatus{
                  id,
                  statusName
              }
              targetId{
                  id,
                  domain{
                      id,
                      domain
                  }
              }
              masteryCriteria{
                  id,
                  name
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
  }`,
    variables : {
      targetAllocatedId: targetId,
      targetStatus:targetStatus,
      targetInstr: targetInstr,
      masteryCriteria: masteryCriteria,
      targetName: targetName,
      dailyTrials: dailyTrials,
      consecutiveDays: consecutiveDays,
      targetType: targetType,
      sd: sd,
      steps: steps,
      video: video
    }
    })
    .then(result => result)
    .catch(error => {
      error.graphQLErrors.map(item => {
        return notification.error({
          message: 'Somthing went wrong',
          description: item.message,
        })
      })
    })
}