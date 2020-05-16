import React from 'react'
import { Select, Typography, Button } from 'antd'
import { ArrowRightOutlined } from '@ant-design/icons'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo'
import EmployeCard from './EmployeCard'

const { Title, Text } = Typography
const { Option } = Select

const EMPLOYES = gql`
  query {
    employee: staffs(first: 2) {
      edges {
        node {
          id
          name
          designation
        }
      }
    }
  }
`

const EmployesCard = ({ style }) => {
  const { loading, data, error } = useQuery(EMPLOYES)

  return (
    <div style={{ ...style }}>
      {loading ? (
        'Loading...'
      ) : (
        <>
          {error && <Text type="danger">Opp&apos;s their is something wrong</Text>}
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
                  Employees
                </Title>
                <Select
                  style={{
                    width: 200,
                    height: 40,
                  }}
                  size="large"
                  placeholder="Select  Employee"
                >
                  {data.employee.edges.map(({ node }) => {
                    return <Option key={node.id}>{node.name}</Option>
                  })}
                </Select>
              </div>

              <div>
                {data.employee.edges.map(({ node }) => {
                  return (
                    <EmployeCard
                      key={node.key}
                      name={node.name}
                      designation={node.designation}
                      profileImg={node.profileImg}
                      leaveRequest={node.leaveRequest}
                      style={{ marginTop: 18 }}
                    />
                  )
                })}
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
                >
                  View All
                  <ArrowRightOutlined style={{ fontSize: 18, marginLeft: 11 }} />
                </Button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}

export default EmployesCard
