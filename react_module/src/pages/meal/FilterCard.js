import React from 'react'
import { Form, Select, Input, DatePicker } from 'antd'
import moment from 'moment'

const { Search } = Input

const FilterCard = ({
  style,
  handleSelectDate,
  dateValue,
  handleFilterMealType,
  mealTypeValue,
  mealNameSearchValue,
  handleMealNameSearch,
}) => {
  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1px solid #E4E9F0',
        boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
        borderRadius: 10,
        padding: '10px 35px',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        ...style,
      }}
    >
      <Form.Item label="Meal Type">
        <Select
          style={{ width: '190px' }}
          defaultValue="all"
          size="large"
          value={mealTypeValue}
          onChange={handleFilterMealType}
        >
          <Select.Option value="All">All</Select.Option>
          <Select.Option value="Breakfast">Breakfast</Select.Option>
          <Select.Option value="Lunch">Lunch</Select.Option>
          <Select.Option value="Snacks">Snacks</Select.Option>
          <Select.Option value="Dinner">Dinner</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item style={{ marginLeft: 30 }} label="Search">
        <Search
          placeholder="Search Food Name..."
          value={mealNameSearchValue}
          onChange={e => handleMealNameSearch(e.target.value)}
          onSearch={handleMealNameSearch}
          style={{ width: '190px' }}
          size="large"
        />
      </Form.Item>

      <Form.Item style={{ marginLeft: 30 }} label="By Date" size="large">
        <DatePicker
          defaultValue={moment(dateValue, 'YYYY-MM-DD')}
          style={{ width: '190px' }}
          onChange={handleSelectDate}
          allowClear={false}
        />
      </Form.Item>
    </div>
  )
}

export default FilterCard
