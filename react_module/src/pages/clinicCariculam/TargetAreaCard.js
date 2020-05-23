/* eslint-disable react/jsx-closing-tag-location */
import React, { useState, useEffect } from 'react'
import { Button, Card, Typography, Input, notification } from 'antd'
import { FormOutlined, PlusOutlined } from '@ant-design/icons'
import gql from 'graphql-tag'
import { useMutation } from 'react-apollo'

const { Title, Text } = Typography

const UPDATE_TARGET_AREA = gql`
  mutation updateTargetArea($pk: ID!, $name: String!) {
    updateTargetArea(input: { pk: $pk, name: $name }) {
      status
      message
      details {
        id
        Area
      }
    }
  }
`

const TargetAreaCard = ({ style, name, targetAreaId, setUpdateTarArea, handelNewTargetDrawer }) => {
  const [editMode, setEditMode] = useState(false)
  const [stateName, setStateName] = useState(name)
  const [newName, setNewName] = useState(stateName)

  const [
    updateTargetName,
    { data: updateTargetNameData, loading: updateTargetNameLoading, error: updateTargetNameError },
  ] = useMutation(UPDATE_TARGET_AREA, {
    variables: {
      pk: targetAreaId,
      name: newName,
    },
  })

  useEffect(() => {
    if (updateTargetNameData) {
      setUpdateTarArea(updateTargetNameData.updateTargetArea.details)
      setStateName(updateTargetNameData.updateTargetArea.details.Area)
      setEditMode(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateTargetNameData])

  useEffect(() => {
    if (updateTargetNameError) {
      notification.error({
        message: 'Filed to updae target area name',
        description: updateTargetNameError,
      })
    }
  }, [updateTargetNameError])

  return (
    <Card
      style={{
        background: '#FFFFFF',
        border: '1px solid #E4E9F0',
        boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
        borderRadius: 10,
        ...style,
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
            fontSize: 18,
            lineHeight: '25px',
            margin: 0,
            marginRight: 15,
          }}
        >
          TARGET AREA :
        </Title>
        {editMode ? (
          <Input
            value={newName}
            onChange={e => setNewName(e.target.value)}
            autoFocus
            style={{
              display: 'block',
              width: '50%',
            }}
            size="large"
            disabled={updateTargetNameLoading}
          />
        ) : (
          <Text
            style={{
              fontSize: 18,
              color: '#000',
              lineHeight: '25px',
            }}
          >
            {stateName}
          </Text>
        )}
        {!editMode && (
          <Button
            onClick={handelNewTargetDrawer}
            style={{
              width: 210,
              height: 40,
              background: 'rgb(10, 133, 10)',
              border: '1px solid #E4E9F0',
              boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
              borderRadius: 6,
              marginLeft: 'auto',
            }}
          >
            <PlusOutlined style={{ fontSize: 20, color: 'rgb(238, 241, 249)' }} />
            <Text
              style={{
                fontSize: 16,
                lineHeight: '22px',
                color: 'rgb(238, 241, 249)',
              }}
            >
              New Target
            </Text>
          </Button>
        )}

        {!editMode && (
          <Button type="link" onClick={() => setEditMode(true)}>
            <FormOutlined style={{ fontSize: 28, color: '#e9e9e9' }} />
          </Button>
        )}
        {editMode && (
          <div style={{ marginLeft: 'auto' }}>
            <Button
              style={{ background: 'rgb(11, 53, 179)' }}
              type="primary"
              size="large"
              onClick={() => {
                if (newName) {
                  if (newName !== name) {
                    updateTargetName()
                  } else {
                    setEditMode(false)
                  }
                } else {
                  // eslint-disable-next-line no-alert
                  alert('Input cant be empty')
                }
              }}
              loading={updateTargetNameLoading}
            >
              Save
            </Button>
            <Button
              style={{ marginLeft: 15 }}
              type="danger"
              size="large"
              disabled={updateTargetNameLoading}
              onClick={() => {
                setNewName(stateName)
                setEditMode(false)
              }}
            >
              Cancle
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}

export default TargetAreaCard
