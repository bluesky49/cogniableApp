/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-indent */
/* eslint-disable array-callback-return */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/jsx-indent-props */
import React, { Component } from 'react'
import { Button, Progress, Drawer, Card, Layout, Row, Col, Typography, Switch, Icon, notification } from 'antd'
import { connect } from 'react-redux'
import { gql } from 'apollo-boost'
import apolloClient from '../../apollo/config'

const { Content } = Layout
const { Title, Text } = Typography

const assessmentCardStyle = {
  background: '#FFFFFF',
  border: '1px solid #E4E9F0',
  boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
  borderRadius: 10,
  width: '100%',
  marginRight: '20px',
  padding: '12px 12px',
  alignItems: 'center',
  display: 'inline-block',
  marginTop: '20px'
}

@connect(({ user, sessionrecording }) => ({ user, sessionrecording }))
class StudentDrawer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      // isSubdrawerOper: false,

      // vb-mapp-isActive,
      isVBMAPPActive: false,
      studentDetails: null
    }
  }

  componentDidMount() {
    // const propData = this.props
    const std = JSON.parse(localStorage.getItem('studentId'))
    apolloClient.query({
      query: gql`{
      student(id: "${std}"){
        id
        firstname
        isCogActive
        isPeakActive
      }
    }`,
    })
      .then(result => {
        this.setState({
          studentDetails: result.data.student,
        })
      })
      .catch(error => {
        console.log(error)
      })

    apolloClient
      .mutate({
        mutation: gql`
          mutation{
            vbmappIsActive(input:{
              student: "${std}"
            }){
              status
              msg
            }
          }
        `,
      })
      .then(result => {
        this.setState({
          isVBMAPPActive: result.data.vbmappIsActive.status
        })
      })
      .catch(error => {
        console.log(error)
      })

  }

  generateNotification = (text) => {
    notification.warning({
      message: 'Warning',
      description: text,
    })
  }

  redirectToAssessment = (text) => {
    if (text === 'VB-MAPP') {
      window.location.href = '/#/therapy/vbmapps/list'
    }
    if (text === 'CogniAble') {
      window.location.href = '/#/cogniableAssessment'
    }
    if (text === 'PEAK') {
      window.location.href = '/#/peak'
    }
  }

  activeInactiveVbMapp = isActive => {
    const std = JSON.parse(localStorage.getItem('studentId'))
    if (isActive) {
      apolloClient
        .mutate({
          mutation: gql`
          mutation{
            vbmappActivateStudent(input:{
                student: "${std}"
            }){
                status
                msg
            }
          }
          `,
        })
        .then(result => {
          this.setState({
            isVBMAPPActive: true
          })
          console.log("vb-mapp ====> ", result)
        })
        .catch(error => {
          console.log(error)
        })
    }
  }

  activeInactivePEAK = isActive => {
    const std = JSON.parse(localStorage.getItem('studentId'))
    apolloClient
      .mutate({
        mutation: gql`mutation {
          updateStudent(input:{
            studentData:{
              id:"${std}", 
              isPeakActive: ${isActive}
            }
          })
          { 
            student {
              id,
              firstname
              isPeakActive
              isCogActive 
            }
          }
        }`,
      })
      .then(result => {
        this.setState({
          studentDetails: result.data.updateStudent.student
        })
      })
      .catch(error => {
        console.log(error)
      })
  }

  activeInactiveCogniAble = isActive => {
    const std = JSON.parse(localStorage.getItem('studentId'))
    apolloClient
      .mutate({
        mutation: gql`
        mutation {
          updateStudent(input:{
            studentData:{
              id:"${std}", 
              isCogActive: ${isActive}
            }
          })
          { 
            student {
              id,
              firstname
              isPeakActive
              isCogActive 
            }
          }
        }`,
      })
      .then(result => {
        this.setState({
          studentDetails: result.data.updateStudent.student
        })
      })
      .catch(error => {
        console.log(error)
      })
  }

  render() {
    const { isVBMAPPActive, studentDetails } = this.state

    return (
      <>
       
        <div role="presentation" style={assessmentCardStyle}>
            <div>
            <Title style={{ fontSize: '18px' }}>PEAK</Title>
            <div>
                <Switch
                checkedChildren={<Icon type="check" />}
                checked={studentDetails?.isPeakActive}
                unCheckedChildren={<Icon type="close" />}
                onChange={(event) => {
                    this.activeInactivePEAK(event)
                }}
                />
            </div>
            <Button type="link" onClick={studentDetails?.isPeakActive ? () => { this.redirectToAssessment('PEAK') } : () => { this.generateNotification('PEAK assessment is not activated') }}><p style={{ display: 'block', marginTop: '5px', marginBottom: '-5px' }}><i>Click here start PEAK Assessment </i></p></Button>
            </div>
        </div>

        <div role="presentation" style={assessmentCardStyle}>
            <div>
            <Title style={{ fontSize: '18px' }}>VB-MAPP</Title>
            <div>
                <Switch
                checkedChildren={<Icon type="check" />}
                unCheckedChildren={<Icon type="close" />}
                checked={isVBMAPPActive}
                onChange={(event) => {
                    this.activeInactiveVbMapp(event)
                }}
                />
            </div>
            <Button type="link" onClick={isVBMAPPActive ? () => { this.redirectToAssessment('VB-MAPP') } : () => { this.generateNotification('VB-MAPP assessment is not activated') }}><p style={{ display: 'block', marginTop: '5px', marginBottom: '-5px' }}><i>Click here start VB-Mapp Assessment </i></p></Button>
            </div>
        </div>

        <div role="presentation" style={assessmentCardStyle}>
            <div>
            <Title style={{ fontSize: '18px' }}>CogniAble</Title>
            <div>
                <Switch
                checkedChildren={<Icon type="check" />}
                checked={studentDetails?.isCogActive}
                unCheckedChildren={<Icon type="close" />}
                onChange={(event) => {
                    this.activeInactiveCogniAble(event)
                }}
                />
            </div>
            <Button type="link" onClick={studentDetails?.isCogActive ? () => { this.redirectToAssessment('CogniAble') } : () => { this.generateNotification('CogniAble assessment is not activated') }}><p style={{ display: 'block', marginTop: '5px', marginBottom: '-5px' }}><i>Click here start CogniAble Assessment </i></p></Button>
            </div>
        </div>

                  
      </>
    )
  }
}
export default StudentDrawer
