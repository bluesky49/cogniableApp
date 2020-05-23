import React, { useState, useEffect } from 'react'
import { Button, Select, Modal, Input, notification } from 'antd'
import gql from 'graphql-tag'
import { useMutation } from 'react-apollo'
import TargetAreaContent from './TargetAreaContent'

const { Option } = Select

const CREATE_TARGET_AREA = gql`
  mutation($domainId: ID!, $name: String!) {
    addTargetArea(input: { domainId: $domainId, name: $name }) {
      status
      message
      details {
        id
        Area
      }
    }
  }
`

const DomainContent = ({ targetAreas, domainId }) => {
  const [open, setOpen] = useState(false)
  const [selectTargetArea, setSelectTargetArea] = useState(
    targetAreas[0] ? targetAreas[0].node : null,
  )
  const [selectValue, setSelectValue] = useState(selectTargetArea ? selectTargetArea.Area : null)
  const [updateTarArea, setUpdateTarArea] = useState()
  const [name, setName] = useState()
  const [allTargetArea, setAllTargetArea] = useState(targetAreas)

  const [
    createTargetArea,
    { data: createTargetAreaData, error: createTargetAreaError, loading: createTargetAreaLoading },
  ] = useMutation(CREATE_TARGET_AREA, {
    variables: {
      domainId,
      name,
    },
  })

  const handelCreateTargetAreaModel = () => {
    setOpen(state => !state)
  }

  const handleSelectChange = value => {
    const newSelectTargetArea = targetAreas.find(target => target.node.id === value).node
    setSelectTargetArea(newSelectTargetArea)
  }

  const handelCreateTargetArea = () => {
    createTargetArea()
  }

  useEffect(() => {
    if (updateTarArea) {
      const newState = []
      // eslint-disable-next-line array-callback-return
      allTargetArea.map(area => {
        if (area.node.id === updateTarArea.id) {
          area.node.Area = updateTarArea.Area
        }
        newState.push(area)
      })
      setAllTargetArea(newState)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateTarArea])

  useEffect(() => {
    if (createTargetAreaData) {
      notification.success({
        message: 'Clinic Cariculam',
        description: 'Create New Target Area Data Sucessfully',
      })
      setName('')
      setOpen(false)
      console.log(createTargetAreaData.addTargetArea.details)
      setAllTargetArea(state => {
        const newState = state
        newState.push({ node: createTargetAreaData.addTargetArea.details })
        return newState
      })
    }
  }, [createTargetAreaData])

  useEffect(() => {
    if (createTargetAreaError) {
      notification.error({
        message: 'Somthing want wrong',
        description: createTargetAreaError,
      })
    }
  }, [createTargetAreaError])

  useEffect(() => {
    setSelectTargetArea(targetAreas[0] ? targetAreas[0].node : null)
  }, [targetAreas])

  useEffect(() => {
    setSelectValue(selectTargetArea ? selectTargetArea.Area : null)
  }, [selectTargetArea])

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Select
          placeholder="Target Area"
          style={{
            width: 200,
            borderRadius: 4,
            marginRight: 38,
          }}
          value={selectValue}
          onChange={handleSelectChange}
          size="large"
        >
          {allTargetArea.map(({ node }) => {
            return (
              <Option key={node.id} value={node.id}>
                {node.Area}
              </Option>
            )
          })}
        </Select>
        <Button
          type="primary"
          style={{
            height: 40,
            width: 200,
            marginRight: 38,
            background: ' #0B35B3',
            fontSize: 16,
            lineHeight: '22px',
          }}
        >
          Search
        </Button>
        <Button
          type="link"
          style={{
            fontSize: 14,
            lineHeight: '19px',
          }}
          onClick={handelCreateTargetAreaModel}
        >
          Add Target Area
        </Button>
      </div>
      <div style={{ marginTop: 20 }}>
        {selectTargetArea && (
          <TargetAreaContent
            domainId={domainId}
            targetArea={selectTargetArea}
            setUpdateTarArea={setUpdateTarArea}
          />
        )}
      </div>
      <Modal
        visible={open}
        title="Title"
        onCancel={handelCreateTargetAreaModel}
        footer={[
          <Button
            key="submit"
            type="primary"
            onClick={handelCreateTargetArea}
            loading={createTargetAreaLoading}
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
            placeholder="Type the targetArea Name"
            value={name}
            onChange={e => setName(e.target.value)}
            size="large"
          />
        </div>
      </Modal>
    </>
  )
}

export default DomainContent
