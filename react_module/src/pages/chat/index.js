/* eslint-disable no-shadow */
import React, { useState, useEffect } from 'react'
import { Row, Col, Typography, notification } from 'antd'
import { useQuery, useLazyQuery } from 'react-apollo'
import profileImg from 'images/student.jpg'
import Scrollbars from 'react-custom-scrollbars'
import { GET_STUDENT, GET_STAFF } from './query'
import ChatUserCard from './ChatUserCard'
import MessageView from './MessageView'

const { Title, Text } = Typography

export default () => {
  const [selectedPeople, setSelectedPeople] = useState()

  // const [
  //   getClinic,
  //   {
  //     data: clinic,
  //     error: clinicError,
  //     loading: clinicLoading
  //   }
  // ] = useLazyQuery()

  const { data: student, error: studentError, loading: studentLoading } = useQuery(GET_STUDENT)

  const { data: staff, error: staffError, loading: staffLoading } = useQuery(GET_STAFF)

  useEffect(() => {
    if (studentError) {
      notification.success({
        message: 'Error to load student',
      })
    }
    if (staffError) {
      notification.error({
        message: 'Error to load staff',
      })
    }
  })

  return (
    <div
      style={{
        maxWidth: 1300,
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '100%',
        height: 'calc(100vh - 100px)',
      }}
    >
      <Row gutter={[77, 0]} style={{ height: '100%' }}>
        <Col span={8}>
          <div
            style={{
              borderRadius: 10,
              background: '#F9F9F9',
              padding: 25,
            }}
          >
            {staffLoading && studentLoading && <Text>Loading...</Text>}
            <Scrollbars style={{ height: 'calc(100vh - 150px)' }} autoHide>
              {student?.students.edges.map(({ node }, index) => {
                return (
                  <div key={node.id} style={{ marginTop: index !== 0 ? 18 : 0 }}>
                    <ChatUserCard
                      profileImg={profileImg}
                      name={node.firstname}
                      // eslint-disable-next-line jsx-a11y/aria-role
                      role="Student"
                      selected={selectedPeople === node.parent?.id}
                      setSelectedPeople={setSelectedPeople}
                      id={node.parent?.id}
                    />
                  </div>
                )
              })}
              {staff?.staffs.edges.map(({ node }) => {
                return (
                  <div key={node.id} style={{ marginTop: 18 }}>
                    <ChatUserCard
                      profileImg={profileImg}
                      name={node.name}
                      // eslint-disable-next-line jsx-a11y/aria-role
                      role="Therapist"
                      selected={selectedPeople === node.user.id}
                      setSelectedPeople={setSelectedPeople}
                      id={node.user.id}
                    />
                  </div>
                )
              })}
            </Scrollbars>
          </div>
        </Col>
        <Col span={16} style={{ position: 'relative', height: '100%' }}>
          <div
            style={{
              height: '100%',
              width: '100%',
            }}
          >
            {selectedPeople ? (
              <MessageView secondUser={selectedPeople} style={{ height: '100%' }} />
            ) : (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                }}
              >
                <Title>Select With whome you wanna Talk</Title>
              </div>
            )}
          </div>
        </Col>
      </Row>
    </div>
  )
}
