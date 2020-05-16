/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable no-self-compare */
/* eslint-disable no-self-compare */
import React from 'react'
import { Helmet } from 'react-helmet'
import { Tabs, Form, Icon, Input, Button, Switch, Card, Avatar } from 'antd'
import Authorize from 'components/LayoutComponents/Authorize'

const { Meta } = Card

class LearnerView extends React.Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    const { TabPane } = Tabs
    return (
      <Authorize roles={['school_admin']} redirect to="/dashboard/beta">
        <Helmet title="Partner" />
        <div className="utils__title utils__title--flat mb-3">
          <strong className="text-uppercase font-size-16">Settings</strong>
        </div>
        <div className="row justify-content-md-center">
          <div className="col-sm-7">
            <div className="card">
              <div className="card-body">
                <Tabs type="card" tabPosition="left">
                  <TabPane tab="Account" key="1" style={{ marginBottom: '0' }}>
                    <div className="card">
                      <div
                        className="card-body"
                        style={{ padding: '0px 20px', textAlign: 'center' }}
                      >
                        <Card style={{ width: '100%', border: 'none', textAlign: 'left' }}>
                          <Meta
                            avatar={
                              <Avatar
                                src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                                style={{
                                  width: '100px',
                                  height: '100px',
                                  border: '1px solid #f6f7fb',
                                }}
                              />
                            }
                            title={<h5 style={{ marginTop: '20px' }}>Demo User</h5>}
                            description="This is the description"
                          />
                        </Card>
                        <Form layout="inline" onSubmit={this.handleSubmit}>
                          <Form.Item>
                            <Input
                              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                              placeholder="Email"
                              style={{ width: 320 }}
                              value="ravi828.rk@gmail.com"
                            />
                          </Form.Item>

                          <Form.Item>
                            <Button htmlType="submit">Update</Button>
                          </Form.Item>
                        </Form>
                        <Form layout="inline" onSubmit={this.handleSubmit}>
                          <Form.Item>
                            <Input
                              prefix={<Icon type="phone" style={{ color: 'rgba(0,0,0,.25)' }} />}
                              placeholder="Phone no"
                              style={{ width: 320 }}
                              value="+91 9582436767"
                            />
                          </Form.Item>

                          <Form.Item>
                            <Button htmlType="submit">Update</Button>
                          </Form.Item>
                        </Form>
                        <Form layout="inline" onSubmit={this.handleSubmit}>
                          <Form.Item>
                            <Input
                              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                              placeholder="Password"
                              style={{ width: 320 }}
                            />
                          </Form.Item>

                          <Form.Item>
                            <Button htmlType="submit">Update</Button>
                          </Form.Item>
                        </Form>
                      </div>
                    </div>
                  </TabPane>
                  <TabPane tab="Privacy and Safety" key="2">
                    11
                  </TabPane>
                  <TabPane tab="Notification" key="3">
                    <div className="card">
                      <div className="card-body" style={{ padding: '0px 20px' }}>
                        <div className="row">
                          <div className="col-sm-9">
                            <h5>Session Reminders</h5>
                            <p>Reminder for everyday sessions</p>
                          </div>
                          <div className="col-sm-3">
                            <Switch
                              checkedChildren={<Icon type="check" />}
                              unCheckedChildren={<Icon type="close" />}
                              defaultChecked
                              style={{ marginTop: '5px' }}
                            />
                          </div>
                        </div>
                        <hr style={{ marginTop: '0px' }} />
                        <div className="row">
                          <div className="col-sm-9">
                            <h5>Data Recording Reminders</h5>
                            <p>Reminder for recording everyday data</p>
                          </div>
                          <div className="col-sm-3">
                            <Switch
                              checkedChildren={<Icon type="check" />}
                              unCheckedChildren={<Icon type="close" />}
                              style={{ marginTop: '5px' }}
                            />
                          </div>
                        </div>
                        <hr style={{ marginTop: '0px' }} />
                        <div className="row">
                          <div className="col-sm-9">
                            <h5>Medical Reminders</h5>
                            <p>Reminder for recording everyday data</p>
                          </div>
                          <div className="col-sm-3">
                            <Switch
                              checkedChildren={<Icon type="check" />}
                              unCheckedChildren={<Icon type="close" />}
                              defaultChecked
                              style={{ marginTop: '5px' }}
                            />
                          </div>
                        </div>
                        <hr style={{ marginTop: '0px' }} />
                        <div className="row">
                          <div className="col-sm-9">
                            <h5>Target Master Notification</h5>
                            <p>Notify me when new target is mastered</p>
                          </div>
                          <div className="col-sm-3">
                            <Switch
                              checkedChildren={<Icon type="check" />}
                              unCheckedChildren={<Icon type="close" />}
                              defaultChecked
                              style={{ marginTop: '5px' }}
                            />
                          </div>
                        </div>
                        <hr style={{ marginTop: '0px' }} />
                      </div>
                    </div>
                  </TabPane>
                  <TabPane tab="Content Prefrences" key="4">
                    3
                  </TabPane>
                  <TabPane tab="Change Profile Picture" key="5">
                    Content of Tab Pane 3
                  </TabPane>
                  <TabPane tab="Upgrade Plan" key="6">
                    Content of Tab Pane 3
                  </TabPane>
                  <TabPane tab="Email Us" key="7">
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

export default LearnerView
