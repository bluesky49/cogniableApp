import React, { useEffect } from 'react'
import { Typography, Button, notification } from 'antd'
import { ClockCircleOutlined, FormOutlined, DeleteOutlined } from '@ant-design/icons'
import gql from 'graphql-tag'
import { useMutation } from 'react-apollo'

const { Title, Text } = Typography

const DELETE_MEAL = gql`
  mutation deleteFood($id: ID!) {
    deleteFood(input: { pk: $id }) {
      status
      message
    }
  }
`

const MealCard = ({
  style,
  mealName,
  time,
  foodType,
  mealContent,
  waterValue,
  id,
  setMealDeleted,
  setUpdateMealId,
}) => {
  const [mutate, { data, error }] = useMutation(DELETE_MEAL, {
    variables: {
      id,
    },
  })

  useEffect(() => {
    if (data) {
      notification.success({
        message: 'Meal Data',
        description: 'Meal Data Deleted Successfully',
      })
      setMealDeleted(true)
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

  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1px solid #E4E9F0',
        boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
        borderRadius: 10,
        padding: '26px 35px',
        position: 'relative',
        ...style,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: 26,
        }}
      >
        <Title
          style={{
            fontSize: 24,
            lineHeight: '33px',
          }}
        >
          {mealName}
        </Title>
        <ClockCircleOutlined style={{ fontSize: 30, marginLeft: 'auto' }} />
        <Text
          style={{
            fontSize: 14,
            lineHeight: '19px',
            color: '#2E2E2E',
            marginLeft: 9,
            marginRight: 19,
          }}
        >
          {time}
        </Text>
        <Text
          style={{
            fontSize: 16,
            lineHeight: '26px',
            color: foodType === 'Junk Food' ? '#FF6B6B' : 'green',
          }}
        >
          {foodType}
        </Text>
      </div>

      <Text
        style={{
          fontSize: 16,
          lineHeight: '26px',
          display: 'block',
        }}
      >
        {mealContent}
      </Text>
      <Text
        style={{
          fontSize: 16,
          lineHeight: '26px',
          display: 'block',
          marginTop: 12,
        }}
      >
        {waterValue} water intake
      </Text>

      <Button
        type="link"
        style={{
          position: 'absolute',
          right: '85px',
          bottom: '33px',
        }}
        onClick={() => {
          setUpdateMealId(id)
        }}
      >
        <FormOutlined style={{ fontSize: 28 }} />
      </Button>
      <Button
        type="link"
        style={{
          position: 'absolute',
          right: '34px',
          bottom: '33px',
        }}
        onClick={() => {
          mutate()
        }}
      >
        <DeleteOutlined style={{ fontSize: 28 }} />
      </Button>
    </div>
  )
}

export default MealCard
