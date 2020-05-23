import React, { useState, useEffect } from 'react'
import { Button, Card, Typography, Input, Modal, Select, notification } from 'antd'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import Scrollbars from 'react-custom-scrollbars'
import gql from 'graphql-tag'
import { useMutation, useLazyQuery } from 'react-apollo'
import DoaminCard from './DoaminCard'

const { Title, Text } = Typography
const { Option } = Select

const CREATE_DOMAIN = gql`
  mutation domainProgram($label: String!, $key: String!, $programArea: ID!) {
    domainProgram(input: { programArea: $programArea, key: $key, label: $label }) {
      domain {
        id
        domain
      }
    }
  }
`

const FILTER_DOMAIN = gql`
  query($text: String!) {
    domain(domain_Icontains: $text) {
      edges {
        node {
          id
          domain
          targetArea {
            edges {
              node {
                id
                Area
              }
            }
          }
        }
      }
    }
  }
`

// TODO
// take text input vlaue

const DomainBox = ({ domains, selectDomain, handleSelectDomain, programArea }) => {
  const [liveDomains, setLiveDomains] = useState(domains)
  const [createDomainModel, setCreateDomainModel] = useState(false)
  const [searchText, setSearchText] = useState()
  const [newDomainName, setNewDomainName] = useState('')
  const [key, setKey] = useState('mand1')

  const [filterDomain, { data: filterDomainData, loading: filterDomainLoading }] = useLazyQuery(
    FILTER_DOMAIN,
    {
      variables: {
        text: searchText,
      },
    },
  )

  const [createDomain, { data: createDomainData, error: createDomainError }] = useMutation(
    CREATE_DOMAIN,
    {
      variables: {
        label: key !== 'mand1' ? 'mand1' : newDomainName,
        key,
        programArea,
      },
    },
  )

  const handleNewDomainNameChange = value => {
    setNewDomainName(value)
  }

  const handelCreateDomainModel = () => setCreateDomainModel(state => !state)

  const handelCreateNewDomain = () => {
    createDomain()
  }

  useEffect(() => {
    if (filterDomainData) {
      setLiveDomains(filterDomainData.domain.edges)
    } else {
      setLiveDomains(domains)
    }
  }, [domains, filterDomainData])

  useEffect(() => {
    if (searchText) {
      filterDomain()
    }
  }, [filterDomain, searchText])

  useEffect(() => {
    if (createDomainData) {
      notification.success({
        message: 'Meal Data',
        description: 'Updated Meal Successfully',
      })
      setNewDomainName('')
      setCreateDomainModel(false)
    }
  }, [createDomainData])

  useEffect(() => {
    if (createDomainError) {
      notification.error({
        message: 'Somthing want wrong',
        description: createDomainError,
      })
    }
  }, [createDomainError])

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
        value={searchText}
        onChange={e => setSearchText(e.target.value)}
      />
      {filterDomainLoading && <Text style={{ marginTop: 24 }}>Loading...</Text>}
      <Scrollbars style={{ marginTop: 24, height: 'calc(100vh - 435px)' }}>
        {liveDomains.map(({ node }, index) => {
          return (
            <DoaminCard
              selected={selectDomain.id === node.id ? true : null}
              title={node.domain}
              handleSelectDomain={handleSelectDomain(node)}
              key={node.id}
              style={{
                margin: '0 20px 0 0',
                marginTop: index === 0 ? 0 : 16,
              }}
            />
          )
        })}
      </Scrollbars>
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
          <Select
            placeholder="Domain Name"
            onChange={value => setKey(value)}
            showSearch
            optionFilterProp="name"
            onSearch={handleNewDomainNameChange}
            style={{
              width: 300,
              marginLeft: 'auto',
              marginRight: 'auto',
              display: 'block',
            }}
            size="large"
          >
            {domains.map(({ node }) => {
              return (
                <Option value={node.id} name={node.domain}>
                  {node.domain}
                </Option>
              )
            })}
          </Select>
        </div>
      </Modal>
    </Card>
  )
}

export default DomainBox