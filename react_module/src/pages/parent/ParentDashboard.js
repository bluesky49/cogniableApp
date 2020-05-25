/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-expressions */
/* eslint-disable array-callback-return */
import React, { useState } from 'react'
import { Layout, Row, Col, Typography, Icon, Button } from 'antd'
import './parentDashboard.scss'
import doctorIcon from 'icons/doctor.png'
import parentCildIcon from 'icons/parentChild.png'
import safeGardIcon from 'icons/safeGard.png'
import gql from 'graphql-tag'
import { useQuery, useMutation } from 'react-apollo'
import { useSelector } from 'react-redux'
import { Helmet } from 'react-helmet'
import PerformanceSummary from './ParentDashboard/PerformenceSummary'
import PerformenceGrap from './ParentDashboard/PerformenceGrap'
import AppointmentsCard from './ParentDashboard/AppointmentsCard'
import SessionCard from './ParentDashboard/SessionCard'
import InfoCard from '../../components/dashboard/InfoCard'
import timeBack from './ParentDashboard/utils'

const { Content } = Layout
const { Title } = Typography

const QUERY = gql`
  query parentDashboard($studentId: ID!) {
    total_targets: targetAllocates(studentId: $studentId) {
      edgeCount
    }
    student(id: $studentId) {
      firstname
    }
    mastered_targets: targetAllocates(studentId: $studentId, targetStatus: "U3RhdHVzVHlwZTox") {
      edgeCount
    }
    sessions: GetStudentSession(studentId: $studentId) {
      edges {
        node {
          id
          sessionName {
            id
            name
          }
          itemRequired
          duration
          sessionHost {
            edges {
              node {
                memberName
                relationship {
                  name
                }
              }
            }
          }
          instruction {
            edges {
              node {
                id
                instruction
              }
            }
          }
          targets(first: 3) {
            edgeCount

            edges {
              node {
                id
                targetlikeSet {
                  edgeCount
                }
                targetId {
                  domain {
                    domain
                  }
                }
                targetAllcatedDetails {
                  id
                  targetName
                }
              }
            }
          }
          childsessionSet(last: 1) {
            edges {
              node {
                id
                status
              }
            }
          }
        }
      }
    }
    appointment: appointments(student: $studentId, first: 2) {
      edges {
        node {
          id
          start
          end
          therapist {
            id
            name
            userRole {
              name
            }
          }
          location {
            id
            location
          }
        }
      }
    }
  }
`

const PERFORMENCE = gql`
  query TargetCount($studentId: ID, $date: Date) {
    total_targets: targetAllocates(studentId: $studentId, date_Gte: $date) {
      edgeCount
    }
    mastered_targets: targetAllocates(
      studentId: $studentId
      targetStatus: "U3RhdHVzVHlwZTox"
      targetStatus_Date_Gte: $date
    ) {
      edgeCount
    }
    intherapy_targets: targetAllocates(
      studentId: $studentId
      targetStatus: "U3RhdHVzVHlwZToz"
      targetStatus_Date_Gte: $date
    ) {
      edgeCount
    }
  }
`

const SEND_LIKE = gql`
  mutation($targetId: ID!) {
    targetLike(input: { target: $targetId }) {
      targetLike {
        id
      }
    }
  }
`
const ParentDashboard = () => {
  const user = useSelector(state => state.user)
  const studentId = localStorage.getItem('studentId')
  const [targetCountBy, setTargetCountBy] = useState('week')
  const performenceQuery = useQuery(PERFORMENCE, {
    variables: {
      studentId,
      date: timeBack(targetCountBy),
    },
  })
  const { data, loading, error } = useQuery(QUERY, {
    variables: {
      studentId,
    },
  })
  const [sendLike, sendLikeRes] = useMutation(SEND_LIKE)

  if (loading) {
    return 'Loading...'
  }

  if (error) {
    return <pre>{JSON.stringify(error)}</pre>
  }

  const handleTargetCountBy = value => {
    setTargetCountBy(value)
  }

  return (
    <div>
      <Helmet title="Dashboard Parent" />
      <Layout style={{ backgroundColor: '#fff', padding: '0px' }}>
        <Layout>
          <Content
            style={{
              padding: '0px 20px',
              maxWidth: 1300,
              width: '100%',
              margin: '0px auto',
            }}
          >
            <Typography>
              <Title ellipsis level={2} className="pageTitle">
                {data.student.firstname}’s Dashboard
              </Title>
            </Typography>

            {performenceQuery.error && 'Opps their is some thing wrong'}
            {performenceQuery.data && (
              <PerformanceSummary
                totalTarget={performenceQuery.data.total_targets.edgeCount}
                masteredTarget={performenceQuery.data.mastered_targets.edgeCount}
                inTherapyTargets={performenceQuery.data.intherapy_targets.edgeCount}
                style={{ marginBottom: 39 }}
                targetCountBy={targetCountBy}
                handleTargetCountBy={handleTargetCountBy}
              />
            )}

            <Row gutter={[39, 0]}>
              <Col style={{ backgroundColor: 'transparent' }} xs={24} lg={8}>
                <AppointmentsCard appointments={data.appointment.edges} />
              </Col>
              <Col style={{ backgroundColor: 'transparent' }} xs={24} lg={16}>
                <PerformenceGrap />
              </Col>
            </Row>

            <div className="taskSection" style={{ position: 'relative', marginBottom: 15 }}>
              <Row gutter={[45, 0]}>
                {data.sessions.edges.map(({ node }) => (
                  <>
                    {node.targets.edgeCount > 0 ? (
                      <>
                        <Col key={node.id} xs={24} lg={8}>
                          <SessionCard
                            id={node.id}
                            sessionName={node.sessionName.name}
                            duration={node.duration}
                            hostList={node.sessionHost.edges}
                            session={node}
                          />
                        </Col>
                      </>
                    ) : (
                      ''
                    )}
                  </>
                ))}
              </Row>
            </div>

            <Row gutter={[45, 0]}>
              <Col xs={24} lg={8}>
                <InfoCard title="Acceptance & Commitment" icon={safeGardIcon} />
              </Col>
              <Col xs={24} lg={8}>
                <InfoCard title="Verified Doctors" icon={doctorIcon} />
              </Col>
              <Col xs={24} lg={8}>
                <InfoCard
                  title="Parent  Community"
                  icon={parentCildIcon}
                  style={{ marginRight: 0 }}
                />
              </Col>
            </Row>
          </Content>
        </Layout>
      </Layout>
    </div>
  )
}

export default ParentDashboard
