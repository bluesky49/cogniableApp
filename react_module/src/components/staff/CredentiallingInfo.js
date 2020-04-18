import React from 'react';
import {
    Form,
    InputNumber,
    Button,
    Select,
    DatePicker,
  } from 'antd';


class CredentiallingInfo extends React.Component {
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
        
        <Form.Item label="Credential Agency">
          <Select>
            <Select.Option value="demo">1</Select.Option>
            <Select.Option value="demo">2</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Application Status">
          <Select>
            <Select.Option value="demo">completed</Select.Option>
            <Select.Option value="demo">Pending</Select.Option>
          </Select>
        </Form.Item>        
        <Form.Item label="Applicaiton Submitted Date">
          <DatePicker />
        </Form.Item>
        <Form.Item label="Application Approved Date">
          <DatePicker />
        </Form.Item>  
        <Form.Item label="Reference No.">
          <InputNumber />
        </Form.Item>
        <Form.Item label="Application validity start Date">
          <DatePicker />
        </Form.Item>
        <Form.Item label="Applicaiton End Date">
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
    export default CredentiallingInfo
