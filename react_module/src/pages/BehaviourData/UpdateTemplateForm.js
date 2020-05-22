/* eslint-disable array-callback-return */
/* eslint-disable react/jsx-closing-tag-location */
import React, { useEffect, useState } from 'react'
import { Form, Input, Button, Select, notification } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import gql from 'graphql-tag'
import { useQuery, useMutation } from 'react-apollo'
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

const TEMPLATE_DETAILS = gql`
  query getTemplateDetails($id: ID!) {
    getTemplateDetails(id: $id) {
      id
      behavior {
        id
        behaviorName
        definition
      }
      status {
        id
        statusName
      }
      behaviorDescription
      environment {
        edges {
          node {
            id
            name
          }
        }
      }
      measurments {
        edges {
          node {
            id
            measuringType
            unit
          }
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

const UPDATE_TEMP = gql`
  mutation updateTemplate(
    $studentId: ID!
    $behaviorId: ID!
    $tempId: ID!
    $status: ID!
    $description: String!
    $measurments: [ID!]!
    $env: [ID!]!
  ) {
    updateTemplate(
      input: {
        decelData: {
          pk: $tempId
          student: $studentId
          behavior: $behaviorId
          status: $status
          behaviorDescription: $description
          measurments: $measurments
          environment: $env
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

const BehaviourForm = ({ style, tempId, form, setUpdateTempId }) => {
  const durationMesId = 'RGVjZWxCZWhhdmlvck1lYXN1cmluZ3NUeXBlOjQ='
  const studentId = localStorage.getItem('studentId')
  const [initialEnv, setInitialEnv] = useState()
  const [initialMeasu, setInitialMeasu] = useState()

  const {
    data: getTemDetailsData,
    loading: getTemDetailsLoading,
    error: getTemDetailsError,
  } = useQuery(TEMPLATE_DETAILS, { variables: { id: tempId } })

  const { data: behaviorData, loading: behaviorLoading } = useQuery(BEHAVIORS, {
    variables: {
      studentId,
    },
  })

  const { data: dancleStatusData, loading: dancleStatusLoading } = useQuery(DANCLE_STATUS)

  const { data: dancleEnvData, loading: dancleEnvLoading } = useQuery(DANCLE_ENVS)

  const { data: dancleMeasurementData, loading: dancleMeasurementLoading } = useQuery(
    DANCLE_MEASURMENTS,
  )

  const [
    updateTemp,
    { data: updateTempData, loading: updateTempLoading, error: updateTempError },
  ] = useMutation(UPDATE_TEMP)

  useEffect(() => {
    if (getTemDetailsData) {
      const env = []
      getTemDetailsData.getTemplateDetails.environment.edges.map(({ node }) => {
        env.push(node.id)
      })
      setInitialEnv(env)

      const measurement = []
      getTemDetailsData.getTemplateDetails.measurments.edges.map(({ node }) => {
        measurement.push(node.id)
      })
      setInitialMeasu(measurement)
    }
  }, [getTemDetailsData])

  useEffect(() => {
    if (updateTempData) {
      notification.success({
        message: 'Update Template Sucessfully',
      })
    }
  }, [updateTempData])

  useEffect(() => {
    if (updateTempError) {
      notification.error({
        message: 'Opps their something wrong',
      })
    }
  }, [updateTempError])

  const SubmitForm = () => {
    form.validateFields((error, value) => {
      if (!error) {
        updateTemp({
          variables: {
            tempId,
            studentId,
            behaviorId: value.name,
            status: value.status,
            description: value.description,
            measurments: value.measurements,
            env: value.envs,
          },
        })
        form.resetFields()
        setUpdateTempId('')
      }
    })
  }

  return (
    <Form
      onSubmit={SubmitForm}
      name="control-update"
      style={{ marginLeft: 0, position: 'relative', ...style }}
    >
      <Button
        type="link"
        onClick={() => {
          setUpdateTempId('')
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
      {getTemDetailsLoading && <div style={{ minHeight: '90vh' }}>Loading...</div>}
      {getTemDetailsError && <div style={{ minHeight: '90vh' }}>Opps their something wrong</div>}
      {getTemDetailsData && (
        <div>
          <Form.Item label="Behaviour Name">
            {form.getFieldDecorator('name', {
              initialValue: getTemDetailsData && getTemDetailsData.getTemplateDetails.behavior.id,
              rules: [{ required: true, message: 'Please select the behavior name!' }],
            })(
              <Select
                placeholder="Select Behavior Name"
                size="large"
                loading={behaviorLoading}
                showSearch
                optionFilterProp="name"
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
              initialValue: getTemDetailsData.getTemplateDetails.status.id,
              rules: [{ required: true, message: 'Please select a status' }],
            })(
              <Select
                placeholder="Select Behaviour Status"
                size="large"
                loading={dancleStatusLoading}
              >
                {dancleStatusData &&
                  dancleStatusData.getDecelStatus.map(dancleStatus => (
                    <Option value={dancleStatus.id} key={dancleStatus.id}>
                      {dancleStatus.statusName}
                    </Option>
                  ))}
              </Select>,
            )}
          </Form.Item>

          <Form.Item label="Behaviour Description">
            {form.getFieldDecorator('description', {
              initialValue: getTemDetailsData.getTemplateDetails.behaviorDescription,
            })(
              <TextArea
                placeholder="Describe the behaviour"
                style={{
                  height: 174,
                  resize: 'none',
                  color: '#000',
                }}
              />,
            )}
          </Form.Item>

          <Form.Item label="Environments">
            {form.getFieldDecorator('envs', {
              initialValue: initialEnv && initialEnv,
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
                    <Option key={envData.id} value={envData.id}>
                      {envData.name}
                    </Option>
                  ))}
              </Select>,
            )}
          </Form.Item>

          <Form.Item label="Measurements">
            {form.getFieldDecorator('measurements', {
              initialValue: initialMeasu && initialMeasu,
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
                    <Option
                      key={measurement.id}
                      value={measurement.id}
                      disabled={measurement.id === durationMesId}
                    >
                      {measurement.measuringType}
                    </Option>
                  ))}
              </Select>,
            )}
          </Form.Item>

          <Form.Item>
            <div
              style={{
                marginTop: 15,
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Button
                type="primary"
                htmlType="submit"
                style={{
                  width: '47%',
                  height: 40,
                  background: '#0B35B3',
                }}
                loading={updateTempLoading}
              >
                Update Template
              </Button>
              <Button
                type="danger"
                style={{
                  width: '47%',
                  height: 40,
                }}
                disabled={updateTempLoading}
                onClick={() => {
                  form.resetFields()
                  setUpdateTempId('')
                }}
              >
                Cancle
              </Button>
            </div>
          </Form.Item>
        </div>
      )}
    </Form>
  )
}

export default Form.create()(BehaviourForm)
