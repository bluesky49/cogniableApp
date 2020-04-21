import React, { Component } from 'react'
import { Form, Input, Select, Button } from 'antd'
import { Helmet } from 'react-helmet'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import {
  UserOutlined,
  KeyOutlined,
  ArrowRightOutlined,
  PhoneOutlined,
  GoogleOutlined,
  SecurityScanOutlined,
} from '@ant-design/icons'
import client from '../../../config'
import styles from './style.module.scss'

const { Option } = Select
// const API_URL = process.env.REACT_APP_API_URL;

@Form.create()
@connect(({ user }) => ({ user }))
class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      countryLoad: false,
      CountryList: [],
      // UserContryName: '',
      // timezone: null,
      signupredirect: false,
      loginredirect: false,
    }
  }

  componentDidMount() {
    const query = `query {
      country {
        edges {
          node {
            id
            name
          }
      }
    }
    }`

    client.request(query).then(data => {
      this.setState({
        CountryList: data.country.edges,
        countryLoad: true,
      })
    })
    // fetch(`${API_URL}/school/country_list`, {headers:{ "Accept": "application/json", "Content-Type": "application/json", "database":"india" }})
    //   .then(res => res.json())
    //   .then(
    //     (result) => {
    //       this.setState({
    //         CountryList: result,
    //         countryLoad: true
    //       });
    //     }
    //   )

    // fetch('http://ip-api.com/json')
    //   .then(res => res.json())
    //   .then(result => {
    //     this.setState({
    //       UserContryName: result.country,
    //       timezone: result.timezone,
    //     })
    //   })
  }

  SignupRedirct = e => {
    e.preventDefault()
    this.setState({
      signupredirect: true,
    })
  }

  onSubmit = event => {
    event.preventDefault()
    // const { timezone } = this.state
    const { form, dispatch } = this.props
    form.validateFields((error, values) => {
      if (!error) {
        // values.timezone = timezone
        dispatch({
          type: 'user/LOGIN',
          payload: values,
        })
      }
    })
  }

  render() {
    const {
      form,
      user: { loading },
    } = this.props

    const { loginredirect, signupredirect, CountryList, countryLoad, UserContryName } = this.state

    if (loginredirect) {
      return <Redirect to="/master_target" />
    }

    if (signupredirect) {
      return <Redirect to="/user/signup" />
    }

    return (
      <>
        <div>
          <Helmet title="Login" />
          <div className={styles.block}>
            <div className="row">
              <div className="col-xl-12">
                <div className={styles.inner}>
                  <div className={styles.form}>
                    <h4 className="text-uppercase" align="center">
                      <strong>SIGN IN</strong>
                    </h4>
                    <br />
                    <Form layout="vertical" hideRequiredMark onSubmit={this.onSubmit}>
                      <Form.Item>
                        {form.getFieldDecorator('username', {
                          rules: [{ required: true, message: 'Please input your Email' }],
                        })(
                          <Input
                            size="large"
                            placeholder="Email"
                            prefix={<UserOutlined className="site-form-item-icon" />}
                          />,
                        )}
                      </Form.Item>
                      <Form.Item>
                        {form.getFieldDecorator('password', {
                          rules: [{ required: true, message: 'Please input your password' }],
                        })(
                          <Input
                            size="large"
                            type="password"
                            prefix={<KeyOutlined className="site-form-item-icon" />}
                            placeholder="Password"
                          />,
                        )}
                      </Form.Item>
                      <p align="center">
                        <Link to="/user/forgot" className="utils__link--blue">
                          {' '}
                          Forgot Password
                        </Link>
                      </p>
                      <Form.Item>
                        <Button type="primary" htmlType="submit" size="large" block>
                          SIGN IN
                          <ArrowRightOutlined className="site-form-item-icon" />
                        </Button>
                        <p align="center" className="mt-2">
                          <SecurityScanOutlined
                            style={{ fontSize: '14px' }}
                            className="site-form-item-icon"
                          />{' '}
                          Your Information is safe with us
                        </p>
                      </Form.Item>
                      <div className="form-group">
                        <div className="mt-2">
                          <Link to="/user/phone">
                            <Button size="large" className="width-50p">
                              <PhoneOutlined rotate="100" className="site-form-item-icon" />
                              Phone
                            </Button>
                          </Link>
                          <Button size="large" className="width-50p">
                            <GoogleOutlined className="site-form-item-icon" />
                            Google
                          </Button>
                        </div>
                      </div>
                      <p align="center">
                        Need help?
                        <text className="utils__link--blue"> Contact Us</text>
                      </p>
                    </Form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default Login
