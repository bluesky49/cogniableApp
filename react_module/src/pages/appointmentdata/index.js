import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { Row, Col, Layout, Typography } from 'antd'
import moment from 'moment'
import { useQuery } from 'react-apollo'
import AppiorMentForm from 'components/Form/AppiorMentForm'
import gql from 'graphql-tag'
import Calendar from 'components/Calander'
import TimeCard from 'pages/StaffManagement/TimeCard'

const { Content } = Layout
const { Title } = Typography

const TIME_SHEET_DATA = gql`
  query appointments($date: Date) {
    appointments(start_Date: $date) {
      edges {
        node {
          id
          start
          title
          end
          location {
            id
            location
          }
        }
      }
    }
  }
`

export default () => {
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'))
  const [newAppiormentCreated, setNewAppiormentCreated] = useState(false)
  const { data, loading, error, refetch } = useQuery(TIME_SHEET_DATA, {
    variables: {
      date,
    },
  })

  useEffect(() => {
    if (newAppiormentCreated) {
      refetch()
      setNewAppiormentCreated(false)
    }
  }, [refetch, date, newAppiormentCreated])

  const handleSelectDate = newDate => {
    setDate(moment(newDate).format('YYYY-MM-DD'))
  }

  return (
    <div>
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
          <Title
            style={{
              marginBottom: 30,
              fontSize: 25,
            }}
          >
            Appiorments
          </Title>
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
                        data.appointments.edges.map(({ node }, index) => {
                          return (
                            <TimeCard
                              key={node.id}
                              title={node.title}
                              location={node.location.location}
                              startTime={moment(node.start).format('HH:mm a')}
                              endTime={moment(node.end).format('HH:mm a')}
                              style={{
                                marginTop: index !== 0 ? 24 : 0,
                              }}
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
                Create A Appiorment
              </Title>
              <div
                style={{
                  background: '#F9F9F9',
                  borderRadius: 10,
                  padding: '30px',
                }}
              >
                <AppiorMentForm setNewAppiormentCreated={setNewAppiormentCreated} />
              </div>
            </Col>
          </Row>
        </Content>
      </Layout>
    </div>
  )
}
