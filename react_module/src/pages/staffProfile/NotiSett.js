/* eslint-disable no-shadow */
import React, { useState, useEffect } from 'react'
import { Typography, Switch, Form, Button, notification } from 'antd'
import gql from 'graphql-tag'
import { useSelector } from 'react-redux'
import { useQuery, useMutation } from 'react-apollo'
import { FormOutlined } from '@ant-design/icons'

const { Title, Text } = Typography
const SETTING = gql`
  query($userId: ID!) {
    userSettings(user: $userId) {
      edges {
        node {
          id
          language
          sessionReminders
          medicalReminders
          dataRecordingReminders
          user {
            id
            username
          }
        }
      }
    }
  }
`

const CHANGE_SETTING = gql`
  mutation(
    $user: ID!
    $language: String
    $sessionReminders: Boolean!
    $medicalReminders: Boolean!
    $dataRecordingReminders: Boolean!
  ) {
    changeUserSetting(
      input: {
        user: $user
        language: $language
        sessionReminders: $sessionReminders
        medicalReminders: $medicalReminders
        dataRecordingReminders: $dataRecordingReminders
      }
    ) {
      details {
        id
        language
        sessionReminders
        medicalReminders
        dataRecordingReminders
      }
    }
  }
`

const SettingForm = () => {
  const [editMode, setEditMode] = useState(false)
  const user = useSelector(state => state.user)
  const [sessionReminders, setSessionReminders] = useState(false)
  const [medicalReminders, setMedicalReminders] = useState(false)
  const [dataRecordingReminders, setDataRecordingReminders] = useState(false)

  const { data: userSettings, error: userSettingsError, loading: userSettingsLoading } = useQuery(
    SETTING,
    {
      variables: {
        userId: user.id,
      },
    },
  )

  const [
    changeSetting,
    { data: changeSettingData, loading: changeSettingLoading, error: changeSettingError },
  ] = useMutation(CHANGE_SETTING, {
    variables: {
      user: user.id,
    },
  })

  useEffect(() => {
    if (userSettings) {
      if (userSettings.userSettings.edges[0]) {
        setDataRecordingReminders(userSettings.userSettings.edges[0].node.dataRecordingReminders)
        setMedicalReminders(userSettings.userSettings.edges[0].node.medicalReminders)
        setSessionReminders(userSettings.userSettings.edges[0].node.sessionReminders)
      } else {
        setDataRecordingReminders(false)
        setMedicalReminders(false)
        setSessionReminders(false)
      }
    }
  }, [userSettings])

  useEffect(() => {
    if (changeSettingData) {
      notification.success({
        message: 'Notification setting change sucessfully',
      })
      setEditMode(false)
    }
    if (changeSettingError) {
      notification.error({
        message: 'Error on changing notification setting',
      })
    }
  }, [changeSettingError, changeSettingData])

  const SwitchFrom = ({ title, info, style, value, setValue }) => {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 0,
          ...style,
        }}
      >
        <div>
          <Title style={{ fontSize: 20, margin: 0 }}>{title}</Title>
          <Text
            style={{
              fontSize: 13,
              lineHeight: '18px',
              margin: 0,
            }}
          >
            {info}
          </Text>
        </div>
        <Form.Item>
          <Switch checked={value} disabled={!editMode} onChange={() => setValue(state => !state)} />
        </Form.Item>
      </div>
    )
  }

  const handleSubmit = e => {
    e.preventDefault()
    changeSetting({
      variables: {
        sessionReminders,
        medicalReminders,
        dataRecordingReminders,
      },
    })
  }
  const handleCancle = () => {
    setEditMode(false)
    if (userSettings.userSettings.edges[0]) {
      setDataRecordingReminders(userSettings.userSettings.edges[0].node.dataRecordingReminders)
      setMedicalReminders(userSettings.userSettings.edges[0].node.medicalReminders)
      setSessionReminders(userSettings.userSettings.edges[0].node.sessionReminders)
    } else {
      setDataRecordingReminders(false)
      setMedicalReminders(false)
      setSessionReminders(false)
    }
  }

  if (userSettingsError) {
    return <div style={{ marginTop: 45 }}>Opps their is something wrong</div>
  }

  if (userSettingsLoading) {
    return <div style={{ marginTop: 45 }}>Loading...</div>
  }

  return (
    <Form
      style={{
        background: '#F9F9F9',
        borderRadius: 10,
        padding: '25px 20px',
        marginTop: 40,
      }}
      onSubmit={handleSubmit}
    >
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Title
            style={{
              margin: 0,
              fontSize: 24,
              lineHeight: '27px',
              marginBottom: 30,
            }}
          >
            Notifications
          </Title>

          {!editMode && (
            <Button type="link" onClick={() => setEditMode(true)}>
              <FormOutlined style={{ fontSize: 24 }} />
            </Button>
          )}
        </div>

        <SwitchFrom
          title="Session Reminders"
          info="Reminders for everyday sessions"
          value={sessionReminders}
          setValue={setSessionReminders}
        />
        <SwitchFrom
          title="Data Recoreding"
          info="Reminders for everyday data recoreding"
          editMode={editMode}
          value={dataRecordingReminders}
          setValue={setDataRecordingReminders}
        />
        <SwitchFrom
          title="Medical Reminders"
          info="Reminders for everyday medical reminders"
          value={medicalReminders}
          setValue={setMedicalReminders}
        />
      </div>
      {editMode && (
        <div
          style={{
            marginTop: 15,
            display: 'flex',
          }}
        >
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            style={{
              width: 150,
            }}
            loading={changeSettingLoading}
          >
            Save
          </Button>
          <Button
            type="damger"
            size="large"
            style={{
              marginLeft: 20,
              width: 150,
              background: 'red',
              color: '#fff',
            }}
            onClick={handleCancle}
          >
            Cancle
          </Button>
        </div>
      )}
    </Form>
  )
}

export default SettingForm
