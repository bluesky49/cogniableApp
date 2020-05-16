import React from 'react'
import { Typography, Button } from 'antd'
import { ClockCircleOutlined, CopyOutlined } from '@ant-design/icons'
import moment from 'moment'

const { Title, Text } = Typography

const MealCard = ({ style, behaviorName, time, note, irt, frequently }) => {
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
          {behaviorName}
        </Title>
        <ClockCircleOutlined style={{ fontSize: 30, marginLeft: 'auto' }} />
        <Text
          style={{
            fontSize: 14,
            lineHeight: '19px',
            color: '#2E2E2E',
            marginLeft: 9,
            margin: 0,
            marginRight: 33,
          }}
        >
          {moment(time).format('HH:mm a')}
        </Text>

        <Button
          type="link"
          style={{
            color: '#000',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <CopyOutlined
            style={{
              marginRight: 2,
              fontSize: 26,
            }}
          />
          Duplicate
        </Button>
      </div>

      <Text
        style={{
          fontSize: 16,
          lineHeight: '26px',
          display: 'block',
          color: '#000',
          margin: 0,
          marginBottom: 5,
        }}
      >
        {note}
      </Text>
      <Text
        style={{
          fontSize: 16,
          lineHeight: '26px',
          margin: 0,
          color: '#000',
        }}
      >
        frequently-{frequently} IRT-{irt}
      </Text>
    </div>
  )
}

export default MealCard
