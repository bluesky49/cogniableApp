/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useReducer } from 'react'
import { Form, Input, Button, Select, DatePicker, Typography } from 'antd'
import '../toiletForm.scss'
import { PlusOutlined, MinusOutlined } from '@ant-design/icons'

const { RangePicker } = DatePicker
const { Option } = Select
const { Title, Text } = Typography

export default ({ index, setPreseptionDrugCount, state, dispatch }) => {
  return (
    <div
      style={{
        position: 'relative',
        paddingTop: index !== 0 ? 15 : 0,
      }}
    >
      {index !== 0 && (
        <Button
          style={{
            position: 'absolute',
            top: 15,
            right: 0,
            zIndex: 10,
          }}
          onClick={() => {
            // eslint-disable-next-line no-shadow
            setPreseptionDrugCount(state => state - 1)
            dispatch({ type: 'REMOVE_PRESEP_DRUG', index })
          }}
        >
          <MinusOutlined style={{ fontSize: 24, marginTop: 2 }} />
        </Button>
      )}
      <Form.Item label="Drug Name" style={{ marginBottom: 0 }}>
        <Input
          value={state[index].drugName}
          onChange={e => {
            dispatch({ type: 'UPDATE_DRUG', drugName: e.target.value, index })
          }}
          size="large"
          style={{ color: '#000' }}
        />
      </Form.Item>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
        }}
      >
        <Form.Item label="Dosage" style={{ marginBottom: 0, marginRight: 20 }}>
          <Input
            value={state[index].dosage}
            type="number"
            onChange={e => {
              dispatch({ type: 'UPDATE_DOSAGE', dosage: e.target.value, index })
            }}
            addonAfter="mg"
            size="large"
            min={1}
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0 }}>
          <Input
            value={state[index].times}
            type="number"
            onChange={e => {
              dispatch({ type: 'UPDATE_TIME', time: e.target.value, index })
            }}
            addonAfter="times a day"
            size="large"
            min={1}
          />
        </Form.Item>
      </div>
    </div>
  )
}
