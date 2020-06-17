import React from 'react'
import { Select, Typography, Button, Tooltip } from 'antd'
import { ArrowRightOutlined } from '@ant-design/icons'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo'
import EmployeCard from './EmployeCard'

const { Title, Text } = Typography
const { Option } = Select

const EMPLOYES = gql`
  query {
    employee: staffs {
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

  const onSelectStaff = (id) => {
    window.location.href = '/#/partners/staffManagement'
  }

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
                <Tooltip placement="topRight" title="Click to select employee">
                  <Select
                    style={{
                      width: 200,
                      height: 40,
                    }}
                    size="large"
                    showSearch
                    optionFilterProp="name"
                    onSelect={onSelectStaff}
                    placeholder="Select  Employee"
                  >
                    {data.employee.edges.map(({ node }) => {
                      return <Option key={node.id} name={node.name}>{node.name}</Option>
                    })}
                  </Select>
                </Tooltip>
              </div>

              <div>
                {data.employee.edges.length > 3 ?
                  data.employee.edges.slice(0, 2).map(({ node }) => {
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
                  })
                  :
                  data.employee.edges.map(({ node }) => {
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
                  href="/#/partners/staffManagement"                  
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
