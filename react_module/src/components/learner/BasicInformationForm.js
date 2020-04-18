/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable no-underscore-dangle */
import React from 'react';
import { Form, Input, Button, Select, DatePicker, notification } from 'antd';
import { gql } from "apollo-boost";
import client from '../../apollo/config'

const { TextArea } = Input;
const { Option } = Select;
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

// const database = localStorage.getItem('database').slice(1,-1)

class BasicInformationForm extends React.Component {
  formRef = React.createRef();

  constructor(props){
    super(props);

    this.state = {
      isLoaded: true,

      categoryList: [],
      clinicLocationList:[],
      staffNodeList: [],
      // diagnosesList: [],
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
        staffs {
          edges {
            node {
              id,
              name,
            }
          }
        },
        category {
          id,
          category
        }
      }`
      })
      .then(result => {
        this.setState({
          
          isLoaded: false,
          clinicLocationList: result.data.schoolLocation.edges,
          // diagnosesList: result.data.diagnoses,
          staffNodeList : result.data.staffs.edges,
          categoryList: result.data.category
        });
  
      }
      );

  }

  // handleNumberChange = e => {
  //   const number = parseInt(e.target.value || 0, 10);
  //   if (Number.isNaN(number)) {
  //     return;
  //   }
  //   this.setState({ parentNumber:number });
  // };

  onReset = () => {
    const {form} = this.props;
    form.resetFields();
  };

  onFinish = (e) => {
    e.preventDefault();
    console.log('entered')

    const { form } = this.props;

    form.validateFields((error, values) => {
      if (!error) {

        // const diagnosesListSelected = []
        // if (values.diagnosis.length > 0){
        //   values.diagnosis.map((item) => diagnosesListSelected.push(`"${item}"`))
        // }

        // diagnoses:[${diagnosesListSelected}],

        const authStaffList = []
        if (values.authStaff.length > 0){
          values.authStaff.map((item) => authStaffList.push(`"${item}"`))
        }

        client.mutate({
        mutation: gql`mutation {
          createStudent(
            input:{
              studentData:{
                clientId:"${values.clientId}", 
                category:"${values.category}", 
                email:"${values.email}", 
                gender:"${values.gender}", 
                dob:"${values.dob._d.toISOString().slice(0,10)}", 
                clinicLocation:"${values.clinicLocation}", 
                firstname:"${values.firstName}", 
                lastname:"${values.lastName}", 
                
                authStaff:[${authStaffList}]
              }
            }
          )
          { 
            student
              {
                firstname,
                id
              }
            }
        }`
        })
        .then(result => {
          notification.success({
            message: 'Learner Added Successfully',
            description: 'Please check your mail for Username and Password',
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
        })

      }
    })

  };

 

  render() {
    const { form } = this.props;
    const {isLoaded, categoryList, clinicLocationList, staffNodeList} = this.state;
    const itemStyle = {marginBottom:"5px"}
    if (isLoaded){
      return <div>Loding...</div>;
    }
    return (
      <Form {...layout} name="control-ref" onSubmit={(e) => this.onFinish(e)}>
        <Form.Item label="Client Id" style={itemStyle}>
          {form.getFieldDecorator('clientId', { rules: [{ required: true, message: 'Please provide ClientId!' }]})(
            <Input />,
          )}
        </Form.Item>
        <Form.Item label="Email" style={itemStyle}>
          {form.getFieldDecorator('email', { rules: [{ required: true, type:"email", message: 'Please provide email!' }]})(
            <Input />,
          )}
        </Form.Item>
        <Form.Item label="First Name" style={itemStyle}>
          {form.getFieldDecorator('firstName', { rules: [{ required: true, message: 'Please provide firstName!' }]})(
            <Input />,
          )}
        </Form.Item>
        <Form.Item label="Last Name" style={itemStyle}>
          {form.getFieldDecorator('lastName',)(
            <Input />,
          )}
        </Form.Item>
        <Form.Item label="Authorized Staff" style={itemStyle}>
          {form.getFieldDecorator('authStaff',)(
            <Select
            mode="multiple"
            placeholder="Select Therapist"
            allowClear
            >
            {staffNodeList.map((item) => <Option value={item.node.id}>{item.node.name}</Option>)} 
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="Address" style={itemStyle}>
          {form.getFieldDecorator('address', { rules: [{ message: 'Please provide Address!' }]})(
            <TextArea
            placeholder="Address"
            autoSize={{ minRows: 3 }}
            />,
          )}
        </Form.Item>
        <Form.Item label="DOB" style={itemStyle}>
          {form.getFieldDecorator('dob', { rules: [{ required: true, message: 'Please provide Date of Birth!' }]})(
            <DatePicker /> ,
          )}
        </Form.Item>


        <Form.Item label="Gender" style={itemStyle}>
          {form.getFieldDecorator('gender', { rules: [{ required: true, message: 'Please provide Date of Birth!' }]})(
            <Select
            placeholder="Who you are"
            allowClear
            >
              <Option value="male">male</Option>
              <Option value="female">female</Option>
              <Option value="other">other</Option>
            </Select>,
          )}
        </Form.Item>


        {/* <Form.Item label="Diagnosis" style={itemStyle}>
          {form.getFieldDecorator('diagnosis', { rules: [{ required: true, message: 'Please provide Diagnosis!' }]})(
            <Select
            mode="multiple"
            placeholder="Select Diagnosis"
            allowClear
            >
              {diagnosesList.map((item) => <Option value={item.id}>{item.name}</Option>)}
            
            </Select>,
          )}
        </Form.Item> */}
        <Form.Item label="Date of Diagnosis" style={itemStyle}>
          {form.getFieldDecorator('dateOfDiagnosis',)(
            <DatePicker />,
          )}
        </Form.Item>
        <Form.Item label="Clinic Location" style={itemStyle}>
          {form.getFieldDecorator('clinicLocation', { rules: [{required: true, message: 'Please provide Clinic Location!' }]})(
            <Select
              placeholder="Select a Clinic location"
              allowClear
            >
              {clinicLocationList.map((item) => <Option value={item.node.id}>{item.node.location}</Option>)}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="Parent/Guardian Name" style={itemStyle}>
          {form.getFieldDecorator('parentFirstName', { rules: [{ required: true, message: 'Please provide Parent Name!' }]})(
            <Input />,
          )}
        </Form.Item>
        <Form.Item label="Parent/Guardian Mobile no" style={itemStyle}>
          {form.getFieldDecorator('parentMobileNumber', { rules: [{ message: 'Please provide Mobile No!' }]})(
            <Input />,
          )}
        </Form.Item>
        <Form.Item label="SSN/Adhaar card" style={itemStyle}>
          {form.getFieldDecorator('ssnCard', { rules: [{ message: 'Please provide Mobile No!' }]})(
            <Input />,
          )}
        </Form.Item>
        <Form.Item label="Location Category" style={itemStyle}>
          {form.getFieldDecorator('category', { rules: [{required: true, message: 'Please provide Mobile No!' }]})(
            <Select
              placeholder="Select category"
              allowClear
            >
              {categoryList.map((item) => <Option value={item.id}>{item.category}</Option>)}
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
    );
  }
}

const BasicInformation = Form.create()(BasicInformationForm)
export default BasicInformation