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
    $drug: [Object!]!
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
        remainders: [
          { time: "10:00 AM", frequency: "Daily" }
          { time: "07:00 PM", frequency: "Daily" }
        ]
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
      return update(action.index, { ...state[action.index], times: `${action.time} mg` }, state)
    case 'UPDATE_DOSAGE':
      return update(
        action.index,
        { ...state[action.index], dosage: parseInt(action.dosage, 10) },
        state,
      )
    default:
      return state
  }
}

const MealForm = ({ style, handleNewMediDate, setNewMediCreated }) => {
  const [condition, setConditon] = useState('')
  const [startDate, setStartDate] = useState(moment().format(dateFormat))
  const [endDate, setEndDate] = useState(moment().format(dateFormat))
  const [severity, setSeverity] = useState('')
  const [drug, setDrug] = useState('')
  const [drugDosage, setDrugDosage] = useState()
  const [drugDosageTime, setDrugDosageTime] = useState('')
  const [reminder, setReminder] = useState(true)
  const [preseptionDrugCount, setPreseptionDrugCount] = useState(1)
  const [remainderCount, setRemainderCount] = useState(1)
  const [remainderTime, setRemainderTime] = useState()
  const [remainderRepetaion, setReminderRepetaion] = useState()

  const [presepState, presepDispatch] = useReducer(presepReducer, [
    { drugName: 'he', time: 1, dosage: 1 },
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
      date: moment(startDate).format('YYYY-MM-DD'),
      startDate: moment(startDate).format('YYYY-MM-DD'),
      endDate: moment(endDate).format('YYYY-MM-DD'),
      drug: presepState,
      severity,
    },
  })

  const SubmitForm = e => {
    e.preventDefault()
    mutate()
  }

  useEffect(() => {
    if (data) {
      notification.success({
        message: 'Meal Data',
        description: 'Meal Data Added Successfully',
      })
      handleNewMediDate(data.createMedical.details.date)
      console.log(data)
      setNewMediCreated(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  useEffect(() => {
    if (error) {
      notification.error({
        message: 'Somthing want wrong',
        description: error,
      })
    }
  }, [error])

  if (error) {
    return <pre>{JSON.stringify(error, null, 2)}</pre>
  }

  return (
    <Form onSubmit={e => SubmitForm(e, this)} name="control-ref" style={{ marginLeft: 0 }}>
      <Form.Item label="Madical Condition" style={{ marginBottom: 0 }}>
        <Input value={condition} onChange={e => setConditon(e.target.value)} size="large" />
      </Form.Item>

      <Form.Item label="Start & End Date" style={{ marginBottom: 0 }}>
        <RangePicker
          onCalendarChange={value => {
            setStartDate(value[0])
            setEndDate(value[1])
          }}
          size="large"
        />
      </Form.Item>

      <Form.Item label="Severity" style={{ marginBottom: 0 }}>
        <Select
          placeholder="Select Severity"
          onChange={value => {
            setSeverity(value)
          }}
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
        </Select>
      </Form.Item>

      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 30,
          }}
        >
          <Title style={{ fontSize: 18 }}>Preseption Drugs</Title>
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
              drug={drug}
              setDrug={setDrug}
              drugDosageTime={drugDosageTime}
              setDrugDosageTime={setDrugDosageTime}
              drugDosage={drugDosage}
              setDrugDosage={setDrugDosage}
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
              Medical Reminders
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
              setReminderRepetaion={setReminderRepetaion}
              setRemainderTime={setRemainderTime}
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
          <Text style={{ color: '#000', fontSize: 16 }}>Add Another Remainder</Text>
          <Button
            style={{
              height: 40,
              marginLeft: 'auto',
            }}
            onClick={() => {
              setRemainderCount(state => state + 1)
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

export default MealForm
