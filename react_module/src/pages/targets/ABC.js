/* eslint-disable react/no-unused-state */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-indent */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable no-nested-ternary */
import React from 'react';
import {Helmet} from 'react-helmet';
import {Form, Input, Button, Select, DatePicker, notification} from 'antd';
import BasicInformationForm from 'components/learner/BasicInformationForm';
import Authorize from 'components/LayoutComponents/Authorize';

import {gql} from 'apollo-boost';
import client from '../../apollo/config';

const {TextArea} = Input;
const {Option} = Select;
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

class ABCForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const itemStyle = {marginBottom:"5px"}
    const { form } = this.props;

    return (
      <Authorize roles={['school_admin']} redirect to="/dashboard/beta">
        <Helmet title="Partner" />
        <div className="row justify-content-md-center">
          <div className="col-sm-7">
            <div className="card">
              <div className="card-body">
                <h5>ABC Recording</h5>
                <hr />
                <br />
                <Form
                  {...layout}
                  name="control-ref"
                >
                  <Form.Item label="Date & Time:" style={itemStyle}>
                    {form.getFieldDecorator('date_time', {
                      rules: [
                        {required: true, message: 'Please provide Date & Time !'},
                      ],
                    })(<DatePicker />)}
                  </Form.Item>
                  <Form.Item label="Location" style={itemStyle}>
                    {form.getFieldDecorator('email', {
                      rules: [
                        {
                          required: true,
                          type: 'email',
                          message: 'Please provide email!',
                        },
                      ],
                    })(<Input />)}
                  </Form.Item>
                  <Form.Item label="Antecedents" style={itemStyle}>
                    {form.getFieldDecorator('firstName', {
                      rules: [
                        {required: true, message: 'Please provide firstName!'},
                      ],
                    })(<Input />)}
                  </Form.Item>
                  <Form.Item label="Behaviors" style={itemStyle}>
                    {form.getFieldDecorator('lastName')(<Input />)}
                  </Form.Item>
                  <Form.Item label="Consequences" style={itemStyle}>
                    {form.getFieldDecorator('authStaff')(
                      <Select
                        mode="multiple"
                        placeholder="Select Therapist"
                        allowClear
                      >

                      <Option value="1">gfd</Option>

                      </Select>,
                    )}
                  </Form.Item>
                  <Form.Item label="Intensity" style={itemStyle}>
                    {form.getFieldDecorator('gender', {
                      rules: [
                        {
                          required: true,
                          message: 'Please provide Date of Birth!',
                        },
                      ],
                    })(
                      <Select placeholder="Who you are" allowClear>
                        <Option value="male">male</Option>
                        <Option value="female">female</Option>
                        <Option value="other">other</Option>
                      </Select>,
                    )}
                  </Form.Item>
                  <Form.Item label="Response" style={itemStyle}>
                    {form.getFieldDecorator('gender', {
                      rules: [
                        {
                          required: true,
                          message: 'Please provide Date of Birth!',
                        },
                      ],
                    })(
                      <Select placeholder="Who you are" allowClear>
                        <Option value="male">male</Option>
                        <Option value="female">female</Option>
                        <Option value="other">other</Option>
                      </Select>,
                    )}
                  </Form.Item>
                  <Form.Item label="Frequency" style={itemStyle}>
                    {form.getFieldDecorator('gender', {
                      rules: [
                        {
                          required: true,
                          message: 'Please provide Date of Birth!',
                        },
                      ],
                    })(
                      <Select placeholder="Who you are" allowClear>
                        <Option value="male">male</Option>
                        <Option value="female">female</Option>
                        <Option value="other">other</Option>
                      </Select>,
                    )}
                  </Form.Item>
                  <Form.Item {...tailLayout}>
                    <Button type="submit" htmlType="submit">
                      {' '}
                      Submit
                    </Button>
                    <Button
                      type="primary"
                      onClick={this.onReset}
                      className="ml-4"
                    >
                      cancel
                    </Button>

                  </Form.Item>

                </Form>
              </div>
            </div>
          </div>
        </div>
      </Authorize>
    );
  }
}

const ABCInfoForm = Form.create()(ABCForm)
export default ABCInfoForm
