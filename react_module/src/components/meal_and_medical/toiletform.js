import React from 'react'
import { Radio, Form ,Input,DatePicker,TimePicker,Button,Switch, notification} from 'antd';
import moment from 'moment';
import { gql } from "apollo-boost";
import client from '../../apollo/config'

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const layout = {
    labelCol: {
      span: 12,
    },

    
  };

class ToiletBasicForm extends React.Component {
    state={

    };

  SubmitForm = (e, This) => {
    console.log(This);
      e.preventDefault();
      const { form } = this.props;
      form.validateFields((error, values) => {
        if (!error) {
          const date = new Date(values.date).toISOString().slice(0,10);
          const time = moment(new Date(values.time)).format("hh:mm A");
          const lastWaterTime = moment(new Date(values.lastWaterTime)).format("hh:mm A");
          // console.log(date);
          // console.log(values);
          // console.log(time);
            client.mutate({
              mutation: gql`mutation {
                recordToiletdata(input:{
                    toiletData:
                    {
                        student:"U3R1ZGVudFR5cGU6MTYz", 
                        date:"${date}",
                        time:"${time}",
                        lastWater:"${values.lastWater}",
                        lastWaterTime:"${lastWaterTime}",
                        success:${values.success},
                        urination:${Boolean(values.urination)},
                        bowel:${Boolean(values.bowel)},
                        prompted:${Boolean(values.prompted)}
                    }
                    
                })
                { 
                    details{
                        id,
                        date,
                        time,
                        lastWater,
                        lastWaterTime,
                        success,
                        urination,
                        bowel,
                        prompted
                    }
                }
            }`
            })
            .then(result => {
              console.log(result)
              notification.success({
                message: 'Medical Data',
                description:'Medical Data Added Successfully',              
              });
              form.resetFields(); 
            })
            .catch(err => { 
              err.graphQLErrors.map((item) => { 
                return notification.error({
                  message: 'Somthing want wrong',
                  description: item.message,
              }); 
            })
          });

        }
      })
    }

  render() {
    const {form} = this.props;
    return (

      <div className="col-sm-12">
        <div className="card">
          <strong style={{textAlign:"center",fontSize:"25px"}}>New Toilet Data</strong>
          <div className="card-body">
            <div style={{textAlign:"left"}}>
              <Form {...layout} onSubmit={(e) => this.SubmitForm(e, this)} name="control-ref" style={{marginLeft:"10%"}}>
                <Form.Item label="Date">
                  {form.getFieldDecorator('date', {rules: [{ required: true, message: 'Please Select Date!' }],})(
                    <DatePicker name="date" style={{width:120}} defaultValue={moment()} />      
                  )}              
                </Form.Item> 

                <Form.Item label="Time">
                  {form.getFieldDecorator('time', {rules: [{ required: true, message: 'Please Select Date!' }],})(
                    <TimePicker use12Hours name="time" style={{width:120}} defaultValue={moment()} />         
                  )}          
                </Form.Item>
                <Form.Item label="Accident/Success">
                  {form.getFieldDecorator('success', {rules: []})(
                    <Switch name="success" />                   
                  )}
                </Form.Item>   

                <Form.Item label="Urination">
                  {form.getFieldDecorator('urination', {rules: []})(
                    <RadioGroup defaultValue="false">
                      <RadioButton style={{width:60}} name="urination" value="true">Yes</RadioButton>
                      <RadioButton style={{width:60}} name="urination" value="false">No</RadioButton>
                    </RadioGroup>
                  )}
                </Form.Item>

                <Form.Item label="Bowel Movement">
                  {form.getFieldDecorator('bowel', {rules: []})(
                    <RadioGroup defaultValue="false">
                      <RadioButton style={{width:60}} value="true">Yes</RadioButton>
                      <RadioButton style={{width:60}} value="false">No</RadioButton>
                    </RadioGroup>
                  )}
                </Form.Item>

                <Form.Item label="Prompted to Request?">
                  {form.getFieldDecorator('prompted', {rules: []})(
                    <RadioGroup defaultValue="false">
                      <RadioButton style={{width:60}} value="true">Yes</RadioButton>
                      <RadioButton style={{width:60}} value="false">No</RadioButton>
                    </RadioGroup>
                  )}
                </Form.Item>

                <Form.Item label=" Last Water Intake">
                  {form.getFieldDecorator('lastWater', {rules: [{ required: true, message: 'Please enter Last Water!' }]})(
                    <Input style={{width:120}} placeholder="Volume" name="lastWater" />
                  )}
                </Form.Item>
                <Form.Item label="Time of Water Intake">
                  {form.getFieldDecorator('lastWaterTime', {rules: [{ required: true, message: 'Please enter Time!' }]})(
                    <TimePicker use12Hours style={{width:120}} placeholder=" intake time" name="lastWaterTime" />
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
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const ToiletForm = Form.create()(ToiletBasicForm);
export default ToiletForm;