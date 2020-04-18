/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable no-underscore-dangle */
import React from 'react';
import {
    Form,
    Input,
    Button,
    Select,
    DatePicker,
    notification,
  } from 'antd';
import { gql } from "apollo-boost";
import client from '../../apollo/config'

const layout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 14,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 7,
    span: 14,
  },
};

const { TextArea } = Input;

class StaffBasicInfo extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      isLoaded: true,

      clinicLocationList:[],
      userRoleList: [],
      
    };

  }

  componentDidMount(){

    client.query({
      query: gql`
        {schoolLocation {
          edges {
            node {
              id,
              location
            }
          }
        },
        userRole {
          id,
          name,
        }
      }`
      })
      .then(result => {
        this.setState({
          isLoaded: false,
          clinicLocationList: result.data.schoolLocation.edges,
          userRoleList: result.data.userRole,
        });
      });

  }

  handleSubmit = (e, This) => {
    e.preventDefault();

    const { form } = this.props;

    form.validateFields((error, values) => {
      if (!error) {

        client.mutate({
          mutation: gql`mutation {
              createStaff(
                input:{
                  staffData:{
                    empId:"${values.staffId}",
                    dateOfJoining:"${values.dateOfJoining._d.toISOString().slice(0,10)}",
                    designation:"${values.designation}",
                    role:"${values.role}",
                    clinicLocation:"${values.clinicLocation}"
                    firstname:"${values.firstname}",
                    surname:"${values.lastname}",
                    email:"${values.email}",
                    gender:"${values.gender}",
                    mobile:"${values.contactNumber}",
                    address:"${values.address}",
                    dob:"${values.dob._d.toISOString().slice(0,10)}",
                    qualification:"${values.qualification}",
                    emergencyName:"${values.emergencyName}",
                    emergencyContact:"${values.emergencyContactNumber}",
                    authLearner:[]
                  }
                }
              )
              { 
                staff{
                  id,
                  surname
                }
              }
            }`
          })
          .then(result => {
            console.log(result)
            notification.success({
              message: 'Staff Added Successfully',
              description:'Please check your mail for Username and Password',              
            });
            form.resetFields(); 
          })
          .catch(err => { 
            err.graphQLErrors.map((item) => { 
              return notification.error({
                message: 'Somthing want wrong',
                description: item.message,
            }); 
          })
        });

      }
    })
  };

  onReset = () => {
    const {form} = this.props;
    form.resetFields();
  };


   render() {
    const {form} = this.props;
    const {isLoaded, clinicLocationList, userRoleList } = this.state;
    const itemStyle = {marginBottom:"5px"}

    if (isLoaded){
      return <div>Loding...</div>;
    }

    return (
      <Form {...layout} onSubmit={(e) => this.handleSubmit(e, this)}>
        
        <Form.Item label="Staff ID" style={itemStyle}>
          {form.getFieldDecorator('staffId', {rules: [{ required: true, message: 'Please provide your Staff Id!' }],})(
            <Input />
          )}
        </Form.Item>
        <Form.Item label="Role" style={itemStyle}>
          {form.getFieldDecorator('role', {rules: [{ required: true, message: 'Please provide your Role' }],})(
            <Select>
              {userRoleList.map((item) => <Select.Option value={item.id}>{item.name}</Select.Option>)}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="Date of Joining" style={itemStyle}>
          {form.getFieldDecorator('dateOfJoining', {rules: [{ required: true, message: 'Please provide your Date of Joining!' }],})(
            <DatePicker />
          )}
        </Form.Item>
       
        <Form.Item label="Designation" style={itemStyle}>
          {form.getFieldDecorator('designation', { initialValue: "" })(
            <Input />
          )}          
        </Form.Item>
        <Form.Item label="Clinic Location" style={itemStyle}>
          {form.getFieldDecorator('clinicLocation', {rules: [{ required: true, message: 'Please select Clinic Location' }],})(
            <Select>
              {clinicLocationList.map((item) => <Select.Option value={item.node.id}>{item.node.location}</Select.Option>)} 
            </Select>
          )}
        </Form.Item>
        <Form.Item label="First Name" style={itemStyle}>
          {form.getFieldDecorator('firstname', {rules: [{ required: true, message: 'Please provide your name' }],})(
            <Input />
          )}
        </Form.Item>        
        <Form.Item label="Last Name" style={itemStyle}>
          {form.getFieldDecorator('lastname', { initialValue: "" })(
            <Input />
          )}
        </Form.Item>
        <Form.Item label="Email" style={itemStyle}>
          {form.getFieldDecorator('email', {rules: [{ required: true, type:"email", message: 'Please provide your email' }],})(
            <Input />
          )}
        </Form.Item>
        <Form.Item label="Gender" style={itemStyle}>
          {form.getFieldDecorator('gender', {rules: [{ required: true, message: 'Please select gender' }],})(
            <Select>
              <Select.Option value="male">Male</Select.Option>
              <Select.Option value="female">Female</Select.Option>
              <Select.Option value="other">Other</Select.Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item label="D.O.B" style={itemStyle}>
          {form.getFieldDecorator('dob', {rules: [{ required: true, message: 'Please provide Date of Birth' }],})(
            <DatePicker />
          )}
        </Form.Item> 
        <Form.Item label="Contact no." style={itemStyle}>
          {form.getFieldDecorator('contactNumber', { initialValue: "" })(
            <Input />
          )}
        </Form.Item>
        
        <Form.Item label="Address" style={itemStyle}>
          {form.getFieldDecorator('address', { initialValue: "" })(
            <TextArea
              placeholder="Address"
              autoSize={{ minRows: 3 }}
            />
          )}
        </Form.Item>
        <Form.Item label="Merital Status" style={itemStyle}>
          {form.getFieldDecorator('meritalStatus', { initialValue: "" })(
            <Select>
              <Select.Option value="Single">Single</Select.Option>
              <Select.Option value="Married">Married</Select.Option>
            </Select>
          )}          
        </Form.Item>       
        <Form.Item label="Emergency Contact Name" style={itemStyle}>
          {form.getFieldDecorator('emergencyName', { initialValue: "" })(
            <Input />
          )}
        </Form.Item>
        <Form.Item label="Emergency Contact Relation" style={itemStyle}>
          {form.getFieldDecorator('emergencyRelation', { initialValue: "" })(
            <Input />
          )}
        </Form.Item>
        <Form.Item label="Emergency contact no." style={itemStyle}>
          {form.getFieldDecorator('emergencyContactNumber', { initialValue: "" })(
            <Input />
          )}
        </Form.Item>
        <Form.Item label="Qualification" style={itemStyle}>
          {form.getFieldDecorator('qualification', { initialValue: "" })(
            <Input />
          )}
        </Form.Item>
        <Form.Item label="Work Exprience" style={itemStyle}>
          {form.getFieldDecorator('workExprience', { initialValue: "" })(
            <Input />
          )}
        </Form.Item>
        
        
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit"> 
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

const StaffBasicInfoForm = Form.create()(StaffBasicInfo)
export default StaffBasicInfoForm
