/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/destructuring-assignment */
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
class EditShortTerm extends React.Component {
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
            goalsAssessment {
              id
              name
            }
            goalResponsibility {
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
      goals: { ShortTermObject },
    } = this.props

    const res = ShortTermObject.responsibility ? ShortTermObject.responsibility.id : null
    const stat = ShortTermObject.goalStatus ? ShortTermObject.goalStatus.id : null
    const ass = ShortTermObject.assessment ? ShortTermObject.assessment.id : null

    form.setFieldsValue({
      goalname: ShortTermObject.goalName,
      goalDescription: ShortTermObject.description,
      dataInitiated: moment(ShortTermObject.dateInitialted),
      endDate: moment(ShortTermObject.dateEnd),
      responsibility: res,
      status: stat,
      assessment: ass,
    })
  }

  handleSubmit = e => {
    e.preventDefault()
    const {
      form,
      goals: { ShortTermObject },
    } = this.props

    form.validateFields((error, values) => {
      if (!error) {
        client
          .mutate({
            mutation: gql`mutation{
                        updateShortTerm(
                            input:{
                                goalData:{
                                    id:"${ShortTermObject.id}", 
                                    goalName:"${values.goalname}"
                                    description:"${values.goalDescription}", 
                                    dateInitialted:"${values.dataInitiated._d
                                      .toISOString()
                                      .slice(0, 10)}", 
                                    dateEnd:"${values.endDate._d.toISOString().slice(0, 10)}", 
                                    responsibility:"${values.responsibility}", 
                                    goalStatus:"${values.status}",
                                    assessment:"${values.assessment}"
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
                                longTerm{
                                    id,
                                    goalName
                                },
                                programArea{
                                    id,
                                    name
                                },
                                assessment{
                                    id,
                                    name
                                },
                                responsibility{
                                    id,
                                    name
                                },
                                goalStatus{
                                    id,
                                    status
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
    const { goalStatusList, goalsAssessmentList, responsibilityList } = this.state
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
        {/* <h5 style={{textAlign:"center"}}>LTG : {goal.longTerm.goalName}</h5> */}

        <Form.Item label="Goal Name" style={itemStyle}>
          {form.getFieldDecorator('goalname', {
            rules: [{ required: true, message: 'Please provide your Goal Name!' }],
          })(<Input />)}
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
        <Form.Item label="Assessment" style={itemStyle}>
          {form.getFieldDecorator('assessment', {
            rules: [{ required: true, message: 'Please select assessment!' }],
          })(
            <Select>
              {goalsAssessmentList.map(item => (
                <Option value={item.id}>{item.name}</Option>
              ))}
            </Select>,
          )}
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
const EditShortTermForm = Form.create()(EditShortTerm)
export default EditShortTermForm
