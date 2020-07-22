/* eslint-disable no-shadow */
import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Select, DatePicker, notification, TimePicker } from 'antd'
import gql from 'graphql-tag'
import { useMutation, useQuery } from 'react-apollo'
import moment from 'moment'
import './MealForm.scss'

const { TextArea } = Input
const { Option } = Select

const CREATE_MEAL = gql`
  mutation createFood(
    $id: ID
    $date: Date
    $mealName: String!
    $mealTime: String
    $note: String
    $mealType: String
    $waterIntake: String
    $foodType: ID
  ) {
    createFood(
      input: {
        foodData: {
          student: $id
          date: $date
          mealName: $mealName
          mealTime: $mealTime
          note: $note
          mealType: $mealType
          waterIntake: $waterIntake
          foodType: $foodType
          note: $note
        }
      }
    ) {
      details {
        id
        mealType
        mealName
        waterIntake
        date
        mealTime
        note
        foodType {
          id
          name
        }
      }
    }
  }
`

const GET_FOOD_TYPE = gql`
  query {
    getFoodType {
      id
      name
    }
  }
`

const dateFormat = 'YYYY-MM-DD'

const MealForm = ({ style, handleNewMealDate, setNewMeal, form }) => {
  const [date, setDate] = useState(moment())
  const [mealTime, setMealTime] = useState(moment())
  const [note, setNote] = useState('')
  const studentId = localStorage.getItem('studentId')

  const foodTypeQuery = useQuery(GET_FOOD_TYPE)

  const [mutate, { data, error }] = useMutation(CREATE_MEAL)

  const SubmitForm = e => {
    e.preventDefault()
    form.validateFields((error, values) => {
      if (!error) {
        mutate({
          variables: {
            id: studentId,
            date: moment(date).format(dateFormat),
            mealName: values.mealName,
            mealType: values.mealType,
            waterIntake: values.waterIntake,
            foodType: values.foodType,
            note: values.note,
            mealTime: moment(values.mealTime).format('HH:mm a'),
          },
        })
      }
    })
  }

  useEffect(() => {
    if (data) {
      notification.success({
        message: 'Meal Data',
        description: 'Meal Data Added Successfully',
      })
      handleNewMealDate(data.createFood.details.date)
      setNewMeal(data.createFood.details)
      form.resetFields()
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
      style={{ marginLeft: 0, position: 'relative', ...style }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Form.Item label="Meal Date" rule={[]}>
          {form.getFieldDecorator('mealDate', {
            initialValue: date,
            rules: [{ required: true, message: 'Please Select Name!' }],
          })(<DatePicker />)}
        </Form.Item>

        <Form.Item label="Meal Time">
          {form.getFieldDecorator('mealTime', {
            initialValue: mealTime,
            rules: [{ required: true, message: 'Please Select a time!' }],
          })(<TimePicker />)}
        </Form.Item>
      </div>

      <Form.Item label="Meal Name">
        {form.getFieldDecorator('mealName', {
          rules: [{ required: true, message: 'Please Select meal name!' }],
        })(<Input placeholder="Enter Meal Name" name="mealName" style={{ color: '#000' }} />)}
      </Form.Item>

      <Form.Item label="Meal Type">
        {form.getFieldDecorator('mealType', {
          rules: [{ required: true, message: 'Please Select a meal type!' }],
        })(
          <Select style={{}} placeholder="Select Meal Type" allowclear size="large" showSearch>
            <Option value="Breakfast">Breakfast</Option>
            <Option value="Lunch">Lunch</Option>
            <Option value="Dinner">Dinner</Option>
          </Select>,
        )}
      </Form.Item>

      <Form.Item label="Food Type">
        {form.getFieldDecorator('foodType', {
          rules: [{ required: true, message: 'Please Select a food type!' }],
        })(
          <Select
            style={{}}
            placeholder="Select Food Type"
            size="large"
            allowclear
            showSearch
            optionFilterProp="name"
          >
            {foodTypeQuery.data &&
              foodTypeQuery.data.getFoodType.map(type => {
                return (
                  <Option value={type.id} key={type.id} name={type.name}>
                    {type.name}
                  </Option>
                )
              })}
          </Select>,
        )}
      </Form.Item>

      <Form.Item label="Water">
        {form.getFieldDecorator('waterIntake', {
          rules: [
            {
              required: true,
              message: 'Please give the water intake number on ml!',
            },
          ],
        })(<Input placeholder="Enter water taken" type="number" addonAfter="ml" min={0} />)}
      </Form.Item>

      <Form.Item label="Note">
        {form.getFieldDecorator('note')(
          <TextArea
            placeholder="Meal Details"
            name="note"
            onChange={e => setNote(e.target.value)}
            value={note}
            autoSize={{ minRows: 3 }}
            style={{
              color: '#000',
            }}
          />,
        )}
      </Form.Item>

      <Form.Item>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Button
            type="primary"
            htmlType="submit"
            style={{
              width: 180,
              height: 40,
              background: '#0B35B3',
            }}
          >
            Save Data
          </Button>
        </div>
      </Form.Item>
    </Form>
  )
}

export default Form.create()(MealForm)
