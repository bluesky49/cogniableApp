import React, { useState } from 'react'
import { Button, Card, Typography, Input, Modal } from 'antd'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import DoaminCard from './DoaminCard'

const { Title } = Typography

const DomainBox = ({ domains, selectDomain, handleSelectDomain }) => {
  const [createDomainModel, setCreateDomainModel] = useState(false)
  const [newDomainName, setNewDomainName] = useState('')

  const handleNewDomainNameChange = e => {
    setNewDomainName(e.target.value)
  }
  const handelCreateDomainModel = () => setCreateDomainModel(state => !state)

  const handelCreateNewDomain = () => {}

  return (
    <Card
      style={{
        background: '#F9F9F9',
        borderRadius: 10,
        minHeight: '65vh',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 26,
        }}
      >
        <Title style={{ fontSize: 24, fontWeight: 'bold', lineHeight: '33px' }}>Domain</Title>
        <Button type="link" onClick={handelCreateDomainModel}>
          <PlusOutlined style={{ fontSize: 24 }} />
        </Button>
      </div>
      <Input
        style={{ height: 40 }}
        suffix={<SearchOutlined style={{ fontSize: 28 }} />}
        placeholder="Search Targets"
      />
      <div style={{ marginTop: 24 }}>
        {domains.map(({ node }, index) => {
          return (
            <DoaminCard
              selected={selectDomain.id === node.id ? true : null}
              title={node.domain}
              handleSelectDomain={handleSelectDomain(node)}
              key={node.id}
              style={{
                marginTop: index === 0 ? 0 : 16,
              }}
            />
          )
        })}
      </div>
      <Modal
        visible={createDomainModel}
        title="Title"
        onCancel={handelCreateDomainModel}
        footer={[
          <Button key="submit" type="primary" onClick={handelCreateNewDomain}>
            Create
          </Button>,
        ]}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            background: '#fff',
          }}
        >
          <Input
            placeholder="Domain Name"
            value={newDomainName}
            onChange={handleNewDomainNameChange}
          />
        </div>
      </Modal>
    </Card>
  )
}

export default DomainBox
