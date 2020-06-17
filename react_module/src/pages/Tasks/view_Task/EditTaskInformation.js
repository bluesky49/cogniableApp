/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable object-shorthand */
import React from 'react'
import { Form, Input, Button, Select, DatePicker } from 'antd'
import moment from 'moment'
import { connect } from 'react-redux'

const { TextArea } = Input
const { Option } = Select
const tailLayout = {
  wrapperCol: {
    offset: 6,
    span: 14,
  },
}

@connect(({ user, tasks }) => ({ user, tasks }))
class EditTaskInformation extends React.Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  componentDidMount() {
    const {
      form,
      tasks: { SelectedTask },
    } = this.props

    const selectedStaffList = []
    SelectedTask.assignWork.edges.map(item => selectedStaffList.push(item.node.id))

    const selectedStudentList = []
    SelectedTask.students.edges.map(item => selectedStudentList.push(item.node.id))

    form.setFieldsValue({
      taskType: SelectedTask.taskType.id,
      description: SelectedTask.description,
      startDate: moment(SelectedTask.startDate),
      dueDate: moment(SelectedTask.dueDate),
      status: SelectedTask.status.id,
      taskName: SelectedTask.taskName,
      priority: SelectedTask.priority.id,
      therapists: selectedStaffList,
      learners: selectedStudentList,
    })
  }

  handleSubmit = e => {
    const {
      form,
      dispatch,
      tasks: { SelectedTask },
    } = this.props
    e.preventDefault()
    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'tasks/EDIT_TASK',
          payload: {
            id: SelectedTask.id,
            values: values,
          },
        })
      }
    })
  }

  onReset = () => {
    this.formRef.current.resetFields()
  }

  render() {
    const itemStyle = { marginBottom: '0' }
    const {
      form,
      tasks: { priority, taskStatus, taskType, learnersList, staffsList, createTaskLoading },
    } = this.props

    return (
      <Form onSubmit={e => this.handleSubmit(e)}>
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
          <Button type="submit" loading={createTaskLoading} htmlType="submit">
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

const EditTaskInformationForm = Form.create()(EditTaskInformation)

export default EditTaskInformationForm
