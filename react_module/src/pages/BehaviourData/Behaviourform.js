/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  notification,
  Radio,
  InputNumber,
  TimePicker,
} from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import gql from 'graphql-tag'
import { useMutation, useQuery } from 'react-apollo'
import moment from 'moment'
import './behaviourForm.scss'
import TextArea from 'antd/lib/input/TextArea'

const { Option } = Select

const DANCLE_STATUS = gql`
  query {
    getDecelStatus {
      id
      statusName
      statusCode
    }
  }
`

const DANCLE_ENVS = gql`
  query {
    getEnvironment {
      id
      name
      defination
    }
  }
`

const DANCLE_MEASURMENTS = gql`
  query {
    getBehaviourMeasurings {
      id
      measuringType
      unit
    }
  }
`

const CREATE_TAMPLET = gql`
  mutation createTemplate(
    $studentId: ID!
    $behaviorId: ID!
    $status: ID!
    $def: String
    $description: String
    $measurments: [ID]
    $envs: [ID]
  ) {
    createTemplate(
      input: {
        decelData: {
          student: $studentId
          behavior: $behaviorId
          status: $status
          behaviorDef: $def
          behaviorDescription: $description
          measurments: $measurments
          environment: $envs
        }
      }
    ) {
      details {
        id
        behaviorDef
        behaviorDescription
        behavior {
          id
          behaviorName
          definition
        }
        status {
          id
          statusName
        }
      }
    }
  }
`

const dateFormat = 'YYYY-MM-DD'

const BehaviourForm = ({ style, setNewTamplateCreated, setNewTampletFromOpen }) => {
  const [name, setName] = useState('')
  const [status, setStatus] = useState()
  const [description, setDescription] = useState('')
  const [envs, setEnvs] = useState(null)
  const [measurements, setMeasurements] = useState()

  const studentId = localStorage.getItem('studentId')

  const {
    data: dancleStatusData,
    error: dancleStatusError,
    loading: dancleStatusLoading,
  } = useQuery(DANCLE_STATUS)

  const { data: dancleEnvData, error: dancleEnvError, loading: dancleEnvLoading } = useQuery(
    DANCLE_ENVS,
  )

  const {
    data: dancleMeasurementData,
    error: dancleMeasurementError,
    loading: dancleMeasurementLoading,
  } = useQuery(DANCLE_MEASURMENTS)

  const [createTemplate, { data: newTempleteData, error: newTempletError }] = useMutation(
    CREATE_TAMPLET,
    {
      variables: {
        studentId,
        behaviorId: 'QmVoYXZpb3JUeXBlOjY4',
        status,
        def: 'Hello def',
        description,
        measurements,
        envs,
      },
    },
  )

  useEffect(() => {
    if (newTempleteData) {
      notification.success({
        message: 'Behaviour Data',
        description: 'New Behaviour Templete Added Successfully',
      })
      setNewTamplateCreated(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newTempleteData])

  useEffect(() => {
    if (newTempletError) {
      notification.error({
        message: 'Somthing want wrong',
        description: newTempletError,
      })
    }
  }, [newTempletError])

  const SubmitForm = e => {
    e.preventDefault()
    console.log(measurements, status)
    createTemplate()
  }

  return (
    <Form
      onSubmit={e => SubmitForm(e, this)}
      name="control-ref"
      style={{ marginLeft: 0, position: 'relative' }}
    >
      <Button
        type="link"
        onClick={e => {
          setNewTampletFromOpen(false)
        }}
        style={{
          position: 'absolute',
          right: -12,
          top: 0,
          zIndex: 10,
        }}
      >
        <CloseOutlined style={{ fontSize: 20, color: '#D81E06' }} />
      </Button>
      <Form.Item label="Behaviour Name">
        <Input
          value={name}
          placeholder="Enter Name"
          onChange={e => {
            setName(e.target.value)
          }}
          size="large"
        />
      </Form.Item>

      <Form.Item label="Status">
        <Select
          value={status}
          onChange={value => {
            setStatus(value)
          }}
          placeholder="Select Behaviour Status"
          size="large"
        >
          {dancleStatusData &&
            dancleStatusData.getDecelStatus.map(dancleStatus => (
              <Option value={dancleStatus.id}>{dancleStatus.statusName}</Option>
            ))}
        </Select>
      </Form.Item>

      <Form.Item label="Behaviour Description">
        <TextArea
          placeholder="Describe the behaviour"
          value={description}
          onChange={e => setDescription(e.target.value)}
          style={{
            height: 174,
            resize: 'none',
          }}
          autoSave={false}
        />
      </Form.Item>

      <Form.Item label="Environments">
        <Select
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="Please select"
          onChange={value => setEnvs(value)}
          size="large"
        >
          {dancleEnvData &&
            dancleEnvData.getEnvironment.map(envData => (
              <Option value={envData.id}>{envData.name}</Option>
            ))}
        </Select>
      </Form.Item>

      <Form.Item label="Measurements">
        <Select
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="Please select"
          onChange={value => {
            console.log(measurements)
            setMeasurements(value)
          }}
          size="large"
        >
          {dancleMeasurementData &&
            dancleMeasurementData.getBehaviourMeasurings.map(measurement => (
              <Option value={measurement.id}>{measurement.measuringType}</Option>
            ))}
        </Select>
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          style={{
            width: '100%',
            height: 40,
            background: '#0B35B3',
            boxShadow: '0px 2px 4px rgba(96, 97, 112, 0.16), 0px 0px 1px rgba(40, 41, 61, 0.04)',
            borderRadius: 8,
            fontSize: 17,
            fontWeight: 'bold',
            marginTop: 30,
          }}
        >
          New Template
        </Button>
      </Form.Item>
    </Form>
  )
}

export default BehaviourForm
