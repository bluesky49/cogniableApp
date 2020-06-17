/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState, useEffect } from 'react'
import { Typography, Button, Input, Modal, notification, Tooltip } from 'antd'
import { FormOutlined } from '@ant-design/icons'
import { useMutation } from 'react-apollo'
import gql from 'graphql-tag'

const { Title } = Typography

const UPDATE_DOMAIN = gql`
  mutation updateDomain($domainId: ID!, $domainName: String!) {
    updateDomain(input: { pk: $domainId, domainName: $domainName }) {
      details {
        id
        domain
      }
    }
  }
`

const DoaminCard = ({
  title,
  selected,
  style,
  handleSelectDomain,
  id,
  targetAreas,
  setUpdateDomain,
}) => {
  const [updateModel, setUpdateModel] = useState(false)
  const [updateTitle, setUpdateTitle] = useState(title)
  const [
    updateDomain,
    { data: updateDomianData, error: updateDomainError, loading: updateDomainLoading },
  ] = useMutation(UPDATE_DOMAIN, {
    variables: {
      domainId: id,
      domainName: updateTitle,
      targetAreas,
    },
  })

  useEffect(() => {
    if (updateDomianData) {
      notification.success({
        message: 'Update Domain Successfully',
      })
      setUpdateModel(false)
      setUpdateDomain(updateDomianData.updateDomain.details)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateDomianData])

  useEffect(() => {
    if (updateDomainError) {
      notification.error({
        message: 'Update Domain Error',
      })
    }
  }, [updateDomainError])

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <div
      onClick={handleSelectDomain}
      style={{
        background: selected ? '#E58425' : '#FFF',
        border: '1px solid #E58425',
        boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
        cursor: 'pointer',
        padding: 18,
        borderRadius: 10,
        height: 70,
        display: 'flex',
        alignItems: 'center',
        ...style,
      }}
    >
      <Title
        style={{
          color: selected ? '#FFF' : '#E58425',
          fontSize: 18,
          lineHeight: '25px',
          display: 'inline',
          margin: 0,
        }}
      >
        {title}
      </Title>
      <Tooltip placement="topRight" title="Edit">
        <Button
          type="link"
          style={{ marginLeft: 'auto', marginTop: 8 }}
          onClick={() => setUpdateModel(true)}
        >
          <FormOutlined style={{ fontSize: 24, color: 'rgb(233, 233, 233)' }} />
        </Button>
      </Tooltip>
      <Modal
        visible={updateModel}
        onCancel={() => setUpdateModel(false)}
        title="Update Domain"
        footer={[
          <Button
            key="submit"
            type="primary"
            onClick={() => {
              updateDomain()
            }}
            loading={updateDomainLoading}
          >
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
          <Input value={updateTitle} onChange={e => setUpdateTitle(e.target.value)} size="large" />
        </div>
      </Modal>
    </div>
  )
}

export default DoaminCard
