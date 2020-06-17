import React, { useState, useEffect } from 'react'
import { Drawer } from 'antd'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo'
import UpdateTargetForm from './UpdateTargetForm'
import TargetAreaCard from './TargetAreaCard'
import TargetCard from './TargetCard'
import TargetFrom from './TargetFrom'

const TargetAreaContent = ({ targetArea, setUpdateTarArea, domainId }) => {
  const [newTargetDrawer, setNewTargetDrawer] = useState(false)
  const [updateTargetDrawer, setUpdateTargetDrawer] = useState(false)
  const [newTarget, setNewTarget] = useState()
  const [updateTargetId, setUpdateTargetId] = useState()
  const [selectName, setName] = useState()
  const [selectInstr, setInstr] = useState()

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

  useEffect(() => {
    if (selectName) {
      setNewTargetDrawer(true)
    }
  }, [selectName])

  const handelNewTargetDrawer = () => {
    if (setNewTargetDrawer) {
      setName('')
      setInstr('')
    }
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
        handelNewTargetDrawer={handelNewTargetDrawer}
      />
      {targets &&
        targets.map(({ node }) => {
          return (
            <TargetCard
              key={node.id}
              title={node.targetMain.targetName}
              style={{ marginTop: 16 }}
              setUpdateTargetId={setUpdateTargetId}
              id={node.id}
              setUpdateTargetDrawer={setUpdateTargetDrawer}
              setName={setName}
              setInstr={setInstr}
              instr={node.targetInstr}
            />
          )
        })}
      <Drawer
        width="650px"
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
            name={selectName}
            instr={selectInstr}
          />
        </div>
      </Drawer>
      <Drawer
        width="650px"
        visible={updateTargetDrawer}
        placement="right"
        onClose={handleUpdateTargetDrawer}
        title="Update Target"
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
