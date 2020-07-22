import React, { useState, useEffect } from 'react'
import { Typography, Button, Drawer } from 'antd'
import { PlusOutlined, WhatsAppOutlined, ClockCircleOutlined } from '@ant-design/icons'
import moment from 'moment'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo'
import defautProfileImg from './img/profile.jpg'
import AppiorMentForm from './AppiorMentForm'

const { Title, Text } = Typography

const APPIORMENTS = gql`
  query {
    upcoming_appointment: appointments(first: 3) {
      edges {
        node {
          start
          end
          title
          therapist {
            name
          }
        }
      }
    }
  }
`

const timeFormat = 'HH:mm a'

const AppointmentCard = ({ therapist, title, start, end, profileImg }) => {
  return (
    <div
      style={{
        padding: '19px 32px 0px',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <img
        src={profileImg || defautProfileImg}
        alt=""
        style={{
          width: 80,
          height: 64,
          borderRadius: 10,
          marginRight: 22,
        }}
      />
      <div style={{ width: '100%' }}>
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
            }}
          >
            {therapist}
          </Title>
          <WhatsAppOutlined style={{ fontSize: 28, marginLeft: 'auto', marginRight: 21 }} />
          <ClockCircleOutlined style={{ fontSize: 30, marginRight: 11 }} />
          <Text
            style={{
              fontSize: 16,
              lineHeight: '22px',
              color: '#000',
            }}
          >
            {`${moment(start).format(timeFormat)}-${moment(end).format(timeFormat)}`}
          </Text>
        </div>
        <Text
          style={{
            fontSize: 16,
            lineHeight: '22px',
            color: '#000',
          }}
        >
          {title}
        </Text>
      </div>
    </div>
  )
}

const AppiorMentsCard = ({ style }) => {
  const [newAppiormentDrawer, setNewAppiormentDrawer] = useState(false)
  const [newAppiormentCreated, setNewAppiormentCreated] = useState(false)

  const appiorments = useQuery(APPIORMENTS)

  useEffect(() => {
    if (newAppiormentCreated) {
      appiorments.refetch()
      setNewAppiormentCreated(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newAppiormentCreated])

  const handelNewAppiormentDrawer = () => {
    setNewAppiormentDrawer(state => !state)
  }

  return (
    <div
      style={{
        ...style,
      }}
    >
      {/* <pre>{JSON.stringify(user)}</pre> */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 9,
          alignItems: 'flex-end',
        }}
      >
        <Title
          style={{
            fontWeight: 600,
            fontSize: 20,
            lineHeight: '27px',
          }}
        >
          Upcoming Appointments
        </Title>
        <Button
          type="primary"
          style={{
            background: '#F9F9F9',
            border: '1px solid #E4E9F0',
            boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
            borderRadius: 6,
            width: 50,
            height: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={handelNewAppiormentDrawer}
        >
          <PlusOutlined style={{ fontSize: 24, marginTop: 5, marginLeft: 2, color: '#000' }} />
        </Button>
      </div>
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid #E4E9F0',
          boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
          borderRadius: 10,
          padding: '14px 6px',
        }}
      >
        {appiorments.error && (
          <div style={{ minHeight: 585 }}>
            <Text type="danger">Opp&apos;s some thing wrong</Text>
          </div>
        )}
        {appiorments.loading && <div style={{ minHeight: 585 }}>Loading...</div>}
        {appiorments.data &&
          appiorments.data.upcoming_appointment.edges.map(({ node }, index) => {
            const { length } = appiorments.data.upcoming_appointment.edges
            return (
              <>
                <AppointmentCard
                  therapist={node.therapist.name}
                  title={node.title}
                  start={node.start}
                  end={node.end}
                  profileImg={node.profileImg}
                />
                {index < length - 1 && (
                  <hr
                    style={{
                      margin: '34px auto 0px',
                      width: 'calc(100% - 64px)',
                    }}
                  />
                )}
              </>
            )
          })}
      </div>
      <Drawer
        handler={false}
        width="500px"
        visible={newAppiormentDrawer}
        placement="right"
        onClose={handelNewAppiormentDrawer}
        title="New Appointment"
      >
        <div
          style={{
            background: '#fff',
            height: '100%',
            width: '100%',
            padding: '30px 40px',
            paddingTop: 0,
          }}
        >
          <AppiorMentForm
            setNewAppiormentCreated={setNewAppiormentCreated}
            handelNewAppiormentDrawer={handelNewAppiormentDrawer}
          />
        </div>
      </Drawer>
    </div>
  )
}

export default AppiorMentsCard
