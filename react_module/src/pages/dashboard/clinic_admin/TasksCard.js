import React from 'react'
import { Typography, Popover } from 'antd'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo'
import defaultProfileImg from './img/profile.jpg'

const { Title, Text } = Typography

const TASKS = gql`
  query {
    tasks: tasks(first: 3) {
      edges {
        node {
          id
          taskName
          status {
            taskStatus
          }
          students {
            edges {
              node {
                firstname
                lastname
              }
            }
          }
        }
      }
    }
  }
`

const TaskCard = ({ title, status, students }) => {
  return (
    <div
      style={{
        padding: '19px 32px 0px',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div style={{ width: '100%' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Title
            style={{
              fontSize: 14,
              lineHeight: '19px',
            }}
          >
            {title}
          </Title>
          <div
            style={{
              display: 'flex',
              marginLeft: 'auto',
            }}
          >
            {students.map(({ node }) => {
              return (
                <Popover content={<Text>{node.firstname}</Text>} placement="bottom">
                  <img
                    key={node.id}
                    src={node.profileImg || defaultProfileImg}
                    style={{
                      width: 35,
                      height: 28,
                      borderRadius: 10,
                      cursor: 'pointer',
                    }}
                    alt=""
                  />
                </Popover>
              )
            })}
          </div>
        </div>
        <Text
          style={{
            fontSize: 14,
            lineHeight: '19px',
            color: '#0B35B3',
          }}
        >
          {status}
        </Text>
      </div>
    </div>
  )
}

const TasksCard = ({ style }) => {
  const { loading, data, error } = useQuery(TASKS)

  return (
    <div
      style={{
        ...style,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 9,
          alignItems: 'flex-end',
        }}
      >
        <Title
          style={{
            fontWeight: 600,
            fontSize: 20,
            lineHeight: '27px',
          }}
        >
          Tasks
        </Title>
      </div>
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid #E4E9F0',
          boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
          borderRadius: 10,
          padding: '14px 6px',
        }}
      >
        {error && <Text type="danger">Opp&apos;s their is a error</Text>}
        {loading && <div style={{ height: '100%' }}>Loading...</div>}
        {data &&
          data.tasks.edges.map(({ node }, index) => {
            const { length } = data.tasks.edges
            return (
              <div key={node.id}>
                <TaskCard
                  title={node.taskName}
                  status={node.status.taskStatus}
                  students={node.students.edges}
                />
                {index < length - 1 && (
                  <hr
                    style={{
                      margin: '34px auto 0px',
                      width: 'calc(100% - 64px)',
                    }}
                  />
                )}
              </div>
            )
          })}
      </div>
    </div>
  )
}

export default TasksCard
