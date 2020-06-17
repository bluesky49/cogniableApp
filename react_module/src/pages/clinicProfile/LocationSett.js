/* eslint-disable no-shadow */
import React, { useEffect, useState } from 'react'
import { List, Button, Skeleton, Card, Input, notification, Typography, Modal } from 'antd'
import './form.css'
import gql from 'graphql-tag'
import { useQuery, useMutation } from 'react-apollo'

const { Text } = Typography

const SCHOOL_LOCARIONS = gql`
  query {
    schoolLocation {
      edges {
        node {
          id
          location
          isActive
        }
      }
    }
  }
`

const CREATE_LOCATION = gql`
  mutation clinicLocation($location: String!) {
    clinicLocation(input: { location: $location }) {
      location {
        id
        location
        isActive
      }
      __typename
    }
  }
`

const UPDATE_LOCATION = gql`
  mutation($id: ID!, $location: String!) {
    updateLocation(input: { id: $id, location: $location }) {
      location {
        id
        location
      }
    }
  }
`

const Location = () => {
  const { data, loading, error } = useQuery(SCHOOL_LOCARIONS)
  const [newLocationName, setNewLocationName] = useState('')
  const [updateLocationModal, setUpdateLocationModal] = useState(false)
  const [updateLocationId, setUpdateLocationId] = useState()
  const [updateLocationName, setUpdateLocationName] = useState()

  const [
    createLocation,
    { data: createLocationData, error: createLoactionError, loading: createLocationLoading },
  ] = useMutation(CREATE_LOCATION, {
    variables: {
      location: newLocationName,
    },
    update(cache, { data }) {
      console.log('data', data)
      const schoolLocation = cache.readQuery({ query: SCHOOL_LOCARIONS })
      console.log(schoolLocation)
      cache.writeQuery({
        query: SCHOOL_LOCARIONS,
        data: {
          schoolLocation: {
            edges: [{ node: data.clinicLocation.location }, ...schoolLocation.schoolLocation.edges],
          },
        },
      })
    },
  })

  const [
    updateLocation,
    { data: updateLocationData, error: updateLoactionError, loading: updateLocationLoading },
  ] = useMutation(UPDATE_LOCATION)

  useEffect(() => {
    if (error) {
      notification.error({
        message: 'Location data loading faild',
      })
    }
  }, [error])

  useEffect(() => {
    if (createLocationData) {
      setNewLocationName('')
      notification.success({
        message: 'New location created sucessfully',
      })
    }
    if (createLoactionError) {
      notification.error({
        message: 'New location create failed',
      })
    }
  }, [createLocationData, createLoactionError])

  useEffect(() => {
    if (updateLocationData) {
      notification.success({
        message: 'Location update sucessfully',
      })
      setUpdateLocationModal(false)
      setUpdateLocationId(null)
      setUpdateLocationName(null)
    }
    if (updateLoactionError) {
      notification.error({
        message: updateLoactionError.message,
      })
    }
  }, [updateLocationData, updateLoactionError])

  const handleSubmit = () => {
    if (newLocationName.length > 0) {
      createLocation()
    } else {
      notification.info({
        message: 'Please type the location address',
      })
    }
  }

  return (
    <div style={{ paddingTop: 45 }}>
      <Text style={{ fontSize: 20, fontWeight: 600 }}>Add new location</Text>

      <div style={{ marginTop: 15 }}>
        <Input
          style={{ width: '85%', height: 45 }}
          size="large"
          placeholder="Type new location name"
          value={newLocationName}
          onChange={e => setNewLocationName(e.target.value)}
        />
        <Button
          type="primary"
          style={{
            background: '#0B35B3',
            borderRadius: 4,
            marginLeft: 18,
            height: 45,
            width: 'calc(100% - (85% + 18px))',
          }}
          onClick={handleSubmit}
          size="large"
          loading={createLocationLoading}
        >
          Save
        </Button>
      </div>

      <Card style={{ marginTop: 20 }}>
        <List
          style={{ minHeight: 150 }}
          className="demo-loadmore-list"
          loading={loading}
          itemLayout="horizontal"
          dataSource={data?.schoolLocation.edges}
          renderItem={item => (
            <List.Item
              key={item.node.id}
              actions={[
                <Button
                  key="list-loadmore-edit"
                  onClick={() => {
                    setUpdateLocationModal(true)
                    setUpdateLocationId(item.node.id)
                    setUpdateLocationName(item.node.location)
                  }}
                >
                  edit
                </Button>,
              ]}
            >
              <Skeleton avatar title={false} loading={loading} active>
                <List.Item.Meta title={<a href="https://ant.design">{item.node.location}</a>} />
              </Skeleton>
            </List.Item>
          )}
        />
      </Card>

      <Modal
        visible={updateLocationModal}
        onCancel={() => {
          setUpdateLocationModal(false)
          setUpdateLocationName(null)
        }}
        title="Update Location"
        width={400}
        footer={
          <div>
            <Button
              type="primary"
              onClick={() => {
                updateLocation({
                  variables: {
                    id: updateLocationId,
                    location: updateLocationName,
                  },
                })
              }}
              loading={updateLocationLoading}
            >
              Create
            </Button>
          </div>
        }
      >
        <div>
          <Input
            size="large"
            value={updateLocationName}
            onChange={e => setUpdateLocationName(e.target.value)}
            placeholder="Give location address"
          />
        </div>
      </Modal>
    </div>
  )
}

export default Location
