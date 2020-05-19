import React, { useState } from 'react'
import { createUseStyles } from 'react-jss'
import { Typography, Button, Select } from 'antd'
import { MinusOutlined, PlusOutlined } from '@ant-design/icons'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo'

const { Text } = Typography
const { Option } = Select

const useStyles = createUseStyles(() => ({
  root: {
    padding: '30px 67px',
    paddingTop: '5px',
  },
  text: {
    fontSize: '16px !important',
    lineHeight: '20px !important',
    letterSpacing: '-0.3px !important',
    color: '#63686E',
  },
  horizontalView: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 25,
    alignItems: 'center',
  },
  submitButton: {
    width: '100%',
    height: 40,
    background: '#0B35B3',
    boxShadow: '0px 2px 4px rgba(96, 97, 112, 0.16), 0px 0px 1px rgba(40, 41, 61, 0.04) !importent',
    borderRadius: 8,
    fontSize: '17 !important',
    fontWeight: 'bold !important',
    marginTop: 20,
  },
}))

const TEMPLATE_DETAILS = gql`
  query getTemplateDetails($id: ID!) {
    getTemplateDetails(id: $id) {
      id
      behavior {
        id
        behaviorName
        definition
      }
      status {
        id
        statusName
      }
      environment {
        edges {
          node {
            id
            name
          }
        }
      }
      measurments {
        edges {
          node {
            id
            measuringType
            unit
          }
        }
      }
    }
  }
`

export default ({ setNewTamplateFromOpen, selectTamplate }) => {
  const classes = useStyles()
  const [env, setEnv] = useState()
  const [duration, setDuration] = useState(0)
  const [intensity, setIntensity] = useState()

  const { data, loading, error } = useQuery(TEMPLATE_DETAILS, { variables: { id: selectTamplate } })

  return (
    <div className={classes.root}>
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
      {loading && 'Loading...'}
      {error && 'Opps their is something wrong'}
      {data && (
        <>
          <div className={classes.horizontalView}>
            <Text className={classes.text}>Titile</Text>
            <Text className={classes.text}>{data.getTemplateDetails.behavior.behaviorName}</Text>
          </div>
          <div className={classes.horizontalView}>
            <Text className={classes.text}>Status</Text>
            <Text className={classes.text}>{data.getTemplateDetails.status.statusName}</Text>
          </div>
          <div className={classes.horizontalView}>
            <Text className={classes.text}>Environments</Text>
            <Text className={classes.text} style={{ maxWidth: '60%', lineBreak: 'anywhere' }}>
              <Select
                onChange={value => setEnv(value)}
                placeholder="Select a environment"
                style={{
                  width: 120,
                }}
              >
                {data.getTemplateDetails.environment.edges.map(({ node }) => {
                  return <Option value={node.id}>{node.name}</Option>
                })}
              </Select>
            </Text>
          </div>
          {data &&
            data.getTemplateDetails.measurments.edges.map(({ node }) => {
              switch (node.measuringType) {
                case 'Intensity':
                  return (
                    <div className={classes.horizontalView}>
                      <Text className={classes.text}>Intensity</Text>
                      <Select onChange={value => setIntensity(value)}>
                        <Option value="Severe">Severe</Option>
                        <Option value="Moderate">Moderate</Option>
                        <Option value="Mild Function">Mild Function</Option>
                      </Select>
                    </div>
                  )
                case 'IRT':
                  return (
                    <div
                      style={{
                        display: 'flex',
                        marginTop: 16,
                        alignItems: 'center',
                        fontSize: 16,
                      }}
                    >
                      <Text className={classes.text}>IRT</Text>
                      <Button
                        style={{
                          marginLeft: 'auto',
                          marginRight: 7,
                        }}
                      >
                        <MinusOutlined />
                      </Button>
                      1
                      <Button
                        style={{
                          marginLeft: 7,
                        }}
                      >
                        <PlusOutlined />
                      </Button>
                    </div>
                  )
                case 'Frequency':
                  return (
                    <div
                      style={{
                        display: 'flex',
                        marginTop: 16,
                        alignItems: 'center',
                        fontSize: 16,
                      }}
                    >
                      <Text className={classes.text}>Frequency</Text>
                      <Button
                        style={{
                          marginLeft: 'auto',
                          marginRight: 7,
                        }}
                      >
                        <MinusOutlined />
                      </Button>
                      1
                      <Button
                        style={{
                          marginLeft: 7,
                        }}
                      >
                        <PlusOutlined />
                      </Button>
                    </div>
                  )
                default:
                  return ''
              }
            })}

          <Button
            type="primary"
            htmlType="submit"
            onClick={() => {
              setNewTamplateFromOpen(true)
            }}
            className={classes.submitButton}
          >
            Click for Submit
          </Button>
        </>
      )}
    </div>
  )
}
