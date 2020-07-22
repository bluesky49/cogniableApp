/* eslint-disable no-shadow */
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
  setNewMeal,
  updateMealId,
  setUpdateMealId,
  setUpdateMeal,
  form,
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

  const [mutate, { data, error }] = useMutation(CREATE_MEAL)

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
    form.validateFields((error, values) => {
      if (!error) {
        if (updateMealId) {
          updateMeal({
            variables: {
              foodId: updateMealId,
              studentId,
              date: moment(values.date).format(dateFormat),
              mealName: values.mealName,
              mealType: values.mealType,
              waterIntake: values.waterIntake,
              foodType: values.foodType,
              note: values.note,
              mealTime: moment(values.mealTime).format('HH:mm a'),
            },
          })
        } else {
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
      }
    })
  }

  useEffect(() => {
    if (updateMealData) {
      notification.success({
        message: 'Meal Data',
        description: 'Updated Meal Successfully',
      })
      handleNewMealDate(updateMealData.updateFood.details.date)
      setUpdateMeal(updateMealData.updateFood.details)
      form.resetFields()
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
      {aMealLoading && (
        <div
          style={{
            minHeight: '100vh',
          }}
        >
          Loading...
        </div>
      )}
      {aMealData && (
        <div>
          <div
            style={{
              display: aMealLoading ? 'hidden' : 'flex',
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
              initialValue: aMealData?.getFoodDetails.mealName,
              rules: [{ required: true, message: 'Please Select meal name!' }],
            })(<Input placeholder="Enter Meal Name" name="mealName" style={{ color: '#000' }} />)}
          </Form.Item>

          <Form.Item label="Meal Type">
            {form.getFieldDecorator('mealType', {
              initialValue: aMealData?.getFoodDetails.mealType,
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
              initialValue: aMealData?.getFoodDetails.foodType.id,
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
              initialValue: aMealData
                ? parseInt(aMealData.getFoodDetails.waterIntake.split(' ')[0], 10)
                : null,
              rules: [
                {
                  required: true,
                  message: 'Please give the water intake number on ml!',
                },
              ],
            })(<Input placeholder="Enter water taken" type="number" addonAfter="ml" min={0} />)}
          </Form.Item>

          <Form.Item label="Note">
            {form.getFieldDecorator('note', {
              initialValue: aMealData?.getFoodDetails.note,
            })(
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
                  Cancel Update
                </Button>
              )}
            </div>
          </Form.Item>
        </div>
      )}
    </Form>
  )
}

export default Form.create()(MealForm)
