/* eslint-disable consistent-return */
import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import { Typography, Button, Drawer } from 'antd'
import { ClockCircleOutlined } from '@ant-design/icons'
import { useDispatch } from 'react-redux'
import './taskHeader.scss'
import SessionInstructionDrawer from './SessionInstructionDrawer'

const { Text } = Typography

const TaskHeader = ({ duration, sessionName, targetsCount, hostList, status, id, session }) => {
  const [visible, setVisible] = useState(false)

  const showDrawer = () => {
    setVisible(true)
  }

  const onClose = () => {
    setVisible(false)
  }

  const dispatch = useDispatch()

  const startDataRecording = () => {
    dispatch({
      type: 'sessionrecording/SET_STATE',
      payload: {
        SessionId: id,
      },
    })
    setVisible(true)
  }

  return (
    <div className="taskHeader">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '70%',
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            fontSize: '20px',
            fontWeight: '600',
            lineHeight: '27px',
          }}
        >
          {sessionName} Sessions
        </Text>
        <Text
          type="secondary"
          style={{
            fontSize: '14px',
            lineHeight: '19px',
            color: '#2E2E2E',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <ClockCircleOutlined style={{ marginRight: 6, fontSize: 30, color: '#2E2E2E' }} />
          {duration}
        </Text>
        <div className="boxText">{targetsCount} Targets</div>
        <div className="boxText">
          {hostList.map(({ node }, index) => {
            return node.relationship.name + (index < hostList.length - 1 ? ', ' : '')
          })}
        </div>
        {status && <div className="boxText">{status}</div>}
      </div>
      <Button
        type="primary"
        style={{
          marginLeft: 'auto',
          color: '#fff',
          width: 140,
          background: '#0B35B3',
          height: 40,
          fontSize: 14,
          lineHeight: '22px',
        }}
        onClick={startDataRecording}
      >
        Start Session
      </Button>

      <Drawer width={500} placement="right" closable={false} onClose={onClose} visible={visible}>
        <SessionInstructionDrawer session={session} />
      </Drawer>
    </div>
  )
}

export default TaskHeader
