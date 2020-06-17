import React from 'react'
import { Typography, Upload, message, Button } from 'antd'
import { LinkOutlined } from '@ant-design/icons'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo'
import './uploadForm.css'

const { Text } = Typography

const LOGO = gql`
  query {
    schoolDetail {
      logo
    }
  }
`

const props = {
  name: 'file',
  multiple: false,
  action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  headers: {
    authorization: 'authorization-text',
  },
  onChange(info) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList)
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`)
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`)
    }
  },
  style: {
    width: '100%',
  },
  className: 'hello',
}

export default () => {
  const { data, error, loading } = useQuery(LOGO, { fetchPolicy: 'no-cache' })

  return (
    <div style={{ marginTop: 45 }}>
      {loading && 'Loading...'}
      {error && <pre>{JSON.stringify(error, null, 2)}</pre>}
      {data && (
        <div>
          <img
            style={{
              width: 200,
              height: 200,
              borderRadius: 8,
              display: 'block',
              border: '1px solid gray',
            }}
            src={`https://development.cogniable.us/media/${data.schoolDetail.logo}`}
            alt="logo"
          />

          <div style={{ marginTop: 37, width: '100%' }}>
            <Text style={{ fontSize: 20, fontWeight: 600 }}>Change Logo</Text>

            <div
              style={{
                display: 'flex',
                marginTop: 22,
                width: '100%',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  marginRight: 18,
                  background: '#FFFFFF',
                  border: '1.25px solid #D5D5D5',
                  borderRadius: 4,
                  width: '80%',
                }}
              >
                <Upload {...props}>
                  <Text style={{ fontSize: 16 }}>Browse Logo</Text>
                  <Button type="link" style={{ marginLeft: 'auto' }}>
                    <LinkOutlined style={{ fontSize: 24, marginTop: 5, color: '#000' }} />
                  </Button>
                </Upload>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
