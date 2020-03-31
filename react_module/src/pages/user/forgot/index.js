import React, { Component } from 'react'
import { Form, Input, Button, message } from 'antd'
import { Helmet } from 'react-helmet'
import { Link, Redirect } from 'react-router-dom'
import styles from './style.module.scss'

const API_URL = process.env.REACT_APP_API_URL;
@Form.create()
class Forgot extends Component {
  state = {
    LoginRedirect:false
  }

  handleSubmit = e => {
    e.preventDefault();
    const { form } = this.props;

    form.validateFields((error, values) => {
      console.log(values)
      if (!error) {
        fetch(`${API_URL}/administrative/forgotpass/`, {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": '*',
            'database':'india'
          },
          body: JSON.stringify(values)
        }).then(res => res.json()).then((result) => {
          if (result.status) {
              message.success(result.detail);
              this.setState({
                LoginRedirect: true,
            });
          } else {
            message.error(result.detail);
          }
        })
      }
    })
  }

  render() {
    const { form } = this.props;
    const { LoginRedirect } = this.state;
    if(LoginRedirect)
    {
      return <Redirect to='/user/login' />
    }
    return (
      <div>
        <Helmet title="Forgot" />
        <div className={styles.block}>
          <div className="row">
            <div className="col-xl-12">
              <div className={styles.inner}>
                <div className={styles.form}>
                  <h4 className="text-uppercase">
                    <strong>Restore Password</strong>
                  </h4>
                  <br />
                  <Form layout="vertical" hideRequiredMark onSubmit={this.handleSubmit}>
                    <Form.Item label="Username">
                      {form.getFieldDecorator('email', {
                        initialValue: '',
                        rules: [{ required: true, message: 'Please input username or email or phone' }],
                      })(<Input size="default" />)}
                    </Form.Item>
                    <div className="mb-2">
                      <Link to="/user/login" className="utils__link--blue utils__link--underlined">
                        Back to login
                      </Link>
                    </div>
                    <div className="form-actions">
                      <Button
                        type="primary"
                        className="width-150 mr-4"
                        htmlType="submit"
                        loading={false}
                      >
                        Restore Password
                      </Button>

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
