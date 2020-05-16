import React from 'react'
import { Steps, Form, Button, Upload, message, Table, Tag } from 'antd'
import { InboxOutlined } from '@ant-design/icons'

const { Column } = Table
const data = [
  {
    key: '1',
    firstName: 'John',
    lastName: 'Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    firstName: 'Jim',
    lastName: 'Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    firstName: 'Joe',
    lastName: 'Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
]

const { Step } = Steps

const steps = [
  {
    title: 'Download Template',
    content: `hello`,
  },
  {
    title: 'Upload Template',
    content: 'Second-content',
  },
  {
    title: 'Result',
    content: 'Last-content',
  },
]

const normFile = e => {
  console.log('Upload event:', e)
  if (Array.isArray(e)) {
    return e
  }
  return e && e.fileList
}

class ExcelUpload extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      current: 0,
      first: true,
      second: false,
      third: false,
    }
  }

  next(pre) {
    const current = pre + 1
    if (current === 0) {
      this.setState({ current, second: false, first: true, third: false })
    }
    if (current === 1) {
      this.setState({ current, second: true, first: false, third: false })
    }
    if (current === 2) {
      this.setState({ current, second: false, first: false, third: true })
    }
  }

  prev(pre) {
    const current = pre - 1
    if (current === 0) {
      this.setState({ current, second: false, first: true, third: false })
    }
    if (current === 1) {
      this.setState({ current, second: true, first: false, third: false })
    }
    if (current === 2) {
      this.setState({ current, second: false, first: false, third: true })
    }
  }

  render() {
    const { current, first, second, third } = this.state

    return (
      <div>
        <Steps current={current}>
          {steps.map(item => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
        <div
          className="steps-content"
          style={{
            marginTop: '16px',
            borderRadius: '2px',
            backgroundColor: '#fafafa',
            minHeight: '200px',
            textAlign: 'center',
            paddingTop: '80px',
          }}
        >
          {first ? (
            <div>
              For download the excel template for adding bulk learners into the system please click
              on{' '}
              <a href="#" style={{ color: 'blue' }}>
                download.
              </a>{' '}
            </div>
          ) : (
            ''
          )}
          {second ? (
            <div>
              <Form.Item
                name="dragger"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                noStyle
              >
                <Upload.Dragger name="files" action="/upload.do">
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Click or drag Excel Template to this area to upload
                  </p>
                  <p className="ant-upload-hint">Support for a single or bulk upload.</p>
                </Upload.Dragger>
              </Form.Item>
            </div>
          ) : (
            ''
          )}
          {third ? (
            <div>
              <Table dataSource={data}>
                <Column title="First Name" dataIndex="firstName" key="firstName" />
                <Column title="Last Name" dataIndex="lastName" key="lastName" />

                <Column title="Age" dataIndex="age" key="age" />
                <Column title="Address" dataIndex="address" key="address" />
                <Column
                  title="Tags"
                  dataIndex="tags"
                  key="tags"
                  render={tags => (
                    <span>
                      {tags.map(tag => (
                        <Tag color="blue" key={tag}>
                          {tag}
                        </Tag>
                      ))}
                    </span>
                  )}
                />
                <Column
                  title="Action"
                  key="action"
                  render={(text, record) => (
                    <span>
                      <a style={{ marginRight: 16 }}>Invite {record.lastName}</a>
                      <a>Delete</a>
                    </span>
                  )}
                />
              </Table>
            </div>
          ) : (
            ''
          )}
        </div>
        <div className="steps-action" style={{ marginTop: '24px' }}>
          {current < steps.length - 1 && (
            <Button type="primary" onClick={() => this.next(current)}>
              Next
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button type="primary" onClick={() => message.success('Processing complete!')}>
              Done
            </Button>
          )}
          {current > 0 && (
            <Button style={{ marginLeft: 8 }} onClick={() => this.prev(current)}>
              Previous
            </Button>
          )}
        </div>
      </div>
    )
  }
}

export default ExcelUpload
