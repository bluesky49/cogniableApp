import React from 'react';
import { Form, Input, Button, Select, DatePicker } from 'antd';

const { TextArea } = Input;
const { Option } = Select;
const tailLayout = {
  wrapperCol: {
    offset: 6,
    span: 14,
  },
};



class EditBasicInformationForm extends React.Component {
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
          <Input value={userinfo ? userinfo.client_id : ""} />
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
          name="authStaff"
          label="Authorized Staff"
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

          >
            <Option value="">1</Option>
            <Option value="">2</Option>
            <Option value="">3</Option>
          </Select>
        </Form.Item>




        <Form.Item
          label="Address"
          style={itemStyle}
        >
          <div>
            <div style={{ margin: '0px' }} />
            <TextArea
              value={userinfo ? userinfo.current_address : ""}
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
          <div>
            <DatePicker />
          </div>
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
            <Option value="Male">Male</Option>
            <Option value="Female">Female</Option>
            <Option value="Other">Other</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="diagnosis"
          label="Diagnosis"
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
          >
            <Option value="">1</Option>
            <Option value="">2</Option>
            <Option value="">3</Option>
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
            value={userinfo ? userinfo.clinic_location : ""}
          >
            <Option value="">1</Option>
            <Option value="">2</Option>
            <Option value="">3</Option>
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
