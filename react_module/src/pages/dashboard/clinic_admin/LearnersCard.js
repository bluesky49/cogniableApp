import React from 'react'
import { Select, Typography, Button } from 'antd'
import { ArrowRightOutlined } from '@ant-design/icons'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo'
import LearnerCard from './LearnerCard'

const { Title, Text } = Typography
const { Option } = Select

const LEARNERS = gql`
  query {
    students {
      edges {
        node {
          id
          firstname
          lastname
          internalNo
        }
      }
    }
  }
`

const LearnersCard = () => {

  const redirectToLearnersList = () => {
    window.location.href = '/#/partners/viewlearners'
  }

  const onSelectStudent = (id) => {
    localStorage.setItem('studentId', JSON.stringify(id))
    window.location.href = '/#/therapistStudent'
  }

  const { data, loading, error } = useQuery(LEARNERS)


  if (loading) {
    return 'Loading...'
  }

  if (error) {
    return <Text type="danger">Opp&apos;s their some error</Text>
  }

  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 40,
        }}
      >
        <Title
          style={{
            fontSize: 20,
            lineHeight: '27px',
          }}
        >
          Learners
        </Title>
        <Select
          style={{
            width: 200,
            height: 40,
          }}
          size="large"
          showSearch
          optionFilterProp="name"
          onSelect={onSelectStudent}
          placeholder="Select Learner"
        >
          {data.students.edges.map(({ node }) => {
            return <Option key={node.id} name={node.firstname}>{node.firstname}</Option>
          })}
        </Select>
      </div>

      <div>
        {data.students.edges.length > 4 ?
          data.students.edges.slice(0,3).map(({ node }) => {
            return (
              <LearnerCard
                key={node.id}
                name={node.firstname}
                node={node}
                style={{ marginTop: 18 }}
                leaveRequest={node.leaveRequest}
              />
            )
          })
        :
          data.students.edges.map(({ node }) => {
            return (
              <LearnerCard
                key={node.id}
                name={node.firstname}
                node={node}
                style={{ marginTop: 18 }}
                leaveRequest={node.leaveRequest}
              />
            )
          })
        }
      </div>

      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <Button
          type="link"
          style={{
            marginTop: 39,
            fontSize: 18,
            lineHeight: '25px',
          }}
          onClick={redirectToLearnersList}
        >
          View All
          <ArrowRightOutlined style={{ fontSize: 18, marginLeft: 11 }} />
        </Button>
      </div>
    </>
  )
}

export default LearnersCard
