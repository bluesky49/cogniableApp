/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable no-underscore-dangle */
/* eslint-disable object-shorthand */

import React from 'react'
import { Form, Input, Button, Select, DatePicker } from 'antd'
import { connect } from 'react-redux'

const { TextArea } = Input
const { Option } = Select
const layout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 14,
  },
}
const tailLayout = {
  wrapperCol: {
    offset: 7,
    span: 14,
  },
}

@connect(({ user, tasks }) => ({ user, tasks }))
class BasicInformationForm extends React.Component {
  formRef = React.createRef()

  constructor(props) {
    super(props)

    this.state = {}
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch({
      type: 'tasks/GET_TASKS_DROPDOWNS',
    })
  }

  onReset = () => {
    const { form } = this.props
    form.resetFields()
  }

  handleSubmit = e => {
    e.preventDefault()

    const { form, dispatch } = this.props

    form.validateFields((error, values) => {
      if (!error) {
        dispatch({
          type: 'tasks/CREATE_TASK',
          payload: {
            values: values,
          },
        })
        form.resetFields()
      }
    })
  }

  render() {
    const {
      form,
      tasks: { priority, taskStatus, taskType, learnersList, staffsList, createTaskLoading },
    } = this.props
    const itemStyle = { marginBottom: '5px' }

    return (
      <Form {...layout} name="control-ref" onSubmit={e => this.handleSubmit(e)}>
        <Form.Item label="Task Type" style={itemStyle}>
          {form.getFieldDecorator('taskType', {
            rules: [{ required: true, message: 'Select Type' }],
          })(
            <Select placeholder="Select Task Type" allowClear>
              {taskType.map(item => (
                <Option value={item.id}>{item.taskType}</Option>
              ))}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="Description" style={itemStyle}>
          {form.getFieldDecorator('description', {
            rules: [{ message: 'Please provide Address!' }],
          })(<TextArea placeholder="description" autoSize={{ minRows: 3 }} />)}
        </Form.Item>
        <Form.Item label="Start Date" style={itemStyle}>
          {form.getFieldDecorator('startDate', {
            rules: [{ required: true, message: 'Please provide Start Date!' }],
          })(<DatePicker />)}
        </Form.Item>
        <Form.Item label="Due Date" style={itemStyle}>
          {form.getFieldDecorator('dueDate', {
            rules: [{ required: true, message: 'Please provide Due Date!' }],
          })(<DatePicker />)}
        </Form.Item>
        <Form.Item label="Status" style={itemStyle}>
          {form.getFieldDecorator('status', {
            rules: [{ required: true, message: 'Select Status' }],
          })(
            <Select placeholder="Select Status" allowClear>
              {taskStatus.map(item => (
                <Option value={item.id}>{item.taskStatus}</Option>
              ))}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="Task Name" style={itemStyle}>
          {form.getFieldDecorator('taskName', {
            rules: [{ required: true, message: 'Enter Task Name!' }],
          })(<Input />)}
        </Form.Item>
        <Form.Item label="Priority" style={itemStyle}>
          {form.getFieldDecorator('priority', {
            rules: [{ required: true, message: 'Please Select Priority!' }],
          })(
            <Select placeholder="Select Priority" allowClear>
              {priority.map(item => (
                <Option value={item.id}>{item.name}</Option>
              ))}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="Therapists" style={itemStyle}>
          {form.getFieldDecorator('therapists')(
            <Select mode="multiple" optionFilterProp="label" placeholder="Select Therapists" allowClear>
              {staffsList.edges.map(item => (
                <Option value={item.node.id} label={item.node.name}>{item.node.name}</Option>
              ))}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="Learners" style={itemStyle}>
          {form.getFieldDecorator('learners')(
            <Select mode="multiple" optionFilterProp="label" placeholder="Select learners" allowClear>
              {learnersList.edges.map(item => (
                <Option value={item.node.id} label={item.node.firstname}>{item.node.firstname}</Option>
              ))}
            </Select>,
          )}
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type="primary" loading={createTaskLoading} htmlType="submit">
            Submit
          </Button>

          <Button onClick={this.onReset} className="ml-4">
            cancel
          </Button>
        </Form.Item>
      </Form>
    )
  }
}

const BasicInformation = Form.create()(BasicInformationForm)
export default BasicInformation
