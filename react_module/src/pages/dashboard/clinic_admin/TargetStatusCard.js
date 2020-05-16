import React from 'react'
import { DatePicker, Typography, Select } from 'antd'

const { Title } = Typography
const { Option } = Select

const TargetStatusCard = () => {
  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1px solid #E4E9F0',
        borderRadius: 10,
        padding: '15px 23px',
      }}
    >
      <div
        style={{
          display: 'flex',
        }}
      >
        <Title
          style={{
            fontWeight: 600,
            fontSize: 20,
            lineHeight: '27px',
          }}
        >
          Target Status
        </Title>

        <DatePicker
          style={{
            marginLeft: 'auto',
            width: 180,
            marginRight: 31,
          }}
          size="large"
        />
        <Select
          style={{
            width: 200,
          }}
          placeholder="Select Target"
          size="large"
        >
          <Option key="1">Hello</Option>
        </Select>
      </div>
    </div>
  )
}

export default TargetStatusCard
