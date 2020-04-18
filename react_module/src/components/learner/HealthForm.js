import React  from 'react';
import{Form,Select,Input,DatePicker,Button} from "antd";


const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 14,
  },
};

class HealthForm extends React.Component {
    

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
          <Form.Item
            name="height"
            label="Height"
            rules={[
            {
              required: true,
            },
          ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="weight"
            label="Weight"
            rules={[
            {
              required: true,
            },
          ]}
          >
            <Input />
          </Form.Item>

          

          <Form.Item 
            label="Allergies"
            name="allergies"
          >
            <Select>
              <Select.Option value="demo">Drug</Select.Option>
              <Select.Option value="demo">Food</Select.Option>
              <Select.Option value="demo">Environment</Select.Option>
              <Select.Option value="demo">Unknown</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item 
            label="Allergy observed"
            name="allergyOberver"
            
          >
            <Select>
              <Select.Option value="demo">After Food/Drink</Select.Option>
              <Select.Option value="demo">After Outdoor activity</Select.Option>
              <Select.Option value="demo">After Medicine</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item 
            label="Allergic Reactions"
            name="allergicReactions"
          >
            <Select>
              <Select.Option value="demo">Itchy, runny or blocked nose</Select.Option>
              <Select.Option value="demo">Ttchy,red,watering eyes</Select.Option>
              <Select.Option value="demo">Wheezing</Select.Option>
              <Select.Option value="demo">Chest tightness</Select.Option>
              <Select.Option value="demo">Shortness of Breath and a cough</Select.Option>
              <Select.Option value="demo">Red Rash</Select.Option>
              <Select.Option value="demo">Swollen lips, tongue,eyes or face</Select.Option>
              <Select.Option value="demo">Tummy pain</Select.Option>
              <Select.Option value="demo">Vomiting or diarrhoea</Select.Option>
              <Select.Option value="demo">Dry,red and cracked skin</Select.Option>
              
            </Select>
          </Form.Item>

          <Form.Item 
            label="observed Since Date:"
            name="observedDate"
          >
            <DatePicker />
          </Form.Item>

          <Form.Item 
            label="Blood Pressure(Systolic)"
            name="BloodPresure"
            
          >
            <Input />
          </Form.Item>

          <Form.Item 
            label="Blood Pressure(Diastolic)"
            name="bloodPressure"
          >
            <Input />
          </Form.Item>

          <Form.Item 
            label="Pulse Rate"
            name="pulseRate"
          >
            <Input />
          </Form.Item>

          <Form.Item 
            label="Cholestrol"
            name="cholestrol"
            
          >
            <Input />
          </Form.Item>

          <Form.Item 
            label="Exercises"
            name="exercises"
          >
            <Input />
          </Form.Item>

          <Form.Item 
            label="Food & Drink"
            name="foodAndDrink"
          >
            <Input />
          </Form.Item>

          <Form.Item 
            label="Immunization"
            name="immunization"
          >
            <Select>
              <Select.Option value="demo">demo</Select.Option>
              <Select.Option value="demo">demo</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item 
            label="Medication"
            name="medication"
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Menstruation"
            name="menstruation"
          >
            <Select>
              <Select.Option value="demo">demo</Select.Option>
              <Select.Option value="demo">demo</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item {...tailLayout}>
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

};

export default HealthForm;