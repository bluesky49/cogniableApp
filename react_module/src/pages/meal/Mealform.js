/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Select, DatePicker, notification, TimePicker } from 'antd'
import { connect, useSelector } from 'react-redux'
import gql from 'graphql-tag'
import { useMutation, useQuery, useLazyQuery } from 'react-apollo'
import moment from 'moment'
import './MealForm.scss'
import { usePrevious } from 'react-delta'

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

const UPDATE_MEAL = gql`
  mutation updateFood(
    $foodId: ID!
    $studentId: ID!
    $foodType: ID!
    $date: Date!
    $mealName: String!
    $mealType: String!
    $mealTime: String!
    $waterIntake: String!
  ) {
    updateFood(
      input: {
        foodData: {
          id: $foodId
          student: $studentId
          date: $date
          mealName: $mealName
          mealTime: $mealTime
          mealType: $mealType
          foodType: $foodType
          waterIntake: $waterIntake
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
        videoUrl
        duration
        foodType {
          id
          name
        }
      }
    }
  }
`

const GET_A_MEAL = gql`
  query getFoodDetails($mealId: ID!) {
    getFoodDetails(id: $mealId) {
      id
      mealType
      mealName
      waterIntake
      date
      mealTime
      note
      videoUrl
      duration
      foodType {
        id
        name
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

const MealForm = ({
  style,
  handleNewMealDate,
  setNewMealCreated,
  updateMealId,
  setUpdateMealId,
}) => {
  const [date, setDate] = useState(moment())
  const [mealName, setMealName] = useState('')
  const [mealTime, setMealTime] = useState(moment())
  const [note, setNote] = useState('')
  const [mealType, setMealType] = useState()
  const [waterIntake, setWaterIntake] = useState()
  const [foodType, setFoodType] = useState()
  const studentId = localStorage.getItem('studentId')

  const foodTypeQuery = useQuery(GET_FOOD_TYPE)

  const [mutate, { data, error }] = useMutation(CREATE_MEAL, {
    variables: {
      id: studentId,
      date: moment(date).format(dateFormat),
      mealName,
      mealTime: moment(mealTime).format('HH:mm a'),
      note,
      mealType,
      waterIntake,
      foodType,
    },
  })

  const [updateMeal, { data: updateMealData, error: updateMealError }] = useMutation(UPDATE_MEAL, {
    userId: studentId,
    mealId: updateMealId,
  })

  const [
    getAMealData,
    {
      error: aMealError,
      loading: aMealLoading,
      data: aMealData,
      called: aMealDataCalled,
      refetch: aMealDataRefetch,
    },
  ] = useLazyQuery(GET_A_MEAL, {
    fetchPolicy: 'network-only',
  })

  const pravUpdateMealId = usePrevious(updateMealId)

  const SubmitForm = e => {
    e.preventDefault()
    if (updateMealId) {
      updateMeal({
        variables: {
          foodId: updateMealId,
          studentId,
          date: moment(date).format('YYYY-MM-DD'),
          mealName,
          mealType,
          waterIntake,
          foodType,
          note,
          mealTime: moment(mealTime).format('HH:mm a'),
        },
      })
    } else {
      mutate()
    }
  }

  useEffect(() => {
    if (updateMealData) {
      notification.success({
        message: 'Meal Data',
        description: 'Updated Meal Successfully',
      })
      handleNewMealDate(updateMealData.updateFood.details.date)
      setNewMealCreated(true)
      setNote('')
      setMealName('')
      setWaterIntake('')
      setMealType('')
      setFoodType('')
      setUpdateMealId()
      setMealTime(moment())
      setDate(moment())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateMealData])

  useEffect(() => {
    if (updateMealError) {
      notification.error({
        message: 'Somthing want wrong',
        description: 'updateMealError',
      })
    }
  }, [updateMealError])

  useEffect(() => {
    if (updateMealId) {
      if (updateMealId === pravUpdateMealId) {
        aMealDataRefetch({
          variables: {
            mealId: updateMealId,
          },
        })
      } else {
        getAMealData({
          variables: {
            mealId: updateMealId,
          },
        })
      }
    }
  }, [aMealDataRefetch, getAMealData, pravUpdateMealId, updateMealId])

  useEffect(() => {
    if (aMealData) {
      // eslint-disable-next-line no-shadow
      const newData = aMealData.getFoodDetails
      setMealName(newData.mealName)
      setMealType(newData.mealType)
      setMealTime(moment(newData.mealTime, 'HH:mm a'))
      setNote(newData.note)
      setWaterIntake(parseInt(newData.waterIntake.split(' ')[0], 10))
      setDate(moment(newData.date))
      setFoodType(newData.foodType.id)
    }
  }, [aMealData])

  useEffect(() => {
    if (data) {
      notification.success({
        message: 'Meal Data',
        description: 'Meal Data Added Successfully',
      })
      handleNewMealDate(data.createFood.details.date)
      setNewMealCreated(true)
      setNote('')
      setMealName('')
      setWaterIntake('')
      setMealType('')
      setFoodType('')
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
      style={{ marginLeft: 0, position: 'relative' }}
    >
      {aMealLoading && <div style={{ position: 'absolute', top: -20, left: 0 }}>Loading...</div>}
      <div
        style={{
          display: aMealLoading ? 'hidden' : 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Form.Item label="Meal Date" rule={[]}>
          <DatePicker
            value={date}
            onChange={value => {
              setDate(value)
            }}
            name="date"
          />
        </Form.Item>

        <Form.Item label="Meal Time">
          <TimePicker value={mealTime} onChange={value => setMealTime(value)} name="mealTime" />
        </Form.Item>
      </div>

      <Form.Item label="Meal Name">
        <Input
          value={mealName}
          onChange={e => setMealName(e.target.value)}
          placeholder="Enter Meal Name"
          name="mealName"
          style={{ color: '#000' }}
        />
      </Form.Item>

      <Form.Item label="Meal Type">
        <Select
          style={{}}
          placeholder="Select Meal Type"
          name="mealType"
          onChange={value => setMealType(value)}
          value={mealType}
          allowclear
          size="large"
          showSearch
        >
          <Option value="Breakfast">Breakfast</Option>
          <Option value="Lunch">Lunch</Option>
          <Option value="Dinner">Dinner</Option>
        </Select>
      </Form.Item>

      <Form.Item label="Food Type">
        <Select
          style={{}}
          placeholder="Select Food Type"
          name="foodType"
          value={foodType}
          size="large"
          onChange={value => setFoodType(value)}
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
        </Select>
      </Form.Item>

      <Form.Item label="Water">
        <Input
          placeholder="Enter water taken"
          name="waterIntake"
          value={waterIntake}
          type="number"
          addonAfter="ml"
          min={0}
          onChange={e => setWaterIntake(e.target.value)}
        />
      </Form.Item>

      <Form.Item label="Note">
        <TextArea
          placeholder="Meal Details"
          name="note"
          onChange={e => setNote(e.target.value)}
          value={note}
          autoSize={{ minRows: 3 }}
          style={{
            color: '#000',
          }}
        />
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
            Save {updateMealId ? 'update' : 'Data'}
          </Button>
          {updateMealId && (
            <Button
              onClick={() => {
                setUpdateMealId()
                setMealTime(moment())
                setDate(moment())
                setNote()
                setMealType()
                setFoodType()
                setMealName()
                setWaterIntake()
              }}
              style={{
                width: 150,
                marginLeft: 20,
                height: 40,
                background: '#ff4444',
                color: '#fff',
              }}
            >
              Cancle Update
            </Button>
          )}
        </div>
      </Form.Item>
    </Form>
  )
}

export default MealForm
