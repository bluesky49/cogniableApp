/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-vars */
import React from 'react';
import { Form, Input, Button, Select, DatePicker } from 'antd';
import moment from 'moment';
import { gql } from "apollo-boost";
import client from '../../apollo/config'

const { TextArea } = Input;
const { Option } = Select;
const tailLayout = {
  wrapperCol: {
    offset: 6,
    span: 14,
  },
};

class EditBasicInformationForm extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      isLoaded: true,
      clinicLocationList : [],
      staffNodeList : [],
      categoryList : [],
    }
  }

  componentDidMount() {

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
          staffNodeList : result.data.staffs.edges,
          categoryList: result.data.category
        });
  
      }
      );

  }
  
  
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
    const itemStyle = { marginBottom: '0' }

    const { userinfo } = this.props;

    const {isLoaded, clinicLocationList, categoryList, staffNodeList} = this.state;

    const selectedStaffList = []
    userinfo.authStaff.edges.map((item) => selectedStaffList.push(item.node.id))

    console.log(userinfo.currentAddress)
    // const selectedDiagnosesList = []
    // userinfo.diagnoses.edges.map((item) => selectedDiagnosesList.push(item.node.id))
    

    // staffNodeList.map((item) => staffList.push(item.node))

    console.log(isLoaded, selectedStaffList)
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
        <Form.Item
          name="clientId"
          label="Client Id"
          rules={[
            {
              required: true,
            },
          ]}
          style={itemStyle}
        >
          <Input value={userinfo ? userinfo.clientId : ""} />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            {
              required: true,
              type: "email"
            },
          ]}
          style={itemStyle}
        >
          <Input value={userinfo ? userinfo.email : ""} />
        </Form.Item>


        <Form.Item
          name="firstName"
          label="First Name"
          rules={[
            {
              required: true,
            },
          ]}
          style={itemStyle}
        >
          <Input value={userinfo ? userinfo.firstname : ""} />
        </Form.Item>

        <Form.Item
          name="lastName"
          label="Last Name"
          rules={[
            {
              required: true,
            },
          ]}
          style={itemStyle}
        >
          <Input value={userinfo ? userinfo.lastname : ""} />
        </Form.Item>


        <Form.Item
          label="Authorized Staff"
          rules={[
            {
              required: true,
            },
          ]}
          style={itemStyle}
        >
          <Select
            mode="multiple"
            placeholder="Select Therapists"
            defaultValue={selectedStaffList}
            allowClear
          >
            {staffNodeList.map((item) => <Option value={item.node.id}>{item.node.name}</Option>)}
          </Select>
        </Form.Item>




        <Form.Item
          label="Address"
          style={itemStyle}
        >
          <div>
            <div style={{ margin: '0px' }} />
            <TextArea
              value={userinfo ? userinfo.currentAddress : ""}
              placeholder="Address"
              autoSize={{ minRows: 2, maxRows: 5 }}
            />
          </div>
        </Form.Item>

        <Form.Item
          name="dob"
          label="DOB"
          rules={[
            {
              required: true,
            }
          ]}
          style={itemStyle}
        >
          {userinfo.dob ? 
            <DatePicker defaultValue={moment(userinfo.dob)} />
          :
            <DatePicker />
          }
        </Form.Item>


        <Form.Item
          name="gender"
          label="Gender"
          rules={[
            {
              required: true,
            },
          ]}
          style={itemStyle}
        >
          <Select
            placeholder="Select a option and change input text above"
            onChange={this.onGenderChange}
            allowClear
            value={userinfo ? userinfo.gender : ""}
          >
            <Option value="male">Male</Option>
            <Option value="female">Female</Option>
            <Option value="other">Other</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="clinicLocation"
          label="Clinic Location"
          rules={[
            {
              required: true,
            },
          ]}
          style={itemStyle}
        >
          <Select
            placeholder="Select a option and change input text above"
            onSelect={this.handleChange}
            allowClear
            value={userinfo.clinicLocation ? userinfo.clinicLocation.id : ""}
          >
            {clinicLocationList.map((item) => <Option value={item.node.id}>{item.node.location}</Option>)}
          </Select>
        </Form.Item>

        <Form.Item
          label="Category"
          rules={[
            {
              required: true,
            },
          ]}
          style={itemStyle}
        >
          <Select
            placeholder="Select a option"
            onSelect={this.handleChange}
            allowClear
            value={userinfo.category ? userinfo.category.id : ""}
          >
            {categoryList.map((item) => <Option value={item.id}>{item.category}</Option>)}
          </Select>
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
    );
  }
}

export default EditBasicInformationForm
