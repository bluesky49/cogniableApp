import React, { useEffect } from 'react'
import { Card, Form, Input, Typography, Button, notification } from 'antd'
import { useQuery, useMutation } from 'react-apollo'
import { useSelector } from 'react-redux'
import { GET_COMMENTS, SEND_COMMENT } from './query'

const { Text, Title } = Typography

export default ({ blogId }) => {
  const userId = useSelector(state => state.user.id)

  const { data, error, loading } = useQuery(GET_COMMENTS, {
    variables: {
      blogId,
    },
  })

  return (
    <Card style={{ marginTop: 10, borderRadius: 10 }}>
      <div>
        {loading && 'Loading...'}
        {error && 'Opps their somethins is wrong'}
        {data &&
          data.communityBlogsDetails.comments.edges.map(({ node }) => {
            return (
              <div
                key={node.id}
                style={{
                  padding: 10,
                  borderRadius: 15,
                  // border: "2px solid rgb(11, 53, 179)",
                  display: 'block',
                  maxWidth: '70%',
                  marginTop: 0,
                }}
              >
                <Title style={{ fontSize: 16, margin: 0 }}>{node.user.username}</Title>
                <Text style={{ fontSize: 15, color: '#000' }}>{node.comment}</Text>
              </div>
            )
          })}
      </div>
      <hr />
      <CommentForm blogId={blogId} userId={userId} />
    </Card>
  )
}

const CommentForm = Form.create()(({ form, blogId, userId }) => {
  const [sendComment, { data, loading, error }] = useMutation(SEND_COMMENT, {
    update(
      cache,
      {
        data: {
          communityLikesComments: {
            details: { comments },
          },
        },
      },
    ) {
      cache.writeQuery({
        query: GET_COMMENTS,
        variables: { blogId },
        data: {
          communityBlogsDetails: {
            comments,
          },
        },
      })
    },
  })

  useEffect(() => {
    if (data) {
      notification.success({
        message: 'Comment send sucessfully',
      })
      form.resetFields()
    }
    if (error) {
      notification.error({
        message: 'Opps their is a problem when seding comment',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error])

  const handleSubmit = e => {
    e.preventDefault()
    form.validateFields((err, values) => {
      if (!err) {
        sendComment({
          variables: {
            blogId,
            userId,
            message: values.message,
          },
        })
      }
    })
  }

  return (
    <Form
      style={{
        width: '90%',
        marginLeft: '5%',
        marginRight: '5%',
        display: 'flex',
        justifyContent: 'space-between',
        height: 40,
      }}
      onSubmit={handleSubmit}
    >
      <Form.Item style={{ width: '80%' }}>
        {form.getFieldDecorator('message', {
          rule: [{ required: true, message: 'Type what you wanna say' }],
        })(<Input placeholder="Type your thought" size="large" />)}
      </Form.Item>
      <Button
        type="primary"
        htmlType="submit"
        size="large"
        style={{ width: 150, maxWidth: '15%', background: 'navyblue' }}
        loading={loading}
      >
        Send
      </Button>
    </Form>
  )
})
