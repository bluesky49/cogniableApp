import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import Authorize from 'components/LayoutComponents/Authorize'
import { Row, Col, Layout, Typography } from 'antd'
import moment from 'moment'
import { useQuery } from 'react-apollo'
import gql from 'graphql-tag'
import { useSelector } from 'react-redux'
import MealCard from './ToiletCard'
import Calendar from './Calander'
import MealForm from './Toiletform'

const { Content } = Layout
const { Title } = Typography

const TOILET_DATA = gql`
  query getToiletData($date: Date!) {
    getToiletData(student: "U3R1ZGVudFR5cGU6MTYz", date: $date, success: true) {
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

export default () => {
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'))
  const user = useSelector(state => state.user)
  const [newMealDate, setNewMealDate] = useState(date)
  const [newMealCreated, setNewMealCreated] = useState(false)
  const { data, loading, error, refetch } = useQuery(TOILET_DATA, {
    variables: {
      studentId: user.id,
      date,
    },
  })

  useEffect(() => {
    if (newMealDate === date && newMealCreated) {
      refetch()
      setNewMealCreated(false)
    }
  }, [newMealDate, refetch, date, newMealCreated])

  const handleSelectDate = newDate => {
    setDate(moment(newDate).format('YYYY-MM-DD'))
  }

  return (
    <Authorize roles={['school_admin', 'parents']} redirect to="/dashboard/beta">
      <Helmet title="Dashboard Alpha" />
      <Layout style={{ backgroundColor: '#F2F4F8', padding: '0px' }}>
        <Content style={{ padding: '0px 20px', maxWidth: 1300, width: '100%', margin: '0px auto' }}>
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
                  handleNewMealDate={newDate => {
                    setNewMealDate(newDate)
                  }}
                  setNewMealCreated={setNewMealCreated}
                />
              </div>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Authorize>
  )
}
