import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import Authorize from 'components/LayoutComponents/Authorize'
import { Row, Col, Layout, Typography, Form, Input, Button, notification } from 'antd'
import { MinusOutlined, PlusOutlined } from '@ant-design/icons'
import moment from 'moment'
import { useQuery, useMutation } from 'react-apollo'
import gql from 'graphql-tag'
import Calendar from './Calander'

import './index.scss'

const { Content } = Layout
const { Title, Text } = Typography

const MAND_DATA = gql`
  query mandPage($studentId: ID!, $date: Date!) {
    getClickData(student: $studentId, date: $date) {
      edges {
        node {
          id
          measurments
          dailyClickDataSet {
            edges {
              node {
                id
                data
                date
              }
            }
          }
        }
      }
    }
  }
`

const RECORD_MAND_DATA = gql`
  mutation recordMand($id: ID!, $data: Int!, $date: Date!) {
    recordMand(input: { dailyData: { dailyClick: $id, date: $date, data: $data } }) {
      details {
        id
        date
        data
        dailyClick {
          id
          measurments
        }
      }
    }
  }
`

const CREATE_NEW_MAND = gql`
  mutation createDailyClick($studentId: ID!, $mandTitle: String!) {
    createDailyClick(input: { clickData: { student: $studentId, measurments: $mandTitle } }) {
      details {
        id
        measurments
        student {
          id
          firstname
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
  const [newMandCreated, setNewMandCreated] = useState(false)
  const [mandTitle, setMandTitle] = useState('')
  const studentId = localStorage.getItem('studentId')
  const { data: studnetInfo } = useQuery(STUDNET_INFO, {
    variables: {
      studentId,
    },
  })

  const { data, loading, error, refetch } = useQuery(MAND_DATA, {
    variables: {
      studentId,
      date,
    },
  })

  const [recodeMandData, { data: mandNewData, error: mandNewDataError }] = useMutation(
    RECORD_MAND_DATA,
  )

  const [createNewMand, { data: newMandRes, error: newMandError }] = useMutation(CREATE_NEW_MAND, {
    variables: {
      studentId,
      mandTitle,
    },
  })

  useEffect(() => {
    if (mandNewData || newMandCreated) {
      refetch()
      setNewMandCreated(false)
    }
  }, [mandNewData, newMandCreated, refetch])

  useEffect(() => {
    if (mandNewData) {
      console.log(mandNewData)
    }
  }, [mandNewData])

  useEffect(() => {
    if (newMandRes) {
      notification.success({
        message: 'Mand Data',
        description: 'New Mand Created Successfully',
      })
      setMandTitle('')
      setNewMandCreated(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newMandRes])

  useEffect(() => {
    if (newMandError) {
      notification.error({
        message: 'Opps I cant create new mand for some reson',
      })
    }
  }, [newMandError])

  useEffect(() => {
    if (mandNewDataError) {
      console.log(mandNewDataError)
    }
  }, [mandNewDataError])

  const handleSelectDate = newDate => {
    setDate(moment(newDate).format('YYYY-MM-DD'))
  }

  const SubmitForm = e => {
    e.preventDefault()
    createNewMand()
  }

  return (
    <Authorize roles={['school_admin', 'therapist', 'parents']} redirect to="/dashboard/beta">
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
              {studnetInfo.student.firstname}&apos;s Mand Data
            </Title>
          )}

          <Row gutter={[46, 0]}>
            <Col span={16}>
              <Calendar value={date} handleOnChange={handleSelectDate} />
              <div
                style={{
                  marginTop: 41,
                }}
              >
                <div
                  style={{
                    marginTop: 17,
                  }}
                >
                  {/* {data &&
                    <pre>
                      {JSON.stringify(data.getClickData.edges, null, 2)}
                    </pre>} */}
                  {loading ? (
                    'Loading...'
                  ) : (
                    <>
                      {error && <pre>{JSON.stringify(error, null, 2)}</pre>}
                      {data &&
                        data.getClickData.edges.map(({ node }, index) => {
                          // eslint-disable-next-line no-shadow
                          const dailyClickData = node.dailyClickDataSet.edges[0]
                            ? parseInt(node.dailyClickDataSet.edges[0].node.data, 10)
                            : 0
                          return (
                            <div
                              id={node.id}
                              style={{
                                background: '#FFFFFF',
                                border: '1px solid #E4E9F0',
                                boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
                                borderRadius: 10,
                                padding: '26px 35px',
                                position: 'relative',
                                marginTop: index !== 0 ? 20 : 0,
                              }}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                }}
                              >
                                <Title
                                  style={{
                                    fontSize: 24,
                                    lineHeight: '33px',
                                    margin: 0,
                                  }}
                                >
                                  {studnetInfo && studnetInfo.student.firstname}&apos;s requests for{' '}
                                  {node.measurments}
                                </Title>

                                <Button
                                  style={{ marginLeft: 'auto' }}
                                  onClick={() => {
                                    let newDailyClickData = dailyClickData
                                    if (dailyClickData > 0) {
                                      newDailyClickData -= 1
                                      console.log(newDailyClickData)
                                      recodeMandData({
                                        variables: {
                                          id: node.id,
                                          data: newDailyClickData,
                                          date,
                                        },
                                      })
                                    }
                                  }}
                                >
                                  <MinusOutlined />
                                </Button>
                                <Text
                                  style={{
                                    fontSize: 14,
                                    lineHeight: '19px',
                                    color: '#2E2E2E',
                                    marginLeft: 9,
                                    marginRight: 19,
                                  }}
                                >
                                  {dailyClickData}
                                </Text>
                                <Button
                                  onClick={() => {
                                    recodeMandData({
                                      variables: {
                                        id: node.id,
                                        date,
                                        data: dailyClickData + 1,
                                      },
                                    })
                                  }}
                                >
                                  <PlusOutlined />
                                </Button>
                              </div>
                            </div>
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
                New Mand
              </Title>
              <div
                style={{
                  background: '#F9F9F9',
                  borderRadius: 10,
                  padding: '30px',
                }}
              >
                <Form onSubmit={e => SubmitForm(e)} name="control-ref" style={{ marginLeft: 0 }}>
                  <Form.Item label="Meal Name">
                    <Input
                      value={mandTitle}
                      onChange={e => setMandTitle(e.target.value)}
                      placeholder="Enter Mand Title"
                      name="mandTitle"
                      required
                    />
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{
                        width: '100%',
                        height: 50,
                        marginTop: 0,
                        fontSize: 16,
                        background: '#0B35B3',
                      }}
                    >
                      Save Mand
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Authorize>
  )
}
