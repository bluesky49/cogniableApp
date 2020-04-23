/* eslint-disable no-unused-vars */
import React from 'react'
import { Form, Input, Button, Select, DatePicker, notification, TimePicker } from 'antd'
import { gql } from 'apollo-boost'
import { connect } from 'react-redux'
import client from '../../apollo/config'

const layout = {
  labelCol: {
    span: 6,
  },
}

const { TextArea } = Input
const { Option } = Select

@connect(({ user }) => ({ user }))
class MealBasicForm extends React.Component {
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
                createFood(
                  input:{
                    foodData:{
                      student:"${studentId}",
                      date:"${date}"
                      mealName:"${values.mealName}",
                      mealTime:"${values.mealTime}",
                      note:"${values.note}",
                      mealType:"${values.mealType}",
                      waterIntake:"${values.waterIntake}",
                      foodType:"${values.foodType}",
                    }
                  }
                )
                { 
                  details{
                    id,
                    mealName
                  }
                }
              }`,
          })
          .then(result => {
            console.log(result)
            notification.success({
              message: 'Meal Data',
              description: 'Meal Data Added Successfully',
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
        <Form.Item label="Meal Date">
          {form.getFieldDecorator('date', {
            rules: [{ required: true, message: 'Please pick a date!' }],
          })(<DatePicker onChange={this.setDate} name="date" style={{ width: 250 }} />)}
        </Form.Item>

        <Form.Item label="Meal Time">
          {form.getFieldDecorator('mealTime', {
            rules: [{ required: true, message: 'Please pick a time!' }],
          })(<TimePicker onChange={this.setTime} name="mealTime" style={{ width: 250 }} />)}
        </Form.Item>

        <Form.Item label="Meal Name">
          {form.getFieldDecorator('mealName', {
            rules: [{ required: true, message: 'Please provide Meal Name!' }],
          })(<Input placeholder="Enter Meal Name" name="mealName" style={{ width: 250 }} />)}
        </Form.Item>

        <Form.Item label="Meal Type">
          {form.getFieldDecorator('mealType', {
            rules: [{ required: true, message: 'Please Select an Option!!' }],
          })(
            <Select
              style={{ width: 250 }}
              placeholder="Select Meal Type"
              name="mealType"
              onChange={this.selectFood}
              allowclear
              showSearch
            >
              <Option value="Breakfast">Breakfast</Option>
              <Option value="Lunch">Lunch</Option>
              <Option value="Dinner">Dinner</Option>
            </Select>,
          )}
        </Form.Item>

        <Form.Item label="Food Type">
          {form.getFieldDecorator('foodType', {
            rules: [{ required: true, message: 'Please Select an Option!!' }],
          })(
            <Select
              showSearch
              style={{ width: 250 }}
              placeholder="Select Food Type"
              name="foodType"
              onChange={this.selectFood}
              allowclear
            >
              <Option value="Rm9vZFR5cGVUeXBlOjE=">Junk Food</Option>
              <Option value="Rm9vZFR5cGVUeXBlOjI=">Balanced meal</Option>
              <Option value="Rm9vZFR5cGVUeXBlOjM=">Nutritional Snacks</Option>
            </Select>,
          )}
        </Form.Item>

        <Form.Item label="Water">
          {form.getFieldDecorator('waterIntake', {
            rules: [{ required: true, message: 'Please Enter Water Intake!' }],
          })(<Input placeholder="Enter water taken" name="waterIntake" style={{ width: 250 }} />)}
        </Form.Item>

        <Form.Item label="Note">
          {form.getFieldDecorator('note', { initialValue: '' })(
            <TextArea
              placeholder="Meal Details"
              name="note"
              autoSize={{ minRows: 3 }}
              style={{ width: 250 }}
            />,
          )}
        </Form.Item>

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

const MealForm = Form.create()(MealBasicForm)
export default MealForm
