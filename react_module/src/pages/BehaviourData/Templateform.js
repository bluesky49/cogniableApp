import React, { useEffect } from 'react'
import { Form, Input, Button, Select, notification } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import gql from 'graphql-tag'
import { useMutation, useQuery } from 'react-apollo'
import './templateform.scss'

const { Option } = Select
const { TextArea } = Input

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

const BEHAVIORS = gql`
  query getBehaviour($studentId: ID!) {
    getBehaviour(studentId: $studentId) {
      edges {
        node {
          id
          behaviorName
        }
      }
    }
  }
`

const BehaviourForm = ({ style, setNewTamplateCreated, setNewTampletFromOpen, form }) => {
  const studentId = localStorage.getItem('studentId')
  const durationMesId = 'RGVjZWxCZWhhdmlvck1lYXN1cmluZ3NUeXBlOjQ='

  const { data: dancleStatusData, loading: dancleStatusLoading } = useQuery(DANCLE_STATUS)

  const { data: dancleEnvData, loading: dancleEnvLoading } = useQuery(DANCLE_ENVS)

  const { data: dancleMeasurementData, loading: dancleMeasurementLoading } = useQuery(
    DANCLE_MEASURMENTS,
  )

  const [
    createTemplate,
    { data: newTempleteData, error: newTempletError, loading: newTempleteLoading },
  ] = useMutation(CREATE_TAMPLET)

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

  const { data: behaviorData, loading: behaviorLoading } = useQuery(BEHAVIORS, {
    variables: {
      studentId,
    },
  })

  const SubmitForm = () => {
    form.validateFields((error, value) => {
      if (!error) {
        createTemplate({
          variables: {
            studentId,
            behaviorId: 'QmVoYXZpb3JUeXBlOjY4',
            status: value.status,
            description: value.description,
            measurements: [value.measurements],
            envs: [value.envs],
          },
        })
      }
    })
  }

  return (
    <Form
      onSubmit={SubmitForm}
      name="control-ref"
      style={{ marginLeft: 0, position: 'relative', ...style }}
    >
      <Button
        type="link"
        onClick={() => {
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
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: 'Please select the behavior name!' }],
        })(
          <Select
            placeholder="Select Behavior Name"
            size="large"
            loading={behaviorLoading}
            showSearch
            optionFilterProp="name"
            style={{
              color: '#000',
            }}
          >
            {behaviorData &&
              behaviorData.getBehaviour.edges.map(({ node }) => {
                return (
                  <Option key={node.id} vlaue={node.id} name={node.behaviorName}>
                    {node.behaviorName}
                  </Option>
                )
              })}
          </Select>,
        )}
      </Form.Item>

      <Form.Item label="Status">
        {form.getFieldDecorator('status', {
          rules: [{ required: true, message: 'Please select a status' }],
        })(
          <Select placeholder="Select Behaviour Status" size="large" loading={dancleStatusLoading}>
            {dancleStatusData &&
              dancleStatusData.getDecelStatus.map(dancleStatus => (
                <Option value={dancleStatus.id}>{dancleStatus.statusName}</Option>
              ))}
          </Select>,
        )}
      </Form.Item>

      <Form.Item label="Behaviour Description">
        {form.getFieldDecorator('description', { initialValue: '' })(
          <TextArea
            placeholder="Describe the behaviour"
            style={{
              height: 174,
              resize: 'none',
              color: '#000',
            }}
            autoSave={false}
          />,
        )}
      </Form.Item>

      <Form.Item label="Environments">
        {form.getFieldDecorator('envs', {
          rules: [{ required: true, message: 'Please select a Environments' }],
        })(
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Please select"
            size="large"
            loading={dancleEnvLoading}
          >
            {dancleEnvData &&
              dancleEnvData.getEnvironment.map(envData => (
                <Option value={envData.id}>{envData.name}</Option>
              ))}
          </Select>,
        )}
      </Form.Item>

      <Form.Item label="Measurements">
        {form.getFieldDecorator('measurements', {
          initialValue: [durationMesId],
          rules: [{ required: true, message: 'Please select a Environments' }],
        })(
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Please select"
            size="large"
            loading={dancleMeasurementLoading}
          >
            {dancleMeasurementData &&
              dancleMeasurementData.getBehaviourMeasurings.map(measurement => (
                <Option value={measurement.id} disabled={measurement.id === durationMesId}>
                  {measurement.measuringType}
                </Option>
              ))}
          </Select>,
        )}
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
          loading={newTempleteLoading}
        >
          New Template
        </Button>
      </Form.Item>
    </Form>
  )
}

export default Form.create()(BehaviourForm)
