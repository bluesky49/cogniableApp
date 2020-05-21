import React from 'react'
import { Select, Typography, Button } from 'antd'
import { ArrowRightOutlined } from '@ant-design/icons'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo'
import Scrollbars from 'react-custom-scrollbars'
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
  const { data, loading, error } = useQuery(LEARNERS)

  return (
    <div
      style={{
        background: '#F9F9F9',
        borderRadius: 10,
        padding: '28px 27px 20px',
        minHeight: 650,
      }}
    >
      {loading ? (
        'Loading...'
      ) : (
        <>
          {error && <Text type="danger">Opp&apos;s their some error</Text>}
          {data && (
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
                  placeholder="Select Learner"
                  showSearch
                  optionFilterProp="name"
                >
                  {data.students.edges.map(({ node }) => {
                    return (
                      <Option key={node.id} name={node.firstname}>
                        {node.firstname}
                      </Option>
                    )
                  })}
                </Select>
              </div>

              <div>
                <Scrollbars
                  style={{
                    height: '481px',
                  }}
                >
                  {data.students.edges.map(({ node }) => {
                    return (
                      <LearnerCard
                        key={node.id}
                        node={node}
                        name={node.firstname}
                        style={{ marginTop: 18 }}
                        leaveRequest={node.leaveRequest}
                      />
                    )
                  })}
                </Scrollbars>
              </div>

              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'flex-end',
                }}
              >
                <a href="/#/therapistStudent">
                  <Button
                    type="link"
                    style={{
                      marginTop: 10,
                      fontSize: 18,
                      lineHeight: '25px',
                    }}
                  >
                    View All
                    <ArrowRightOutlined style={{ fontSize: 18, marginLeft: 11 }} />
                  </Button>
                </a>
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}

export default LearnersCard
