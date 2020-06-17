import React from 'react'
import { Button, Typography, Tooltip } from 'antd'
import { FormOutlined, CopyOutlined } from '@ant-design/icons'
import targetImg1 from './images/motherChild.jpg'

const { Title, Text } = Typography

const TargetCard = ({
  style,
  title,
  setUpdateTargetId,
  id,
  setName,
  setUpdateTargetDrawer,
  setInstr,
  instr,
}) => {
  const onCopyClick = () => {
    setInstr(instr)
    setName(title)
  }

  return (
    <div
      style={{
        display: 'flex',
        background: '#FFFFFF',
        border: '1px solid #E4E9F0',
        boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
        borderRadius: 10,
        padding: '20px',
        ...style,
      }}
    >
      <img
        src={targetImg1}
        alt=""
        style={{
          width: 80,
          height: 60,
          border: '1px solid #E4E9F0',
          boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
          borderRadius: 10,
          marginRight: 25,
        }}
      />
      <div style={{ width: 'calc(100% - 105px)' }}>
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
          <Tooltip placement="topRight" title="Edit">
            <Button
              type="link"
              style={{
                marginLeft: 'auto',
              }}
              onClick={() => {
                setUpdateTargetId(id)
                setUpdateTargetDrawer(true)
              }}
            >
              <FormOutlined style={{ fontSize: 28, color: '#e9e9e9' }} />
            </Button>
          </Tooltip>
          <div
            style={{
              display: 'flex',
            }}
          >
            <Tooltip placement="topRight" title="Duplicate">
              <Button
                type="link"
                style={{
                  marginLeft: 'auto',
                  padding: 0,
                }}
                onClick={onCopyClick}
              >
                <CopyOutlined style={{ fontSize: 28, color: 'green' }} />
              </Button>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TargetCard
