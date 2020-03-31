import React  from 'react';
import{Form,Radio,Input,DatePicker,Button} from "antd";

class EditInsuranceForm extends React.Component {
    

    render(){
      const itemStyle = {marginBottom:'0'}
      return(
        <Form
          layout={{
            labelCol: {span: 4 },
            wrapperCol: { span: 14 },
          }}
          
          initialValues={{
          size: 'small',
        }}
          // onValuesChange={onFormLayoutChange}
          size='small'
        >          

          <Form.Item label="First Name" style={itemStyle}>
            <Input />
          </Form.Item>

          <Form.Item label="Last Name" style={itemStyle}>
            <Input />
          </Form.Item>
          

          <Form.Item label="DOB:" style={itemStyle}>
            <DatePicker />
          </Form.Item>

          <Form.Item label="Gender" name="gender" style={itemStyle}>
            <Radio.Group>
              <Radio.Button value="male">Male</Radio.Button>
              <Radio.Button value="female">Female</Radio.Button>
            </Radio.Group>
          </Form.Item>

          
          <Form.Item label="SSN:" style={itemStyle}>
            <Input />
          </Form.Item>

          <Form.Item label="Policy No:" style={itemStyle}>
            <Input />
          </Form.Item>

          <Form.Item label="Group Name" style={itemStyle}>
            <Input />
          </Form.Item>

          <Form.Item label="Insured ID" style={itemStyle}>
            <Input />
          </Form.Item>

          <Form.Item label="Address" style={itemStyle}>
            <Input />
          </Form.Item>

          <Form.Item label="City" style={itemStyle}>
            <Input />
          </Form.Item>

          <Form.Item label="State" style={itemStyle}>
            <Input />
          </Form.Item>

          <Form.Item label="Zip" style={itemStyle}>
            <Input />
          </Form.Item>
          
          
          <Form.Item label="">
            <Button className="ml-5 btn-primary">Save</Button>

            <Button className="ml-4">Cancel</Button>
            <Button className="ml-4 float-right">Next</Button>
          </Form.Item>  

          

          
        </Form>
        
        
      )
    }

};

export default EditInsuranceForm;