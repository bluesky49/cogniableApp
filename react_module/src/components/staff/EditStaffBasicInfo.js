import React from 'react';
import { Form, Input, Button, Select, DatePicker, InputNumber, TimePicker} from 'antd';
import moment from 'moment';

class EditStaffBasicInfo extends React.Component {

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  };

  onFinish = values => {
    console.log(values);
  };

  onReset = () => {
    this.formRef.current.resetFields();   
  };

   render() {
   
    const itemStyle = {marginBottom:'0'}
    const { userinfo } = this.props;
    const dateFormat = 'YYYY-MM-DD';
    const timeFormat = 'h:mm A'

    return (
      <Form
        layout={{
          labelCol: {span: 4 },
          wrapperCol: { span: 14 },
        }}
        ref={this.formRef}
        name="control-ref"
        onFinish={this.onFinish}
      >
        
        <Form.Item name="employee_id" label="Employee ID" rules={[{required: true,}]} style={itemStyle}>
          <Input value={userinfo ? userinfo.email : ""} />
        </Form.Item>
        <Form.Item name="designation" label="Designation" style={itemStyle}>
          <Input value={userinfo ? userinfo.designation : ""} />
        </Form.Item>
        <Form.Item name="emp_type" label="Employee Type" style={itemStyle}>
          <Input value={userinfo ? userinfo.emp_type : ""} />
        </Form.Item>
        <Form.Item name="salutation" label="Salutation" style={itemStyle}>
          <Input value={userinfo ? userinfo.salutation : ""} />
        </Form.Item>
        <Form.Item name="name" label="First Name" style={itemStyle}>
          <Input value={userinfo ? userinfo.name : ""} />
        </Form.Item>
        <Form.Item name="surname" label="Last Name" style={itemStyle}>
          <Input value={userinfo ? userinfo.surname : ""} />
        </Form.Item>
        <Form.Item name="gender" label="Gender" style={itemStyle}>
          <Select placeholder="Select an option" value={userinfo ? userinfo.gender : ""} allowClear>
            <Select.Option value="Male">Male</Select.Option>
            <Select.Option value="Female">Female</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="local_address" label="Address" style={itemStyle}>
          <Input value={userinfo ? userinfo.local_address : ""} />
        </Form.Item>
        <Form.Item name="email" label="Email" style={itemStyle}>
          <Input value={userinfo ? userinfo.email : ""} />
        </Form.Item>
        <Form.Item name="clinic_location" label="Clinic Location" style={itemStyle}>
          <Input value={userinfo ? userinfo.clinic_location : ""} />
        </Form.Item>
        <Form.Item name="shift_start" label="Shift start time" style={itemStyle}>
          <TimePicker use12Hours defaultValue={moment(userinfo ? userinfo.shift_start : "", timeFormat)} style={{ width: 403 }} />
        </Form.Item>
        <Form.Item name="shift_end" label="Shift end time" style={itemStyle}>
          <TimePicker use12Hours defaultValue={moment(userinfo ? userinfo.shift_end : "", timeFormat)} style={{ width: 403 }} />
        </Form.Item>
        <Form.Item name="dob" label="D.O.B" style={itemStyle}>
          <DatePicker defaultValue={moment(userinfo ? userinfo.dob : "", dateFormat)} format={dateFormat} style={{ width: 403 }} />
        </Form.Item>
        <Form.Item name="ssn_aadhar" label="SSN/Adhar" style={itemStyle}>
          <InputNumber value={userinfo ? userinfo.ssn_aadhar : ""} style={{ width: 403 }} />
        </Form.Item>
        <Form.Item name="qualification" label="Qualification" style={itemStyle}>
          <Input value={userinfo ? userinfo.qualification : ""} />
        </Form.Item>
        <Form.Item name="contact_no" label="Contact no." style={itemStyle}>
          <InputNumber value={userinfo ? userinfo.contact_no : ""} style={{ width: 403 }} />
        </Form.Item>
        <Form.Item name="tax_id" label="Tax Id" style={itemStyle}>
          <InputNumber value={userinfo ? userinfo.tax_id : ""} style={{ width: 403 }} />
        </Form.Item>
        <Form.Item name="npi" label="NPI" style={itemStyle}>
          <Input value={userinfo ? userinfo.npi : ""} />
        </Form.Item>
        <Form.Item name="emergency_name" label="Emergency Contact Name" style={itemStyle}>
          <Input value={userinfo ? userinfo.emergency_name : ""} />
        </Form.Item>
        <Form.Item name="emergency_contact" label="Emergency contact no." style={itemStyle}>
          <InputNumber value={userinfo ? userinfo.emergency_contact : ""} style={{ width: 403 }} />
        </Form.Item>
        <Form.Item name="duration" label="Duration of contract/internship" style={itemStyle}>
          <Input value={userinfo ? userinfo.duration : ""} />
        </Form.Item>
        <Form.Item name="date_of_joining" label="Date of Joining" style={itemStyle}>
          <DatePicker defaultValue={moment(userinfo ? userinfo.date_of_joining : "", dateFormat)} format={dateFormat} style={{ width: 403 }} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">Submit</Button>
          <Button onClick={this.onReset} className="ml-4">Cancel</Button>
        </Form.Item>
      </Form>
    )
  }
}
export default EditStaffBasicInfo
