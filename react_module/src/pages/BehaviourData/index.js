import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import Authorize from 'components/LayoutComponents/Authorize'
import { Row, Col, Layout, Typography, Button, Drawer } from 'antd'
import moment from 'moment'
import { useQuery } from 'react-apollo'
import gql from 'graphql-tag'
import Calendar from 'components/Calander'
import Scrollbars from 'react-custom-scrollbars'
import BehaviourCard from './BehaviourCard'
import TemplateForm from './Templateform'
import TamplateCard from './TamplateCard'
import CreateDehavrioDrawer from './CreateDehavrioDrawer'

const { Content } = Layout
const { Title, Text } = Typography

const BEHAVIOUR_RECORD_DATA = gql`
  query getDecelData($date: Date!, $studentId: ID!) {
    getDecelData(template_Student: $studentId, date_Gte: $date, date_Lte: $date) {
      edges {
        node {
          id
          irt
          note
          duration
          template {
            behavior {
              behaviorName
            }
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
          behaviorDef
          behaviorDescription
        }
      }
    }
  }
`

export default () => {
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'))
  const [newMealDate, setNewMealDate] = useState(date)
  const [newTamplateCreated, setNewTamplateCreated] = useState(false)
  const [newTampletFromOpen, setNewTamplateFromOpen] = useState(false)
  const [newRecordDrawer, setNewRecordDrawer] = useState(false)
  const studentId = localStorage.getItem('studentId')
  const [selectTamplate, setSelectTamplate] = useState()

  const { data, loading, error } = useQuery(BEHAVIOUR_RECORD_DATA, {
    variables: {
      studentId,
      date,
    },
  })

  const {
    data: dancleTemplateData,
    error: dancleTemplateError,
    loading: dancleTemplateLoading,
    refetch: dancleTempleteRefatch,
  } = useQuery(GET_TEMPLETES, {
    variables: {
      studentId,
    },
  })

  useEffect(() => {
    if (newTamplateCreated) {
      dancleTempleteRefatch()
      setNewTamplateCreated(false)
      setNewTamplateFromOpen(false)
    }
  }, [dancleTempleteRefatch, newTamplateCreated])

  const handleSelectDate = newDate => {
    setDate(moment(newDate).format('YYYY-MM-DD'))
  }

  return (
    <Authorize roles={['school_admin', 'parents']} redirect to="/dashboard/beta">
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
                  {loading ? (
                    'Loading...'
                  ) : (
                    <>
                      {error && <pre>{JSON.stringify(error, null, 2)}</pre>}
                      {data &&
                        data.getDecelData.edges.map(({ node }, index) => {
                          return (
                            <BehaviourCard
                              key={node.id}
                              behaviorName={node.template.behavior.behaviorName}
                              time={node.duration}
                              note={node.note}
                              irt={node.irt}
                              frequently={node.frequency.edges.length}
                              style={{ marginTop: index === 0 ? 0 : 20 }}
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
                {newTampletFromOpen ? (
                  <TemplateForm
                    handleNewMealDate={newDate => {
                      setNewMealDate(newDate)
                    }}
                    setNewTampletFromOpen={setNewTamplateFromOpen}
                    setNewTamplateCreated={setNewTamplateCreated}
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
                      >
                        {dancleTemplateError && 'Opps their is something wrong'}
                        {dancleTemplateData &&
                          dancleTemplateData.getTemplate.edges.map(({ node }, index) => {
                            return (
                              <TamplateCard
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
            </Col>
          </Row>

          <Drawer
            width={500}
            title="Add Behaviour Templates"
            placement="right"
            visible={newRecordDrawer}
            onClose={() => setNewRecordDrawer(false)}
          >
            <CreateDehavrioDrawer
              setNewTamplateFromOpen={setNewTamplateFromOpen}
              selectTamplate={selectTamplate}
            />
          </Drawer>
        </Content>
      </Layout>
    </Authorize>
  )
}
