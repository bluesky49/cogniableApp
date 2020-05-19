import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import Authorize from 'components/LayoutComponents/Authorize'
import { Row, Col, Layout, Typography } from 'antd'
import moment from 'moment'
import { useQuery } from 'react-apollo'
import gql from 'graphql-tag'
import Calendar from 'components/Calander'
import MedicalCard from './MedicalCard'
import MedicalForm from './Medicalform'

const { Content } = Layout
const { Title } = Typography

const MEDICAL_DATA = gql`
  query getMedication($date: Date!, $studentId: ID!) {
    getMedication(student: $studentId, date: $date) {
      edges {
        node {
          id
          condition
          startDate
          endDate
          note
          duration
        }
      }
    }
  }
`

const STUDNET_INFO = gql`
  query student($studentId: ID!) {
    student(id: $studentId) {
      firstname
    }
  }
`

export default () => {
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'))
  const [newMediDate, setNewMediDate] = useState(date)
  const [newMediCreated, setNewMediCreated] = useState(false)
  const studentId = localStorage.getItem('studentId')

  const { data, loading, error, refetch } = useQuery(MEDICAL_DATA, {
    variables: {
      studentId,
      date,
    },
  })

  const { data: studnetInfo } = useQuery(STUDNET_INFO, {
    variables: {
      studentId,
    },
  })

  useEffect(() => {
    if (newMediDate === date && newMediCreated) {
      refetch()
      setNewMediCreated(false)
    }
  }, [newMediDate, refetch, date, newMediCreated])

  const handleSelectDate = newDate => {
    setDate(moment(newDate).format('YYYY-MM-DD'))
  }

  return (
    <Authorize roles={['school_admin', 'parents']} redirect to="/dashboard/beta">
      <Helmet title="Dashboard Alpha" />
      <Layout style={{ padding: '0px' }}>
        <Content style={{ padding: '0px 20px', maxWidth: 1300, width: '100%', margin: '0px auto' }}>
          {studnetInfo && (
            <Title
              style={{
                marginBottom: 30,
                fontSize: 25,
              }}
            >
              {studnetInfo.student.firstname}&apos;s Medical Data
            </Title>
          )}
          <Row gutter={[46, 0]}>
            <Col span={16}>
              <Calendar value={date} handleOnChange={handleSelectDate} />
              <div style={{ marginTop: 41 }}>
                <div style={{ marginTop: 17 }}>
                  {loading && 'Loading...'}
                  {error && <pre>{JSON.stringify(error, null, 2)}</pre>}
                  {data &&
                    data.getMedication.edges.map(({ node }, index) => (
                      <MedicalCard
                        key={node.id}
                        condition={node.condition}
                        note={node.note}
                        startDate={node.startDate}
                        endDate={node.endDate}
                        style={{ marginTop: index === 0 ? 0 : 20 }}
                      />
                    ))}
                </div>
              </div>
            </Col>

            <Col span={8}>
              <Title
                style={{
                  marginLeft: '30px',
                  fontSize: '30px',
                  lineHeight: '41px',
                }}
              >
                New Medical Data
              </Title>
              <div
                style={{
                  background: '#F9F9F9',
                  borderRadius: 10,
                  padding: '30px',
                }}
              >
                <MedicalForm
                  handleNewMediDate={newDate => {
                    setNewMediDate(newDate)
                  }}
                  setNewMediCreated={setNewMediCreated}
                />
              </div>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Authorize>
  )
}
