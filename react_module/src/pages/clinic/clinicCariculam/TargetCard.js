import React from 'react'
import { Button, Typography } from 'antd'
import { FormOutlined, CopyOutlined } from '@ant-design/icons'
import targetImg1 from './images/motherChild.jpg'

const { Title, Text } = Typography

const TargetCard = ({ style, title }) => {
  return (
    <div
      style={{
        display: 'flex',
        background: '#FFFFFF',
        border: '1px solid #E4E9F0',
        boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
        borderRadius: 10,
        padding: '32px 20px',
        ...style,
      }}
    >
      <img
        src={targetImg1}
        alt=""
        style={{
          width: 150,
          height: 120,
          border: '1px solid #E4E9F0',
          boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
          borderRadius: 10,
          marginRight: 25,
        }}
      />
      <div style={{ width: 'calc(100% - 175px)' }}>
        <div
          style={{
            display: 'flex',
            paddingTop: 20,
          }}
        >
          <Title
            style={{
              fontSize: 18,
              lineHeight: '25px',
              margin: 0,
              width: '70%',
              marginBottom: 16,
            }}
          >
            {title}
          </Title>
          <Button
            type="link"
            style={{
              marginLeft: 'auto',
            }}
          >
            <FormOutlined style={{ fontSize: 28, color: '#e9e9e9' }} />
          </Button>
        </div>
        <div
          style={{
            display: 'flex',
          }}
        >
          <Text
            style={{
              fontSize: 16,
              lineHeight: '22px',
              marginRight: 25,
              color: '#000',
            }}
          >
            Receptive Language
          </Text>
          <span
            style={{
              fontWeight: 600,
              fontSize: 14,
              lineHeight: '19px',
              color: '#D4237A',
            }}
          >
            in therapy
          </span>
          <Button
            type="link"
            style={{
              marginLeft: 'auto',
              padding: 0,
            }}
          >
            <CopyOutlined style={{ fontSize: 28, color: 'green' }} />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default TargetCard
