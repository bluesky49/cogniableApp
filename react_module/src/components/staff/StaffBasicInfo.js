import React from 'react';
import {
    Form,
    Input,
    Button,
    Select,
    DatePicker,
    InputNumber,
    TimePicker,
  } from 'antd';


class StaffBasicInfo extends React.Component {
   render() {
   

    

    return (
      <Form
        labelCol={{
        span: 8,
        }}
        wrapperCol={{
        span: 14,
        }}
        layout="horizontal"
        initialValues={{
        size:'small',
        }}
        // onValuesChange={onFormLayoutChange}
        size='small'
      >
        
        <Form.Item label="Employee ID">
          <Input />
        </Form.Item>
        <Form.Item label="Emp Department">
          <Input />
        </Form.Item>
        <Form.Item label="Designation">
          <Input />
        </Form.Item>
        <Form.Item label="Employee Type">
          <Input />
        </Form.Item>
        <Form.Item label="Salutation">
          <Input />
        </Form.Item>
        <Form.Item label="First Name">
          <Input />
        </Form.Item>
        <Form.Item label="Middle Name">
          <Input />
        </Form.Item>
        <Form.Item label="Last Name">
          <Input />
        </Form.Item>
        <Form.Item label="Gender">
          <Select>
            <Select.Option value="demo">Male</Select.Option>
            <Select.Option value="demo">Female</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Authorized Learner">
          <Input />
        </Form.Item>
        <Form.Item label="Address">
          <Input />
        </Form.Item>
        <Form.Item label="Email">
          <Input />
        </Form.Item>
        <Form.Item label="Clinic Location">
          <Input />
        </Form.Item>
        <Form.Item label="Shift start time">
          <TimePicker />
        </Form.Item>
        <Form.Item label="Shift end time">
          <TimePicker />
        </Form.Item>
        <Form.Item label="D.O.B">
          <DatePicker />
        </Form.Item>
        <Form.Item label="SSN/Adhar">
          <InputNumber />
        </Form.Item>
        <Form.Item label="Qualification">
          <Input />
        </Form.Item>
        <Form.Item label="Contact no.">
          <InputNumber />
        </Form.Item>
        <Form.Item label="Tax Id">
          <InputNumber />
        </Form.Item>
        <Form.Item label="NPI">
          <Input />
        </Form.Item>
        <Form.Item label="Emergency Contact Name">
          <Input />
        </Form.Item>
        <Form.Item label="Emergency contact no.">
          <InputNumber />
        </Form.Item>
        <Form.Item label="Duration of contract/internship">
          <Input />
        </Form.Item>
        <Form.Item label="Date of Joining">
          <DatePicker />
        </Form.Item>
        <Form.Item>
          <Button type="primary">Submit</Button>
          <Button>Cancel</Button>
        </Form.Item>
      </Form>
    )
  }
}
export default StaffBasicInfo
