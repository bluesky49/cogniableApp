import React, { useState } from 'react'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo'
import { Table, Layout, Typography, Button, Drawer } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useHistory } from 'react-router-dom'
import CreateAssignmentForm from './CreateAssignmentForm'

const { Content } = Layout
const { Title } = Typography

const PEAK_PROGRAMS = gql`
  query($studentId: ID!) {
    peakPrograms(student: $studentId) {
      edges {
        node {
          id
          title
          category
          notes
          date
        }
      }
    }
  }
`

export default () => {
  const [open, setOpen] = useState(false)
  const studentId = localStorage.getItem('studentId')
  const history = useHistory()

  const { data, error, loading } = useQuery(PEAK_PROGRAMS, {
    variables: {
      studentId,
    },
  })

  if (error) {
    return <pre>{JSON.stringify(error, null, 2)}</pre>
  }

  return (
    <Layout style={{ padding: '0px' }}>
      <Content
        style={{
          padding: '0px 20px',
          maxWidth: 1100,
          width: '100%',
          margin: '0px auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Title
            style={{
              marginBottom: 30,
              fontSize: 25,
            }}
          >
            PEAK Assignment
          </Title>
          <Button size="large" onClick={() => setOpen(true)}>
            <PlusOutlined />
            Create PEAK Assignment
          </Button>
        </div>

        <div>
          <Table
            columns={[
              {
                title: 'Date',
                dataIndex: 'node.date',
                onCellClick: record => {
                  console.log(record)
                  localStorage.setItem('peakId', record.node.id)
                  if (
                    record.node.category === 'TRANSFORMATION' ||
                    record.node.category === 'EQUIVALANCE'
                  ) {
                    history.push('/classPage')
                  } else {
                    history.push('/peakAssign')
                  }
                },
              },
              {
                title: 'Category',
                dataIndex: 'node.category',
              },
              {
                title: 'Title',
                dataIndex: 'node.title',
              },
              {
                title: 'Note',
                dataIndex: 'node.notes',
              },
            ]}
            dataSource={data?.peakPrograms.edges}
            loading={loading}
          />
        </div>
      </Content>
      <Drawer
        visible={open}
        onClose={() => {
          setOpen(false)
        }}
        width={400}
        title="Create New Assignment"
      >
        <div
          style={{
            padding: '0px 30px',
          }}
        >
          <CreateAssignmentForm setOpen={setOpen} PEAK_PROGRAMS={PEAK_PROGRAMS} />
        </div>
      </Drawer>
    </Layout>
  )
}
