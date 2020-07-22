/* eslint-disable no-plusplus */
import React, { useState, useEffect } from 'react'
import { Typography, DatePicker } from 'antd'
import moment from 'moment'
import './Calander.scss'

const { Text } = Typography

const dateFormat = 'YYYY-MM-DD'

const getDates = selectDate => {
  const returnValue = []
  for (let i = 0; i <= 6; ++i) {
    returnValue.push(
      moment(selectDate)
        .weekday(i)
        .format(dateFormat),
    )
  }
  return returnValue
}

const Calander = ({ value, handleOnChange, style }) => {
  const [selectDate, setSelectDate] = useState(moment(value).format(dateFormat))
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat']
  const [dates, setDates] = useState(getDates(value))

  useEffect(() => {
    setSelectDate(moment(value).format(dateFormat))
    setDates(getDates(value))
  }, [value])

  return (
    <div
      style={{
        background: '#F9F9F9',
        borderRadius: 10,
        padding: '15px 30px',
        ...style,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 15,
          maxWidth: 640,
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        <Text style={{ fontSize: 20, color: '#000', fontWeight: 600 }}>Select By Date</Text>
        <DatePicker
          defaultValue={moment(value, dateFormat)}
          style={{
            width: '190px',
          }}
          size="large"
          value={moment(value)}
          onChange={newDate => {
            handleOnChange(moment(newDate))
          }}
          allowClear={false}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {days.map((day, index) => {
          return (
            <button
              key={day}
              type="button"
              className="calEle"
              style={{
                background: dates[index] === selectDate ? '#E58425' : 'none',
                borderRadius: 10,
                width: 100,
                height: 100,
                paddingTop: 10,
                display: 'fex',
                flexDirection: 'column',
                alignItems: 'center',
                border: 'none',
                cursor: 'pointer',
              }}
              onClick={() => {
                const newDate = dates[index]
                handleOnChange(moment(newDate).format(dateFormat))
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  lineHeight: '25px',
                  display: 'block',
                  textAlign: 'center',
                  color: dates[index] === selectDate ? '#fff' : '#000',
                }}
              >
                {day}
              </Text>
              <Text
                style={{
                  fontSize: 30,
                  lineHeight: '41px',
                  textAlign: 'center',
                  display: 'block',
                  fontWeight: 600,
                  color: dates[index] === selectDate ? '#fff' : '#000',
                  marginTop: 14,
                }}
              >
                {moment(dates[index]).format('DD')}
              </Text>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default Calander
