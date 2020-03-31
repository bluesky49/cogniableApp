import React from 'react';
import {
    Form,
    Input,
    Button,
    DatePicker,
    InputNumber,
  } from 'antd';


class EditHrDetails extends React.Component {
   render() {
    const itemStyle = {marginBottom:'0'}
    

    return (
      <Form
        layout={{
          labelCol: {span: 4 },
          wrapperCol: { span: 14 },
        }}
        initialValues={{
        size:'small',
        }}
        // onValuesChange={onFormLayoutChange}
        size='small'
      >
        
        <Form.Item label="Offer Date" style={itemStyle}>
          <DatePicker />
        </Form.Item>
        <Form.Item label="Date of Joining" style={itemStyle}>
          <DatePicker />
        </Form.Item>
        <Form.Item label="Date of Releiving" style={itemStyle}>
          <DatePicker />
        </Form.Item>
        <Form.Item label="Total Experience" style={itemStyle}>
          <Input />
        </Form.Item>
        <Form.Item label="Documentation Status" style={itemStyle}>
          <Input />
        </Form.Item>
        <Form.Item label="Background Status" style={itemStyle}>
          <Input />
        </Form.Item>
        <Form.Item label="Training period(To and From)" style={itemStyle}>
          <Input />
        </Form.Item>
        <Form.Item label="Service(clinical)Start Date" style={itemStyle}>
          <DatePicker />
        </Form.Item>
        <Form.Item label="Leaves from last year" style={itemStyle}>
          <InputNumber />
        </Form.Item>
        <Form.Item label="Leaves This Year" style={itemStyle}>
          <InputNumber />
        </Form.Item>
        <Form.Item label="Leaves Taken" style={itemStyle}>
          <InputNumber />
        </Form.Item>
        <Form.Item label="Leaves Remaining" style={itemStyle}>
          <InputNumber />
        </Form.Item>
        <Form.Item label="Last Appraisal Date" style={itemStyle}>
          <DatePicker />
        </Form.Item>
        <Form.Item label="Next Appraisal Date" style={itemStyle}>
          <DatePicker />
        </Form.Item>
        <Form.Item label="Remarks" style={itemStyle}>
          <Input />
        </Form.Item>
        <Form.Item label="Gross Salary" style={itemStyle}>
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
    export default EditHrDetails
