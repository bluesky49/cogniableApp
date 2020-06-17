/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useReducer } from 'react'
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
  Typography,
  Switch,
} from 'antd'
import { connect, useSelector } from 'react-redux'
import gql from 'graphql-tag'
import { useMutation, useQuery } from 'react-apollo'
import moment from 'moment'
import { times, remove, update } from 'ramda'
import './toiletForm.scss'
import { PlusOutlined, MinusOutlined } from '@ant-design/icons'
import ReminderForm from './Medicalform/ReminderForm'
import PreseptionDrugFrom from './Medicalform/PreseptionDrugForm'

const { RangePicker } = DatePicker
const { Option } = Select
const { Title, Text } = Typography

const CREATE_MEDICAL_DATA = gql`
  mutation createMedical(
    $studentId: ID!
    $date: Date!
    $condition: String!
    $startDate: Date!
    $endDate: Date!
    $note: String
    $severity: ID!
    $drug: [DrugInput!]!
    $remainder: [RemainderInput!]!
  ) {
    createMedical(
      input: {
        student: $studentId
        date: $date
        condition: $condition
        startDate: $startDate
        endDate: $endDate
        note: $note
        duration: "10 min"
        lastObservedDate: "2020-05-16"
        severity: $severity
        drug: $drug
        remainders: $remainder
      }
    ) {
      details {
        id
        date
        condition
        startDate
        endDate
        note
        duration
        lastObservedDate
      }
    }
  }
`

const SEVERITY_TYPE = gql`
  query {
    getSeverity {
      id
      name
    }
  }
`

const dateFormat = 'YYYY-MM-DD'

const presepReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_PRESEP_DRUG':
      return [
        ...state,
        {
          drugName: '',
          times: 1,
          dosage: 1,
        },
      ]

    case 'REMOVE_PRESEP_DRUG':
      return remove(action.index, 1, state)

    case 'UPDATE_DRUG':
      return update(action.index, { ...state[action.index], drugName: action.drugName }, state)
    case 'UPDATE_TIME':
      return update(
        action.index,
        { ...state[action.index], times: parseInt(action.time, 10) },
        state,
      )
    case 'UPDATE_DOSAGE':
      return update(
        action.index,
        { ...state[action.index], dosage: parseInt(action.dosage, 10) },
        state,
      )
    case 'RESET':
      return [{ drugName: '', times: 1, dosage: 1 }]
    default:
      return state
  }
}

const remainderReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_REMAINDER':
      return [
        ...state,
        {
          time: moment(),
          frequency: 'Daily',
        },
      ]

    case 'REMOVE_REMAINDER':
      return remove(action.index, 1, state)

    case 'UPDATE_TIME':
      return update(action.index, { ...state[action.index], time: action.time }, state)
    case 'UPDATE_FREQUENCY':
      return update(action.index, { ...state[action.index], frequency: action.frequency }, state)
    case 'RESET':
      return [{ time: moment(), frequency: 'Daily' }]
    default:
      return state
  }
}

const MedicalForm = ({ style, handleNewMediDate, setNewMediCreated, form }) => {
  const [reminder, setReminder] = useState(true)
  const [preseptionDrugCount, setPreseptionDrugCount] = useState(1)
  const [remainderCount, setRemainderCount] = useState(1)

  const [presepState, presepDispatch] = useReducer(presepReducer, [
    { drugName: '', times: 1, dosage: 1 },
  ])

  const [remainderState, remainderDispatch] = useReducer(remainderReducer, [
    { time: moment(), frequency: 'Daily' },
  ])

  const studentId = localStorage.getItem('studentId') 

  const { data: severityType, loading: severityTypeLoading, error: severityTypeError } = useQuery(
    SEVERITY_TYPE,
  )

  useEffect(() => {
    console.log(presepState)
  }, [presepState])

  const [mutate, { data, error }] = useMutation(CREATE_MEDICAL_DATA, {
    variables: {
      studentId,
      drug: presepState,
      remainder: reminder ? remainderState : null,
    },
  })

  useEffect(() => {
    console.log(remainderState)
  }, [remainderState])

  const SubmitForm = e => {
    e.preventDefault()
    // eslint-disable-next-line no-shadow
    form.validateFields((error, values) => {
      if (!error) {
        mutate({
          variables: {
            date: moment(values.timeFream[0]).format('YYYY-MM-DD'),
            startDate: moment(values.timeFream[0]).format('YYYY-MM-DD'),
            endDate: moment(values.timeFream[1]).format('YYYY-MM-DD'),
            condition: values.condition,
            severity: values.severity,
          },
        })
      }
    })
  }

  useEffect(() => {
    if (data) {
      notification.success({
        message: 'Medical Data',
        description: 'Medical Data Added Successfully',
      })
      handleNewMediDate(data.createMedical.details.date)
      form.resetFields()
      setPreseptionDrugCount(1)
      presepDispatch({ type: 'RESET' })
      setRemainderCount(1)
      remainderDispatch({ type: 'RESET' })
      setNewMediCreated(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  useEffect(() => {
    if (error) {
      notification.error({
        message: 'Somthing went wrong',
        description: error,
      })
    }
  }, [error])

  if (error) {
    return <pre>{JSON.stringify(error, null, 2)}</pre>
  }

  return (
    <Form onSubmit={e => SubmitForm(e)} name="control-ref" style={{ marginLeft: 0 }}>
      <Form.Item label="Medical Condition" style={{ marginBottom: 0 }}>    
        {form.getFieldDecorator('condition', {    
          rules: [{ required: true, message: 'Please give the condition name' }],
        })(<Input size="large" placeholder="Type the condition" />)}
      </Form.Item>

      <Form.Item label="Start & End Date" style={{ marginBottom: 0 }}>
        {form.getFieldDecorator('timeFream', {
          rules: [{ required: true, message: 'Please select start and end date!' }],
        })(<RangePicker size="large" />)}
      </Form.Item>

      <Form.Item label="Severity" style={{ marginBottom: 0 }}>
        {form.getFieldDecorator('severity', {
          rules: [{ required: true, message: 'Please select a severity' }],
        })(
          <Select
            placeholder="Select Severity"
            size="large"
            showSearch
            loading={severityTypeLoading}
            optionFilterProp="name"
          >
            {severityType &&
              severityType.getSeverity.map(node => (
                <Option value={node.id} name={node.name}>
                  {node.name}
                </Option>
              ))}
          </Select>,
        )}
      </Form.Item>

      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 30,
          }}
        >
          <Title style={{ fontSize: 18 }}>Prescription Drugs</Title>
          <Button
            style={{
              height: 40,
            }}
            onClick={() => {
              setPreseptionDrugCount(state => state + 1)
              presepDispatch({ type: 'ADD_PRESEP_DRUG' })
            }}
          >
            <PlusOutlined style={{ fontSize: 24, marginTop: 5 }} />
          </Button>
        </div>

        {times(n => {
          return (
            <PreseptionDrugFrom
              index={n}
              dispatch={presepDispatch}
              state={presepState}
              setPreseptionDrugCount={setPreseptionDrugCount}
            />
          )
        }, preseptionDrugCount)}
      </div>

      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            margin: '30px 0 25px',
          }}
        >
          <div>
            <Title
              style={{
                margin: 0,
                fontSize: 18,
              }}
            >
              Medicine Reminders
            </Title>
            <Text>Remind me for medicine dosage</Text>
          </div>
          <Switch
            defaultChecked
            onChange={e => {
              setReminder(state => !state)
            }}
            size="large"
          />
        </div>
        {times(n => {
          return (
            <ReminderForm
              reminder={reminder}
              dispatch={remainderDispatch}
              state={remainderState}
              index={n}
              setRemainderCount={setRemainderCount}
            />
          )
        }, remainderCount)}

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            marginTop: 10,
          }}
        >
          <Text style={{ color: '#000', fontSize: 16 }}>Add Another Reminder</Text>
          <Button
            style={{
              height: 40,
              marginLeft: 'auto',
            }}
            onClick={() => {
              setRemainderCount(state => state + 1)
              remainderDispatch({ type: 'ADD_REMAINDER' })
            }}
          >
            <PlusOutlined style={{ fontSize: 24, marginTop: 5 }} />
          </Button>
        </div>
      </div>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          style={{
            width: '100%',
            height: 45,
            background: '#0B35B3',
            marginTop: 20,
          }}
        >
          Save Data
        </Button>
      </Form.Item>
    </Form>
  )
}

export default Form.create()(MedicalForm)
