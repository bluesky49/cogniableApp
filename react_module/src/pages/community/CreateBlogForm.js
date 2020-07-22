import React, { useEffect } from 'react'
import { Form, Input, Select, Button, notification } from 'antd'
import './form.scss'
import { useMutation } from 'react-apollo'
import { CREATE_BLOG, GET_BLOGS } from './query'

const { Option } = Select
const { TextArea } = Input

const BlogForm = ({ form, setOpen, groupId }) => {
  const [createBlog, { data, error, loading }] = useMutation(CREATE_BLOG, {
    update(
      cache,
      {
        data: {
          addCommunityBlogs: { details },
        },
      },
    ) {
      const cacheData = cache.readQuery({ query: GET_BLOGS, variables: { group: groupId } })
      cache.writeQuery({
        query: GET_BLOGS,
        variables: { group: groupId },
        data: {
          communityBlogs: {
            edges: [{ node: details }, ...cacheData.communityBlogs.edges],
          },
        },
      })
    },
  })

  useEffect(() => {
    if (data) {
      notification.success({
        message: 'New blog added sucessfully',
      })
      form.resetFields()
      setOpen(false)
    }
    if (error) {
      notification.error({
        message: 'Opps faild to create blog',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error])

  const handleSubmit = e => {
    e.preventDefault()
    form.validateFields((err, values) => {
      if (!err) {
        createBlog({
          variables: {
            title: values.title,
            category: values.category,
            description: values.content,
            group: groupId,
          },
        })
      }
    })
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Item label="Title">
        {form.getFieldDecorator('title', {
          rules: [{ required: true, message: 'Title is required' }],
        })(<Input size="large" placeholder="Give the blog title" />)}
      </Form.Item>
      <Form.Item label="Catagory">
        {form.getFieldDecorator('category', {
          rules: [{ required: true, message: 'Blog category is required' }],
        })(
          <Select size="large" placeholder="Select a blog catagory">
            <Option key="1" value="Q29tbXVuaXR5R3JvdXBzVHlwZTox">
              Travle
            </Option>
          </Select>,
        )}
      </Form.Item>
      <Form.Item label="Content">
        {form.getFieldDecorator('content', {
          rules: [{ required: true, message: 'Type blog content' }],
        })(<TextArea style={{ height: 150 }} />)}
      </Form.Item>

      <div>
        <Button
          type="primary"
          htmlType="submit"
          style={{
            width: 150,
            height: 45,
            fontSize: '1.3rem',
          }}
          loading={loading}
        >
          Create
        </Button>
      </div>
    </Form>
  )
}

export default Form.create()(BlogForm)
