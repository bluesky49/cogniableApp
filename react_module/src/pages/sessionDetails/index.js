import React, { useState } from 'react'
import moment from 'moment'
import { Layout, Row, Col, Typography, Icon, Button } from 'antd'
import gql from 'graphql-tag'
import { useQuery, useMutation } from 'react-apollo'
import Calander from 'components/Calander'
import { Helmet } from 'react-helmet'
import TaskCard from './TaskCard'
import TaskHeader from './TaskHeader'

const { Content } = Layout

const QUERY = gql`
  query parentDashboard($studentId: ID!, $date: Date!) {
    sessions: GetStudentSession(studentId: $studentId, date: $date) {
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
  }
`

export default () => {
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'))
  const studentId = localStorage.getItem('studentId')

  const { data, loading, error } = useQuery(QUERY, {
    fetchPolicy: 'network-only',
    variables: {
      studentId,
      date,
    },
  })

  const handleSelectDate = newDate => {
    setDate(moment(newDate).format('YYYY-MM-DD'))
  }

  return (
    <div>
      <Helmet title="Dashboard Alpha" />
      <Layout style={{ padding: '0px' }}>
        <Content
          style={{
            padding: '0px 20px',
            maxWidth: 1300,
            width: '100%',
            margin: '0px auto',
          }}
        >
          <Calander value={date} handleOnChange={handleSelectDate} />
          <div
            style={{
              marginTop: 30,
              fontSize: 18,
            }}
          >
            {loading && 'Loading...'}
            {error && 'Opps their something wrong'}
          </div>

          {!loading &&
            data &&
            data.sessions.edges.map(({ node }) => {
              return (
                <div
                  className="taskSection"
                  style={{
                    position: 'relative',
                    marginBottom: 15,
                    marginTop: 31,
                  }}
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
                        <Col key={target.node.id} xs={24} lg={8}>
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
                      marginTop: 10,
                    }}
                  >
                    <Button
                      type="primary"
                      style={{
                        color: '#fff',
                        width: 300,
                        background: '#0B35B3',
                        height: 40,
                        fontSize: 14,
                        lineHeight: '22px',
                      }}
                    >
                      Start Session
                    </Button>
                  </div>
                </div>
              )
            })}
        </Content>
      </Layout>
    </div>
  )
}
