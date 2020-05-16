import React, { Component } from 'react'
import { Form, Input, Button, message } from 'antd'
import { Helmet } from 'react-helmet'
import { Link, Redirect } from 'react-router-dom'
import { MailOutlined, KeyOutlined, ArrowRightOutlined } from '@ant-design/icons'
import styles from './style.module.scss'

const API_URL = process.env.REACT_APP_API_URL
@Form.create()
class Forgot extends Component {
  state = {
    LoginRedirect: false,
    emailField: true,
  }

  handleSubmit = e => {
    e.preventDefault()
    const { form } = this.props
    form.validateFields((error, values) => {
      console.log(values)
      this.setState({ emailField: false })
      if (!error) {
        fetch(`${API_URL}/administrative/forgotpass/`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            database: 'india',
          },
          body: JSON.stringify(values),
        })
          .then(res => res.json())
          .then(result => {
            if (result.status) {
              message.success(result.detail)
              this.setState({
                LoginRedirect: true,
              })
            } else {
              message.error(result.detail)
            }
          })
      }
    })
  }

  render() {
    const { form } = this.props
    const { LoginRedirect, emailField } = this.state
    if (LoginRedirect) {
      return <Redirect to="/user/login" />
    }
    return (
      <div>
        <Helmet title="Forgot" />
        <div className={styles.block}>
          <div className="row">
            <div className="col-xl-12">
              <div className={styles.inner}>
                <div className={styles.form}>
                  <h4 className="text-uppercase" align="center">
                    <strong>Forget Password</strong>
                  </h4>
                  <br />
                  <Form layout="vertical" hideRequiredMark onSubmit={this.handleSubmit}>
                    {emailField ? (
                      <Form.Item>
                        {form.getFieldDecorator('email', {
                          initialValue: '',
                          rules: [{ required: true, message: 'Please input your email' }],
                        })(
                          <Input
                            size="large"
                            placeholder="Enter your email"
                            prefix={<MailOutlined className="site-form-item-icon" />}
                          />,
                        )}
                      </Form.Item>
                    ) : (
                      <>
                        <Form.Item>
                          {form.getFieldDecorator('password', {
                            initialValue: '',
                            rules: [{ required: true, message: 'Please password' }],
                          })(
                            <Input
                              size="large"
                              placeholder="New Password"
                              prefix={<KeyOutlined className="site-form-item-icon" />}
                            />,
                          )}
                        </Form.Item>
                        <Form.Item>
                          {form.getFieldDecorator('re-password', {
                            initialValue: '',
                            rules: [{ required: true, message: 'Please re-type your password' }],
                          })(
                            <Input
                              size="large"
                              placeholder="Retype Password"
                              prefix={<KeyOutlined className="site-form-item-icon" />}
                            />,
                          )}
                        </Form.Item>
                      </>
                    )}
                    <div>
                      <Button type="primary" size="large" block htmlType="submit" loading={false}>
                        CONTINUE
                        <ArrowRightOutlined className="site-form-item-icon" />
                      </Button>
                    </div>
                    <div className="mb-2 mt-5">
                      <Link to="/user/login" className="utils__link--blue utils__link--underlined">
                        Back to login
                      </Link>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Forgot
