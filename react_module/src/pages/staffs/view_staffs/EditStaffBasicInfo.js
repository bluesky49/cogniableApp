/* eslint-disable react/no-unused-state */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-unused-vars */
/* eslint-disable no-lone-blocks */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-self-compare */
import React from 'react'
import { Form, Input, Button, Select, DatePicker } from 'antd'
import moment from 'moment'
import { gql } from 'apollo-boost'
import client from '../../../apollo/config'

const { TextArea } = Input

class EditStaffBasicInfo extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoaded: true,
      staffId: this.props.userinfo.employeeId,
      dateOfJoining: this.props.userinfo.dateOfJoining,
      role: this.props.userinfo.userRole.id,
      designation: this.props.userinfo.designation,
      clinicLocation: null,
      firstname: this.props.userinfo.name,
      lastname: this.props.userinfo.surname,
      email: this.props.userinfo.email,
      gender: this.props.userinfo.gender,
      contactNumber: this.props.userinfo.contactNo,
      address: this.props.userinfo.localAddress,
      maritalStatus: null,
      dob: this.props.userinfo.dob,
      emergencyName: this.props.userinfo.emergencyName,
      emergencyContactNumber: this.props.userinfo.emergencyContact,
      emergencyRelation: '',
      qualification: '',
      workExprience: '',

      clinicLocationList: [],
      userRoleList: [],
    }
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  setDateOfJoining = value => {
    this.setState({ dateOfJoining: new Date(value).toISOString().slice(0, 10) })
  }

  selectRole = value => {
    this.setState({ role: value })
  }

  selectClinicLocation = value => {
    this.setState({ clinicLocation: value })
  }

  selectGender = value => {
    this.setState({ gender: value })
  }

  selectMeritalStatus = value => {
    this.setState({ maritalStatus: value })
  }

  setDob = value => {
    this.setState({ dob: new Date(value).toISOString().slice(0, 10) })
  }

  onFinish = values => {
    console.log(values)
  }

  onReset = () => {
    this.formRef.current.resetFields()
  }

  render() {
    const itemStyle = { marginBottom: '0' }
    const { userinfo } = this.props
    const dateFormat = 'YYYY-MM-DD'
    const timeFormat = 'h:mm A'

    const {
      staffId,
      designation,
      firstname,
      lastname,
      email,
      contactNumber,
      address,
      emergencyName,
      emergencyContactNumber,
      emergencyRelation,
      qualification,
      workExprience,
      clinicLocationList,
      userRoleList,
      dateOfJoining,
      dob,
      role,
      clinicLocation,
    } = this.state

    console.log(clinicLocation, 1)

    return (
      <Form
        layout={{
          labelCol: { span: 4 },
          wrapperCol: { span: 14 },
        }}
        ref={this.formRef}
        name="control-ref"
        onFinish={this.onFinish}
      >
        <Form.Item style={itemStyle} label="Staff ID">
          <Input name="staffId" onChange={this.handleChange} value={staffId} />
        </Form.Item>
        <Form.Item style={itemStyle} label="Date of Joining">
          {dateOfJoining ? (
            <DatePicker onChange={this.setDateOfJoining} defaultValue={moment(dateOfJoining)} />
          ) : (
            <DatePicker onChange={this.setDateOfJoining} />
          )}
        </Form.Item>
        <Form.Item style={itemStyle} label="Role">
          <Select onSelect={this.selectRole} defaultValue={role}>
            {userRoleList.map(item => (
              <Select.Option value={item.id}>{item.name}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item style={itemStyle} label="Designation">
          <Input name="designation" onChange={this.handleChange} value={designation} />
        </Form.Item>
        <Form.Item style={itemStyle} label="Clinic Location">
          <Select onSelect={this.selectClinicLocation} value={clinicLocation}>
            {clinicLocationList.map(item => (
              <Select.Option value={item.node.id}>{item.node.location}</Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item style={itemStyle} label="First Name">
          <Input name="firstname" onChange={this.handleChange} value={firstname} />
        </Form.Item>
        <Form.Item style={itemStyle} label="Last Name">
          <Input name="lastname" onChange={this.handleChange} value={lastname} />
        </Form.Item>
        <Form.Item style={itemStyle} label="Email">
          <Input name="email" type="email" onChange={this.handleChange} value={email} />
        </Form.Item>
        <Form.Item style={itemStyle} label="Gender">
          <Select onSelect={this.selectGender}>
            <Select.Option value="male">Male</Select.Option>
            <Select.Option value="female">Female</Select.Option>
            <Select.Option value="other">Other</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item style={itemStyle} label="Contact no.">
          <Input name="contactNumber" onChange={this.handleChange} value={contactNumber} />
        </Form.Item>

        <Form.Item style={itemStyle} label="Address">
          <TextArea
            placeholder="Address"
            name="address"
            onChange={this.handleChange}
            value={address}
            autoSize={{ minRows: 2, maxRows: 5 }}
          />
        </Form.Item>
        <Form.Item style={itemStyle} label="Merital Status">
          <Select onSelect={this.selectMeritalStatus}>
            <Select.Option value="Single">Single</Select.Option>
            <Select.Option value="Married">Married</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item style={itemStyle} label="D.O.B">
          {dob ? (
            <DatePicker onChange={this.setDob} defaultValue={moment(dob)} />
          ) : (
            <DatePicker onChange={this.setDob} />
          )}
        </Form.Item>

        <Form.Item style={itemStyle} label="Emergency Contact Name">
          <Input name="emergencyName" onChange={this.handleChange} value={emergencyName} />
        </Form.Item>
        <Form.Item style={itemStyle} label="Emergency Contact Relation">
          <Input name="emergencyRelation" onChange={this.handleChange} value={emergencyRelation} />
        </Form.Item>
        <Form.Item style={itemStyle} label="Emergency contact no.">
          <Input
            name="emergencyContactNumber"
            onChange={this.handleChange}
            value={emergencyContactNumber}
          />
        </Form.Item>

        <Form.Item style={itemStyle} label="Qualification">
          <Input name="qualification" onChange={this.handleChange} value={qualification} />
        </Form.Item>
        <Form.Item style={itemStyle} label="Work Exprience">
          <Input name="workExprience" onChange={this.handleChange} value={workExprience} />
        </Form.Item>

        <Form.Item style={itemStyle}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Button onClick={this.onReset} className="ml-4">
            Cancel
          </Button>
        </Form.Item>
      </Form>
    )
  }
}
export default EditStaffBasicInfo
