import React  from 'react';
import{Form,Select,Input,DatePicker,Button} from "antd";


const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 14,
  },
};

class EditHealthForm extends React.Component {
    

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
          <Form.Item
            name="height"
            label="Height"
            rules={[
            {
              required: true,
            },
          ]}
            style={itemStyle}
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
            style={itemStyle}
          >
            <Input />
          </Form.Item>

          

          <Form.Item 
            label="Allergies"
            name="allergies"
            style={itemStyle}
          >
            <Select>
              <Select.Option value="demo">Drug</Select.Option>
              <Select.Option value="demo2">Food</Select.Option>
              <Select.Option value="demo3">Environment</Select.Option>
              <Select.Option value="demo4">Unknown</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item 
            label="Allergy observed"
            name="allergyOberver"
            style={itemStyle}
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
            style={itemStyle}
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
            style={itemStyle}
          >
            <DatePicker />
          </Form.Item>

          <Form.Item 
            label="Blood Pressure(Systolic)"
            name="BloodPresure"
            style={itemStyle}
            
          >
            <Input />
          </Form.Item>

          <Form.Item 
            label="Blood Pressure(Diastolic)"
            name="bloodPressure"
            style={itemStyle}
          >
            <Input />
          </Form.Item>

          <Form.Item 
            label="Pulse Rate"
            name="pulseRate"
            style={itemStyle}
          >
            <Input />
          </Form.Item>

          <Form.Item 
            label="Cholestrol"
            name="cholestrol"
            style={itemStyle}
            
          >
            <Input />
          </Form.Item>

          <Form.Item 
            label="Exercises"
            name="exercises"
            style={itemStyle}
          >
            <Input />
          </Form.Item>

          <Form.Item 
            label="Food & Drink"
            name="foodAndDrink"
            style={itemStyle}
          >
            <Input />
          </Form.Item>

          <Form.Item 
            label="Immunization"
            name="immunization"
            style={itemStyle}
          >
            <Select>
              <Select.Option value="demo">demo</Select.Option>
              <Select.Option value="demo">demo</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item 
            label="Medication"
            name="medication"
            style={itemStyle}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Menstruation"
            name="menstruation"
            style={itemStyle}
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

export default EditHealthForm;