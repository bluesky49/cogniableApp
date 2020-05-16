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
  Typography,
  Switch,
} from 'antd'
import { connect, useSelector } from 'react-redux'
import gql from 'graphql-tag'
import { useMutation, useQuery } from 'react-apollo'
import moment from 'moment'
import './toiletForm.scss'

const { RangePicker } = DatePicker
const { Option } = Select
const { Title, Text } = Typography

const CREATE_TOILET_DATA = gql`
  mutation recordToiletdata(
    $date: Date!
    $time: String!
    $waterIntake: String!
    $waterIntakeTime: String!
    $urination: Boolean!
    $bowel: Boolean!
    $prompted: Boolean!
  ) {
    recordToiletdata(
      input: {
        toiletData: {
          student: "U3R1ZGVudFR5cGU6MTYz"
          date: $date
          time: $time
          lastWater: $waterIntake
          lastWaterTime: $waterIntakeTime
          success: true
          urination: $urination
          bowel: $bowel
          prompted: $prompted
        }
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

const dateFormat = 'YYYY-MM-DD'

const MealForm = ({ style, handleNewMealDate, setNewMealCreated }) => {
  const [condition, setConditon] = useState('')
  const [startDate, setStartDate] = useState(moment().format(dateFormat))
  const [endDate, setEndDate] = useState(moment().format(dateFormat))
  const [severity, setSeverity] = useState('')
  const [drug, setDrug] = useState('')
  const [drugDosage, setDrugDosage] = useState()
  const [drugDosageTime, setDrugDosageTime] = useState('')
  const [reminder, setReminder] = useState(true)
  const [remainderTime, setRemainderTime] = useState()
  const [remainderRepetaion, setReminderRepetaion] = useState()

  const user = useSelector(state => state.user)
  const [mutate, { data, error }] = useMutation(CREATE_TOILET_DATA, {
    variables: {
      studentId: user.id,
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
      handleNewMealDate(data.recordToiletdata.details.date)
      console.log(data)
      setNewMealCreated(true)
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
      <Form.Item label="Madical Condition">
        <Input value={condition} onChange={e => setConditon(e.target.value)} />
      </Form.Item>

      <Form.Item label="Start & End Date">
        <RangePicker
          onCalendarChange={value => {
            setStartDate(value[0])
            setEndDate(value[1])
          }}
        />
      </Form.Item>

      <Form.Item label="Severity">
        <Select
          placeholder="Select Severity"
          onChange={value => {
            setSeverity(value)
          }}
        >
          <Option value="Mind">Mind</Option>
        </Select>
      </Form.Item>

      <Form.Item label="Prescription Drug">
        <Input value={drug} onChange={e => setDrug(e.target.value)} />
      </Form.Item>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
        }}
      >
        <Form.Item label="Dosage">
          <Input
            value={drugDosage}
            type="number"
            onChange={e => setDrugDosage(e.target.value)}
            addonAfter="mg"
          />
        </Form.Item>

        <Form.Item>
          <Input
            value={drugDosageTime}
            type="number"
            onChange={e => setDrugDosageTime(e.target.value)}
            addonAfter="times a day"
          />
        </Form.Item>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <Title>Medical Reminders</Title>
          <Text>Remind me for medicine dosage</Text>
        </div>
        <Switch
          defaultChecked
          onChange={e => {
            setReminder(state => !state)
          }}
        />
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Form.Item>
          <TimePicker
            disabled={!reminder}
            onChange={value => {
              setRemainderTime(value)
            }}
          />
        </Form.Item>

        <Form.Item>
          <Select
            disabled={!reminder}
            placeholder="Set Repeat"
            onChange={value => {
              setReminderRepetaion(value)
            }}
          >
            <Option value="Everyday">Everyday</Option>
          </Select>
        </Form.Item>
      </div>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          style={{
            width: 206,
            height: 40,
            background: '#0B35B3',
          }}
        >
          Save Data
        </Button>
      </Form.Item>
    </Form>
  )
}

export default MealForm
