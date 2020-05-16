import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import Authorize from 'components/LayoutComponents/Authorize'
import { Row, Col, Button, Layout, Typography } from 'antd'
import { FilterOutlined } from '@ant-design/icons'
import moment from 'moment'
import { useQuery } from 'react-apollo'
import gql from 'graphql-tag'
import MealCard from './MealCard'
import Calendar from './Calander'
import MealForm from './Mealform'
import FilterCard from './FilterCard'

const { Content } = Layout
const { Title } = Typography

const MEAL = gql`
  query getFood(
    $studentId: ID!
    $startDate: Date!
    $mealType: String
    $endDate: Date!
    $mealNameContain: String
  ) {
    getFood(
      student: $studentId
      mealType: $mealType
      date_Gte: $startDate
      date_Lte: $endDate
      mealName_Icontains: $mealNameContain
    ) {
      edges {
        node {
          id
          mealType
          mealName
          waterIntake
          date
          mealTime
          note
          foodType {
            id
            name
          }
        }
      }
    }
  }
`

export default () => {
  const [filter, setFilter] = useState(false)
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'))
  const [mealType, setMealType] = useState('All')
  const [mealNameSearchContent, setMealNameSerchContent] = useState('')
  const [newMealDate, setNewMealDate] = useState(date)
  const [newMealCreated, setNewMealCreated] = useState(false)
  const [mealDeleted, setMealDeleted] = useState(false)
  const [updateMealId, setUpdateMealId] = useState()

  const studentId = localStorage.getItem('studentId')
  const mealQuery = useQuery(MEAL, {
    variables: {
      studentId,
      startDate: date,
      endDate: date,
      mealType: mealType === 'All' ? '' : mealType,
      mealNameContain: mealNameSearchContent,
    },
  })

  useEffect(() => {
    if (newMealDate === date && newMealCreated) {
      mealQuery.refetch()
      setNewMealCreated(false)
    }
  }, [newMealDate, mealQuery, date, newMealCreated])

  useEffect(() => {
    if (mealDeleted) {
      mealQuery.refetch()
      setMealDeleted(false)
    }
  }, [mealDeleted, mealQuery])

  const handleFilterToggle = () => {
    setFilter(state => !state)
  }

  const handleSelectDate = newDate => {
    setDate(moment(newDate).format('YYYY-MM-DD'))
  }

  const handleFilterMealType = value => {
    setMealType(value)
  }

  const handleMealNameSearch = value => {
    setMealNameSerchContent(value)
  }

  return (
    <Authorize roles={['school_admin', 'parents']} redirect to="/dashboard/beta">
      <Helmet title="Dashboard Alpha" />
      <Layout style={{ padding: '0px' }}>
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
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  <Button type="link" onClick={handleFilterToggle}>
                    <FilterOutlined style={{ fontSize: 40 }} />
                  </Button>
                </div>
                {filter && (
                  <div style={{ marginTop: 20 }}>
                    <FilterCard
                      dateValue={date}
                      handleSelectDate={handleSelectDate}
                      mealTypeValue={mealType}
                      handleFilterMealType={handleFilterMealType}
                      mealNameSearchValue={mealNameSearchContent}
                      handleMealNameSearch={handleMealNameSearch}
                    />
                  </div>
                )}
                <div
                  style={{
                    marginTop: 17,
                  }}
                >
                  {mealQuery.loading ? (
                    'Loading...'
                  ) : (
                    <>
                      {mealQuery.error && <pre>{JSON.stringify(mealQuery.error, null, 2)}</pre>}
                      {mealQuery.data &&
                        mealQuery.data.getFood.edges.map(({ node }, index) => {
                          return (
                            <MealCard
                              key={node.id}
                              id={node.id}
                              mealName={node.mealType}
                              time={node.mealTime}
                              foodType={node.foodType.name}
                              mealContent={node.mealName}
                              waterValue={node.waterIntake}
                              style={{ marginTop: index === 0 ? 0 : 20 }}
                              setMealDeleted={setMealDeleted}
                              setUpdateMealId={setUpdateMealId}
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
                New Meal
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
                  updateMealId={updateMealId}
                  setUpdateMealId={setUpdateMealId}
                />
              </div>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Authorize>
  )
}