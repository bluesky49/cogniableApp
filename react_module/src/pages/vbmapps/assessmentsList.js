import React, { Component } from 'react'
import Authorize from 'components/LayoutComponents/Authorize'
import AssessmentCard from 'components/assessmentCard'
import { gql } from 'apollo-boost'
import { Link } from 'react-router-dom'
// import { FaChartPie, FaBookmark } from 'react-icons/fa'
import moment from 'moment'
import client from '../../apollo/config'

class AssessmentsList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      assessments: [],
      areas: [],
      selected: 0,
      master: '',
      // studentID: 'U3R1ZGVudFR5cGU6MTYz',
      studentID: JSON.parse(localStorage.getItem('studentId')),
    }
  }

  componentDidMount() {
    const { studentID } = this.state
    client
      .query({
        query: gql`
        query{
          vbmappGetAssessments(student:"${studentID}"){
              edges{
                  total
                  milestone
                  barriers
                  transition
                  eesa
                  node{
                      id
                      date
                      testNo
                      color
                      student{
                          id,
                          firstname
                      }
                  }
              }
          }
        }
        `,
      })
      .then(result => {
        console.log(result.data.vbmappGetAssessments.edges[0])
        this.setState({
          assessments: result.data.vbmappGetAssessments.edges,
          selected:
            result.data.vbmappGetAssessments.edges[
              result.data.vbmappGetAssessments.edges.length - 1
            ].node.testNo,
          master:
            result.data.vbmappGetAssessments.edges[
              result.data.vbmappGetAssessments.edges.length - 1
            ].node.id,
        })
      })
    client
      .query({
        query: gql`
          query {
            vbmappAreas {
              id
              apiArea
              areaName
              description
            }
          }
        `,
      })
      .then(result => {
        console.log(result.data.vbmappAreas)
        this.setState({
          areas: result.data.vbmappAreas,
        })
      })
  }

  handleKeyDown = () => {}

  getActiveAssessment = () => {
    const { assessments, selected } = this.state
    let bg = '#FFF'
    let textColor = '#000'
    const completed =
      assessments[assessments.length - 1].milestone +
      assessments[assessments.length - 1].barriers +
      assessments[assessments.length - 1].eesa +
      assessments[assessments.length - 1].transition
    let percentage = 0
    if (completed > 0) {
      percentage = (completed / assessments[assessments.length - 1].total) * 100
      percentage = Math.round(percentage * 10) / 10
    }
    const outputDate = moment(assessments[assessments.length - 1].node.date).format('MMMM DD, YYYY')
    if (selected === assessments[assessments.length - 1].node.testNo) {
      bg = '#3E7BFA'
      textColor = '#FFF'
    }
    return (
      <div
        role="button"
        onKeyDown={this.handleKeyDown}
        tabIndex="0"
        onClick={() =>
          this.setState({
            selected: assessments[assessments.length - 1].node.testNo,
            master: assessments[assessments.length - 1].node.id,
          })
        }
        style={{
          backgroundColor: bg,
          color: textColor,
          cursor: 'pointer',
          boxShadow:
            '0px 0px 1px rgba(0, 0, 0, 0.08), 0px 0px 2px rgba(0, 0, 0, 0.12), 0px 4px 8px rgba(0, 0, 0, 0.08)',
          paddingTop: 10,
          paddingBottom: 10,
          paddingLeft: 20,
          paddingRight: 20,
          borderRadius: 10,
          flex: 1,
          marginTop: 20,
        }}
      >
        <p style={{ fontSize: 18, fontWeight: '700', marginBottom: 0 }}>
          Assessment {assessments[assessments.length - 1].node.testNo}
        </p>
        <p>
          <span style={{ marginRight: 10 }}>{percentage}% completed</span>
          <span>{outputDate}</span>
        </p>
        <div
          style={{
            paddingBottom: 5,
            borderBottom: '0.5px solid rgba(0, 0, 0, 0.1)',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
            display: 'flex',
          }}
        >
          <p style={{ fontSize: 12 }}>
            Milestones: {assessments[assessments.length - 1].milestone}
          </p>
          <p style={{ fontSize: 12 }}>Barriers: {assessments[assessments.length - 1].barriers}</p>
          <p style={{ fontSize: 12 }}>EESA: {assessments[assessments.length - 1].eesa}</p>
          <p style={{ fontSize: 12 }}>
            Transitions: {assessments[assessments.length - 1].transition}
          </p>
        </div>
        <div style={{ flexDirection: 'row', display: 'flex', marginTop: 10 }}>
          <p style={{ marginRight: 10 }}>IEP Report</p>
          <p>Notes</p>
        </div>
      </div>
    )
  }

  getPreviousAssessments = () => {
    const { assessments, selected } = this.state
    const pa = []
    let bg = '#FFF'
    let textColor = '#000'
    for (let x = assessments.length - 2; x >= 0; x -= 1) {
      if (selected === assessments[x].node.testNo) {
        bg = '#3E7BFA'
        textColor = '#FFF'
      } else {
        bg = '#FFF'
        textColor = '#000'
      }
      const outputDate = moment(assessments[x].node.date).format('MMMM DD, YYYY')
      pa.push(
        <div
          role="button"
          onKeyDown={this.handleKeyDown}
          tabIndex="0"
          onClick={() =>
            this.setState({ selected: assessments[x].node.testNo, master: assessments[x].node.id })
          }
          style={{
            backgroundColor: bg,
            color: textColor,
            cursor: 'pointer',
            boxShadow:
              '0px 0px 1px rgba(0, 0, 0, 0.08), 0px 0px 2px rgba(0, 0, 0, 0.12), 0px 4px 8px rgba(0, 0, 0, 0.08)',
            paddingTop: 10,
            paddingBottom: 10,
            paddingLeft: 20,
            paddingRight: 20,
            borderRadius: 10,
            flex: 1,
            marginTop: 20,
          }}
        >
          <p style={{ fontSize: 18, fontWeight: '700', marginBottom: 0 }}>
            Assessment {assessments[x].node.testNo}
          </p>
          <p>
            <span>{outputDate}</span>
          </p>
          <div
            style={{
              paddingBottom: 5,
              borderBottom: '0.5px solid rgba(0, 0, 0, 0.1)',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'row',
              display: 'flex',
            }}
          >
            <p style={{ fontSize: 12 }}>Milestones: {assessments[x].milestone}</p>
            <p style={{ fontSize: 12 }}>Barriers: {assessments[x].barriers}</p>
            <p style={{ fontSize: 12 }}>EESA: {assessments[x].eesa}</p>
            <p style={{ fontSize: 12 }}>Transitions: {assessments[x].transition}</p>
          </div>
          <div style={{ flexDirection: 'row', display: 'flex', marginTop: 10 }}>
            <p style={{ marginRight: 10 }}>IEP Report</p>
            <p>Notes</p>
          </div>
        </div>,
      )
    }
    return pa
  }

  getAreas = () => {
    const { areas, studentID, selected, master } = this.state
    const areass = []
    let milestoneCounter = 0
    for (let x = 0; x < areas.length; x += 1) {
      switch (areas[x].areaName) {
        case 'Milestones':
          milestoneCounter = x
          areass.push(
            <div className="col-sm-12 col-md-6">
              <Link
                to={{
                  pathname: '/therapy/vbmapps/milestonesGroups',
                  areaID: areas[x].id,
                  student: studentID,
                  test: selected,
                  masterID: master,
                }}
              >
                <div
                  style={{
                    cursor: 'pointer',
                    boxShadow:
                      '0px 0px 1px rgba(0, 0, 0, 0.08), 0px 0px 2px rgba(0, 0, 0, 0.12), 0px 4px 8px rgba(0, 0, 0, 0.08)',
                    paddingTop: 10,
                    paddingBottom: 10,
                    paddingLeft: 20,
                    paddingRight: 20,
                    borderRadius: 10,
                    flex: 1,
                    marginTop: 20,
                  }}
                >
                  <p style={{ fontSize: 18, fontWeight: '700' }}>{areas[x].areaName}</p>
                  <p>{areas[x].description}</p>
                </div>
              </Link>
            </div>,
          )
          break

        case 'Barriers':
          areass.push(
            <div className="col-sm-12 col-md-6">
              <Link
                to={{
                  pathname: '/therapy/vbmapps/barriersGroups',
                  areaID: areas[x].id,
                  student: studentID,
                  test: selected,
                  masterID: master,
                }}
              >
                <div
                  style={{
                    cursor: 'pointer',
                    boxShadow:
                      '0px 0px 1px rgba(0, 0, 0, 0.08), 0px 0px 2px rgba(0, 0, 0, 0.12), 0px 4px 8px rgba(0, 0, 0, 0.08)',
                    paddingTop: 10,
                    paddingBottom: 10,
                    paddingLeft: 20,
                    paddingRight: 20,
                    borderRadius: 10,
                    flex: 1,
                    marginTop: 20,
                  }}
                >
                  <p style={{ fontSize: 18, fontWeight: '700' }}>{areas[x].areaName}</p>
                  <p>{areas[x].description}</p>
                </div>
              </Link>
            </div>,
          )
          break

        case 'Transition Assessment':
          areass.push(
            <div className="col-sm-12 col-md-6">
              <Link
                to={{
                  pathname: '/therapy/vbmapps/transitionGroups',
                  areaID: areas[x].id,
                  student: studentID,
                  test: selected,
                  masterID: master,
                }}
              >
                <div
                  style={{
                    cursor: 'pointer',
                    boxShadow:
                      '0px 0px 1px rgba(0, 0, 0, 0.08), 0px 0px 2px rgba(0, 0, 0, 0.12), 0px 4px 8px rgba(0, 0, 0, 0.08)',
                    paddingTop: 10,
                    paddingBottom: 10,
                    paddingLeft: 20,
                    paddingRight: 20,
                    borderRadius: 10,
                    flex: 1,
                    marginTop: 20,
                  }}
                >
                  <p style={{ fontSize: 18, fontWeight: '700' }}>{areas[x].areaName}</p>
                  <p>{areas[x].description}</p>
                </div>
              </Link>
            </div>,
          )
          break

        case 'EESA':
          areass.push(
            <div className="col-sm-12 col-md-6">
              <Link
                to={{
                  pathname: '/therapy/vbmapps/eesaGroups',
                  areaID: areas[x].id,
                  student: studentID,
                  test: selected,
                  masterID: master,
                }}
              >
                <div
                  style={{
                    cursor: 'pointer',
                    boxShadow:
                      '0px 0px 1px rgba(0, 0, 0, 0.08), 0px 0px 2px rgba(0, 0, 0, 0.12), 0px 4px 8px rgba(0, 0, 0, 0.08)',
                    paddingTop: 10,
                    paddingBottom: 10,
                    paddingLeft: 20,
                    paddingRight: 20,
                    borderRadius: 10,
                    flex: 1,
                    marginTop: 20,
                  }}
                >
                  <p style={{ fontSize: 18, fontWeight: '700' }}>{areas[x].areaName}</p>
                  <p>{areas[x].description}</p>
                </div>
              </Link>
            </div>,
          )
          break

        case 'Task Analysis':
          areass.push(
            <div className="col-sm-12 col-md-6">
              <Link
                to={{
                  pathname: '/therapy/vbmapps/taskGroups',
                  areaID: areas[milestoneCounter].id,
                  student: studentID,
                  test: selected,
                  masterID: master,
                }}
              >
                <div
                  style={{
                    cursor: 'pointer',
                    boxShadow:
                      '0px 0px 1px rgba(0, 0, 0, 0.08), 0px 0px 2px rgba(0, 0, 0, 0.12), 0px 4px 8px rgba(0, 0, 0, 0.08)',
                    paddingTop: 10,
                    paddingBottom: 10,
                    paddingLeft: 20,
                    paddingRight: 20,
                    borderRadius: 10,
                    flex: 1,
                    marginTop: 20,
                  }}
                >
                  <p style={{ fontSize: 18, fontWeight: '700' }}>{areas[x].areaName}</p>
                  <p>{areas[x].description}</p>
                </div>
              </Link>
            </div>,
          )
          break

        default:
          break
      }
    }
    return areass
  }

  render() {
    const { assessments, areas, studentID, selected, master } = this.state
    return (
      <Authorize roles={['parents', 'therapist', 'school_admin']} redirect to="/dashboard/beta">
        <div style={{ height: '100%', width: '100%' }}>
          <div className="row">
            <div className="col-sm-3 col-md-3">
              {assessments && assessments.length > 0 && (
                <Link
                  to={{
                    pathname: '/therapy/vbmapps/new',
                    test: assessments[assessments.length - 1].node.testNo + 1,
                    student: studentID,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: '#3E7BFA',
                      color: '#FFFFFF',
                      cursor: 'pointer',
                      boxShadow:
                        '0px 0px 1px rgba(0, 0, 0, 0.08), 0px 0px 2px rgba(0, 0, 0, 0.12), 0px 4px 8px rgba(0, 0, 0, 0.08)',
                      paddingTop: 10,
                      paddingBottom: 10,
                      paddingLeft: 20,
                      paddingRight: 20,
                      borderRadius: 10,
                      flex: 1,
                      marginTop: 20,
                      marginBottom: 20,
                    }}
                  >
                    <p style={{ marginBottom: 0 }}>New Assessment</p>
                  </div>
                </Link>
              )}
              <p style={{ fontWeight: '700', letterSpacing: 0.8, fontSize: 16 }}>
                Active Assessment
              </p>
              {assessments && assessments.length > 0 && this.getActiveAssessment()}
              <p style={{ fontWeight: '700', letterSpacing: 0.8, fontSize: 16, marginTop: 30 }}>
                Previous Assessments
              </p>
              {assessments && assessments.length > 0 && this.getPreviousAssessments()}
            </div>
            <div className="col-sm-9 col-md-9">
              <div className="row" style={{ position: 'fixed' }}>
                {areas && areas.length > 0 && this.getAreas()}
              </div>
            </div>
          </div>
        </div>
      </Authorize>
    )
  }
}

export default AssessmentsList
