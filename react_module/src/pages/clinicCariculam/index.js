import React, { useState, useEffect } from 'react'
import { Layout, Tabs, Button, Row, Col, Modal, Input, notification, Tooltip } from 'antd'
import { PlusOutlined, SyncOutlined } from '@ant-design/icons'
import { useQuery, useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import './index.scss'
import TabContent from './TabContent'

const { Content } = Layout
const { TabPane } = Tabs

const AREAS = gql`
  query {
    programArea {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`

const CREATE_AREA = gql`
  mutation programArea($name: String!) {
    programArea(input: { name: $name }) {
      ProgramArea {
        id
        name
      }
    }
  }
`

const SYNC_PROGRAM = gql`mutation {
    SyncProgram(input:{})
    {
        message
    }
}
`

export default () => {
  const [addNewAreaModel, setAddNewAreaModel] = useState(false)
  const areasData = useQuery(AREAS)
  const [newAreaName, setNewAreaName] = useState('')
  const [mutate, newAreaData] = useMutation(CREATE_AREA)
  const [sync_pro, sync_program] = useMutation(SYNC_PROGRAM)

  const handelAddNewAreaModel = () => {
    setAddNewAreaModel(state => !state)
  }

  const SyncProgram = () => {
   sync_pro()
  }
  useEffect(() => {
    if (sync_program.data) {
      notification.success({
        message: sync_program.data.SyncProgram.message,
      })
      setAddNewAreaModel(false)
    }
  }, [sync_program.data])

  const handelCreateNewArea = () => {
    if (newAreaName) {
      mutate({ variables: { name: newAreaName } })
      setNewAreaName('')
    } else {
      notification.info({
        message: 'Please give a name',
      })
    }
  }

  const handelNewAreaName = e => {
    setNewAreaName(e.target.value)
  }

  useEffect(() => {
    if (newAreaData.data) {
      notification.success({
        message: 'New Area Created Succesfully',
      })
      setAddNewAreaModel(false)
    }
  }, [newAreaData.data])

  useEffect(() => {
    if (newAreaData.error) {
      notification.error({
        message: 'New Area Created Error',
      })
    }
  }, [newAreaData.error])

  if (areasData.loading) {
    return 'Loading...'
  }

  if (areasData.error) {
    return <pre>{JSON.stringify(areasData.error, null, 2)}</pre>
  }

  return (
    <div>
      <Layout style={{ padding: '0px' }}>
        <Layout>
          <Content
            style={{
              padding: '0px 20px',
              maxWidth: 1300,
              margin: '0px auto',
              width: '100%',
            }}
          >
            <Row style={{ width: '100%' }}>
              <Col span={24}>
                <Tabs defaultActiveKey="1" style={{ position: 'relative' }}>
                  {areasData.data &&
                    areasData.data.programArea.edges.map(({ node }) => {
                      return (
                        <TabPane style={{ marginTop: 27 }} tab={node.name} key={node.id}>
                          <TabContent programArea={node.id} />
                        </TabPane>
                      )
                    })}
                  {// {"programArea":{"ProgramArea":{"id":"UHJvZ3JhbUFyZWFUeXBlOjE5","name":"asdfsafd","__typename":"ProgramAreaType"},"__typename":"ProgramAreaMutationPayload"}}
                  newAreaData.data && (
                    <TabPane
                      style={{ marginTop: 27 }}
                      tab={newAreaData.data.programArea.ProgramArea.name}
                      key={newAreaData.data.programArea.ProgramArea.id}
                    >
                      <TabContent programArea={newAreaData.data.programArea.ProgramArea.id} />
                    </TabPane>
                  )}

                  <Tooltip placement="topRight" title="Click here to add new area">
                    <Button
                      type="secondary"
                      onClick={handelAddNewAreaModel}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        fontSize: 14,
                        lineHeight: '19px',
                        height: 35,
                        width: 180,
                        background: '#F9F9F9',
                        border: '1px solid #E4E9F0',
                        boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
                        borderRadius: 6,
                        position: 'absolute',
                        color: '#000',
                        right: 160,
                        top: 0,
                      }}
                    >
                      <PlusOutlined style={{ fontSize: 18, color: '#000' }} />
                      Add New Area
                    </Button>
                  </Tooltip>

                  <Tooltip placement="topRight" title="Update your Whole Program">
                    <Button
                      type="secondary"
                      onClick={SyncProgram}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        fontSize: 14,
                        lineHeight: '19px',
                        height: 35,
                        width: 150,
                        background: '#F9F9F9',
                        border: '1px solid #E4E9F0',
                        boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
                        borderRadius: 6,
                        position: 'absolute',
                        color: '#000',
                        right: 0,
                        top: 0,
                      }}
                    >
                      <SyncOutlined style={{ fontSize: 18, color: '#000' }} />
                      Sync Program
                    </Button>
                  </Tooltip>
                </Tabs>
              </Col>
            </Row>

            <Modal
              visible={addNewAreaModel}
              title="Create New Area"
              onCancel={handelAddNewAreaModel}
              footer={[
                <Button
                  key="submit"
                  type="primary"
                  onClick={handelCreateNewArea}
                  loading={newAreaData.loading}
                >
                  Create
                </Button>,
              ]}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  background: '#fff',
                }}
              >
                <Input
                  placeholder="Area Name"
                  value={newAreaName}
                  onChange={handelNewAreaName}
                  autoFocus
                  size="large"
                />
              </div>
            </Modal>
          </Content>
        </Layout>
      </Layout>
    </div>
  )
}
