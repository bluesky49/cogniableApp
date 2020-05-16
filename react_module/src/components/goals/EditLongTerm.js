/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-unused-state */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-underscore-dangle */
import React from 'react'
import { Form, Checkbox, Button, Select, Input, DatePicker, notification } from 'antd'
import { gql } from 'apollo-boost'
import { connect } from 'react-redux'
import moment from 'moment'
import client from '../../apollo/config'

const { TextArea } = Input
const { Option } = Select

@connect(({ goals }) => ({ goals }))
class EditLongTerm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      goalStatusList: [],
      goalsAssessmentList: [],
      responsibilityList: [],
    }
  }

  componentDidMount() {
    client
      .query({
        query: gql`
          {
            goalStatus {
              id
              status
            }
            goalResponsibility {
              id
              name
            }
            goalsAssessment {
              id
              name
            }
          }
        `,
      })
      .then(result => {
        this.setState({
          goalsAssessmentList: result.data.goalsAssessment,
          goalStatusList: result.data.goalStatus,
          responsibilityList: result.data.goalResponsibility,
        })
      })
      .catch(error => {
        error.graphQLErrors.map(item => {
          return notification.error({
            message: 'Somthing want wrong',
            description: item.message,
          })
        })
      })

    const {
      form,
      goals: { LongTermObject },
    } = this.props

    const res = LongTermObject.responsibility ? LongTermObject.responsibility.id : null
    const stat = LongTermObject.goalStatus ? LongTermObject.goalStatus.id : null

    form.setFieldsValue({
      goalname: LongTermObject.goalName,
      goalDescription: LongTermObject.description,
      dataInitiated: moment(LongTermObject.dateInitialted),
      endDate: moment(LongTermObject.dateEnd),
      responsibility: res,
      status: stat,
    })
  }

  handleSubmit = e => {
    e.preventDefault()
    const {
      form,
      goals: { LongTermObject },
    } = this.props

    form.validateFields((error, values) => {
      if (!error) {
        console.log(values)

        client
          .mutate({
            mutation: gql`mutation{
                    updateLongTerm(
                        input:{
                            goalData:{
                                id:"${LongTermObject.id}", 
                                goalName:"${values.goalname}"
                                description:"${values.goalDescription}", 
                                dateInitialted:"${values.dataInitiated._d
                                  .toISOString()
                                  .slice(0, 10)}", 
                                dateEnd:"${values.endDate._d.toISOString().slice(0, 10)}", 
                                responsibility:"${values.responsibility}", 
                                goalStatus:"${values.status}"
                            }
                        }
                    )
                    { 
                      details{
                        id,
                        goalName,
                        description,
                        dateInitialted,
                        dateEnd,
                        responsibility{
                            id,
                            name
                        }
                        goalStatus{
                          id,
                          status
                        },
                        student{
                            id,
                            firstname
                        }
                    }
                    }
                }`,
          })
          .then(result => {
            notification.success({
              message: 'Goal Updated Successfully',
            })
          })
          .catch(err => {
            notification.error({
              message: 'Somthing want wrong',
            })
          })
      }
    })
  }

  render() {
    const { form } = this.props
    const { goalStatusList, responsibilityList } = this.state
    const itemStyle = { marginBottom: '5px' }

    return (
      <Form
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 14,
        }}
        layout="horizontal"
        initialValues={{
          size: 'small',
        }}
        onSubmit={this.handleSubmit}
        size="small"
      >
        <Form.Item label="Goal Name" style={itemStyle}>
          {form.getFieldDecorator('goalname', {
            rules: [{ required: true, message: 'Please provide your Goal name!' }],
          })(<Input name="goalname" />)}
        </Form.Item>
        <Form.Item label="Goal Description" style={itemStyle}>
          {form.getFieldDecorator('goalDescription', {
            rules: [{ required: true, message: 'Please describe your goal here!' }],
          })(<TextArea name="goaldescription" autoSize={{ minRows: 5 }} />)}
        </Form.Item>

        <Form.Item label="Date Initiated" style={itemStyle}>
          {form.getFieldDecorator('dataInitiated', {
            rules: [{ required: true, message: 'Please select initiated date!' }],
          })(<DatePicker />)}
        </Form.Item>

        <Form.Item label="End Date" style={itemStyle}>
          {form.getFieldDecorator('endDate', {
            rules: [{ required: true, message: 'Please select End Date!' }],
          })(<DatePicker />)}
        </Form.Item>

        <Form.Item label="Responsibility" style={itemStyle}>
          {form.getFieldDecorator('responsibility', {
            rules: [{ required: true, message: 'Please select responsible person!' }],
          })(
            <Select>
              {responsibilityList.map(item => (
                <Option value={item.id}>{item.name}</Option>
              ))}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="Goal Status" style={itemStyle}>
          {form.getFieldDecorator('status', {
            rules: [{ required: true, message: 'Please select goal status!' }],
          })(
            <Select>
              {goalStatusList.map(item => (
                <Option value={item.id}>{item.status}</Option>
              ))}
            </Select>,
          )}
        </Form.Item>

        <Form.Item label="&nbsp;" style={itemStyle}>
          <Button htmlType="submit" type="primary" style={{ marginRight: '10px' }}>
            Save
          </Button>
          <Button name="cancel"> Cancel</Button>
        </Form.Item>
      </Form>
    )
  }
}
const EditLongTermForm = Form.create()(EditLongTerm)
export default EditLongTermForm
