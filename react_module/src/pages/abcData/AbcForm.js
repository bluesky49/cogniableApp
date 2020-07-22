/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import {
  Form,
  Input,
  Button,
  Select,
  notification,
  Typography,
  DatePicker,
  TimePicker,
  Modal,
} from 'antd'
import gql from 'graphql-tag'
import { useMutation, useQuery } from 'react-apollo'
import moment from 'moment'
import './MealForm.scss'
import { PlusOutlined, MinusOutlined } from '@ant-design/icons'

const { Text } = Typography
const { TextArea } = Input
const { Option } = Select

const CREATE_ABC = gql`
  mutation recordAbcdata(
    $studentId: ID!
    $date: Date!
    $frequency: Int!
    $time: String!
    $intensity: String!
    $response: String!
    $function: String!
    $behaviors: [ID!]!
    $consequences: [ID!]!
    $antecedents: [ID!]!
    $environment: ID
    $note: String
  ) {
    recordAbcdata(
      input: {
        abcData: {
          studentId: $studentId
          date: $date
          target: 100
          frequency: $frequency
          time: $time
          Intensiy: $intensity
          response: $response
          Duration: "10:05"
          Notes: $note
          function: $function
          behaviors: $behaviors
          consequences: $consequences
          antecedents: $antecedents
          environments: $environment
        }
      }
    ) {
      details {
        id
        date
        target
        frequency
        time
        Intensiy
        response
        Duration
        Notes
        function
        behavior {
          edges {
            node {
              id
              behaviorName
            }
          }
        }
        consequences {
          edges {
            node {
              id
              consequenceName
            }
          }
        }
        antecedent {
          edges {
            node {
              id
              antecedentName
            }
          }
        }
        environments {
          id
          name
        }
      }
    }
  }
`

const GET_ATTENDANCE = gql`
  query getAntecedent($studentId: ID!) {
    getAntecedent(studentId: $studentId) {
      edges {
        node {
          id
          antecedentName
        }
      }
    }
  }
`

const GET_CONSEQUENCES = gql`
  query getConsequences($studentId: ID!) {
    getConsequences(studentId: $studentId) {
      edges {
        node {
          id
          consequenceName
        }
      }
    }
  }
`

const GET_BEHAVIOR = gql`
  query getBehaviour($studentId: ID!) {
    getBehaviour(studentId: $studentId) {
      edges {
        node {
          id
          behaviorName
          definition
        }
      }
    }
  }
`

const GET_ENVIRONMENTS = gql`
  query {
    getEnvironment {
      id
      name
      defination
    }
  }
`

const CREATE_BEHAVIOR = gql`
  mutation createBehaviour($studentId: ID!, $name: String!) {
    createBehaviour(input: { student: $studentId, name: $name, definition: "Test Definition" }) {
      details {
        id
        behaviorName
        definition
      }
    }
  }
`

const CREATE_ATTENDENCE = gql`
  mutation createAntecedent($studentId: ID!, $name: String!) {
    createAntecedent(input: { student: $studentId, name: $name }) {
      details {
        id
        antecedentName
      }
    }
  }
`

const CREATE_CONSIQUENCE = gql`
  mutation createConsequence($studentId: ID!, $name: String!) {
    createConsequence(input: { student: $studentId, name: $name }) {
      details {
        id
        consequenceName
      }
    }
  }
`

const dateFormat = 'YYYY-MM-DD'

const MealForm = ({ style, form, setNewAbc }) => {
  const studentId = localStorage.getItem('studentId')
  // new
  const [frequency, setFrequency] = useState(0)
  const [antecedentModel, setAntecedentModel] = useState(false)
  const [behaviourModel, setBehaviourModel] = useState(false)
  const [consequenceModel, setConsequenceModel] = useState(false)
  const [newBehName, setNewBehName] = useState()
  const [newAntName, setNewAntName] = useState()
  const [newConsName, setNewConsName] = useState()
  const [behaviorDataState, setBehaviourDataState] = useState()
  const [consequencesDataState, setConsequencesDataState] = useState()
  const [antecedentDataState, setAntecedentDataState] = useState()

  const { data: behaviorData, loading: behaviorLoading } = useQuery(GET_BEHAVIOR, {
    variables: { studentId },
  })
  const { data: consequencesData, loading: consequencesLoading } = useQuery(GET_CONSEQUENCES, {
    variables: { studentId },
  })
  const { data: antecedentData, loading: antecedentLoading } = useQuery(GET_ATTENDANCE, {
    variables: { studentId },
  })
  const { data: environmentData, loading: locationLoding } = useQuery(GET_ENVIRONMENTS, {
    variables: {
      studentId,
    },
  })

  const [mutate, { data, error, loading }] = useMutation(CREATE_ABC, {
    variables: {
      id: studentId,
      date: moment().format(dateFormat),
    },
  })

  const [
    createNewBehName,
    { data: createBehData, loading: createBehLoading, error: createBehError },
  ] = useMutation(CREATE_BEHAVIOR)

  useEffect(() => {
    if (behaviorData) {
      setBehaviourDataState([...behaviorData.getBehaviour.edges])
    }
  }, [behaviorData])

  useEffect(() => {
    if (consequencesData) {
      setConsequencesDataState([...consequencesData.getConsequences.edges])
    }
  }, [consequencesData])

  useEffect(() => {
    if (antecedentData) {
      setAntecedentDataState([...antecedentData.getAntecedent.edges])
    }
  }, [antecedentData])

  useEffect(() => {
    if (createBehData) {
      notification.success({
        message: 'New Behaviour Created Sucessfully',
      })
      setBehaviourDataState(state => {
        if (state) {
          return [{ node: createBehData.createBehaviour.details }, ...state]
        }
        return [{ node: createBehData.createBehaviour.details }]
      })
      setNewBehName('')
      setBehaviourModel(false)
    }
    if (createBehError) {
      notification.error({
        message: 'New Behaviour Creation Error',
      })
    }
  }, [createBehData, createBehError])

  const [
    createNewAttendence,
    { data: createAntData, loading: createAntLoading, error: createAntError },
  ] = useMutation(CREATE_ATTENDENCE)

  useEffect(() => {
    if (createAntData) {
      notification.success({
        message: 'New Antendence Created Sucessfully',
      })
      setNewAntName('')
      setAntecedentModel(false)
      setAntecedentDataState(state => {
        if (state) {
          return [{ node: createAntData.createAntecedent.details }, ...state]
        }
        return [{ node: createAntData.createAntecedent.details }]
      })
    }
    if (createAntError) {
      notification.error({
        message: 'New Antendence Creation Error',
      })
    }
  }, [createAntData, createAntError])

  const [
    createNewConsiquence,
    { data: createConsData, loading: createConsLoading, error: createConsError },
  ] = useMutation(CREATE_CONSIQUENCE)

  useEffect(() => {
    if (createConsData) {
      notification.success({
        message: 'New Consiquence Created Sucessfully',
      })
      setNewConsName('')
      setConsequenceModel(false)
      setConsequencesDataState(state => {
        if (state) {
          return [{ node: createConsData.createConsequence.details }, ...state]
        }
        return [{ node: createConsData.createConsequence.details }]
      })
    }
    if (createConsError) {
      notification.error({
        message: 'New Consiquence Creation Error',
      })
    }
  }, [createConsData, createConsError])

  const SubmitForm = e => {
    e.preventDefault()
    form.validateFields((formError, values) => {
      if (!formError) {
        mutate({
          variables: {
            studentId,
            date: moment(values.date).format(dateFormat),
            frequency,
            time: moment(values.time).format('HH:mm a'),
            intensity: values.intensity,
            response: values.response,
            note: values.note,
            function: values.function,
            behaviors: values.behaviors,
            consequences: values.consequences,
            antecedents: values.antecedents,
            environment: values.environment,
          },
        })
      }
    })
  }

  useEffect(() => {
    if (data) {
      notification.success({
        message: 'ABC Data',
        description: 'ABC data Added Successfully',
      })
      form.resetFields()
      setNewAbc({ node: data.recordAbcdata.details })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  useEffect(() => {
    if (error) {
      notification.error({
        message: 'Somthing want wrong',
        description: error.message,
      })
    }
  }, [error])

  const handelCreateNewBehName = () => {
    if (newBehName) {
      createNewBehName({
        variables: {
          name: newBehName,
          studentId,
        },
      })
    } else {
      notification.info({ message: 'Type the name' })
    }
  }

  const handelCreateNewAnt = () => {
    if (newAntName) {
      createNewAttendence({
        variables: {
          name: newAntName,
          studentId,
        },
      })
    } else {
      notification.info({ message: 'Type the name' })
    }
  }

  const handelCreateNewCons = () => {
    if (newConsName) {
      createNewConsiquence({
        variables: {
          name: newConsName,
          studentId,
        },
      })
    } else {
      notification.info({ message: 'Type the name' })
    }
  }

  if (error) {
    return <pre>{JSON.stringify(error, null, 2)}</pre>
  }

  return (
    <Form
      onSubmit={e => SubmitForm(e, this)}
      name="control-ref"
      style={{ marginLeft: 0, position: 'relative', ...style }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Form.Item label="Date">
          {form.getFieldDecorator('date', {
            rules: [{ required: true, message: 'Please Select a Date!' }],
          })(<DatePicker placeholder="Select Date" />)}
        </Form.Item>

        <Form.Item label="Time">
          {form.getFieldDecorator('time', {
            rules: [{ required: true, message: 'Please Select a Time!' }],
          })(<TimePicker placeholder="Select a Time" />)}
        </Form.Item>
      </div>

      <div style={{ position: 'relative' }}>
        <Button
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            zIndex: 100,
          }}
          onClick={() => setAntecedentModel(true)}
        >
          <PlusOutlined />
        </Button>

        <Form.Item label="Antecedent">
          {form.getFieldDecorator('antecedents', {
            rules: [{ required: true, message: 'Please Select a Antecedent!' }],
          })(
            <Select
              style={{}}
              placeholder="Select a Antecedent"
              size="large"
              allowclear
              showSearch
              optionFilterProp="name"
              mode="multiple"
              loading={antecedentLoading}
            >
              {antecedentDataState &&
                antecedentDataState.map(({ node }) => {
                  return (
                    <Option value={node.id} key={node.id} name={node.antecedentName}>
                      {node.antecedentName}
                    </Option>
                  )
                })}
            </Select>,
          )}
        </Form.Item>
      </div>

      <div style={{ position: 'relative' }}>
        <Button
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            zIndex: 100,
          }}
          onClick={() => setBehaviourModel(true)}
        >
          <PlusOutlined />
        </Button>

        <Form.Item label="Behaviour">
          {form.getFieldDecorator('behaviors', {
            rules: [{ required: true, message: 'Please Select a Behaviour!' }],
          })(
            <Select
              style={{}}
              placeholder="Select a Behaviour"
              size="large"
              allowclear
              showSearch
              optionFilterProp="name"
              mode="multiple"
              loading={behaviorLoading}
            >
              {behaviorDataState &&
                behaviorDataState.map(({ node }) => {
                  return (
                    <Option value={node.id} key={node.id} name={node.behaviorName}>
                      {node.behaviorName}
                    </Option>
                  )
                })}
            </Select>,
          )}
        </Form.Item>
      </div>

      <div style={{ position: 'relative' }}>
        <Button
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            zIndex: 100,
          }}
          onClick={() => setConsequenceModel(true)}
        >
          <PlusOutlined />
        </Button>

        <Form.Item label="Consequence">
          {form.getFieldDecorator('consequences', {
            rules: [{ required: true, message: 'Please Select a Consequence!' }],
          })(
            <Select
              style={{}}
              placeholder="Select a Consequence"
              size="large"
              allowclear
              showSearch
              optionFilterProp="name"
              mode="multiple"
              loading={consequencesLoading}
            >
              {consequencesDataState &&
                consequencesDataState.map(({ node }) => {
                  return (
                    <Option value={node.id} key={node.id} name={node.consequenceName}>
                      {node.consequenceName}
                    </Option>
                  )
                })}
            </Select>,
          )}
        </Form.Item>
      </div>

      
      <div style={{ position: 'relative' }}>
        {/* <Button
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            zIndex: 100,
          }}
          onClick={() => setConsequenceModel(true)}
        >
          <PlusOutlined />
        </Button> */}

        <Form.Item label="Environment">
          {form.getFieldDecorator('environment')(
            <Select
              style={{}}
              placeholder="Select a Environment"
              size="large"
              allowclear
              showSearch
              optionFilterProp="name"
              loading={locationLoding}
            >
              {environmentData?.getEnvironment.map((item ) => {
                return (
                  <Option value={item.id} key={item.id} name={item.name}>
                    {item.name}
                  </Option>
                )
              })}
            </Select>,
          )}
        </Form.Item>
      </div>

      <Form.Item label="Intensity">
        {form.getFieldDecorator('intensity', {
          rules: [{ required: true, message: 'Please Select a intensity!' }],
        })(
          <Select style={{ width: '100%' }} placeholder="Select a Intensity" size="large">
            <Option key={1} value="Severe">
              Severe
            </Option>
            <Option key={2} value="Moderate">
              Moderate
            </Option>
            <Option key={3} value="Mild Function">
              Mild Function
            </Option>
          </Select>,
        )}
      </Form.Item>

      <Form.Item label="Response">
        {form.getFieldDecorator('response', {
          rules: [{ required: true, message: 'Please Select a response!' }],
        })(
          <Select style={{}} placeholder="Select a Response" size="large" allowclear>
            <Option value="Improve" key="1">
              Improve
            </Option>
          </Select>,
        )}
      </Form.Item>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: 18,
        }}
      >
        <Text style={{ fontSize: 18 }}>Frequency</Text>

        <Button
          style={{ marginLeft: 'auto', marginRight: 10 }}
          onClick={() =>
            setFrequency(state => {
              if (state > 0) {
                return state - 1
              }
              return 0
            })
          }
        >
          <MinusOutlined />
        </Button>
        <Input
          type="number"
          value={frequency}
          style={{ width: 70, marginRight: 10 }}
          onChange={e => setFrequency(parseInt(e.target.value, 10))}
        />
        <Button onClick={() => setFrequency(state => state + 1)}>
          <PlusOutlined />
        </Button>
      </div>

      <Form.Item label="Function">
        {form.getFieldDecorator('function', {
          rules: [{ required: true, message: 'Please Select a Function!' }],
        })(
          <Select style={{}} placeholder="Select a finction" size="large" allowclear>
            <Option value="Escape" key="1">
              Escape
            </Option>
          </Select>,
        )}
      </Form.Item>

      <Form.Item label="Note">
        {form.getFieldDecorator('note')(
          <TextArea
            style={{
              resize: 'none',
              width: '100%',
              height: 180,
            }}
          />,
        )}
      </Form.Item>

      <Form.Item>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Button
            type="primary"
            htmlType="submit"
            style={{
              width: 180,
              height: 40,
              background: '#0B35B3',
            }}
            loading={loading}
          >
            Save Data
          </Button>
        </div>
      </Form.Item>

      <Modal
        visible={antecedentModel}
        title="Create A New Antecedent"
        onCancel={() => setAntecedentModel(false)}
        footer={[
          <Button
            key="submit"
            type="primary"
            onClick={handelCreateNewAnt}
            loading={createAntLoading}
          >
            Create
          </Button>,
        ]}
      >
        <Form>
          <Input
            placeholder="Type Antecedent Name"
            value={newAntName}
            onChange={e => setNewAntName(e.target.value)}
          />
        </Form>
      </Modal>

      <Modal
        visible={behaviourModel}
        title="Create A New Behaviour"
        onCancel={() => setBehaviourModel(false)}
        footer={[
          <Button
            key="submit"
            type="primary"
            onClick={handelCreateNewBehName}
            loading={createBehLoading}
          >
            Create
          </Button>,
        ]}
      >
        <Form>
          <Input
            placeholder="Type Behavior Name"
            value={newBehName}
            onChange={e => setNewBehName(e.target.value)}
          />
        </Form>
      </Modal>

      <Modal
        visible={consequenceModel}
        title="Create A New Consequence"
        onCancel={() => setConsequenceModel(false)}
        footer={[
          <Button
            key="submit"
            type="primary"
            onClick={handelCreateNewCons}
            loading={createConsLoading}
          >
            Create
          </Button>,
        ]}
      >
        <Form>
          <Input
            placeholder="Type Consequence Name"
            value={newConsName}
            onChange={e => setNewConsName(e.target.value)}
          />
        </Form>
      </Modal>
    </Form>
  )
}

export default Form.create()(MealForm)
