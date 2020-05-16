import React, { useState } from 'react'
import { Typography, Button, Select, Form, Input, DatePicker, TimePicker } from 'antd'
import { Scrollbars } from 'react-custom-scrollbars'
import {
  PlusOutlined,
  WhatsAppOutlined,
  ClockCircleOutlined,
  CloseOutlined,
} from '@ant-design/icons'
import moment from 'moment'
import gql from 'graphql-tag'
import Drawer from 'rc-drawer'
import { useQuery } from 'react-apollo'
import defautProfileImg from './img/profile.jpg'

const { Title, Text } = Typography
const { Option } = Select

const APPIORMENTS = gql`
  query {
    upcoming_appointment: appointments(first: 2) {
      edges {
        node {
          id
          start
          end
          title
          location {
            id
            location
          }
          therapist {
            name
          }
        }
      }
    }
  }
`
const CREATE_APPIORMENTS = gql`
  mutation {
    CreateAppointment(
      input: {
        appointment: {
          therapist: "U3RhZmZUeXBlOjc3"
          student: "U3R1ZGVudFR5cGU6OTI="
          location: "TG9jYXRpb25UeXBlOjM="
          title: "fhgfhfg"
          purposeAssignment: "fdgfdh"
          note: "fghfgh"
          start: "2020-04-23T11:00:51.180Z"
          end: "2020-04-23T12:00:51.180Z"
        }
      }
    ) {
      appointment {
        id
      }
    }
  }
`

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
            {`${moment(start)}-${moment(end)}`}
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
  const [createNewAppiormentDrawer, setCreateNewAppiormentDrawer] = useState(false)
  const appiorments = useQuery(APPIORMENTS)

  // const {mutate, newAppiorments} = useMutation(CREATE_APPIORMENTS)
  // const user = useSelector(state => state.user)

  const handelAddTargetAreaDrawer = () => {
    setCreateNewAppiormentDrawer(state => !state)
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
          onClick={handelAddTargetAreaDrawer}
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
        {appiorments.loading ? (
          'Loading...'
        ) : (
          <>
            {appiorments.error && <Text type="danger">Opp&apos;s some thing wrong </Text>}
            {appiorments.data && (
              <Scrollbars style={{ height: 219, padding: '0px 26px' }}>
                {appiorments.data.upcoming_appointment.edges.map(({ node }) => {
                  return (
                    <>
                      <AppointmentCard
                        therapist={node.therapist.name}
                        title={node.title}
                        start={node.start}
                        end={node.end}
                        profileImg={node.profileImg}
                      />
                      <hr
                        style={{
                          margin: '34px auto 0px',
                          width: 'calc(100% - 64px)',
                        }}
                      />
                    </>
                  )
                })}
              </Scrollbars>
            )}
          </>
        )}
      </div>
      <Drawer
        handler={false}
        className="drawer242"
        levelMove={100}
        width="500px"
        open={createNewAppiormentDrawer}
        placement="right"
        onMaskClick={handelAddTargetAreaDrawer}
        onClose={handelAddTargetAreaDrawer}
      >
        <div
          style={{
            background: '#fff',
            height: '100%',
            width: '100%',
            padding: '30px 75px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Title
              style={{
                fontSize: '22px',
              }}
            >
              New Appiorment
            </Title>
            <Button type="link" onClick={handelAddTargetAreaDrawer}>
              <CloseOutlined style={{ fontSize: 25, color: '#000' }} />
            </Button>
          </div>
          <Form name="basic" initialValues={{ remember: true }}>
            <Form.Item
              label="Select User"
              name="username"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Select>
                <Option key="1">Hello</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Purpose of Assignment"
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <DatePicker />
            </Form.Item>

            <Form.Item
              label="Date (Select one time or Recutting)"
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <DatePicker />
            </Form.Item>

            <Form.Item
              label="Time"
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <TimePicker />
              <TimePicker />
            </Form.Item>

            <Form.Item
              label="Select Therefist"
              name="username"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Select>
                <Option key="1">Hello</Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Drawer>
    </div>
  )
}

export default AppiorMentsCard
