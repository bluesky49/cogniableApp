import React from 'react'
import { Typography, Tag } from 'antd'
import { ClockCircleOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

const ABCCard = ({ style, time, location, behavior }) => {
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
            fontSize: 20,
            lineHeight: '33px',
            margin: 0,
          }}
        >
          Behaviors:{' '}
          {behavior?.map(({ node }) => (
            <Tag>{node.behaviorName}</Tag>
          ))}
        </Title>
        <ClockCircleOutlined style={{ fontSize: 30, marginLeft: 'auto' }} />
        <Text
          style={{
            fontSize: 14,
            lineHeight: '19px',
            color: '#2E2E2E',
            marginLeft: 9,
            marginRight: 15,
          }}
        >
          {time}
        </Text>
      </div>
      <Title
        style={{
          fontSize: 20,
          lineHeight: '33px',
          margin: 0,
        }}
      >
        Locations:{' '}
        {location?.map(({ node }) => (
          <Tag>{node.behaviorLocation}</Tag>
        ))}
      </Title>
    </div>
  )
}

export default ABCCard
