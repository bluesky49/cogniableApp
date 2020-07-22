/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-indent */
import React, { useState, useEffect } from 'react'
import { Layout, Card, Row, Col, Typography, Button, Tag, Progress, notification } from 'antd'
import gql from 'graphql-tag'
import { useQuery, useMutation } from 'react-apollo'
import cardImg from 'images/smile_family.jpg'
import Scrollbars from 'react-custom-scrollbars'
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons'
import { Spinner } from 'reactstrap'
import { history } from 'index'
import client from 'apollo/config'

const { Content } = Layout
const { Title, Text } = Typography

const GET_PEAK_CODES = gql`
  query {
    peakGetCodes(peakType: "Direct") {
      edges {
        node {
          id
          peakType
          code
          description
          instructions
          expRes
        }
      }
    }
  }
`

const GET_CODE_DETAILS = gql`
  query($id: ID!) {
    peakCodeDetails(id: $id) {
      id
      peakType
      code
      description
      instructions
      expRes
    }
  }
`

const SEND_RESPONSE = gql`
  mutation($programId: ID!, $yes: [ID]!, $no: [ID]!) {
    peakSubmitResponse(input: { program: $programId, yes: $yes, no: $no }) {
      details {
        id
        program {
          id
          title
          date
        }
        yes {
          edges {
            node {
              id
              code
            }
          }
        }
        no {
          edges {
            node {
              id
              code
            }
          }
        }
      }
    }
  }
`

const QUIT = gql`
  mutation($programId: ID!) {
    peakFinishAssessment(input: { program: $programId }) {
      details {
        id
        date
        title
        status
      }
    }
  }
`

const SUMMERY = gql`
  query($program: ID!) {
    peakDataSummary(program: $program) {
      total
      totalAttended
      totalCorrect
      totalIncorrect
      totalNoResponse
      edges {
        node {
          id
          yes {
            edges {
              node {
                id
                code
              }
            }
          }
          no {
            edges {
              node {
                id
                code
              }
            }
          }
        }
      }
    }
  }
`

export default () => {
  const { data, error, loading } = useQuery(GET_PEAK_CODES)
  const [selectedQ, setSelectedQ] = useState()
  const peakId = localStorage.getItem('peakId')

  const { data: summeryData } = useQuery(SUMMERY, {
    variables: {
      program: peakId,
    },
  })

  const { data: quartionData, error: quartionError, loading: quartionLoading } = useQuery(
    GET_CODE_DETAILS,
    {
      variables: {
        id: selectedQ?.id,
      },
    },
  )

  const [
    sendResponse,
    { data: sendResponseData, error: sendResponseError, loading: sendResponseLoading },
  ] = useMutation(SEND_RESPONSE)

  const [quit, { data: quitRes, error: quitError, loading: quitLoading }] = useMutation(QUIT, {
    variables: {
      programId: peakId,
    },
  })

  useEffect(() => {
    if (quitRes) {
      history.push('/peakResult')
    }
    if (quitError) {
      notification.error({
        message: 'Error to quit PEAK assigment',
      })
    }
  }, [quitRes, quitError])

  useEffect(() => {
    if (data) {
      setSelectedQ({ id: data.peakGetCodes.edges[0]?.node.id, index: 0 })
    }
  }, [data])

  useEffect(() => {
    if (sendResponseError) {
      notification.error({
        message: "Their are something wrong. Can't send response",
      })
    }
    if (sendResponseData) {
      // const cacheSummeryData = client.readQuery(SUMMERY);
      // client.writeQuery({
      //   query: SUMMERY,
      //   variables: {
      //     program: peakId,
      //   },
      //   data: {
      //     peakDataSummary: Ob {
      //       totalAttended:
      //     }
      //   }
      // });
      nextQua(selectedQ.index)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sendResponseError, sendResponseData])

  const nextQua = nowIndex => {
    const id = data.peakGetCodes.edges[nowIndex + 1]?.node.id
    if (id) {
      setSelectedQ({ id, index: nowIndex + 1 })
    }
  }

  const prevQua = nowIndex => {
    const id = data.peakGetCodes.edges[nowIndex - 1]?.node.id
    if (id) {
      setSelectedQ({ id, index: nowIndex - 1 })
    }
  }

  const handelSelectQ = (id, index) => () => {
    setSelectedQ({ id, index })
  }

  const handleSendRes = ans => () => {
    sendResponse({
      variables: {
        programId: peakId,
        yes: ans === 'y' ? [selectedQ.id] : [],
        no: ans === 'y' ? [] : [selectedQ.id],
      },
    })
  }

  if (error) {
    return <pre>{JSON.stringify(error, null, 2)}</pre>
  }

  if (loading) {
    return 'Loading...'
  }

  return (
    <Layout>
      <Content
        style={{
          maxWidth: '1300px',
          marginLeft: 'auto',
          marginRight: 'auto',
          width: '100%',
        }}
      >
        <Row>
          <Col span={18}>
            <div style={{ padding: 24, border: '2px solid #f9f9f9', borderRadius: '20px', marginRight: '10px' }}>
            {/* {quartionLoading ? (
              <div
                style={{
                  width: '100%',
                  height: '60vh',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                }}
              >
                Loading..
              </div>
            ) : ( */}
            <div>
              {quartionError && selectedQ && <pre>{JSON.stringify(quartionError, null, 2)}</pre>}
              {quartionData && selectedQ && (
                <div>
                  <Row>
                    <Col span={10}>
                      <img
                        src={cardImg}
                        alt=""
                        style={{
                          height: 200,
                          borderRadius: 10,
                          width: '100%',
                          marginTop: 10,
                        }}
                      />
                    </Col>
                    {quartionLoading ? (
                      <div
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 20,
                        }}
                      >
                        Loading..
                      </div>
                    ) : (
                        <Col span={14} style={{ padding: '0px 20px' }}>
                          <Title style={{ marginTop: 20, fontSize: 24 }}>
                            Question {quartionData.peakCodeDetails.code} : {quartionData.peakCodeDetails.instructions}
                          </Title>
                          <Text style={{ marginTop: 0, fontSize: 18, lineHeight: '27px', display: 'block' }}>
                            {quartionData.peakCodeDetails.description}
                          </Text>
                          <Title style={{ fontWeight: 600, fontSize: 18, marginTop: 12, display: 'inline-block' }}>
                            Expected Response:
                          </Title>
                          <Text style={{ fontSize: 18, display: 'inline-block' }}>&nbsp;{quartionData.peakCodeDetails.expRes}</Text>
                        </Col>
                      )}
                  </Row>




                  <div
                    style={{
                      marginTop: 105,
                      textAlign: 'right'
                    }}
                  >
                    {sendResponseLoading && (
                      <div
                        style={{
                          // position: 'absolute',
                          width: '100%',
                          height: '100%',
                          background: '#f9f9f9',
                          color: '#000',

                          // alignItems: 'center',
                          // justifyContent: 'center',
                          padding: '3px'
                          // zIndex: 1000,
                        }}
                      >
                        Recording response...
                      </div>
                    )}
                    <Button
                      style={{
                        borderRadius: 10,
                        background: '#4BAEA0',
                        height: 80,
                        width: 250,
                        // position: 'relative',
                        // float: 'right',
                      }}
                      onClick={handleSendRes('y')}
                    >
                      <Title style={{ color: '#fff', fontSize: 20 }}>
                        Correct Response
                        </Title>
                      {/* <Text
                            style={{
                              color: '#fff',
                              fontSize: 20,
                              marginTop: 6,
                            }}
                          >
                            Anna gave an expected response
                        </Text> */}
                    </Button>
                    <Button
                      style={{
                        borderRadius: 10,
                        background: '#FF8080',
                        height: 80,
                        // float: 'right',
                        width: 250
                      }}
                      onClick={handleSendRes('n')}
                    >
                      <Title style={{ color: '#fff', fontSize: 20 }}>
                        Incorrect Response
                        </Title>
                      {/* <Text
                            style={{
                              color: '#fff',
                              fontSize: 20,
                              marginTop: 6,
                            }}
                          >
                            Anna gave an unexpected response
                        </Text> */}
                    </Button>
                  </div>
                </div>
              )}
            </div>
            {/* )} */}
            <div style={{ marginTop: 40, textAlign: 'right' }}>

              <Button
                style={{ marginLeft: 'auto', height: 57 }}
                onClick={() => prevQua(selectedQ.index)}
              >
                <ArrowLeftOutlined style={{ fontSize: 20, marginTop: 4 }} />
              </Button>
              <Button
                style={{ marginLeft: 6, height: 57 }}
                onClick={() => nextQua(selectedQ.index)}
              >
                <ArrowRightOutlined style={{ fontSize: 20, marginTop: 4 }} />
              </Button>
              <Button
                type="danger"
                style={{
                  marginLeft: 6,
                  height: 57,
                  width: 100,
                  fontSize: 18,
                  fontWeight: 'bold',
                  background: '#FF8080'
                }}
                loading={quitLoading}
                onClick={() => {
                  quit()
                }}
              >
                Quit
              </Button>

              {summeryData && (
                <div
                  style={{
                    background: '#F0F6FF',
                    padding: '7px 17px',
                    borderRadius: 4,
                    width: '100%',
                    marginTop: '10px'
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      color: '#8C98AA',
                    }}
                  >
                    {summeryData.peakDataSummary.totalAttended} &nbsp; of
                    {summeryData.peakDataSummary.total} answered
                  </Text>
                  <Progress
                    percent={
                      (summeryData.peakDataSummary.totalAttended /
                        summeryData.peakDataSummary.total) *
                      100
                    }
                    size="small"
                    showInfo={false}
                  />
                </div>
              )}


            </div>
          </div>
          </Col>


          <Col
            span={6}
            style={{
              padding: 10,
              background: '#f9f9f9',
              borderRadius: 10,
            }}
          >
            <Scrollbars
              style={{
                height: 'calc(100vh - 180px)',
                minHeight: 'calc(100vh - 180px)',
              }}
              autoHide
            >
              {selectedQ &&
                data?.peakGetCodes.edges.map(({ node }, index) => {
                  const selected = node.id === selectedQ.id
                  return (
                    <Card
                      key={node.id}
                      style={{
                        marginTop: index === 0 ? 0 : 20,
                        border: 'none',
                        cursor: 'pointer',
                      }}
                      bodyStyle={{
                        padding: 10,
                        background: selected ? '#E58425' : '#FFFFFF',
                        border: '1px solid #EBE8E8',
                        boxShadow: '0px 0px 5px rgba(114, 111, 111, 0.3)',
                        borderRadius: 10,
                        paddingBottom: 15,
                      }}
                      onClick={handelSelectQ(node.id, index)}
                    >
                      <img
                        src={cardImg}
                        alt=""
                        style={{ height: 140, borderRadius: 10, width: '100%' }}
                      />
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginTop: 9,
                          padding: '0px 17px',
                        }}
                      >
                        <Title
                          style={{
                            fontSize: 24,
                            marginBottom: 1,
                            color: selected ? '#fff' : '#000',
                          }}
                        >
                          {node.code}
                        </Title>
                        <Tag
                          style={{
                            height: 25,
                            background: selected ? '#fff' : '#E58425',
                            paddingTop: 2,
                            fontSize: 14,
                            fontWeight: 600,
                            color: selected ? '#E58425' : '#fff',
                          }}
                        >
                          {node.peakType}
                        </Tag>
                      </div>
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: 600,
                          padding: '0px 17px',
                          marginTop: 0,
                          color: selected ? '#fff' : '#000',
                        }}
                      >
                        8 Targets. 44 Trials
                      </Text>
                    </Card>
                  )
                })}
            </Scrollbars>
          </Col>
        </Row>
      </Content>
    </Layout>
  )
}
