import React from 'react'
import { Form, Input, Icon, Button, Select, message } from 'antd'
import { Redirect } from 'react-router-dom'

const FormItem = Form.Item
const API_URL = process.env.REACT_APP_API_URL;
const { Option } = Select

class RegisterFormComponent extends React.Component {
  state = {
    confirmDirty: false,
    CountryList:[],
    LoginRedirect:false
  }

  componentDidMount() {
    fetch(`${API_URL}/school/country_list`, {headers:{ "Accept": "application/json", "Content-Type": "application/json", "database":"india" }})
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            CountryList: result
          });
        }
      )
  }

  LoginRedirectFun = e => {
    e.preventDefault();
    this.setState({
      LoginRedirect: true
    });
  }

  handleSubmit = event => {
    event.preventDefault();
    const { form } = this.props;
    const { timezone } = this.state;
    form.validateFields((error, values) => {
      if (!error) {
        values.timezone = timezone;

        console.log(values);

        fetch(`${API_URL}/administrative/sign_up/`, {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": '*',
            'country':values.country
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

  handleConfirmBlur = e => {
    const { value } = e.target
    const { confirmDirty } = this.state
    this.setState({
      confirmDirty: confirmDirty || !!value,
    })
  }


  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!')
    } else {
      callback()
    }
  }

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props
    const { confirmDirty } = this.state
    if (value && confirmDirty) {
      form.validateFields(['confirm'], { force: true })
    }
    callback()
  }

  render() {
    const { form } = this.props;
    const { CountryList, LoginRedirect } = this.state;

    if(LoginRedirect)
    {
      return <Redirect to='/user/login' />
    }
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem>
          {form.getFieldDecorator('school_name', {
            rules: [{ required: true, message: 'Please input your Clinic name!' }],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Please input your Clinic name"
            />,
          )}
        </FormItem>
        <FormItem>
          {form.getFieldDecorator('email', {
            rules: [{ type:"email", required: true, message: 'Please input your email!' }],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Please input your Email"
            />,
          )}
        </FormItem>
        <FormItem>
          {form.getFieldDecorator('country', { rules: [{ required: true, message: 'Please select your country' }] })(
            <Select
              id="user-country"
              showSearch
              style={{ width: '100%' }}
              placeholder="Select your country"
              optionFilterProp="children"
            >
              {CountryList.map(c =>
                <Option value={c.id}>{c.name}</Option>
              )}
            </Select>
          )}
        </FormItem>
        <FormItem>
          {form.getFieldDecorator('no_learner', {
            rules: [{ required: true, message: 'Please input your number of learner!' }],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Please input your number learner"
            />,
          )}
        </FormItem>
        <FormItem>
          {form.getFieldDecorator('password', {
            rules: [
              {
                required: true,
              },
              {
                validator: this.validateToNextPassword,
              },
            ],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="Input your password"
            />,
          )}
        </FormItem>
        <FormItem>
          {form.getFieldDecorator('confirm', {
            rules: [
              {
                required: true,
              },
              {
                validator: this.compareToFirstPassword,
              },
            ],
          })(
            <Input
              type="password"
              onBlur={this.handleConfirmBlur}
              placeholder="Confirm your password"
            />,
          )}
        </FormItem>

        <div className="form-actions">
          <Button type="primary" htmlType="submit" className="login-form-button">
            Sign Up
          </Button>
          <span className="ml-3 pull-right">
            <a
              href="javascript: void(0);"
              className="text-primary utils__link--underlined"
              onClick={this.LoginRedirectFun}
            >
              Login
            </a>{' '}
          </span>
        </div>
      </Form>
    )
  }
}

const RegisterForm = Form.create()(RegisterFormComponent)
export default RegisterForm
