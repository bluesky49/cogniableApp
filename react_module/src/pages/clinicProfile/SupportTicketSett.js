/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import {
  Typography,
  Table,
  Button,
  DatePicker,
  Drawer,
  Form,
  Input,
  Select,
  Spin,
  notification,
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import gql from 'graphql-tag'
import { useQuery, useMutation } from 'react-apollo'
import moment from 'moment'
import TextArea from 'antd/lib/input/TextArea'

const { Text } = Typography
const { Option } = Select

const TICKETS_QUERY = gql`
  query tickets($form: Date, $to: Date) {
    tickets(date_Gte: $form, date_Lte: $to) {
      edges {
        node {
          id
          subject
          description
          priority {
            id
            priority
          }
          service {
            id
            service
          }
          assignTo {
            id
            team
          }
          status {
            id
            status
          }
          createdBy {
            id
            username
          }
          createdAt
        }
      }
    }
  }
`

const CREATE_TICKET = gql`
  mutation createTicket(
    $issue: String!
    $description: String
    $priority: ID!
    $service: ID!
    $assign: ID!
  ) {
    createTicket(
      input: {
        subject: $issue
        description: $description
        priority: $priority
        service: $service
        assignTo: $assign
      }
    ) {
      ticket {
        id
        subject
      }
    }
  }
`

const TICKET_PRIORITY = gql`
  query {
    ticketPriority {
      id
      priority
    }
  }
`

const TICKET_SERVICE = gql`
  query {
    ticketService {
      id
      service
    }
  }
`

const TICKET_STATUS = gql`
  query {
    ticketStatus {
      id
      status
    }
  }
`

const TICKET_ASSIGN = gql`
  query {
    ticketAssign {
      id
      team
    }
  }
`

const TICKET_STATUS_SORT = gql`
  query {
    InProcessticket: tickets(status: "VGlja2V0U3RhdHVzVHlwZTox") {
      edgeCount
    }
    Resolvedticket: tickets(status: "VGlja2V0U3RhdHVzVHlwZToy") {
      edgeCount
    }
  }
`

const InfoCard = ({ count, title, style }) => (
  <div
    style={{
      padding: 15,
      borderRadius: 8,
      background: '#eee',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: 'column',
      maxWidth: 100,
      ...style,
    }}
  >
    <Text style={{ fontSize: 22, fontWeight: 600 }}>{count}</Text>
    <Text
      style={{
        fontSize: 16,
        textAlign: 'center',
        fontWeight: 600,
        display: 'block',
        lineHeight: '20px',
      }}
    >
      {title}
    </Text>
  </div>
)

const dateFormate = 'YYYY-MM-DD'

export default () => {
  const [createTicketDrawer, setCreateTicketDrawer] = useState(false)
  const [form, setForm] = useState()
  const [to, setTo] = useState()
  const [tickets, setTickets] = useState()
  const [newTicket, setNewTicket] = useState()

  const {
    data: ticketsData,
    error: ticketsError,
    loading: ticketLoading,
    refetch: ticketRefetch,
  } = useQuery(TICKETS_QUERY, {
    variables: {
      form: form && to ? moment(form).format(dateFormate) : null,
      to: to && form ? moment(to).format(dateFormate) : null,
    },
  })
  const { data: ticketStatusInfo } = useQuery(TICKET_STATUS_SORT)

  useEffect(() => {
    if (newTicket) {
      ticketRefetch()
      setNewTicket(null)
    }
  }, [newTicket])

  useEffect(() => {
    if (ticketsData) {
      setTickets(
        ticketsData.tickets.edges.map(({ node }) => {
          return {
            date: moment(node.createdAt).format('YYYY-MM-DD'),
            piority: node.priority.priority,
            status: node.status.status,
            issue: node.subject,
          }
        }),
      )
    }
  }, [ticketsData])

  return (
    <div>
      <div style={{ display: 'flex', marginBottom: 30, marginTop: 40 }}>
        <InfoCard
          count={ticketStatusInfo?.InProcessticket.edgeCount}
          title="Active Tickets"
          style={{
            marginRight: 30,
          }}
        />
        <InfoCard
          count={ticketStatusInfo?.Resolvedticket.edgeCount}
          title="Resolved Tickets"
          style={{
            marginRight: 30,
          }}
        />
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: 25,
        }}
      >
        <Button
          size="large"
          style={{ marginRight: 20 }}
          onClick={() => setCreateTicketDrawer(true)}
        >
          <PlusOutlined style={{ fontSize: 24, marginTop: 5, fontWeight: 600 }} />
        </Button>

        <DatePicker
          size="large"
          placeholder="Form Date"
          value={form}
          onChange={newDate => setForm(newDate)}
          style={{ marginRight: 20 }}
        />
        <DatePicker
          placeholder="To Date"
          size="large"
          value={to}
          onChange={newDate => setTo(newDate)}
        />
      </div>

      {ticketsError && 'Opps their is something wrong'}
      {ticketLoading && <Spin />}
      {ticketsData && (
        <Table
          pagination={false}
          columns={[
            {
              title: 'Date',
              dataIndex: 'date',
              width: '16%',
            },
            {
              title: 'Piority',
              dataIndex: 'piority',
              width: '12%',
            },
            {
              title: 'Status',
              dataIndex: 'status',
              width: '12%',
            },
            {
              title: 'Issues',
              dataIndex: 'issue',
              width: '30%',
            },
          ]}
          dataSource={tickets}
        />
      )}

      <Drawer
        visible={createTicketDrawer}
        onClose={() => setCreateTicketDrawer(false)}
        title="Add Support Ticket"
        width="400px"
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            background: '#fff',
            padding: 30,
            paddingTop: 0,
          }}
        >
          <CreateTicketForm setOpen={setCreateTicketDrawer} setNewTicket={setNewTicket} />
        </div>
      </Drawer>
    </div>
  )
}

const CreateTicketForm = Form.create()(({ form, setOpen, setNewTicket }) => {
  const { data: ticketPriorityData, loading: ticketPriorityLoading } = useQuery(TICKET_PRIORITY)

  const { data: ticketAssignData, loading: ticketAssignLoading } = useQuery(TICKET_ASSIGN)

  const { data: ticketServiceData, loading: ticketServiceLoading } = useQuery(TICKET_SERVICE)

  const { data: ticketStatusData, loading: ticketStatusLoading } = useQuery(TICKET_STATUS)

  const [
    createTicket,
    { data: createTicketData, error: createTicketError, loading: createTicketLoading },
  ] = useMutation(CREATE_TICKET)

  useEffect(() => {
    if (createTicketData) {
      notification.success({
        message: 'New support ticket create sucessfully',
      })
      form.resetFields()
      setOpen(false)
      setNewTicket(createTicketData.createTicket.ticket)
    }
  }, [createTicketData])

  useEffect(() => {
    if (createTicketError) {
      notification.success({
        message: 'Faild to create new support ticket',
      })
    }
  }, [createTicketError])

  const handleSubmit = e => {
    e.preventDefault()
    // eslint-disable-next-line no-shadow
    form.validateFields((error, values) => {
      if (!error) {
        createTicket({
          variables: {
            issue: values.issue,
            description: values.description,
            priority: values.priority,
            service: values.service,
            assign: values.assign,
          },
        })
      }
    })
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Item label="Issue">
        {form.getFieldDecorator('issue', {
          rules: [{ required: true, message: 'Please give the issue name!' }],
        })(<Input placeholder="Type the issue name" />)}
      </Form.Item>
      <Form.Item label="Description">
        {form.getFieldDecorator('description')(<TextArea placeholder="Give more details" />)}
      </Form.Item>
      <Form.Item label="Assign">
        {form.getFieldDecorator('assign', {
          rules: [{ required: true, message: 'Please select one!' }],
        })(
          <Select placeholder="Select one" size="large" loading={ticketAssignLoading}>
            {ticketAssignData?.ticketAssign.map(({ id, team }) => (
              <Option key={id} value={id}>
                {team}
              </Option>
            ))}
          </Select>,
        )}
      </Form.Item>
      <Form.Item label="Priority">
        {form.getFieldDecorator('priority', {
          rules: [{ required: true, message: 'Please select a priority!' }],
        })(
          <Select placeholder="Select priority" size="large" loading={ticketPriorityLoading}>
            {ticketPriorityData?.ticketPriority.map(({ id, priority }) => (
              <Option key={id} value={id}>
                {priority}
              </Option>
            ))}
          </Select>,
        )}
      </Form.Item>
      <Form.Item label="Service Issue">
        {form.getFieldDecorator('service', {
          rules: [{ required: true, message: 'Please select a service!' }],
        })(
          <Select placeholder="Select a service issue" size="large" loading={ticketServiceLoading}>
            {ticketServiceData?.ticketService.map(({ id, service }) => (
              <Option key={id} value={id}>
                {service}
              </Option>
            ))}
          </Select>,
        )}
      </Form.Item>
      <Form.Item label="Status">
        {form.getFieldDecorator('status', {
          rules: [{ required: true, message: 'Please select a status!' }],
        })(
          <Select placeholder="Select a status" size="large" loading={ticketStatusLoading}>
            {ticketStatusData?.ticketStatus.map(({ id, status }) => (
              <Option key={id} value={id}>
                {status}
              </Option>
            ))}
          </Select>,
        )}
      </Form.Item>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Button
          type="primary"
          htmlType="submit"
          style={{ marginTop: 15, fontSize: 16, width: '46%', height: 40 }}
          loading={createTicketLoading}
        >
          Create Target
        </Button>

        <Button
          type="danger"
          style={{ marginTop: 15, fontSize: 16, width: '46%', height: 40 }}
          onClick={() => {
            form.resetFields()
            setOpen(false)
          }}
        >
          Cancle
        </Button>
      </div>
    </Form>
  )
})
