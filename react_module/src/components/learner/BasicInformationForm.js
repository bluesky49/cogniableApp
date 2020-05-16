/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable no-underscore-dangle */
/* eslint-disable object-shorthand */

import React from 'react'
import { Form, Input, Button, Select, DatePicker } from 'antd'
import { connect } from 'react-redux'

const { TextArea } = Input
const { Option } = Select
const layout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 14,
  },
}
const tailLayout = {
  wrapperCol: {
    offset: 7,
    span: 14,
  },
}

@connect(({ user, learners }) => ({ user, learners }))
class BasicInformationForm extends React.Component {
  formRef = React.createRef()

  constructor(props) {
    super(props)

    this.state = {}
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch({
      type: 'learners/GET_LEARNERS_DROPDOWNS',
    })
  }

  onReset = () => {
    const { form } = this.props
    form.resetFields()
  }

  handleSubmit = e => {
    e.preventDefault()

    const { form, dispatch } = this.props

    form.validateFields((error, values) => {
      if (!error) {
        dispatch({
          type: 'learners/CREATE_LEARNER',
          payload: {
            values: values,
          },
        })
      }
    })
  }

  render() {
    const {
      form,
      learners: { clinicLocationList, categoryList, staffDropdownList },
    } = this.props
    const itemStyle = { marginBottom: '5px' }

    return (
      <Form {...layout} name="control-ref" onSubmit={e => this.handleSubmit(e)}>
        <Form.Item label="Client Id" style={itemStyle}>
          {form.getFieldDecorator('clientId', {
            rules: [{ required: true, message: 'Please provide ClientId!' }],
          })(<Input />)}
        </Form.Item>
        <Form.Item label="Email" style={itemStyle}>
          {form.getFieldDecorator('email', {
            rules: [{ required: true, type: 'email', message: 'Please provide email!' }],
          })(<Input />)}
        </Form.Item>
        <Form.Item label="First Name" style={itemStyle}>
          {form.getFieldDecorator('firstName', {
            rules: [{ required: true, message: 'Please provide firstName!' }],
          })(<Input />)}
        </Form.Item>
        <Form.Item label="Last Name" style={itemStyle}>
          {form.getFieldDecorator('lastName')(<Input />)}
        </Form.Item>
        <Form.Item label="Authorized Staff" style={itemStyle}>
          {form.getFieldDecorator('authStaff')(
            <Select mode="multiple" placeholder="Select Therapist" allowClear>
              {staffDropdownList.map(item => (
                <Option value={item.node.id}>{item.node.name}</Option>
              ))}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="Address" style={itemStyle}>
          {form.getFieldDecorator('address', { rules: [{ message: 'Please provide Address!' }] })(
            <TextArea placeholder="Address" autoSize={{ minRows: 3 }} />,
          )}
        </Form.Item>
        <Form.Item label="DOB" style={itemStyle}>
          {form.getFieldDecorator('dob', {
            rules: [{ required: true, message: 'Please provide Date of Birth!' }],
          })(<DatePicker />)}
        </Form.Item>

        <Form.Item label="Gender" style={itemStyle}>
          {form.getFieldDecorator('gender', {
            rules: [{ required: true, message: 'Please provide Date of Birth!' }],
          })(
            <Select placeholder="Who you are" allowClear>
              <Option value="male">male</Option>
              <Option value="female">female</Option>
              <Option value="other">other</Option>
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="Date of Diagnosis" style={itemStyle}>
          {form.getFieldDecorator('dateOfDiagnosis')(<DatePicker />)}
        </Form.Item>
        <Form.Item label="Clinic Location" style={itemStyle}>
          {form.getFieldDecorator('clinicLocation', {
            rules: [{ required: true, message: 'Please provide Clinic Location!' }],
          })(
            <Select placeholder="Select a Clinic location" allowClear>
              {clinicLocationList.map(item => (
                <Option value={item.node.id}>{item.node.location}</Option>
              ))}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="Parent/Guardian Name" style={itemStyle}>
          {form.getFieldDecorator('parentFirstName', {
            rules: [{ required: true, message: 'Please provide Parent Name!' }],
          })(<Input />)}
        </Form.Item>
        <Form.Item label="Parent/Guardian Mobile no" style={itemStyle}>
          {form.getFieldDecorator('parentMobileNumber', {
            rules: [{ message: 'Please provide Mobile No!' }],
          })(<Input />)}
        </Form.Item>
        <Form.Item label="SSN/Adhaar card" style={itemStyle}>
          {form.getFieldDecorator('ssnCard', { rules: [{ message: 'Please provide Mobile No!' }] })(
            <Input />,
          )}
        </Form.Item>
        <Form.Item label="Location Category" style={itemStyle}>
          {form.getFieldDecorator('category', {
            rules: [{ required: true, message: 'Please provide Mobile No!' }],
          })(
            <Select placeholder="Select category" allowClear>
              {categoryList.map(item => (
                <Option value={item.id}>{item.category}</Option>
              ))}
            </Select>,
          )}
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="submit" htmlType="submit">
            Submit
          </Button>

          <Button htmlType="primary" onClick={this.onReset} className="ml-4">
            cancel
          </Button>
        </Form.Item>
      </Form>
    )
  }
}

const BasicInformation = Form.create()(BasicInformationForm)
export default BasicInformation
