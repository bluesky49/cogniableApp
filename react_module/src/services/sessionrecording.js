/* eslint-disable import/prefer-default-export */
/* eslint-disable consistent-return */
import { notification } from 'antd'
import { gql } from 'apollo-boost'
import apolloClient from '../apollo/config'

export async function getTargets(payload) {
  return apolloClient
    .query({
      query: gql`{
            getsession(id: "${payload.masterSessionId}") {
                id,
                sessionName {
                    id
                    name
                },
                duration,
                targets {
                    edgeCount
                    edges {
                        node {
                            id,
                            targetInstr,
                            targetStatus {
                                id,
                                statusName
                            }
                            targetId {
                                domain {
                                    domain
                                }
                            }
                            targetAllcatedDetails {
                                id
                                targetName
                                DailyTrials
                                targetType{
                                    id,
                                    typeTar
                                }
                            }
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
            }
            promptCodes {
                id,
                promptName 
            }
            getChildSession(sessions:"${payload.masterSessionId}", date: "${payload.date}") { 
                edges{
                    node{
                        id,
                        sessionDate,
                        createdAt,
                        duration,
                        status,
                        sessions{
                            id,
                            itemRequired,
                            sessionName{
                                id,
                                name
                            },
                            targets{
                                edges{
                                    node{
                                        id
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }`,
        fetchPolicy: 'no-cache',
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

export async function getChildSessionData(payload) {
  return apolloClient
    .query({
      query: gql`{
            getSessionRecordings(ChildSession:"${payload.id}", sessiondate: "${payload.date}") {
                edges {
                    node {
                        id,
                        durationStart,
                        durationEnd,
                        ChildSession{
                            id,
                            sessionDate,
                            status,
                            sessions{
                                id,
                                sessionName{
                                    id,
                                    name
                                }
                            }
                        }
                        targets{
                            id
                        }
                        status{
                            id,
                            statusName
                        }
                        sessionRecord{
                            edges{
                                node{
                                    id,
                                    entryTime,
                                    trial,
                                    durationStart,
                                    durationEnd,
                                    sd{
                                        id,
                                        sd
                                    },
                                    step{
                                        id,
                                        step
                                    }
                                    promptCode{
                                        id,
                                        promptName
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }`,
        fetchPolicy: 'no-cache',
    })
    .then(result => result)
    .catch(error => {
      error.graphQLErrors.map(item => {
        return notification.error({
          message: 'Somthing want wrong loading chlid session data',
          description: item.message,
        })
      })
    })
}

export async function createChildSession(masterSessionId) {
  return apolloClient
    .mutate({
      mutation: gql`mutation {
            startSession(input:{ 
                parentSession:"${masterSessionId}", 
                status:"progress",
                duration:0
            })
            { 
                details {
                    id,
                    sessionDate,
                    status,
                    duration,
                    sessions {
                        id
                    }
                }
            }
        }`,
    })
    .then(result => result)
    .catch(error => {
      error.graphQLErrors.map(item => {
        return notification.error({
          message: 'Somthing want wrong creating child session',
          description: item.message,
        })
      })
    })
}

export async function updateChildSessionDuration(payload) {
  return apolloClient
    .mutate({
      mutation: gql`mutation {
            changeSessionStatus(input:{
                pk:"${payload.id}",
                duration:${payload.duration}
            })
            { 
                details{
                    id,
                    sessionDate,
                    status,
                    duration,
                    sessions {
                        id
                    }
                }
            }
        }`,
    })
    .then(result => result)
    .catch(error => {
      error.graphQLErrors.map(item => {
        return notification.error({
          message: 'Somthing want wrong updating child session duration',
          description: item.message,
        })
      })
    })
}

export async function finishChildSession(payload) {
  return apolloClient
    .mutate({
      mutation: gql`mutation {
            changeSessionStatus(input:{
                pk:"${payload.id}",
                duration:${payload.duration},
                status:"completed"
            })
            { 
                details{
                    id,
                    sessionDate,
                    status,
                    duration,
                    sessions {
                        id
                    }
                }
            }
        }`,
    })
    .then(result => result)
    .catch(error => {
      error.graphQLErrors.map(item => {
        return notification.error({
          message: 'Somthing want wrong submitting child session',
          description: item.message,
        })
      })
    })
}

export async function createFirstTragetAndTrialInstance(payload) {
  return apolloClient
    .mutate({
      mutation: gql`mutation {
            sessionRecording(input:{
                targets:"${payload.targetId}",
                childsession:"${payload.childId}",
                durationStart:0,
                durationEnd:0,
                status:"${payload.targetStatusId}",
                sessionRecord:[],
            })
            { 
                details {
                    id,
                    durationStart,
                    durationEnd,
                    targets {
                        id,
                    },                    
                    sessionRecord {
                        edges {
                            node {
                                id,
                                trial,
                                durationStart,
                                durationEnd,
                                sd {
                                    id,
                                    sd
                                },
                                step {
                                    id,
                                    step
                                },
                                promptCode {
                                    id,
                                    promptName
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
          message: 'Somthing want wrong creating first target object',
          description: item.message,
        })
      })
    })
}

export async function recordTargetCorrectTrial(payload) {
  return apolloClient
    .mutate({
      mutation: gql`mutation {
            sessionRecording(input:{
                targets:"${payload.targetId}",
                childsession:"${payload.childId}",
                status:"${payload.statusId}",
                sessionRecord:[{trial:"${payload.response}", durationStart:${payload.start}, durationEnd:${payload.end}, prompt:"${payload.promptId}", sd:"", step:""}],
            })
            { 
                details {
                    id,
                    durationStart,
                    durationEnd,
                    targets {
                        id,
                    },                    
                    sessionRecord {
                        edges {
                            node {
                                id,
                                trial,
                                durationStart,
                                durationEnd,
                                sd {
                                    id,
                                    sd
                                },
                                step {
                                    id,
                                    step
                                },
                                promptCode {
                                    id,
                                    promptName
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
          message: 'Somthing want wrong creating first target object',
          description: item.message,
        })
      })
    })
}

export async function recordTargetStimulusTrial(payload) {
  return apolloClient
    .mutate({
      mutation: gql`mutation {
            sessionRecording(input:{
                targets:"${payload.targetId}",
                childsession:"${payload.childId}",
                status:"${payload.statusId}",
                sessionRecord:[{trial:"${payload.response}", durationStart:${payload.start}, durationEnd:${payload.end}, prompt:"${payload.promptId}", sd:"${payload.sdId}", step:""}],
            })
            { 
                details {
                    id,
                    durationStart,
                    durationEnd,
                    targets {
                        id,
                    },                    
                    sessionRecord {
                        edges {
                            node {
                                id,
                                trial,
                                durationStart,
                                durationEnd,
                                sd {
                                    id,
                                    sd
                                },
                                step {
                                    id,
                                    step
                                },
                                promptCode {
                                    id,
                                    promptName
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
          message: 'Somthing want wrong recording stimulus trial',
          description: item.message,
        })
      })
    })
}

export async function recordTargetStepTrial(payload) {
  return apolloClient
    .mutate({
      mutation: gql`mutation {
            sessionRecording(input:{
                targets:"${payload.targetId}",
                childsession:"${payload.childId}",
                status:"${payload.statusId}",
                sessionRecord:[{trial:"${payload.response}", durationStart:${payload.start}, durationEnd:${payload.end}, prompt:"${payload.promptId}", sd:"", step:"${payload.stepId}"}],
            })
            { 
                details {
                    id,
                    durationStart,
                    durationEnd,
                    targets {
                        id,
                    },                    
                    sessionRecord {
                        edges {
                            node {
                                id,
                                trial,
                                durationStart,
                                durationEnd,
                                sd {
                                    id,
                                    sd
                                },
                                step {
                                    id,
                                    step
                                },
                                promptCode {
                                    id,
                                    promptName
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
          message: 'Somthing want wrong recording step trial',
          description: item.message,
        })
      })
    })
}

export async function updateTargetEndTime(payload) {
  return apolloClient
    .mutate({
      mutation: gql`mutation {
            updateTargetRec(input:{
                pk:"${payload.skillsId}",
                durationEnd:${payload.endTime}
            })
            { 
                details{
                    id,
                    durationStart,
                    durationEnd
                }               
            }
        }`,
    })
    .then(result => result)
    .catch(error => {
      error.graphQLErrors.map(item => {
        return notification.error({
          message: 'Somthing want wrong updating target endtime',
          description: item.message,
        })
      })
    })
}

export async function createNewTargetInstance(payload) {
  return apolloClient
    .mutate({
      mutation: gql`mutation {
            sessionRecording(input:{
                targets:"${payload.targetId}",
                childsession:"${payload.childId}",
                durationStart:${payload.start},
                durationEnd:0,
                status:"${payload.statusId}",
                sessionRecord:[],
            })
            { 
                details {
                    id,
                    durationStart,
                    durationEnd,
                    targets {
                        id,
                    },
                    sessionRecord {
                        edges {
                            node {
                                id,
                                trial,
                                durationStart,
                                durationEnd,
                                sd {
                                    id,
                                    sd
                                },
                                step {
                                    id,
                                    step
                                },
                                promptCode {
                                    id,
                                    promptName
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
          message: 'Somthing want wrong creating new target object',
          description: item.message,
        })
      })
    })
}

export async function updateTargetTrial(payload) {
  return apolloClient
    .mutate({
      mutation: gql`mutation {
            updateTrial(input:{
                pk:"${payload.object.id}",
                trial:"${payload.response}",
                promptCode:"${payload.promptId}"
            })
            { 
                details {
                    id,
                    trial,
                    durationStart,
                    durationEnd,
                    sd {
                        id,
                        sd
                    },
                    step {
                        id,
                        step
                    },
                    promptCode {
                        id,
                        promptName
                    }
                }
            }
        }`,
    })
    .then(result => result)
    .catch(error => {
      error.graphQLErrors.map(item => {
        return notification.error({
          message: 'Somthing want wrong updating target trial object',
          description: item.message,
        })
      })
    })
}
