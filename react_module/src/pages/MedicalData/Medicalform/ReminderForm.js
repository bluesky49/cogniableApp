/* eslint-disable no-unused-vars */
import React from 'react'
import { Form, Button, Select, TimePicker } from 'antd'
import '../toiletForm.scss'
import { MinusOutlined } from '@ant-design/icons'

const { Option } = Select

export default ({ reminder, setRemainderTime, setReminderRepetaion, index, setRemainderCount }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        paddingTop: index !== 0 ? 52 : 0,
        position: 'relative',
      }}
    >
      {index !== 0 && (
        <Button
          style={{
            position: 'absolute',
            top: 10,
            right: 0,
            zIndex: 10,
          }}
          onClick={() => {
            setRemainderCount(state => state - 1)
          }}
        >
          <MinusOutlined style={{ fontSize: 24, marginTop: 2 }} />
        </Button>
      )}

      <Form.Item style={{ marginBottom: 0 }}>
        <TimePicker
          disabled={!reminder}
          onChange={value => {
            setRemainderTime(value)
          }}
          size="large"
        />
      </Form.Item>

      <Form.Item style={{ marginBottom: 0 }}>
        <Select
          disabled={!reminder}
          placeholder="Set Repeat"
          onChange={value => {
            setReminderRepetaion(value)
          }}
          style={{
            width: 150,
          }}
          size="large"
          mode="multiple"
        >
          <Option value="mon">Monday</Option>
          <Option value="tue">Tuesday</Option>
          <Option value="wed">Wednesday</Option>
          <Option value="thu">Thursday</Option>
          <Option value="fri">Friday</Option>
          <Option value="sat">Saturday</Option>
          <Option value="sun">Sunday</Option>
        </Select>
      </Form.Item>
    </div>
  )
}
