import React, { useEffect } from 'react'
import { Form, Input, Button, Typography, notification, Tag } from 'antd'
import gql from 'graphql-tag'
import { useQuery, useMutation } from 'react-apollo'

const { Text, Title } = Typography

const CONTACT_DETAILS = gql`
  query {
    schoolDetail {
      id
      schoolName
      address
      email
      contactNo
      country {
        name
      }
    }
  }
`

const UPDATE_CLINIC = gql`
  mutation updateClinic($email: String!, $contactNo: String!, $address: String!) {
    updateClinic(input: { email: $email, contactNo: $contactNo, address: $address }) {
      school {
        id
      }
    }
  }
`

const ContactDetails = ({ form }) => {
  const {
    data: schoolData,
    error: schoolDataError,
    loading: schoolDataLoading,
  } = useQuery(CONTACT_DETAILS, { fetchPolicy: 'no-cache' })

  const [
    updateDetails,
    { data: updateDetailsData, loading: updateDetailsLoading, error: updateDetailsError },
  ] = useMutation(UPDATE_CLINIC)

  const handelSubmit = e => {
    e.preventDefault()
    form.validateFields((error, values) => {
      if (!error) {
        updateDetails({
          variables: {
            email: values.email,
            address: values.address,
            contactNo: values.phone,
          },
        })
      }
    })
  }

  useEffect(() => {
    if (updateDetailsData) {
      notification.success({
        message: 'Contact details updated sucessfully',
      })
    }
    if (updateDetailsError) {
      notification.error({
        message: 'Contact details update Faild',
      })
    }
  })

  return (
    <Form
      style={{
        display: 'flex',
        paddingTop: 35,
      }}
      onSubmit={handelSubmit}
    >
      {schoolDataLoading && 'Loading...'}
      {schoolDataError && 'Opps their something is wrong'}
      {schoolData && (
        <div>
          <div style={{ marginRight: 70 }}>
            <Form.Item style={{ marginBottom: 24 }} label="Address">
              {form.getFieldDecorator('address', {
                initialValue: schoolData.schoolDetail.address,
                rules: [
                  {
                    required: true,
                    message: 'Please give the clinic address!',
                  },
                ],
              })(<Input style={{ width: '300px' }} placeholder="Type clinic address" />)}
            </Form.Item>

            <div label="Country" style={{ marginBottom: 24 }}>
              <Title
                style={{
                  fontSize: 18,
                  fontWeight: 'normal',
                  display: 'inline',
                }}
              >
                Country:&nbsp;
              </Title>
              <Tag>
                <Text style={{ margin: 0, fontSize: 16 }}>
                  {schoolData.schoolDetail.country.name}
                </Text>
              </Tag>
            </div>

            <Form.Item label="Email">
              {form.getFieldDecorator('email', {
                initialValue: schoolData.schoolDetail.email,
                rules: [{ required: true, message: 'Please give the clinic email!' }],
              })(<Input style={{ width: '300px' }} placeholder="Type clinic email" />)}
            </Form.Item>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Form.Item label="Phone Number">
              {form.getFieldDecorator('phone', {
                initialValue: schoolData.schoolDetail.contactNo,
                rules: [{ required: true, message: 'Please give phone number!' }],
              })(<Input style={{ width: '300px' }} placeholder="Type clinic phone number" />)}
            </Form.Item>

            <div style={{ marginTop: 'auto', marginBottom: 20 }}>
              <Button
                type="primary"
                htmlType="submit"
                style={{ height: 40, width: 140 }}
                loading={updateDetailsLoading}
              >
                Save Data
              </Button>
              <Button
                type="danger"
                htmlType="submit"
                style={{ marginLeft: '20px', height: 40, width: 140 }}
                onClick={() => form.resetFields()}
              >
                Reset
              </Button>
            </div>
          </div>
        </div>
      )}
    </Form>
  )
}

export default Form.create()(ContactDetails)
