import React from 'react'
import { Typography } from 'antd'
import { ClockCircleOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

const MealCard = ({ style, condition, startDate, endDate, note }) => {
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
          {condition}
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
          {startDate}-{endDate}
        </Text>
      </div>

      <Text
        style={{
          fontSize: 16,
          lineHeight: '26px',
          display: 'block',
        }}
      >
        {note}
      </Text>
    </div>
  )
}

export default MealCard
