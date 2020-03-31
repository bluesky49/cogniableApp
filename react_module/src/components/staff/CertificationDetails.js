import React from 'react';
import {
    Form,
    Input,
    Button,
    Select,
    DatePicker,
  } from 'antd';


class CertificationDetails extends React.Component {
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
        
        <Form.Item label="Certification Area">
          <Select>
            <Select.Option value="demo">1</Select.Option>
            <Select.Option value="demo">2</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Certification Name">
          <Input />
        </Form.Item>
        <Form.Item label="Application Status">
          <Select>
            <Select.Option value="demo">completed</Select.Option>
            <Select.Option value="demo">Pending</Select.Option>
          </Select>
        </Form.Item>        
        <Form.Item label="App Submitted Date">
          <DatePicker />
        </Form.Item>
        <Form.Item label="App Approved Date">
          <DatePicker />
        </Form.Item>
        <Form.Item label="Validity Start Date">
          <DatePicker />
        </Form.Item>
        <Form.Item label="Validity End Date">
          <DatePicker />
        </Form.Item>       
        <Form.Item label="Remarks">
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
    export default CertificationDetails
