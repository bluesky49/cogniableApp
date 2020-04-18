import React from 'react'
import { Radio, Form ,Input,DatePicker,TimePicker,Button,Switch} from 'antd';
import moment from 'moment';


const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const layout = {
    labelCol: {
      span: 12,
    },

    
  };

class ToiletForm extends React.Component {
    state={

    };

  render() {
    
    return (

      <div className="col-sm-12">
        <div className="card">
          <strong style={{textAlign:"center",fontSize:"25px"}}>New Toilet Data</strong>
          <div className="card-body">
            <div style={{textAlign:"left"}}>
              <Form {...layout}>
                <Form.Item label="Date">
                  <DatePicker onChange={this.setDate} style={{width:120}} defaultValue={moment()} />                    
                </Form.Item> 

                <Form.Item label="Time">
                  <TimePicker onChange={this.setTime} style={{width:120}} defaultValue={moment()} />                   
                </Form.Item>
                <Form.Item label="Accident/Success">
                  <Switch />                   
                </Form.Item>   

                <Form.Item label="Urination">
                  <RadioGroup defaultValue="a">
                    <RadioButton style={{width:60}} value="a">Yes</RadioButton>
                
                    <RadioButton style={{width:60}} value="b">No</RadioButton>
                    
                  </RadioGroup>
                </Form.Item>

                <Form.Item label="Bowel Movement">
                  <RadioGroup defaultValue="a">
                    <RadioButton style={{width:60}} value="a">Yes</RadioButton>
                
                    <RadioButton style={{width:60}} value="b">No</RadioButton>
                    
                  </RadioGroup>
                </Form.Item>

                <Form.Item label="Prompted to Request?">
                  <RadioGroup defaultValue="a">
                    <RadioButton style={{width:60}} value="a">Yes</RadioButton>
                
                    <RadioButton style={{width:60}} value="b">No</RadioButton>
                    
                  </RadioGroup>
                </Form.Item>

                <Form.Item label=" Last Water Intake">
                  <Input style={{width:120}} placeholder="Volume" name="volume" />
                </Form.Item>
                <Form.Item label=" Time of Water Intake">
                  <TimePicker style={{width:120}} placeholder=" intake time" name="time" />
                </Form.Item>
                <Button type="primary">Submit</Button>
        
              </Form>
            
            </div>
          </div>
        </div>
      </div>
        

        

        
    )
  }
}

export default ToiletForm