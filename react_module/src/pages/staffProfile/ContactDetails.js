import React, { useEffect } from 'react'
import { Form, Input, Button, notification } from 'antd'
import gql from 'graphql-tag'
import { useQuery, useMutation } from 'react-apollo'
import { useSelector } from 'react-redux'

const CONTACT_DETAILS = gql`
  query($id: ID!) {
    staffs(user: $id) {
      edges {
        node {
          email
          id
          contactNo
        }
      }
    }
  }
`

const UPDATE_CLINIC = gql`
  mutation UpdateStaff($id: ID!, $email: String, $mobile: String) {
    updateStaff(input: { staffData: { id: $id, email: $email, mobile: $mobile } }) {
      staff {
        id
        email
        contactNo
      }
    }
  }
`

const ContactDetails = ({ form }) => {
  const user = useSelector(state => state.user)
  const {
    data: schoolData,
    error: schoolDataError,
    loading: schoolDataLoading,
  } = useQuery(CONTACT_DETAILS, { fetchPolicy: 'no-cache', variables: { id: user.id } })

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
            id: schoolData.staffs.edges[0].node.id,
            email: values.email,
            mobile: values.phone,
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
            <Form.Item label="Email">
              {form.getFieldDecorator('email', {
                initialValue: schoolData.staffs.edges[0].node.email,
                rules: [{ required: true, message: 'Please give the clinic email!' }],
              })(<Input style={{ width: '300px' }} placeholder="Type clinic email" />)}
            </Form.Item>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Form.Item label="Phone Number">
              {form.getFieldDecorator('phone', {
                initialValue: schoolData.staffs.edges[0].node.contactNo,
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
