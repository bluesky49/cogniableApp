import React, { Component } from 'react'
import { Form, Input, Select, Button, Checkbox } from 'antd'
import { Helmet } from 'react-helmet'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import styles from './style.module.scss'


const { Option } = Select
const API_URL = process.env.REACT_APP_API_URL;

@Form.create()
@connect(({ user }) => ({ user }))
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      countryLoad: false,
      CountryList: [],
      UserContryName: "",
      timezone:null,
      signupredirect:false,
      loginredirect:false
    };

  }

  componentDidMount() {
    fetch(`${API_URL}/school/country_list`, {headers:{ "Accept": "application/json", "Content-Type": "application/json", "database":"india" }})
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            CountryList: result,
            countryLoad: true
          });
        }
      )

    fetch('http://ip-api.com/json')
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            UserContryName: result.country,
            timezone:result.timezone
          });
        }
      )

  }

  SignupRedirct = e => {
    e.preventDefault();
    this.setState({
      signupredirect: true
    });
  }

  onSubmit = event => {
    event.preventDefault()
    const { timezone } = this.state;
    const { form, dispatch } = this.props;
    form.validateFields((error, values) => {
      if (!error) {
        values.timezone = timezone;
        dispatch({
          type: 'user/LOGIN',
          payload: values,
        })
      }
    })
  }


  render() {
    const {  form, user: { loading }, } = this.props;


    const { loginredirect,signupredirect, CountryList, countryLoad, UserContryName } = this.state;

    if(loginredirect)
    {
      return <Redirect to='/master_target' />
    }

    if(signupredirect)
    {
      return <Redirect to='/user/signup' />
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
                    <h4 className="text-uppercase">
                      <strong>Please log in</strong>
                    </h4>
                    <br />
                    <Form layout="vertical" hideRequiredMark onSubmit={this.onSubmit}>
                      <Form.Item label="Email or Username or Phone">
                        {form.getFieldDecorator('username', {
                          rules: [{ required: true, message: 'Please input your Email or Username or Phone' }],
                        })(<Input size="default" placeholder="Provide your Email or Username or Phone" />)}
                      </Form.Item>
                      <Form.Item label="Password">
                        {form.getFieldDecorator('password', {
                          rules: [{ required: true, message: 'Please input your password' }],
                        })(<Input size="default" type="password" placeholder="Provide your Password" />)}
                      </Form.Item>
                      <Form.Item label="Country">
                        {form.getFieldDecorator('country', { rules: [{ required: true, message: 'Please select your country' }] })(
                          <Select
                            id="user-country"
                            showSearch
                            {...countryLoad ? "" : "disabled"}
                            style={{ width: '100%' }}
                            initialValue={UserContryName}
                            placeholder="Select your country"
                            optionFilterProp="children"
                          >
                            {CountryList.map(c =>
                              <Option value={c.id}>{c.name}</Option>
                            )}
                          </Select>
                        )}
                      </Form.Item>
                      <Form.Item>
                        {form.getFieldDecorator('remember', {
                          valuePropName: 'checked',
                          initialValue: true,
                        })(<Checkbox>Remember me</Checkbox>)}
                        <Link
                          to="/user/forgot"
                          className="utils__link--blue utils__link--underlined pull-right"
                        >
                          Forgot password?
                        </Link>
                      </Form.Item>
                      <div className="form-actions">
                        <Button
                          type="primary"
                          className="width-150 mr-4"
                          htmlType="submit"
                          loading={loading}
                        >
                          Login
                        </Button>
                        <span className="ml-3 register-link">
                          <a
                            href="javascript: void(0);"
                            className="text-primary utils__link--underlined"
                            onClick={this.SignupRedirct}
                          >
                            Register
                          </a>{' '}
                        if you don&#39;t have account
                        </span>
                      </div>
                      <div className="form-group">
                        <p>Use another service to Log In</p>
                        <div className="mt-2">
                          <a href="javascript: void(0);" className="btn btn-icon mr-2">
                            <i className="icmn-facebook" />
                          </a>
                          <a href="javascript: void(0);" className="btn btn-icon mr-2">
                            <i className="icmn-google" />
                          </a>
                          <a href="javascript: void(0);" className="btn btn-icon mr-2">
                            <i className="icmn-windows" />
                          </a>
                          <a href="javascript: void(0);" className="btn btn-icon mr-2">
                            <i className="icmn-twitter" />
                          </a>
                        </div>
                      </div>
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
