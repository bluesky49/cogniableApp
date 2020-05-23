import React, { useEffect } from 'react'
import { Form, Input, Button, notification } from 'antd'
import gql from 'graphql-tag'
import { useMutation } from 'react-apollo'
import './targetFrom.scss'

const CREATE_TARGET = gql`
  mutation masterTarget(
    $domainId: ID!
    $targetAreaId: ID!
    $targetname: String!
    $targetInstr: String!
  ) {
    masterTarget(
      input: {
        domainId: $domainId
        targetAreaId: $targetAreaId
        targetName: $targetname
        targetInstr: $targetInstr
      }
    ) {
      target {
        id
        targetInstr
        targetMain {
          targetName
        }
      }
    }
  }
`

const TargetForm = ({ domainId, targetAreaId, form, setNewTarget, handelNewTargetDrawer }) => {
  const [createTarget, { data, loading, error }] = useMutation(CREATE_TARGET)

  useEffect(() => {
    if (data) {
      notification.success({
        message: 'Clinic Cariculam',
        description: 'New Target Added Successfully',
      })
      setNewTarget({ node: data.masterTarget.target })
      form.resetFields()
      handelNewTargetDrawer()
    }
  }, [data])

  useEffect(() => {
    if (error) {
      notification.error({
        message: 'Somthing want wrong',
        description: error.message,
      })
    }
  }, [error])

  const handleSubmit = e => {
    e.preventDefault()
    // eslint-disable-next-line no-shadow
    form.validateFields((error, value) => {
      if (!error) {
        createTarget({
          variables: {
            domainId,
            targetAreaId,
            targetname: value.targetname,
            targetInstr: value.targetInstr,
          },
        })
      }
    })
  }

  return (
    <Form name="targetForm" onSubmit={handleSubmit}>
      <Form.Item label="Target Name">
        {form.getFieldDecorator('targetname', {
          rules: [{ required: true, message: 'Please enter Target Name' }],
        })(<Input placeholder="Target Name" size="large" />)}
      </Form.Item>

      <Form.Item label="Target Instration">
        {form.getFieldDecorator('targetInstr', {
          rules: [{ required: true, message: 'Please enter Target Instration!' }],
        })(<Input placeholder="Target Instration" size="large" />)}
      </Form.Item>

      <Button
        type="primary"
        htmlType="submit"
        loading={loading}
        style={{ marginTop: 15, fontSize: 16, width: '100%', height: 40 }}
      >
        Create Target
      </Button>
    </Form>
  )
}

export default Form.create()(TargetForm)
