// import { GraphQLClient } from 'graphql-request'
/* eslint-disable no-else-return */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-underscore-dangle */

import { notification } from 'antd'
import { gql } from 'apollo-boost'
import apolloClient from '../apollo/config'

export async function getClinicLearners() {
  return apolloClient
    .query({
      query: gql`
        query {
          students {
            edges {
              node {
                id
                firstname
                email
                dob
                mobileno
                lastname
                gender
                currentAddress
                clientId
                ssnAadhar
                parentMobile
                parentName
                dateOfDiagnosis
                category {
                  id
                  category
                }
                clinicLocation {
                  id
                  location
                }
                authStaff {
                  edges {
                    node {
                      id
                      name
                    }
                  }
                }
                isActive
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
          message: 'Somthing want wrong',
          description: item.message,
        })
      })
    })
}

export async function getLearnersDropdown() {
  return apolloClient
    .query({
      query: gql`
        query {
          category {
            id
            category
          }
          schoolLocation {
            edges {
              node {
                id
                location
              }
            }
          }
          staffs {
            edges {
              node {
                id
                name
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
          message: 'Somthing want wrong',
          description: item.message,
        })
      })
    })
}

export async function updateLearner(payload) {
  const authStaffList = []
  if (payload.values.authStaff.length > 0) {
    payload.values.authStaff.map(item => authStaffList.push(`"${item}"`))
  }

  return apolloClient
    .mutate({
      mutation: gql`mutation {
            updateStudent(input:{
                studentData:{
                    id:"${payload.id}", 
                    clientId:"${payload.values.clientId}", 
                    category:"${payload.values.category}", 
                    email:"${payload.values.email}", 
                    gender:"${payload.values.gender}", 
                    dob:"${payload.values.dob._d.toISOString().slice(0, 10)}",
                    dateOfDiagnosis:"${payload.values.dateOfDiagnosis._d
                      .toISOString()
                      .slice(0, 10)}", 
                    clinicLocation:"${payload.values.clinicLocation}", 
                    firstname:"${payload.values.firstName}", 
                    lastname:"${payload.values.lastName}", 
                    authStaff:[${authStaffList}],
                    parentName:"${payload.values.parentFirstName}",
                    parentMobile:"${payload.values.parentMobileNumber}",
                    ssnAadhar:"${payload.values.ssnCard}",
                    mobileno: "${payload.values.mobileNo}",
                    address: "${payload.values.address}",
                }
            })
            { 
                student {
                    id,
                    firstname,
                    email,
                    dob,
                    mobileno,
                    lastname,
                    gender,
                    currentAddress,
                    clientId,
                    ssnAadhar,
                    parentMobile,
                    parentName,
                    dateOfDiagnosis,
                    category{
                        id,
                        category
                    },
                    clinicLocation{
                        id,
                        location
                    },
                    authStaff{
                        edges {
                            node {
                                id,
                                name,
                            }
                        }
                    },
                    isActive
                    
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

export async function createLearner(payload) {
  const authStaffList = []
  if (payload.values.authStaff.length > 0) {
    payload.values.authStaff.map(item => authStaffList.push(`"${item}"`))
  }

  return apolloClient
    .mutate({
      mutation: gql`mutation {
            createStudent(input:{
                studentData:{
                    clientId:"${payload.values.clientId}", 
                    category:"${payload.values.category}", 
                    email:"${payload.values.email}", 
                    gender:"${payload.values.gender}", 
                    dob:"${payload.values.dob._d.toISOString().slice(0, 10)}",
                    dateOfDiagnosis:"${payload.values.dateOfDiagnosis._d
                      .toISOString()
                      .slice(0, 10)}", 
                    clinicLocation:"${payload.values.clinicLocation}", 
                    firstname:"${payload.values.firstName}", 
                    lastname:"${payload.values.lastName}", 
                    authStaff:[${authStaffList}],
                    parentName:"${payload.values.parentFirstName}",
                    parentMobile:"${payload.values.parentMobileNumber}",
                    ssnAadhar:"${payload.values.ssnCard}",
                    mobileno: "${payload.values.mobileNo}",
                    address: "${payload.values.address}",
                }
            })
            { 
                student {
                    id,
                    firstname,
                    email,
                    dob,
                    mobileno,
                    lastname,
                    gender,
                    currentAddress,
                    clientId,
                    ssnAadhar,
                    parentMobile,
                    parentName,
                    dateOfDiagnosis,
                    category{
                        id,
                        category
                    },
                    clinicLocation{
                        id,
                        location
                    },
                    authStaff{
                        edges {
                            node {
                                id,
                                name,
                            }
                        }
                    },
                    isActive
                    
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

export async function learnerActiveInactive(payload) {
  return apolloClient
    .mutate({
      mutation: gql`mutation {
            updateStudent(input:{
                studentData:{
                    id:"${payload.id}", 
                    isActive: ${payload.checked}
                }
            })
            { 
                student {
                    id,
                    isActive
                    
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
