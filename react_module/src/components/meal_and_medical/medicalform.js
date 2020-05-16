/* eslint-disable no-unused-vars */
import React from 'react'
import { Switch, Form, Input, Button, Select, notification, DatePicker, TimePicker } from 'antd'
import { gql } from 'apollo-boost'
import { connect } from 'react-redux'
import client from '../../apollo/config'

const { TextArea } = Input

const layout = {
  labelCol: {
    span: 6,
  },
}

const { Option } = Select
// const { RangePicker } = DatePicker;

@connect(({ user }) => ({ user }))
class MedicalBasicForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoaded: true,
    }
  }

  componentDidMount() {
    this.setState({
      isLoaded: false,
    })
  }

  SubmitForm = (e, This) => {
    console.log(This)
    e.preventDefault()
    const {
      user: { studentId },
      form,
    } = this.props
    form.validateFields((error, values) => {
      if (!error) {
        const date = new Date(values.date).toISOString().slice(0, 10)
        client
          .mutate({
            mutation: gql`mutation {
                createMedical(
                  input:{
                    medicalData:{
                      student:"${studentId}",
                      date:"${date}"
                      condition:"${values.condition}",
                      severity:"${values.severity}",
                      note:"${values.note}",
                      dosage:"${values.dosage} mg",
                      howOftenTaken:"${values.howOftenTaken} times"
                    }
                  }
                )
                { 
                  details{
                    id,
                    condition
                  }
                }
              }`,
          })
          .then(result => {
            console.log(result)
            notification.success({
              message: 'Medical Data',
              description: 'Medical Data Added Successfully',
            })
            form.resetFields()
          })
          .catch(err => {
            err.graphQLErrors.map(item => {
              return notification.error({
                message: 'Somthing want wrong',
                description: item.message,
              })
            })
          })
      }
    })
  }

  onReset = () => {
    const { form } = this.props
    form.resetFields()
  }

  render() {
    const { form } = this.props
    const { isLoaded } = this.state
    console.log(form)
    if (isLoaded) {
      return <div>Loding...</div>
    }

    return (
      <Form
        {...layout}
        onSubmit={e => this.SubmitForm(e, this)}
        name="control-ref"
        style={{ marginLeft: '10%' }}
      >
        <Form.Item label="Condition">
          {form.getFieldDecorator('condition', {
            rules: [{ required: true, message: 'Please enter Condition!' }],
          })(<Input name="condition" style={{ width: 250 }} />)}
        </Form.Item>

        <Form.Item label="Date">
          {form.getFieldDecorator('date', {
            rules: [{ required: true, message: 'Please pick a date!' }],
          })(<DatePicker onChange={this.setDate} name="date" style={{ width: 250 }} />)}
        </Form.Item>

        <Form.Item label="Severity">
          {form.getFieldDecorator('severity', {
            rules: [{ required: true, message: 'Please Select severity!' }],
          })(
            <Select
              showSearch
              style={{ width: 250 }}
              placeholder="Select"
              name="severity"
              allowclear
            >
              <Option value="U2V2ZXJpdHlDb25kaXRpb25UeXBlOjE=">Mild</Option>
              <Option value="U2V2ZXJpdHlDb25kaXRpb25UeXBlOjI=">Moderate</Option>
              <Option value="U2V2ZXJpdHlDb25kaXRpb25UeXBlOjM=">Severe</Option>
            </Select>,
          )}
        </Form.Item>

        <Form.Item label="Drug">
          {form.getFieldDecorator('medicineDetails', {
            rules: [{ required: true, message: 'Please enter Medicine!' }],
          })(<Input name="medicineDetails" style={{ width: 250 }} />)}
        </Form.Item>

        <Form.Item label="Dosage">
          {form.getFieldDecorator('dosage', {
            rules: [{ required: true, message: 'Please enter Dosage!' }],
          })(<Input name="dosage" suffix="mg" style={{ width: '90px' }} />)}
          {form.getFieldDecorator('howOftenTaken', {
            rules: [{ required: true, message: 'Please enter Times!' }],
          })(
            <Input
              name="howOftenTaken"
              suffix="times a day"
              style={{ width: '140px', marginLeft: '20px' }}
            />,
          )}
        </Form.Item>

        <Form.Item label="Note">
          {form.getFieldDecorator('note', { initialValue: '' })(
            <TextArea
              placeholder="Medical Details"
              name="note"
              autoSize={{ minRows: 3 }}
              style={{ width: 250 }}
            />,
          )}
        </Form.Item>

        <Form.Item label="Reminders">
          <Switch defaultChecked onChange="" />
        </Form.Item>

        <div style={{ marginLeft: 90 }}>
          <TimePicker use12Hours format="h:mm a" style={{ width: 130 }} />
          <Select
            showSearch
            style={{ width: '100px', marginLeft: '10px' }}
            onChange={this.selectMeal}
            defaultValue="Everyday"
            allowclear
          >
            <Option value="EveryDay">Everyday</Option>
            <Option value="Weekly">Weekly</Option>
            <Option value="Monthly">Monthly</Option>
          </Select>
        </div>
        <br />
        <div style={{ marginLeft: 90 }}>
          <TimePicker use12Hours format="h:mm a" style={{ width: 130 }} />
          <Select
            showSearch
            style={{ width: 100, marginLeft: '10px' }}
            onChange={this.selectMeal}
            defaultValue="Everyday"
            allowclear
          >
            <Option value="EveryDay">Everyday</Option>
            <Option value="Weekly">Weekly</Option>
            <Option value="Monthly">Monthly</Option>
          </Select>
        </div>
        <br />

        <Form.Item>
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

const MedicalForm = Form.create()(MedicalBasicForm)
export default MedicalForm
