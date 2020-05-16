import React from 'react'
import { Form, Input, Button, Select, DatePicker } from 'antd'

class EditCertificationDetails extends React.Component {
  render() {
    const itemStyle = { marginBottom: '0' }

    return (
      <Form
        layout={{
          labelCol: { span: 4 },
          wrapperCol: { span: 14 },
        }}
        initialValues={{
          size: 'small',
        }}
        // onValuesChange={onFormLayoutChange}
        size="small"
      >
        <Form.Item label="Certification Area" style={itemStyle}>
          <Select>
            <Select.Option value="demo">1</Select.Option>
            <Select.Option value="demo">2</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Certification Name" style={itemStyle}>
          <Input />
        </Form.Item>
        <Form.Item label="Application Status" style={itemStyle}>
          <Select>
            <Select.Option value="demo">completed</Select.Option>
            <Select.Option value="demo">Pending</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="App Submitted Date" style={itemStyle}>
          <DatePicker />
        </Form.Item>
        <Form.Item label="App Approved Date" style={itemStyle}>
          <DatePicker />
        </Form.Item>
        <Form.Item label="Validity Start Date" style={itemStyle}>
          <DatePicker />
        </Form.Item>
        <Form.Item label="Validity End Date" style={itemStyle}>
          <DatePicker />
        </Form.Item>
        <Form.Item label="Remarks" style={itemStyle}>
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
export default EditCertificationDetails
