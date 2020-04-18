import React from 'react';
import {
    Form,
    Input,
    Button,
    DatePicker,
    InputNumber,
  } from 'antd';


class HrDetails extends React.Component {
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
        
        <Form.Item label="Offer Date">
          <DatePicker />
        </Form.Item>
        <Form.Item label="Date of Joining">
          <DatePicker />
        </Form.Item>
        <Form.Item label="Date of Releiving">
          <DatePicker />
        </Form.Item>
        <Form.Item label="Total Experience">
          <Input />
        </Form.Item>
        <Form.Item label="Documentation Status">
          <Input />
        </Form.Item>
        <Form.Item label="Background Status">
          <Input />
        </Form.Item>
        <Form.Item label="Training period(To and From)">
          <Input />
        </Form.Item>
        <Form.Item label="Service(clinical)Start Date">
          <DatePicker />
        </Form.Item>
        <Form.Item label="Leaves from last year">
          <InputNumber />
        </Form.Item>
        <Form.Item label="Leaves This Year">
          <InputNumber />
        </Form.Item>
        <Form.Item label="Leaves Taken">
          <InputNumber />
        </Form.Item>
        <Form.Item label="Leaves Remaining">
          <InputNumber />
        </Form.Item>
        <Form.Item label="Last Appraisal Date">
          <DatePicker />
        </Form.Item>
        <Form.Item label="Next Appraisal Date">
          <DatePicker />
        </Form.Item>
        <Form.Item label="Remarks">
          <Input />
        </Form.Item>
        <Form.Item label="Gross Salary">
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary">Submit</Button>
          <Button>Cancel</Button>
        </Form.Item>
      </Form>
    )
        }
    }
    export default HrDetails
