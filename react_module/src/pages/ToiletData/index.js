import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import Authorize from 'components/LayoutComponents/Authorize'
import { Row, Col, Layout, Typography } from 'antd'
import moment from 'moment'
import { useQuery } from 'react-apollo'
import gql from 'graphql-tag'
import Calendar from 'components/Calander'
import MealCard from './ToiletCard'
import MealForm from './Toiletform'

const { Content } = Layout
const { Title } = Typography

const TOILET_DATA = gql`
  query getToiletData($date: Date!, $student: ID!) {
    getToiletData(student: $student, date: $date, success: true) {
      edges {
        node {
          id
          date
          time
          lastWater
          lastWaterTime
          success
          urination
          bowel
          prompted
        }
      }
    }
  }
`

const STUDNET_INFO = gql`
  query student($student: ID!) {
    student(id: $student) {
      firstname
    }
  }
`

export default () => {
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'))
  const [newToiletDate, setNewToiletDate] = useState(date)
  const [newToiletDataCreated, setNewToiletDataCreated] = useState(false)
  const studentId = localStorage.getItem('studentId')
  const { data, loading, error, refetch } = useQuery(TOILET_DATA, {
    variables: {
      student: studentId,
      date,
    },
  })

  const { data: studnetInfo } = useQuery(STUDNET_INFO, {
    variables: {
      student: studentId,
    },
  })

  useEffect(() => {
    if (newToiletDate === date && newToiletDataCreated) {
      refetch()
      setNewToiletDataCreated(false)
    }
  }, [newToiletDate, refetch, date, newToiletDataCreated])

  const handleSelectDate = newDate => {
    setDate(moment(newDate).format('YYYY-MM-DD'))
  }

  return (
    <Authorize roles={['school_admin', 'parents', 'therapist']} redirect to="/dashboard/beta">
      <Helmet title="Dashboard Alpha" />
      <Layout style={{ padding: '0px' }}>
        <Content
          style={{
            padding: '0px 20px',
            maxWidth: 1300,
            width: '100%',
            margin: '0px auto',
          }}
        >
          {studnetInfo && (
            <Title
              style={{
                marginBottom: 30,
                fontSize: 25,
              }}
            >
              {studnetInfo.student && studnetInfo.student.firstname}&apos;s Toilet Data
            </Title>
          )}
          <Row gutter={[46, 0]}>
            <Col span={16}>
              <Calendar value={date} handleOnChange={handleSelectDate} />
              <div
                style={{
                  marginTop: 41,
                }}
              >
                <div
                  style={{
                    marginTop: 17,
                  }}
                >
                  {loading ? (
                    'Loading...'
                  ) : (
                    <>
                      {error && <pre>{JSON.stringify(error, null, 2)}</pre>}
                      {data &&
                        data.getToiletData.edges.map(({ node }, index) => {
                          return (
                            <MealCard
                              key={node.id}
                              urination={node.urination}
                              bowel={node.bowel}
                              prompted={node.prompted}
                              time={node.time}
                              waterValue={node.waterIntake}
                              style={{ marginTop: index === 0 ? 0 : 20 }}
                            />
                          )
                        })}
                    </>
                  )}
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
                Record Toilet Data
              </Title>
              <div
                style={{
                  background: '#F9F9F9',
                  borderRadius: 10,
                  padding: '30px',
                }}
              >
                <MealForm
                  handleNewToiletDate={newDate => {
                    setNewToiletDate(newDate)
                  }}
                  selectDate={date}
                  setNewToiletCreated={setNewToiletDataCreated}
                />
              </div>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Authorize>
  )
}
