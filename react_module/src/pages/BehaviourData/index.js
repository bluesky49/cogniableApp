/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable react/jsx-closing-tag-location */
import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { Row, Col, Layout, Typography, Button, Drawer } from 'antd'
import moment from 'moment'
import { useQuery } from 'react-apollo'
import gql from 'graphql-tag'
import Calendar from 'components/Calander'
import Scrollbars from 'react-custom-scrollbars'
import Search from 'antd/lib/input/Search'
import BehaviourCard from 'components/Behaviour/BehaviourCard'
import TemplateForm from './Templateform'
import TamplateCard from './TamplateCard'
import CreateDehavrioDrawer from './CreateDehavrioDrawer'
import UpdateTemplateForm from './UpdateTemplateForm'

const { Content } = Layout
const { Title, Text } = Typography
const BEHAVIOUR_RECORD_DATA = gql`
  query getDecelData($date: Date!, $studentId: ID!, $status: ID) {
    getDecelData(template_Student: $studentId, date_Gte: $date, date_Lte: $date, status: $status) {
      edges {
        node {
          id
          irt
          note
          duration
          template {
            id
            behavior {
              behaviorName
            }
          }
          status {
            id
            statusName
          }
          frequency {
            edges {
              node {
                id
              }
            }
          }
        }
      }
    }
  }
`

const GET_TEMPLETES = gql`
  query getTemplate($studentId: ID!) {
    getTemplate(student: $studentId) {
      edges {
        node {
          id
          behavior {
            id
            behaviorName
            definition
          }
          status {
            id
            statusName
          }
          environment {
            edges {
              node {
                id
              }
            }
          }
          behaviorDescription
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
  const [newTamplate, setNewTamplate] = useState(false)
  const [newTampletFromOpen, setNewTamplateFromOpen] = useState(false)
  const [newRecordDrawer, setNewRecordDrawer] = useState(false)
  const studentId = localStorage.getItem('studentId')
  const [selectTamplate, setSelectTamplate] = useState()
  const [updateTempId, setUpdateTempId] = useState()
  const [viewBehaviorRecordData, setViewBehaviorRecordData] = useState()
  const [newRecord, setNewRecord] = useState()
  const [deleteTem, setDeleteTem] = useState()
  const [tamplateList, setTamplateList] = useState()
  const [filterTemText, setFilterTemText] = useState('')
  const [updateBehavior, setUpdateBehavior] = useState()
  const [deleteBehaviour, setDeleteBehaviour] = useState()

  const { data, loading, error } = useQuery(BEHAVIOUR_RECORD_DATA, {
    fetchPolicy: 'no-cache',
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

  const {
    data: dancleTemplateData,
    error: dancleTemplateError,
    loading: dancleTemplateLoading,
  } = useQuery(GET_TEMPLETES, {
    variables: {
      studentId,
    },
  })

  useEffect(() => {
    if (deleteBehaviour) {
      setViewBehaviorRecordData(state => {
        return state.filter(beh => beh.node.id !== deleteBehaviour)
      })
      setDeleteBehaviour(null)
    }
  }, [deleteBehaviour])

  useEffect(() => {
    if (filterTemText.length > 0) {
      const searchText = filterTemText.trim().toLowerCase()
      const filteredTem = tamplateList.filter(tem => {
        return tem.node.behavior.behaviorName.toLowerCase().match(searchText)
      })
      setTamplateList(filteredTem)
    }
    if (filterTemText.length === 0 && dancleTemplateData) {
      setTamplateList([...dancleTemplateData.getTemplate.edges])
    }
  }, [filterTemText, dancleTemplateData])

  useEffect(() => {
    if (updateBehavior) {
      setViewBehaviorRecordData(state => {
        const newState = state.map(beh => {
          console.log(updateBehavior)
          if (beh.node.id === updateBehavior.id) {
            beh.node = updateBehavior
          }
          return beh
        })
        return newState
      })
    }
  }, [updateBehavior])

  useEffect(() => {
    if (data) {
      setViewBehaviorRecordData([...data.getDecelData.edges])
    }
  }, [data])

  useEffect(() => {
    if (deleteTem) {
      setTamplateList(state => {
        return state.filter(({ node }) => node.id !== deleteTem)
      })
      setDeleteTem(null)
      setViewBehaviorRecordData(state => {
        return state.filter(({ node }) => node.template.id !== deleteTem)
      })
    }
  }, [deleteTem])

  useEffect(() => {
    if (newRecord) {
      if (newRecord.node.date === date) {
        setViewBehaviorRecordData(state => {
          return [newRecord, ...state]
        })
      }
    }
  }, [newRecord])

  useEffect(() => {
    if (dancleTemplateData) {
      return setTamplateList([...dancleTemplateData.getTemplate.edges])
    }
  }, [dancleTemplateData])

  useEffect(() => {
    if (newTamplate) {
      setTamplateList(state => {
        return [newTamplate, ...state]
      })
      setNewTamplate(null)
      setNewTamplateFromOpen(false)
    }
  }, [newTamplate])

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
          {studnetInfo && (
            <Title
              style={{
                marginBottom: 30,
                fontSize: 25,
              }}
            >
              {studnetInfo.student.firstname}&apos;s Behavior Data
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
                      {error && <pre>{JSON.stringify(error, null, 2)}</pre>}
                      {data &&
                        viewBehaviorRecordData &&
                        viewBehaviorRecordData.map(({ node }, index) => {
                          return (
                            <BehaviourCard
                              key={node.id}
                              id={node.id}
                              behaviorName={node.template.behavior.behaviorName}
                              time={node.duration}
                              note={node.note}
                              irt={node.irt}
                              frequently={node.frequency.edges.length}
                              style={{ marginTop: index === 0 ? 0 : 20 }}
                              setDeleteBehaviour={setDeleteBehaviour}
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
                  fontSize: '25px',
                  lineHeight: '41px',
                }}
              >
                {newTampletFromOpen ? 'New Behaviour Templates' : 'Behaviour Templates'}
              </Title>
              <div
                style={{
                  background: '#F9F9F9',
                  borderRadius: 10,
                  padding: '30px',
                  paddingBottom: '20px',
                }}
              >
                {updateTempId ? (
                  <UpdateTemplateForm tempId={updateTempId} setUpdateTempId={setUpdateTempId} />
                ) : (
                  <div>
                    {newTampletFromOpen ? (
                      <TemplateForm
                        setNewTampletFromOpen={setNewTamplateFromOpen}
                        setNewTamplate={setNewTamplate}
                      />
                    ) : (
                      <div>
                        {dancleTemplateLoading ? (
                          <div
                            style={{
                              height: 'calc(100vh - 320px)',
                              minHeight: 'calc(100vh - 320px)',
                            }}
                          >
                            Loading...
                          </div>
                        ) : (
                          <Scrollbars
                            style={{
                              height: 'calc(100vh - 320px)',
                              minHeight: 'calc(100vh - 320px)',
                            }}
                            autoHide
                          >
                            {dancleTemplateError && 'Opps their is something wrong'}

                            <Search
                              placeholder="search by tarmplet name"
                              size="large"
                              style={{
                                width: '99.70%',
                                marginLeft: 'auto',
                                marginBottom: 10,
                                marginRight: 'auto',
                              }}
                              value={filterTemText}
                              onChange={e => setFilterTemText(e.target.value)}
                            />

                            {tamplateList?.length === 0 && (
                              <div
                                style={{
                                  width: '100%',
                                  height: '70%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <Text
                                  style={{
                                    fontSize: 16,
                                    textAlign: 'center',
                                  }}
                                >
                                  Their is no Behavior Tamplate <br />
                                  Please create One
                                </Text>
                              </div>
                            )}

                            {tamplateList?.map(({ node }, index) => {
                              return (
                                <TamplateCard
                                  key={node.id}
                                  id={node.id}
                                  behaviourName={node.behavior.behaviorName}
                                  description={node.behaviorDescription}
                                  status={node.status.statusName}
                                  envsNum={node.environment.edges.length}
                                  setNewRecordDrawer={setNewRecordDrawer}
                                  style={{
                                    marginTop: index === 0 ? 0 : 20,
                                  }}
                                  setSelectTamplate={setSelectTamplate}
                                  setDeleteTem={setDeleteTem}
                                  setUpdateTempId={setUpdateTempId}
                                />
                              )
                            })}
                          </Scrollbars>
                        )}
                        <Button
                          type="primary"
                          htmlType="submit"
                          onClick={() => {
                            setNewTamplateFromOpen(true)
                          }}
                          style={{
                            width: '100%',
                            height: 40,
                            background: '#0B35B3',
                            boxShadow:
                              '0px 2px 4px rgba(96, 97, 112, 0.16), 0px 0px 1px rgba(40, 41, 61, 0.04) !importent',
                            borderRadius: 8,
                            fontSize: 17,
                            fontWeight: 'bold',
                            marginTop: 10,
                          }}
                        >
                          New Template
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Col>
          </Row>

          <Drawer
            width={500}
            title="Add Behaviour Templates"
            placement="right"
            visible={newRecordDrawer}
            onClose={() => {
              setNewRecordDrawer(false)
              setSelectTamplate(null)
            }}
          >
            {selectTamplate && (
              <CreateDehavrioDrawer
                setNewTamplateFromOpen={setNewTamplateFromOpen}
                setNewRecordDrawer={setNewRecordDrawer}
                selectTamplate={selectTamplate}
                setNewRecord={setNewRecord}
                setSelectTamplate={setSelectTamplate}
                setUpdateBehavior={setUpdateBehavior}
              />
            )}
          </Drawer>
        </Content>
      </Layout>
    </div>
  )
}
