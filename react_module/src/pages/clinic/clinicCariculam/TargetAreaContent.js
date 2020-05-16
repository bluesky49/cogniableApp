import React, { useState } from 'react'
import { Button, Typography } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import Drawer from 'rc-drawer'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo'
import TargetAreaCard from './TargetAreaCard'
import TargetCard from './TargetCard'

const { Text } = Typography

const TargetAreaContent = ({ targetArea }) => {
  const [newTargetDrawer, setNewTargetDrawer] = useState(false)
  const TARGET_QUERY = gql`
    query{
      target(targetArea:"${targetArea.id}") {
        edges {
          node {
            id
            targetInstr
            targetMain {
              targetName
            }
          }
        }
      }           
    }
  `
  const { data, loading, error } = useQuery(TARGET_QUERY)

  const handelNewTargetDrawer = () => {
    setNewTargetDrawer(state => !state)
  }

  if (loading) {
    return 'Loading...'
  }

  if (error) {
    return <pre>{JSON.stringify(error, null, 2)}</pre>
  }

  return (
    <>
      <TargetAreaCard name={targetArea.Area} style={{ marginBottom: 33 }} />
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
      {data.target.edges.map(({ node }) => {
        return <TargetCard title={node.targetMain.targetName} style={{ marginTop: 16 }} />
      })}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginTop: 50,
          alignItems: 'center',
        }}
      >
        <Button
          onClick={handelNewTargetDrawer}
          style={{
            width: 210,
            height: 40,
            background: '#F9F9F9',
            border: '1px solid #E4E9F0',
            boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
            borderRadius: 6,
            marginLeft: 'auto',
          }}
        >
          <PlusOutlined style={{ fontSize: 20, color: '#000' }} />
          <Text style={{ fontSize: 16, lineHeight: '22px', color: '#000' }}>New Target</Text>
        </Button>
      </div>
      <Drawer
        handler={false}
        className="drawer2"
        levelMove={100}
        width="500px"
        open={newTargetDrawer}
        placement="right"
        onMaskClick={handelNewTargetDrawer}
        onClose={handelNewTargetDrawer}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            background: '#fff',
          }}
        >
          hello
        </div>
      </Drawer>
    </>
  )
}

export default TargetAreaContent
