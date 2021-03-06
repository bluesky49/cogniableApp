/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-shadow */
import React from 'react'
import { Typography } from 'antd'
import defaultProfileImg from './img/profile.jpg'

const { Title } = Typography

const LearnerCard = ({ style, key, name, node, leaveRequest, profileImg }) => {

  const selectStudent = () => {
    console.log('===> button clicked', node.id)
    localStorage.setItem('studentId', JSON.stringify(node.id))
    window.location.href = '/#/therapistStudent'
  }

  return (
    <a onClick={selectStudent}>
      <div
        key={key}
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
          src={profileImg || defaultProfileImg}
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
          <Title style={{ fontSize: 18, lineHeight: '25px' }}>{name}</Title>
          <div>
            <span
              style={{
                color: '#0B35B3',
                marginRight: 38,
              }}
            >
              Learner
            </span>
            {leaveRequest && <span style={{ color: '#FF5454' }}>Pending leave request</span>}
          </div>
        </div>
      </div>
    </a>
  )
}

export default LearnerCard
