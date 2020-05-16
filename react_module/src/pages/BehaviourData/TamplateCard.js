import React, { useEffect } from 'react'
import { Typography, Button } from 'antd'
import recordIcon from 'icons/racord.png'

const { Title, Text } = Typography

const TampletCard = ({
  style,
  behaviourName,
  description,
  status,
  envsNum,
  setNewRecordDrawer,
}) => {
  return (
    <div
      style={{
        padding: '13px 20px',
        background: '#FFFFFF',
        border: '1px solid #E4E9F0',
        boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
        borderRadius: 10,
        ...style,
      }}
    >
      <Title
        style={{
          fontSize: 18,
          lineHeight: '25px',
          textTransform: 'capitalize',
          margin: 0,
        }}
      >
        {behaviourName}
      </Title>
      <Text
        style={{
          marginTop: 4,
          fontSize: 16,
          lineHeight: '26px',
          color: 'rgba(0, 0, 0, 0.3)',
        }}
      >
        {description}
      </Text>
      <Text
        style={{
          fontSize: 16,
          lineHeight: '26px',
          color: '#000',
          display: 'block',
          margin: 0,
        }}
      >
        {status} . {envsNum} Environments
      </Text>
      <hr style={{ margin: '26px 0 0' }} />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Button
          type="link"
          style={{
            fontSize: 14,
            lineHeight: '19px',
            color: '#0B35B3',
            padding: '12px 0 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}
        >
          Behaviour Graph
        </Button>
        <Button
          type="link"
          style={{
            fontSize: 14,
            lineHeight: '19px',
            color: '#D81E06',
            padding: '12px 0 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
          onClick={() => {
            setNewRecordDrawer(true)
          }}
        >
          <img
            src={recordIcon}
            style={{
              width: 24,
              height: 24,
              marginRight: 7,
            }}
            alt=""
          />
          Press to Record
        </Button>
      </div>
    </div>
  )
}

export default TampletCard
