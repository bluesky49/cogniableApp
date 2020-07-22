import React, { useState, useEffect, useReducer } from 'react'
import {
  Form,
  Button,
  notification,
  Radio,
  InputNumber,
  TimePicker,
  Typography,
  Switch,
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import gql from 'graphql-tag'
import { useMutation } from 'react-apollo'
import moment from 'moment'
import { times, remove, update } from 'ramda'
import { useSelector } from 'react-redux'
import ReminderForm from './ReminderForm'
import './toiletForm.scss'

const { Title, Text } = Typography

const CREATE_TOILET_DATA = gql`
  mutation recordToiletdata(
    $date: Date!
    $time: String!
    $waterIntake: String
    $waterIntakeTime: String!
    $urination: Boolean!
    $bowel: Boolean!
    $prompted: Boolean!
    $remainders: [RemaindersInput]
    $student: ID!
    $session: ID!
  ) {
    recordToiletdata(
      input: {
        toiletData: {
          session: $session
          student: $student
          date: $date
          time: $time
          lastWater: $waterIntake
          lastWaterTime: $waterIntakeTime
          success: true
          urination: $urination
          bowel: $bowel
          prompted: $prompted
        }
        remainders: $remainders
      }
    ) {
      details {
        id
        date
        time
        lastWater
        lastWaterTime
        success
        urination
        bowel
        prompted
      }
    }
  }
`

const TimeFormat = 'HH:mm'

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

const ToiletForm = ({ style, handleNewToiletDate, setNewToiletCreated, selectDate }) => {
  const [waterIntake, setWaterIntake] = useState()
  const [waterIntakeTime, setwaterIntakeTime] = useState(moment())
  const [urination, setUrination] = useState(true)
  const [bowel, setBowel] = useState(true)
  const [prompted, setPrompted] = useState(true)
  const [reminder, setReminder] = useState(true)
  const [remainderCount, setRemainderCount] = useState(1)
  const studentId = localStorage.getItem('studentId')
  const sessionId = useSelector(state => state.sessionrecording.ChildSession.id)

  const [remainderState, remainderDispatch] = useReducer(remainderReducer, [
    { time: moment(), frequency: 'Daily' },
  ])

  const [mutate, { data, error, loading }] = useMutation(CREATE_TOILET_DATA, {
    variables: {
      session: sessionId,
      student: studentId,
      date: selectDate,
      time: moment().format(TimeFormat),
      waterIntake: waterIntake && `${waterIntake} ml`,
      waterIntakeTime: moment(waterIntakeTime).format(TimeFormat),
      urination,
      bowel,
      prompted,
      remainders: reminder ? remainderState : null,
    },
  })

  const SubmitForm = e => {
    e.preventDefault()
    mutate()
  }

  useEffect(() => {
    if (data) {
      notification.success({
        message: 'Toilet Data',
        description: 'Toilet Data Added Successfully',
      })
      handleNewToiletDate(data.recordToiletdata.details.date)
      setWaterIntake('')
      setRemainderCount(1)
      setNewToiletCreated(true)
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
    <Form
      onSubmit={e => SubmitForm(e, this)}
      name="control-ref"
      style={{ marginLeft: 0, ...style }}
    >
      <Form.Item label="Urination">
        <Radio.Group
          className="radioGroup"
          defaultValue="y"
          onChange={e => {
            if (e.target.value === 'y') {
              setUrination(true)
            } else {
              setUrination(false)
            }
          }}
        >
          <Radio.Button className="radioButton" value="y">
            Yes
          </Radio.Button>
          <Radio.Button className="radioButton" value="n">
            No
          </Radio.Button>
        </Radio.Group>
      </Form.Item>

      <Form.Item label="Bowel Movement">
        <Radio.Group
          className="radioGroup"
          defaultValue="y"
          onChange={e => {
            if (e.target.value === 'y') {
              setBowel(true)
            } else {
              setBowel(false)
            }
          }}
        >
          <Radio.Button className="radioButton" value="y">
            Yes
          </Radio.Button>
          <Radio.Button className="radioButton" value="n">
            No
          </Radio.Button>
        </Radio.Group>
      </Form.Item>

      <Form.Item label="Prompted to Request">
        <Radio.Group
          className="radioGroup"
          defaultValue="y"
          onChange={e => {
            if (e.target.value === 'y') {
              setPrompted(true)
            } else {
              setPrompted(false)
            }
          }}
        >
          <Radio.Button className="radioButton" value="y">
            Yes
          </Radio.Button>
          <Radio.Button className="radioButton" value="n">
            No
          </Radio.Button>
        </Radio.Group>
      </Form.Item>

      <Form.Item label="Water Intake (ml)">
        <InputNumber
          placeholder="Type water Intake in ml"
          style={{ width: '100%' }}
          value={waterIntake}
          onChange={value => setWaterIntake(value)}
        />
      </Form.Item>

      <Form.Item label="Water Intake Time">
        <TimePicker
          value={waterIntakeTime}
          onChange={value => setwaterIntakeTime(value)}
          name="toiletTime"
          style={{ width: '100%' }}
          size="large"
        />
      </Form.Item>

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
            onChange={() => {
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
          <Text style={{ color: '#000', fontSize: 16 }}>Add Another Remainder</Text>
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
            width: 206,
            height: 40,
            background: '#0B35B3',
            marginTop: 10,
          }}
          loading={loading}
        >
          Save Data
        </Button>
      </Form.Item>
    </Form>
  )
}

export default ToiletForm
