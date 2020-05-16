import React from 'react'
import { Typography } from 'antd'
import profileImg from './img/profile.jpg'

const { Title } = Typography

const LearnerCard = ({ style }) => {
  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1px solid #E4E9F0',
        boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
        borderRadius: 10,
        padding: '16px 12px',
        display: 'flex',
        alignItems: 'center',
        ...style,
      }}
    >
      <img
        src={profileImg}
        alt=""
        style={{
          width: 80,
          height: 64,
          borderRadius: 10,
        }}
      />
      <div
        style={{
          marginLeft: 22,
        }}
      >
        <Title style={{ fontSize: 18, lineHeight: '25px' }}>Nikson johnson</Title>
        <div>
          <span
            style={{
              color: '#0B35B3',
              marginRight: 38,
            }}
          >
            Student
          </span>
          <span style={{ color: '#FF5454' }}>Pending leave request</span>
        </div>
      </div>
    </div>
  )
}

export default LearnerCard
