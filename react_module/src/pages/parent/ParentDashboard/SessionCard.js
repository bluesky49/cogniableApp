/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { Typography, Card, Button, Drawer } from 'antd'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo'
import { useDispatch } from 'react-redux'
import taskCardHeroImg from './images/taskCardHero.jpg'
import SessionInstructionDrawer from './SessionInstructionDrawer'

const GET_STATUS = gql`
  query getChildSession($sessionId: ID!) {
    getChildSession(sessions: $sessionId) {
      edges {
        node {
          id
          status
        }
      }
    }
  }
`

const { Title, Text } = Typography

const TaskCard = ({ style, id, sessionName, duration, hostList, session }) => {
  const dispatch = useDispatch()
  const [visible, setVisible] = useState(false)

  const { data, error } = useQuery(GET_STATUS, {
    variables: {
      sessionId: id,
    },
  })

  useEffect(() => {
    if (data) {
      console.log(data)
    }
  }, [data])

  const showDrawer = () => {
    setVisible(true)
  }

  const onClose = () => {
    setVisible(false)
  }

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
    <div>
      <Card
        hoverable
        style={{
          margin: '10px 10px 10px 0',
          background: '#FFFFFF',
          border: '1px solid #E4E9F0',
          boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
          borderRadius: 10,
          maxWidth: 400,
          overflow: 'hidden',
          ...style,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Title style={{ fontSize: 20, display: 'inline', margin: 0 }}>
            {sessionName} Session
          </Title>
          <Text style={{ fontWeight: 600 }}>
            {data && data.getChildSession.edges[0].node.status}
          </Text>
        </div>

        <Text style={{ fontSize: 16, color: '#000', marginTop: 7 }}>{duration}</Text>
        <img
          alt="example"
          src={taskCardHeroImg}
          style={{
            height: 120,
            width: '100%',
            transform: 'scale(1.2)',
            marginTop: 30,
            marginBottom: 20,
          }}
        />
        <div style={{ fontSize: 16, color: '#000' }}>
          {hostList.map(({ node }, index) => {
            return node.relationship.name + (index < hostList.length - 1 ? ', ' : '')
          })}
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: 10,
          }}
        >
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
        </div>
      </Card>
      <Drawer width={500} placement="right" closable={false} onClose={onClose} visible={visible}>
        <SessionInstructionDrawer session={session} />
      </Drawer>
    </div>
  )
}

export default TaskCard
