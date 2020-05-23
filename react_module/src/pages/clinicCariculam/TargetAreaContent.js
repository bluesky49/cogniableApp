import React, { useState, useEffect } from 'react'
import { Button, Typography, Drawer } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo'
import UpdateTargetForm from './UpdateTargetForm'
import TargetAreaCard from './TargetAreaCard'
import TargetCard from './TargetCard'
import TargetFrom from './TargetFrom'

const { Text } = Typography

const TargetAreaContent = ({ targetArea, setUpdateTarArea, domainId }) => {
  const [newTargetDrawer, setNewTargetDrawer] = useState(false)
  const [updateTargetDrawer, setUpdateTargetDrawer] = useState(false)
  const [newTarget, setNewTarget] = useState()
  const [updateTargetId, setUpdateTargetId] = useState()

  const [targets, setTargets] = useState()
  const TARGET_QUERY = gql`
    query{
      target(targetArea:"${targetArea.id}") {
        edges {
          node {
            id
            targetInstr
            targetMain {
              targetName
            }
          }
        }
      }           
    }
  `
  const { data, loading, error } = useQuery(TARGET_QUERY)

  useEffect(() => {
    if (data) {
      setTargets(data.target.edges)
    }
  }, [data])

  useEffect(() => {
    if (newTarget) {
      setTargets(state => {
        const newState = [...state]
        newState.push(newTarget)
        return newState
      })
    }
  }, [newTarget])

  const handelNewTargetDrawer = () => {
    setNewTargetDrawer(state => !state)
  }

  const handleUpdateTargetDrawer = () => {
    setUpdateTargetDrawer(state => !state)
  }

  if (loading) {
    return 'Loading...'
  }

  if (error) {
    return 'Opps their something wrong'
  }

  return (
    <>
      <TargetAreaCard
        name={targetArea.Area}
        style={{ marginBottom: 33 }}
        targetAreaId={targetArea.id}
        setUpdateTarArea={setUpdateTarArea}
      />
      {targets &&
        targets.map(({ node }) => {
          return (
            <TargetCard
              title={node.targetMain.targetName}
              style={{ marginTop: 16 }}
              setUpdateTargetId={setUpdateTargetId}
              id={node.id}
              setUpdateTargetDrawer={setUpdateTargetDrawer}
            />
          )
        })}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginTop: 50,
          alignItems: 'center',
        }}
      >
        <Button
          onClick={handelNewTargetDrawer}
          style={{
            width: 210,
            height: 40,
            background: '#F9F9F9',
            border: '1px solid #E4E9F0',
            boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
            borderRadius: 6,
            marginLeft: 'auto',
          }}
        >
          <PlusOutlined style={{ fontSize: 20, color: '#000' }} />
          <Text style={{ fontSize: 16, lineHeight: '22px', color: '#000' }}>New Target</Text>
        </Button>
      </div>
      <Drawer
        width="400px"
        visible={newTargetDrawer}
        placement="right"
        onClose={handelNewTargetDrawer}
        title="Add New Target"
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            background: '#fff',
            padding: 30,
            paddingTop: 0,
          }}
        >
          <TargetFrom
            domainId={domainId}
            targetAreaId={targetArea.id}
            setNewTarget={setNewTarget}
            handelNewTargetDrawer={handelNewTargetDrawer}
          />
        </div>
      </Drawer>
      <Drawer
        width="400px"
        visible={updateTargetDrawer}
        placement="right"
        onClose={handleUpdateTargetDrawer}
        title="Add New Target"
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            background: '#fff',
            padding: 30,
            paddingTop: 0,
          }}
        >
          <UpdateTargetForm
            targetId={updateTargetId}
            targetAreaId={targetArea.id}
            setNewTarget={setNewTarget}
            domainId={domainId}
            setUpdateTargetId={setUpdateTargetId}
            handleUpdateTargetDrawer={handleUpdateTargetDrawer}
          />
        </div>
      </Drawer>
    </>
  )
}

export default TargetAreaContent
