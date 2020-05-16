import React from 'react'
import { Helmet } from 'react-helmet'
// import { Tabs } from 'antd';
import {
  Tabs,
  Form,
  Input,
  Button,
  Select,
  Cascader,
  DatePicker,
  InputNumber,
  TreeSelect,
  Switch,
} from 'antd'
import Authorize from '../../LayoutComponents/Authorize'
// import style from '../learnerform.scss'

class LearnerForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    const { TabPane } = Tabs
    return (
      <Authorize roles={['admin']} redirect to="/dashboard/beta">
        <Helmet title="Partner" />
        <div className="utils__title utils__title--flat mb-3">
          <strong className="text-uppercase font-size-16">Create Learner</strong>
        </div>
        <div className="row justify-content-md-center">
          <div className="col-sm-7">
            <div className="card">
              <div className="card-body">
                <Tabs type="card">
                  <TabPane tab="Excel Upload" key="1">
                    Content of Tab Pane 1
                  </TabPane>
                  <TabPane tab="Basic Details" key="2">
                    <Form
                      labelCol={{
                        span: 6,
                      }}
                      wrapperCol={{
                        span: 14,
                      }}
                      layout="horizontal"
                      initialValues={{
                        size: 'middle',
                      }}
                      // onValuesChange={onFormLayoutChange}
                      size="middle"
                    >
                      <Form.Item label="Input">
                        <Input />
                      </Form.Item>
                      <Form.Item label="Select">
                        <Select>
                          <Select.Option value="demo">Demo</Select.Option>
                        </Select>
                      </Form.Item>
                      <Form.Item label="TreeSelect">
                        <TreeSelect
                          treeData={[
                            {
                              title: 'Light',
                              value: 'light',
                              children: [
                                {
                                  title: 'Bamboo',
                                  value: 'bamboo',
                                },
                              ],
                            },
                          ]}
                        />
                      </Form.Item>
                      <Form.Item label="Cascader">
                        <Cascader
                          options={[
                            {
                              value: 'zhejiang',
                              label: 'Zhejiang',
                              children: [
                                {
                                  value: 'hangzhou',
                                  label: 'Hangzhou',
                                },
                              ],
                            },
                          ]}
                        />
                      </Form.Item>
                      <Form.Item label="DatePicker">
                        <DatePicker />
                      </Form.Item>
                      <Form.Item label="InputNumber">
                        <InputNumber />
                      </Form.Item>
                      <Form.Item label="Switch">
                        <Switch />
                      </Form.Item>
                      <Form.Item label="Button">
                        <Button>Button</Button>
                      </Form.Item>
                    </Form>
                  </TabPane>
                  <TabPane tab="Insurance Details" key="3">
                    Content of Tab Pane 3
                  </TabPane>
                  <TabPane tab="Health Details" key="4">
                    Content of Tab Pane 3
                  </TabPane>
                  <TabPane tab="Intake Form" key="5">
                    Content of Tab Pane 3
                  </TabPane>
                  <TabPane tab="Settings" key="6">
                    Content of Tab Pane 3
                  </TabPane>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </Authorize>
    )
  }
}

export default LearnerForm
