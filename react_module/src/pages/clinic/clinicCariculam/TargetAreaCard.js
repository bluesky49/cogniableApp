import React from 'react'
import { Button, Card, Typography } from 'antd'
import { FormOutlined } from '@ant-design/icons'

const { Title, Text, Paragraph } = Typography

const TargetAreaCard = ({ style, name }) => {
  return (
    <Card
      style={{
        background: '#FFFFFF',
        border: '1px solid #E4E9F0',
        boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
        borderRadius: 10,
        ...style,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: 21,
        }}
      >
        <Title
          style={{
            fontSize: 18,
            lineHeight: '25px',
            margin: 0,
            marginRight: 15,
          }}
        >
          TARGET AREA :
        </Title>
        <Text
          style={{
            fontSize: 18,
            color: '#000',
            lineHeight: '25px',
          }}
        >
          {name}
        </Text>
        <Button style={{ marginLeft: 'auto' }} type="link">
          <FormOutlined style={{ fontSize: 28, color: '#e9e9e9' }} />
        </Button>
      </div>
      <div>
        <Title
          style={{
            fontSize: 18,
            lineHeight: '25px',
            margin: 0,
            marginBottom: 12,
          }}
        >
          DESCRIPTION
        </Title>
        <Paragraph
          style={{
            fontSize: 18,
            lineHeight: '25px',
            color: '#000',
          }}
        >
          Target Area 1 Reference site about Lorem Ipsum, giving information on its origins, as well
          as a random Lipsum generator
        </Paragraph>
      </div>
    </Card>
  )
}

export default TargetAreaCard
