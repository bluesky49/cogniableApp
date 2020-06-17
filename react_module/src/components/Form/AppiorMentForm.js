import React, { useEffect } from 'react'
import { Form, Input, Button, Select, notification, DatePicker } from 'antd'
import gql from 'graphql-tag'
import { useSelector } from 'react-redux'
import { useMutation, useQuery } from 'react-apollo'
import moment from 'moment'
import './appiorMentForm.scss'

const { TextArea } = Input
const { Option } = Select

const CREATE_APPIORMENTS = gql`
  mutation CreateAppointment(
    $therapistId: ID!,
    $studentId: ID!,
    $locationId: ID,
    $title: String,
    $purposeAssignment: String!,
    $note: String,
    $start: DateTime!,
    $end: DateTime!,
  ) {
    CreateAppointment(
      input: {
        appointment: {
          therapist: $therapistId
          student: $studentId
          location: $locationId
          title: $title
          purposeAssignment: $purposeAssignment
          note: $note
          start: $start
          end: $end
        }
      }
    ) {
      appointment {
        id
      }
    }
  }
`

const ALL_STUDENT = gql`
  query {
    students {
      edges {
        node {
          id
          firstname
          internalNo
        }
      }
    }
  }
`

const ALL_THERAPIST = gql`
  query {
    staffs(userRole: "Therapist") {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`

const ALL_LOCATION = gql`
  query {
    schoolLocation {
      edges {
        node {
          id
          location
        }
      }
    }
  }
`

const AppiorMentForm = ({ setNewAppiormentCreated, form }) => {

  const userRole = useSelector(state => state.user.role)
  const therapistReduxId = useSelector(state => state.user.staffId)

  const { data: allSudent, loading: allSudentLoading } = useQuery(ALL_STUDENT)

  const { data: allTherapist, loading: allTherapistLoading } = useQuery(ALL_THERAPIST)

  const { data: allLocation, loading: allLocationLoading } = useQuery(ALL_LOCATION)

  const [
    createAppiorments,
    { data: createAppiormentsData, error: createAppiormentsError },
  ] = useMutation(CREATE_APPIORMENTS)

  useEffect(() => {
    if (createAppiormentsData) {
      notification.success({
        message: 'Clinic Dashboard',
        description: 'Appointment created Successfully',
      })
      form.resetFields()
      if (setNewAppiormentCreated) {
        setNewAppiormentCreated(true)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createAppiormentsData])

  useEffect(() => {
    if (createAppiormentsError) {
      notification.error({
        message: 'Something went wrong!',
        description: createAppiormentsError.message,
      })
    }
  }, [createAppiormentsError])

  const handleSubmit = e => {
    e.preventDefault()
    form.validateFields((error, values) => {
      if (!error) {
        createAppiorments({
          variables: {
            therapistId: userRole === 'therapist' ? therapistReduxId : values.therapist,
            studentId: values.student,
            title: values.title,
            locationId: values.location ? values.location : '',
            purposeAssignment: values.purposeAssignment,
            note: values.note ? values.note : "" ,
            start: values.start,
            end: values.end,
          },
        })
      }
    })
  }

  return (
    <>
      <Form
        name="basic"
        style={{
          marginTop: 0,
        }}
        onSubmit={handleSubmit}
        size="large"
      >
        <Form.Item label="Title">
          {form.getFieldDecorator('title', {
            rules: [{ required: true, message: 'Please give a title' }],
          })(<Input placeholder="Title" size="large" />)}
        </Form.Item>

        <Form.Item label="Select Learner">
          {form.getFieldDecorator('student', {
            rules: [{ required: true, message: 'Please select a Learner' }],
          })(
            <Select
              placeholder="Select Learner"
              size="large"
              loading={allSudentLoading}
              showSearch
              optionFilterProp="name"
            >
              {allSudent &&
                allSudent.students.edges.map(({ node }) => (
                  <Option value={node.id} name={node.firstname}>
                    {node.firstname}
                  </Option>
                ))}
            </Select>,
          )}
        </Form.Item>

        <Form.Item label="Appointment Reason">
          {form.getFieldDecorator('purposeAssignment', {
            rules: [
              {
                required: true,
                message: 'Please give the Appointment Reason',
              },
            ],
          })(<Input placeholder="Appointment Reason" size="large" />)}
        </Form.Item>

        <Form.Item
          label="Location"
          rules={[{ required: true, message: 'Please select a location!' }]}
        >
          {form.getFieldDecorator('location')(
            <Select
              placeholder="Select Location"
              size="large"
              loading={allLocationLoading}
              showSearch
              optionFilterProp="location"
            >
              {allLocation &&
                allLocation.schoolLocation.edges.map(({ node }) => (
                  <Option key={node.id} location={node.location}>
                    {node.location}
                  </Option>
                ))}
            </Select>,
          )}
        </Form.Item>

        <Form.Item
          label="Start Time"
          rules={[{ required: true, message: 'Please select a start time!' }]}
        >
          {form.getFieldDecorator('start', {
            rules: [
              {
                required: true,
                message: 'Please select the start date',
              },
            ],
          })(
            <DatePicker
              style={{
                width: '100%',
              }}
              placeholder="Start Time"
              format="YYYY-MM-DD HH:mm:ss"
              showTime={{ defaultValue: moment() }}
              size="large"
            />,
          )}
        </Form.Item>

        <Form.Item
          label="End Time"
          rules={[{ required: true, message: 'Please select a end time!' }]}
        >
          {form.getFieldDecorator('end', {
            rules: [
              {
                required: true,
                message: 'Please select a end time',
              },
            ],
          })(
            <DatePicker
              style={{
                width: '100%',
              }}
              size="large"
              format="YYYY-MM-DD HH:mm:ss"
              showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
              placeholder="End Time"
            />,
          )}
        </Form.Item>

        {userRole === 'therapist' ?
          ''
        :
          <Form.Item
            label="Select Therapist"
          >
            {form.getFieldDecorator('therapist', {
              rules: [
                {
                  required: true,
                  message: 'Please select a Therapist',
                },
              ],
            })(
              <Select
                placeholder="Select Therapist"
                size="large"
                loading={allTherapistLoading}
                showSearch
                optionFilterProp="name"
              >
                {allTherapist &&
                  allTherapist.staffs.edges.map(({ node }) => (
                    <Option key={node.id} name={node.name}>
                      {node.name}
                    </Option>
                  ))}
              </Select>,
            )}
          </Form.Item>          
        }

        <Form.Item label="Note">
          {form.getFieldDecorator('note')(
            <TextArea
              placeholder="Take a note"
              style={{
                height: 150,
                resize: 'none',
              }}
            />,
          )}
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{
              width: 180,
              height: 40,
              background: '#0B35B3',
              marginTop: 15,
              marginBottom: 20,
            }}
          >
            Create Appointment
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}

export default Form.create()(AppiorMentForm)
