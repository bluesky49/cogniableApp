import React from 'react'
import { Checkbox, Form, Button, Select, Input, DatePicker } from 'antd'

const { TextArea } = Input

class ShortTerm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      goalname: '',
      comments: '',
      goaldescription: '',
      instruction: '',
      type: '',
      date: '',
      discipline: '',
      responsibility: '',
      initgoal: '',
      save: '',
      cancel: '',
    }
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  setDate = value => {
    this.setState({ date: new Date(value).toISOString().slice(0, 10) })
  }

  selectInstruction = value => {
    this.setState({ instruction: value })
  }

  selectType = value => {
    this.setState({ type: value })
  }

  selectDiscipline = value => {
    this.setState({ discipline: value })
  }

  selectResponsibility = value => {
    this.setState({ responsibility: value })
  }

  selectInitgoal = value => {
    this.setState({ initgoal: value })
  }

  render() {
    const {
      goaldescription,
      goalname,
      type,
      comments,
      instruction,
      date,
      discipline,
      responsibility,
      initgoal,
      save,
      cancel,
    } = this.state
    console.log(
      type,
      comments,
      instruction,
      date,
      discipline,
      responsibility,
      initgoal,
      save,
      cancel,
    )

    return (
      <Form
        labelCol={{
          span: 6,
        }}
        wrapperCol={{
          span: 14,
        }}
        layout="horizontal"
        initialValues={{
          size: 'small',
        }}
        // onValuesChange={onFormLayoutChange}
        size="small"
      >
        <Form.Item label="Goal Name">
          <Input name="goalname" onChange={this.handleChange} value={goalname} />
        </Form.Item>
        <Form.Item label="Goal Description">
          <TextArea
            name="goaldescription"
            onChange={this.handleChange}
            autoSize={{ minRows: 2, maxRows: 5 }}
          >
            {goaldescription}
          </TextArea>
        </Form.Item>
        <Form.Item valuePropName="checked" style={{ textAlign: 'right' }}>
          <Checkbox name="comments">Allow others to add comments to this branch</Checkbox>
        </Form.Item>
        <Form.Item label="Instructional Notes Template">
          <Select name="instruction" onSelect={this.selectInstruction}>
            <Select.Option value="demo">1</Select.Option>
            <Select.Option value="demo">2</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Type">
          <Select name="type">
            {' '}
            onSelect={this.selectType}
            <Select.Option value="demo">1</Select.Option>
            <Select.Option value="demo">2</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Date Initiated">
          <DatePicker name="date" onChange={this.setDate} />
        </Form.Item>
        <Form.Item label="Discipline">
          <Select name="discipline" onSelect={this.selectDiscipline}>
            <Select.Option value="demo">yes</Select.Option>
            <Select.Option value="demo">no</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Responsibility">
          <Select name="responsibility" onSelect={this.selectResponsibility}>
            <Select.Option value="demo">1</Select.Option>
            <Select.Option value="demo">2</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Initial Goal Status">
          <Select name="initgoal" onSelect={this.selectInitgoal}>
            <Select.Option value="demo">pending</Select.Option>
            <Select.Option value="demo">completed</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button name="save" type="primary">
            Save
          </Button>
          <Button name="cancel">Cancel</Button>
        </Form.Item>
      </Form>
    )
  }
}
export default ShortTerm
