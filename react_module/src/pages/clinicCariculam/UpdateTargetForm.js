/* eslint-disable react/jsx-closing-tag-location */
import React, { useEffect } from 'react'
import { Form, Input, Button, notification } from 'antd'
import gql from 'graphql-tag'
import { useMutation, useQuery } from 'react-apollo'
import './targetFrom.scss'

const TARGET_QUERY = gql`
  query target($targetAreaId: ID!, $id: ID!) {
    target(targetArea: $targetAreaId, id: $id) {
      edges {
        node {
          id
          targetInstr
          targetMain {
            targetName
          }
        }
      }
    }
  }
`

const UPDATE_TARGET = gql`
  mutation updateMasterTarget(
    $targetId: ID!
    $domainId: ID!
    $targetAreaId: ID!
    $targetName: String!
    $targetInstr: String!
  ) {
    updateMasterTarget(
      input: {
        pk: $targetId
        domainId: $domainId
        targetAreaId: $targetAreaId
        targetName: $targetName
        targetInstr: $targetInstr
      }
    ) {
      details {
        id
        targetInstr
        domain {
          id
          domain
        }
        targetArea {
          id
          Area
        }
        targetMain {
          id
          targetName
        }
      }
    }
  }
`

const TargetForm = ({ targetId, form, targetAreaId, handleUpdateTargetDrawer, domainId }) => {
  const { data, loading, error } = useQuery(TARGET_QUERY, {
    variables: {
      targetAreaId,
      id: targetId,
    },
  })

  const [
    updateTarget,
    { data: updateTargetData, error: updateTargetError, loading: updateTargetLoading },
  ] = useMutation(UPDATE_TARGET)

  useEffect(() => {
    if (updateTargetData) {
      notification.success({
        message: 'Clinic Cariculam',
        description: 'Target Updated Added Successfully',
      })
      form.resetFields()
      handleUpdateTargetDrawer(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateTargetData])

  useEffect(() => {
    if (updateTargetError) {
      notification.error({
        message: 'Somthing want wrong',
        description: updateTargetError.message,
      })
    }
  }, [updateTargetError])

  const handleSubmit = e => {
    e.preventDefault()
    // eslint-disable-next-line no-shadow
    form.validateFields((error, value) => {
      if (!error) {
        updateTarget({
          variables: {
            targetId,
            domainId,
            targetAreaId,
            targetName: value.targetname,
            targetInstr: value.targetInstr,
          },
        })
      }
    })
  }

  return (
    <div>
      {loading ? (
        'Loading...'
      ) : (
        <div>
          {error && 'opps their something wrong'}
          {data && (
            <Form name="targetForm" onSubmit={handleSubmit}>
              <Form.Item label="Target Name">
                {form.getFieldDecorator('targetname', {
                  initialValue: data.target.edges[0].node.targetMain.targetName,
                  rules: [{ required: true, message: 'Please enter Target Name' }],
                })(<Input placeholder="Target Name" size="large" />)}
              </Form.Item>

              <Form.Item label="Target Instration">
                {form.getFieldDecorator('targetInstr', {
                  initialValue: data.target.edges[0].node.targetInstr,
                  rules: [
                    {
                      required: true,
                      message: 'Please enter Target Instration!',
                    },
                  ],
                })(<Input placeholder="Target Instration" size="large" />)}
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                loading={updateTargetLoading}
                style={{
                  marginTop: 15,
                  fontSize: 16,
                  width: '100%',
                  height: 40,
                }}
              >
                Update Target
              </Button>
            </Form>
          )}
        </div>
      )}
    </div>
  )
}

export default Form.create()(TargetForm)
