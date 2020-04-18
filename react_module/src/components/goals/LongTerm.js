/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable no-underscore-dangle */
import React from 'react';
import {
    Form,
    Button,
    Select,
    Input,
    DatePicker,
    notification,
  } from 'antd';
import { gql } from "apollo-boost";
import { connect } from 'react-redux'
import client from '../../apollo/config'
  

const { TextArea } = Input;
const { Option } = Select

@connect(({ goals }) => ({ goals }))
class LongTerm extends React.Component {
  constructor(props){
    super(props);

    this.state = {

      // goalStatusList : [],
      // goalsAssessmentList: [],
      // programAreaList : [],
      // responsibilityList : [],


     
    };

  }

//   componentDidMount() {

//     client.query({
//         query: gql`{
//           goalStatus{
//             id,
//             status
//           }
//           goalsProgramArea{
//             id,
//             name
//           }
//           goalsAssessment{
//             id,
//             name
//           }
//           goalResponsibility{
//             id,
//             name
//           }
//         }`
//     })
//     .then(result => {
//         this.setState({
//             goalsAssessmentList: result.data.goalsAssessment,
//             programAreaList: result.data.goalsProgramArea,
//             goalStatusList: result.data.goalStatus, 
//             responsibilityList: result.data.goalResponsibility,        
//         })
//     })
//     .catch(error => { 
//         error.graphQLErrors.map((item) => { 
//             return notification.error({
//                 message: 'Somthing want wrong',
//                 description: item.message,
//             }); 
//         })
//     });

// }
  
  // setDate = (value) => {this.setState({date : (new Date(value)).toISOString().slice(0,10)})}

  handleSubmit = e => {
    e.preventDefault();
    const { form, goals:{LearnerId} } = this.props;

    form.validateFields((error, values) => {
      if (!error) {
        console.log(values)

        client.mutate({
            mutation: gql`
            mutation {
              createLongTerm(
                input:{
                  goalData:{
                    student:"${LearnerId}", 
                    goalName:"${values.goalname}", 
                    description:"${values.goalDescription}", 
                    dateInitialted:"${values.dataInitiated._d.toISOString().slice(0,10)}", 
                    dateEnd:"${values.endDate._d.toISOString().slice(0,10)}", 
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
          }`
            })
            .then(result => {
                console.log(result)
                notification.success({
                    message: 'Goal Added Successfully',                
                });
                form.resetFields();
            })
            .catch(err => { 
                console.log(err)
                notification.error({
                    message: 'Somthing want wrong',
                }); 
      
            });

        }
    })

  }


 
  
  render() {
    const { form, goals:{GoalStatusList, GoalResponsibleList, StaffList} } = this.props;
    const itemStyle = {marginBottom:"5px"}
    
   

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
        size:'small',
        }}
        onSubmit={this.handleSubmit}
        size='small'

      >
        
             
        
        <Form.Item label="Goal Name" style={itemStyle}>
          {form.getFieldDecorator('goalname', { rules: [{ required: true, message: 'Please provide your Goal name!' }]})(
            <Input name="goalname" />,
          )}
          
        </Form.Item>
        <Form.Item label="Goal Description" style={itemStyle}>
          {form.getFieldDecorator('goalDescription', { rules: [{ required: true, message: 'Please describe your goal here!' }]})(
            <TextArea
              name="goaldescription"
              autoSize={{ minRows: 5 }}
            />,
          )}
        </Form.Item>
        
        <Form.Item label="Date Initiated" style={itemStyle}>
          {form.getFieldDecorator('dataInitiated', { rules: [{ required: true, message: 'Please select initiated date!' }]})(
            <DatePicker />,
          )}
          
        </Form.Item>

        <Form.Item label="End Date" style={itemStyle}>
          {form.getFieldDecorator('endDate', { rules: [{ required: true, message: 'Please select End Date!' }]})(
            <DatePicker />,
          )}
          
        </Form.Item>
        
        <Form.Item label="Responsible" style={itemStyle}>
          {form.getFieldDecorator('responsibility', { rules: [{ required: true, message: 'Please select responsible person!' }]})(
            <Select>
              {GoalResponsibleList.map((item) => <Option value={item.id}>{item.name}</Option>)}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="Therapist" style={itemStyle}>
          {form.getFieldDecorator('therapist', { rules: [{ required: true, message: 'Please select Therapist!' }]})(
            <Select
                id="product-edit-colors"
                showSearch
                placeholder="Select a Therapist"
                optionFilterProp="children"
                
            >
                {StaffList.map(c => <Option value={c.node.id}>{c.node.name}</Option>)}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="Goal Status" style={itemStyle}>
          {form.getFieldDecorator('status', { rules: [{ required: true, message: 'Please select goal status!' }]})(
            <Select>
              {GoalStatusList.map((item) => <Option value={item.id}>{item.status}</Option>)}
            </Select>,
          )}
        </Form.Item>


        <Form.Item label="&nbsp;" style={itemStyle}>
          <Button htmlType="submit" type="primary" style={{marginRight:"10px"}}>Save</Button>
          <Button name="cancel"> Cancel</Button>
        </Form.Item>
      </Form>
    )
        }
    }
    const LongTermForm = Form.create()(LongTerm)
    export default LongTermForm
