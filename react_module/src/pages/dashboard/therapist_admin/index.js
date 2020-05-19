import React from 'react'
import { Layout, Row, Col, Button, Icon } from 'antd'
import { Helmet } from 'react-helmet'
import Authorize from 'components/LayoutComponents/Authorize'
import InfoCard from 'components/dashboard/InfoCard'
import doctorIcon from 'icons/doctor.png'
import parentCildIcon from 'icons/parentChild.png'
import safeGardIcon from 'icons/safeGard.png'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo'
import LearnersCard from './LearnersCard'
import AppiorMentsCard from './AppiorMentsCard'
import TasksCard from './TasksCard'
import TaskHeader from './TaskHeader'
import TaskCard from './TaskCard'

const { Content } = Layout

const SESSIONS = gql`
  query sessions($studentId: ID!) {
    sessions: GetStudentSession(studentId: $studentId) {
      edges {
        node {
          id
          sessionName {
            id
            name
          }
          duration
          sessionHost {
            edges {
              node {
                relationship {
                  name
                }
              }
            }
          }
          targets(first: 2) {
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
  }
`

export default () => {
  const studentId = localStorage.getItem('studentId')

  const { data: sessions, error: sessionsError, loading: sessionsLoading } = useQuery(SESSIONS, {
    variables: {
      studentId,
    },
  })

  return (
    <Authorize roles={['therapist']} redirect to="/dashboard/beta">
      <Helmet title="Dashboard Alpha" />
      <Layout style={{ padding: '0px' }}>
        <Content
          style={{
            padding: '0px',
            maxWidth: 1300,
            width: '100%',
            margin: '0px auto',
          }}
        >
          <Row style={{ width: '100%', margin: 0 }} gutter={[41, 0]}>
            <Col span={8} style={{ paddingLeft: 0 }}>
              <LearnersCard />
              <InfoCard
                title="Acceptance & Commitment"
                icon={safeGardIcon}
                style={{
                  height: 140,
                  margin: 0,
                  marginTop: 20,
                  maxWidth: '100%',
                }}
              />
              <InfoCard
                title="Verified Doctors"
                icon={doctorIcon}
                style={{
                  height: 140,
                  margin: 0,
                  marginTop: 20,
                  maxWidth: '100%',
                }}
              />
              <InfoCard
                title="Parent  Community"
                icon={parentCildIcon}
                style={{
                  height: 140,
                  margin: 0,
                  marginTop: 20,
                  maxWidth: '100%',
                }}
              />
            </Col>
            <Col span={16} style={{ paddingRight: 0 }}>
              <div
                style={{
                  minHeight: 374,
                }}
              >
                {sessionsLoading && 'Loading...'}
                {sessionsError && 'Opps their something is wrong'}
                {sessions &&
                  sessions.sessions.edges.map(({ node }, index) => {
                    if (index !== 0) {
                      return ''
                    }
                    return (
                      <div
                        className="taskSection"
                        style={{ position: 'relative', marginBottom: 15 }}
                      >
                        <TaskHeader
                          duration={node.duration}
                          sessionName={node.sessionName.name}
                          targetsCount={node.targets.edgeCount}
                          hostList={node.sessionHost.edges}
                          status={
                            node.childsessionSet.edges[0]
                              ? node.childsessionSet.edges[0].node.status
                              : null
                          }
                        />
                        <Row gutter={[45, 0]}>
                          {node.targets.edges.map(target => {
                            return (
                              <Col key={target.node.id} xs={24} lg={12}>
                                <TaskCard
                                  id={target.node.id}
                                  domainName={target.node.targetId.domain.domain}
                                  targetName={target.node.targetAllcatedDetails.targetName}
                                  like={target.node.targetlikeSet.edgeCount}
                                  userLiked="dislike"
                                />
                              </Col>
                            )
                          })}
                        </Row>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                          }}
                        >
                          <Button
                            type="link"
                            block
                            style={{
                              width: 100,
                              fontSize: 14,
                              lineHeight: '22px',
                              color: '#0B35B3',
                              marginTop: 10,
                            }}
                          >
                            View All
                            <Icon type="arrow-right" style={{ color: '#0B35B3' }} />
                          </Button>
                        </div>
                      </div>
                    )
                  })}
              </div>
              <AppiorMentsCard style={{ marginTop: 13 }} />
              <TasksCard style={{ marginTop: 27 }} />
            </Col>
          </Row>
        </Content>
      </Layout>
    </Authorize>
  )
}
