import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Select, notification, DatePicker } from 'antd'
import gql from 'graphql-tag'
import { useMutation, useQuery } from 'react-apollo'
import moment from 'moment'
import './appiorMentForm.scss'

const { TextArea } = Input
const { Option } = Select

const CREATE_APPIORMENTS = gql`
  mutation CreateAppointment(
    $therapistId: ID!
    $studentId: ID!
    $locationId: ID!
    $title: String
    $purposeAssignment: String!
    $note: String!
    $start: DateTime!
    $end: DateTime!
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

export default ({ setNewAppiormentCreated, handelNewAppiormentDrawer }) => {
  const [location, setLocalions] = useState()
  const [purposeAssignment, setPurposeAssignment] = useState()
  const [note, setNote] = useState()
  const [start, setStart] = useState(moment('00:00:00', 'HH:mm:ss'))
  const [end, setEnd] = useState(moment('00:00:00', 'HH:mm:ss'))
  const [title, setTitle] = useState()
  const [student, setStudent] = useState()
  const [therapist, setTherapist] = useState()

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
        description: 'Appiontment created Successfully',
      })
      setNewAppiormentCreated(true)
      handelNewAppiormentDrawer()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createAppiormentsData])

  useEffect(() => {
    if (createAppiormentsError) {
      notification.error({
        message: 'Something went wrong!',
        description: createAppiormentsError,
      })
    }
  }, [createAppiormentsError])

  const handleSubmit = () => {
    createAppiorments({
      variables: {
        therapistId: therapist,
        studentId: student,
        title,
        locationId: location,
        purposeAssignment,
        note,
        start,
        end,
      },
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
        <Form.Item label="Title" rules={[{ required: true, message: 'Please give a Title' }]}>
          <Input
            placeholder="Title"
            value={title}
            size="large"
            onChange={e => setTitle(e.target.value)}
          />
        </Form.Item>

        <Form.Item
          label="Select Student"
          rules={[{ required: true, message: 'Please select a student!' }]}
        >
          <Select
            onChange={value => {
              setStudent(value)
            }}
            placeholder="Select Student"
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
          </Select>
        </Form.Item>

        <Form.Item
          label="Appointment Reason"
          rules={[
            {
              required: true,
              message: 'Please type the Appointment Reason',
            },
          ]}
        >
          <Input
            placeholder="Appointment Reason"
            value={purposeAssignment}
            size="large"
            onChange={e => setPurposeAssignment(e.target.value)}
          />
        </Form.Item>

        <Form.Item
          label="Location"
          rules={[{ required: true, message: 'Please select a location!' }]}
        >
          <Select
            onChange={value => {
              setLocalions(value)
            }}
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
          </Select>
        </Form.Item>

        <Form.Item
          label="Start Time"
          rules={[{ required: true, message: 'Please select start time!' }]}
        >
          <DatePicker
            style={{
              width: '100%',
            }}
            placeholder="Start Time"
            format="YYYY-MM-DD HH:mm:ss"
            showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
            value={start}
            onChange={newTime => {
              setStart(newTime)
            }}
            size="large"
          />
        </Form.Item>

        <Form.Item
          label="End Time"
          rules={[{ required: true, message: 'Please select end time!' }]}
        >
          <DatePicker
            style={{
              width: '100%',
            }}
            size="large"
            value={end}
            format="YYYY-MM-DD HH:mm:ss"
            showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
            onChange={newTime => setEnd(newTime)}
            placeholder="End Time"
          />
        </Form.Item>

        <Form.Item
          label="Select Therapist"
          rules={[{ required: true, message: 'Please select a therapist!' }]}
        >
          <Select
            placeholder="Select Therefist"
            size="large"
            onChange={value => setTherapist(value)}
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
          </Select>
        </Form.Item>

        <Form.Item label="Note">
          <TextArea
            placeholder="Take a note"
            value={note}
            onChange={e => setNote(e.target.value)}
            style={{
              height: 150,
              resize: 'none',
            }}
          />
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
            Create Appiontment
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}
