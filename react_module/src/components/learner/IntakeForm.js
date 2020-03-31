import React from 'react';
import { Form, Input, Button,Radio } from 'antd';


const { TextArea } = Input;
const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 14,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 14,
  },
};

class IntakeForm extends React.Component {
  formRef = React.createRef();

  
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
    return (
      <Form {...layout} ref={this.formRef} name="control-ref" onFinish={this.onFinish}>
        

        <Form.Item
          name="firstName"
          label="First Name"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>


        <Form.Item
          name="middleName"
          label="Middel Name"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>


        <Form.Item
          name="lastName"
          label="Last Name"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>


        <Form.Item name="radio-group" label="Current School">
          <Radio.Group>
            <Radio value="a">Level 1</Radio>
            <Radio value="b">Level 2</Radio>
            <Radio value="c">Level 3</Radio>
          </Radio.Group>
        </Form.Item>

        
        <Form.Item
          name="PfirstName"
          label="Primary Family Contact First Name"
          
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="PlastName"
          label="Last Name"
          
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>


        <Form.Item
          name="relationChild"
          label="Relationship to child"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>


        <Form.Item
          name="phone"
          label="Phone Number"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
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
        >
          <Input />
        </Form.Item>

        
        <Form.Item
          label="Address"
        >
          <div>
            <div style={{ margin: '0px' }} />
            <TextArea
              placeholder="Address"
              autoSize={{ minRows: 2, maxRows: 5 }}
            />
          </div>
        </Form.Item>


        <Form.Item
          name="PlastName"
          label="Apt/Suite/Unit"
          
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>




        <Form.Item 
          name="zipcode"
          label="Zipcode"
          rules={[
            {
              required: true,
            }
          ]} 
        >
          <Input />
        </Form.Item>


        <Form.Item
          name="otherMembers"
          label="Other Members"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
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

export default IntakeForm