/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import Authorize from 'components/LayoutComponents/Authorize'
import { Row, Col, Layout, Typography } from 'antd'
import moment from 'moment'
import { useQuery } from 'react-apollo'
import gql from 'graphql-tag'
import Calendar from 'components/Calander'
import ABCCard from './ABCCard'
import AbcForm from './AbcForm'

const { Content } = Layout
const { Title } = Typography

const ABC = gql`
  query getABC($studentId: ID!, $date: Date!) {
    getABC(studentId: $studentId, date: $date) {
      edges {
        node {
          id
          date
          target
          frequency
          time
          Intensiy
          response
          Duration
          Notes
          behavior {
            edges {
              node {
                id
                behaviorName
              }
            }
          }
          consequences {
            edges {
              node {
                id
                consequenceName
              }
            }
          }
          antecedent {
            edges {
              node {
                id
                antecedentName
              }
            }
          }
          environments {
            id
            name
          }
        }
      }
    }
  }
`

const STUDNET_INFO = gql`
  query student($studentId: ID!) {
    student(id: $studentId) {
      firstname
    }
  }
`

export default () => {
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'))
  const [abc, setAbc] = useState()
  const [newAbc, setNewAbc] = useState()

  const studentId = localStorage.getItem('studentId')

  const { data, loading, error } = useQuery(ABC, {
    variables: {
      studentId,
      date,
    },
  })

  const { data: studnetInfo } = useQuery(STUDNET_INFO, {
    variables: {
      studentId,
    },
  })

  useEffect(() => {
    if (data) {
      setAbc([...data.getABC.edges])
    }
  }, [data])

  useEffect(() => {
    if (newAbc) {
      setAbc([newAbc, ...data.getABC.edges])
    }
  }, [newAbc])

  const handleSelectDate = newDate => {
    setDate(moment(newDate).format('YYYY-MM-DD'))
  }

  return (
    <Authorize roles={['school_admin', 'parents', 'therapist']} redirect to="/dashboard/beta">
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
          {studnetInfo && (
            <Title
              style={{
                marginBottom: 30,
                fontSize: 25,
              }}
            >
              {studnetInfo.student.firstname}&apos;s ABC Data
            </Title>
          )}

          <Row gutter={[46, 0]}>
            <Col span={16}>
              <Calendar value={date} handleOnChange={handleSelectDate} />
              <div
                style={{
                  marginTop: 25,
                }}
              >
                <div
                  style={{
                    marginTop: 17,
                  }}
                >
                  {loading ? (
                    'Loading...'
                  ) : (
                    <>
                      {error && 'Opps their something wrong'}
                      {abc?.map(({ node }) => {
                        return (
                          <ABCCard
                            key={node.id}
                            style={{ marginTop: 20 }}
                            time={node.time}
                            behavior={node.behavior.edges}
                            // location={node.location.edges}
                            environment={node.environments}

                          />
                        )
                      })}
                    </>
                  )}
                </div>
              </div>
            </Col>
            <Col span={8}>
              <Title
                style={{
                  marginLeft: '30px',
                  fontSize: '30px',
                  lineHeight: '41px',
                }}
              >
                New ABC Data
              </Title>
              <div
                style={{
                  background: '#F9F9F9',
                  borderRadius: 10,
                  padding: '30px',
                }}
              >
                <AbcForm setNewAbc={setNewAbc} />
              </div>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Authorize>
  )
}
