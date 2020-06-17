/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable object-shorthand */
import React from 'react'
import { Form, Input, Button, Select, DatePicker } from 'antd'
import moment from 'moment'
import { connect } from 'react-redux'

const { TextArea } = Input
const { Option } = Select
const tailLayout = {
  wrapperCol: {
    offset: 6,
    span: 14,
  },
}

@connect(({ user, learners }) => ({ user, learners }))
class EditBasicInformation extends React.Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  componentDidMount() {
    const {
      form,
      learners: { UserProfile },
    } = this.props

    const selectedStaffList = []
    UserProfile.authStaff.edges.map(item => selectedStaffList.push(item.node.id))

    form.setFieldsValue({
      clientId: UserProfile.clientId,
      category: UserProfile.category.id,
      email: UserProfile.email,
      gender: UserProfile.gender,
      dob: moment(UserProfile.dob),
      dateOfDiagnosis: UserProfile.dateOfDiagnosis ? moment(UserProfile.dateOfDiagnosis) : null,
      clinicLocation: UserProfile.clinicLocation ? UserProfile.clinicLocation.id : null,
      firstName: UserProfile.firstname,
      lastName: UserProfile.lastname,
      authStaff: selectedStaffList,
      parentFirstName: UserProfile.parentName,
      parentMobileNumber: UserProfile.parentMobile,
      ssnCard: UserProfile.ssnAadhar,
      mobileNo: UserProfile.mobileno,
      address: UserProfile.currentAddress,
    })
  }

  handleSubmit = e => {
    const {
      form,
      dispatch,
      learners: { UserProfile },
    } = this.props
    e.preventDefault()
    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'learners/EDIT_LEARNER',
          payload: {
            id: UserProfile.id,
            values: values,
          },
        })
      }
    })
  }

  onReset = () => {
    this.formRef.current.resetFields()
  }

  render() {
    const itemStyle = { marginBottom: '0' }
    const {
      form,
      learners: { clinicLocationList, categoryList, staffDropdownList },
    } = this.props

    return (
      <Form onSubmit={e => this.handleSubmit(e)}>
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
        <Form.Item label="Mobile no" style={itemStyle}>
          {form.getFieldDecorator('mobileNo', {
            rules: [{ message: 'Please provide Mobile No!' }],
          })(<Input />)}
        </Form.Item>
        <Form.Item label="Authorized Staff" style={itemStyle}>
          {form.getFieldDecorator('authStaff')(
            <Select mode="multiple" placeholder="Select Therapist" allowClear maxTagCount="4">
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
          {form.getFieldDecorator('clinicLocation')(
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

const EditBasicInformationForm = Form.create()(EditBasicInformation)

export default EditBasicInformationForm
