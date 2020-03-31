import React  from 'react';
import{Form,Radio,Input,DatePicker,Button} from "antd";

class InsuranceForm extends React.Component {
    

    render(){
      return(
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
          // onValuesChange={onFormLayoutChange}
          size='small'
        >          

          <Form.Item label="First Name">
            <Input />
          </Form.Item>

          <Form.Item label="Last Name">
            <Input />
          </Form.Item>
          

          <Form.Item label="DOB:">
            <DatePicker />
          </Form.Item>

          <Form.Item label="Gender" name="gender">
            <Radio.Group>
              <Radio.Button value="male">Male</Radio.Button>
              <Radio.Button value="female">Female</Radio.Button>
            </Radio.Group>
          </Form.Item>

          
          <Form.Item label="SSN:">
            <Input />
          </Form.Item>

          <Form.Item label="Policy No:">
            <Input />
          </Form.Item>

          <Form.Item label="Group Name">
            <Input />
          </Form.Item>

          <Form.Item label="Insured ID">
            <Input />
          </Form.Item>

          <Form.Item label="Address">
            <Input />
          </Form.Item>

          <Form.Item label="City">
            <Input />
          </Form.Item>

          <Form.Item label="State">
            <Input />
          </Form.Item>

          <Form.Item label="Zip">
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

export default InsuranceForm;