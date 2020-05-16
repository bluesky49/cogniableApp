import React from 'react'
import { Card, Typography } from 'antd'

const { Title } = Typography

const DoaminCard = ({ title, selected, style, handleSelectDomain }) => {
  return (
    <Card
      onClick={handleSelectDomain}
      style={{
        background: selected ? '#E58425' : '#FFF',
        border: '1px solid #E58425',
        boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
        borderRadius: 10,
        height: 70,
        ...style,
      }}
      hoverable
    >
      <Title
        style={{
          color: selected ? '#FFF' : '#E58425',
          fontSize: 18,
          lineHeight: '25px',
        }}
      >
        {title}
      </Title>
    </Card>
  )
}

export default DoaminCard
