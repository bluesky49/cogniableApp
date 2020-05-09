// import { GraphQLClient } from 'graphql-request'
/* eslint-disable no-else-return */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-underscore-dangle */

import { notification } from 'antd'
import { gql } from 'apollo-boost'
import apolloClient from '../apollo/config'

export async function getClinicStaffs() {
  return apolloClient
    .query({
      query: gql`
        query {
          staffs {
            edges {
              node {
                id
                name
                email
                gender
                localAddress
                designation
                empType
                salutation
                dateOfJoining
                dob
                surname
                contactNo
                emergencyContact
                emergencyName
                employeeId
                clinicLocation {
                  id
                  location
                }
                userRole {
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
    .catch(error => {
      error.graphQLErrors.map(item => {
        return notification.error({
          message: 'Somthing want wrong fetching Staffs',
          description: item.message,
        })
      })
    })
}

export async function getStaffDropdown() {
  return apolloClient
    .query({
      query: gql`
        query {
          userRole {
            id
            name
          }
          schoolLocation {
            edges {
              node {
                id
                location
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
          message: 'Somthing want wrong fetching staff dropdowns',
          description: item.message,
        })
      })
    })
}

export async function createStaff(payload) {
  return apolloClient
    .mutate({
      mutation: gql`mutation {
			createStaff(
				input:{
					staffData:{
						empId:"${payload.values.staffId}",
						dateOfJoining:"${payload.values.dateOfJoining._d.toISOString().slice(0, 10)}",
						designation:"${payload.values.designation}",
						role:"${payload.values.role}",
						clinicLocation:"${payload.values.clinicLocation}"
						firstname:"${payload.values.firstname}",
						surname:"${payload.values.lastname}",
						email:"${payload.values.email}",
						gender:"${payload.values.gender}",
						mobile:"${payload.values.contactNumber}",
						address:"${payload.values.address}",
						dob:"${payload.values.dob._d.toISOString().slice(0, 10)}",
						qualification:"${payload.values.qualification}",
						emergencyName:"${payload.values.emergencyName}",
						emergencyContact:"${payload.values.emergencyContactNumber}",
						authLearner:[]
					}
				}
			)
			{ 
				staff {
					id,
					name,
					email,
					gender,
					localAddress,
					designation,
					empType,
					salutation,
					dateOfJoining,
					dob,
					surname,
					contactNo,
					emergencyContact,
					emergencyName,
					employeeId,
					clinicLocation{
						id,
						location
					},
					userRole{
						id,
						name
					}	
				}
			}
		}`,
    })
    .then(result => result)
    .catch(err => {
      err.graphQLErrors.map(item => {
        return notification.error({
          message: 'Somthing want wrong',
          description: item.message,
        })
      })
    })
}
