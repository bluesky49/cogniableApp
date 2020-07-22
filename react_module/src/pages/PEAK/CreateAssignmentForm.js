/* eslint-disable no-shadow */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import { Form, Input, DatePicker, Select, Button, notification } from 'antd'
import './form.scss'
import gql from 'graphql-tag'
import { useMutation } from 'react-apollo'
import moment from 'moment'

const { TextArea } = Input
const { Option } = Select

const CREATE_PEAK = gql`
  mutation($studentId: ID!, $title: String!, $category: String!, $note: String, $date: Date!) {
    peakCreateProgram(
      input: { student: $studentId, title: $title, category: $category, notes: $note, date: $date }
    ) {
      details {
        id
        title
        category
        notes
        date
      }
    }
  }
`

const CreateAssignmentForm = ({ form, setOpen, PEAK_PROGRAMS }) => {
  const studentId = localStorage.getItem('studentId')
  const [createPeak, { data, error, loading }] = useMutation(CREATE_PEAK, {
    update(cache, { data }) {
      const peakPrograms = cache.readQuery({
        query: PEAK_PROGRAMS,
        variables: {
          studentId,
        },
      })
      console.log('cache', peakPrograms)
      cache.writeQuery({
        query: PEAK_PROGRAMS,
        variables: {
          studentId,
        },
        data: {
          peakPrograms: {
            edges: [{ node: data.peakCreateProgram.details }, ...peakPrograms.peakPrograms.edges],
          },
        },
      })
    },
  })

  useEffect(() => {
    if (data) {
      notification.success({
        message: 'Create new assignment succesfully',
      })
      setOpen(false)
      form.resetFields()
    }
    if (error) {
      notification.error({
        message: 'Create new assignment failed',
      })
    }
  }, [data, error])

  const handleSubmit = e => {
    e.preventDefault()
    form.validateFields((formError, values) => {
      if (!formError) {
        createPeak({
          variables: {
            studentId,
            title: values.title,
            category: values.category,
            note: values.note,
            date: moment(values.date).format('YYYY-MM-DD'),
          },
        })
      }
    })
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Item label="Program Title">
        {form.getFieldDecorator('title', {
          rules: [{ required: true, message: 'Please give the program title' }],
        })(
          <Input
            placeholder="Type the program title"
            size="large"
            style={{ resize: 'none', width: '100%' }}
          />,
        )}
      </Form.Item>
      <Form.Item label="Date">
        {form.getFieldDecorator('date', {
          rules: [{ required: true, message: 'Please select a date' }],
        })(
          <DatePicker
            size="large"
            style={{
              width: '100%',
            }}
          />,
        )}
      </Form.Item>
      <Form.Item label="Category">
        {form.getFieldDecorator('category', {
          rules: [{ required: true, message: 'Please select a category' }],
        })(
          <Select style={{ width: '100%' }} placeholder="Select a category" size="large">
            <Option key="1" value="Direct">
              Direct
            </Option>
            <Option key="2" value="Generalization">
              Generalization
            </Option>
            <Option key="3" value="Transformation">
              Transformation
            </Option>
            <Option key="4" value="Equivalance">
              Equivalance
            </Option>
          </Select>,
        )}
      </Form.Item>

      <Form.Item label="Note">
        {form.getFieldDecorator('note')(
          <TextArea
            placeholder="Take a note"
            style={{ resize: 'none', width: '100%', height: 120 }}
          />,
        )}
      </Form.Item>

      <Button
        htmlType="submit"
        type="primary"
        size="large"
        style={{
          marginLeft: 'auto',
          marginRight: 10,
          marginTop: 15,
          width: '100%',
          backgroundColor: '#0B35B3',
          color: '#fff',
        }}
        loading={loading}
      >
        Create programe
      </Button>
    </Form>
  )
}

export default Form.create()(CreateAssignmentForm)
