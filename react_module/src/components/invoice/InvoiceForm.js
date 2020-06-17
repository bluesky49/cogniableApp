/* eslint-disable array-callback-return */
/* eslint-disable no-shadow */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-closing-tag-location */
import React, { useEffect, useState } from 'react'
import { Form, Select, Input, Checkbox, Typography, Button, notification, DatePicker } from 'antd'
import gql from 'graphql-tag'
import { useMutation, useQuery } from 'react-apollo'
import moment from 'moment'
import InvoiceItemsTable from './InvoiceItemsTable'
import './invoiceForm.scss'

const { Option } = Select
const { Text, Title } = Typography
const { TextArea } = Input

const CREATE_INVOICE = gql`
  mutation createInvoice(
    $customer: ID!
    $email: String!
    $status: ID!
    $issueDate: Date!
    $dueDate: Date!
    $address: String!
    $taxableSubtotal: Float!
    $discount: Float!
    $products: [FeeInput!]!
    $total: Float!
  ) {
    createInvoice(
      input: {
        invoiceNo: "# 0001"
        clinic: 8
        customer: $customer
        email: $email
        status: $status
        issueDate: $issueDate
        dueDate: $dueDate
        amount: 10.0
        address: $address
        taxableSubtotal: $taxableSubtotal
        discount: $discount
        total: $total
        products: $products
      }
    ) {
      details {
        id
        invoiceNo
        email
        issueDate
        dueDate
        amount
        address
        taxableSubtotal
        discount
        total
        clinic {
          id
          schoolName
        }
        status {
          id
          statusName
        }
        invoiceFee {
          edges {
            node {
              id
              quantity
              rate
              amount
              tax
              schoolServices {
                id
                name
              }
            }
          }
        }
      }
    }
  }
`

const ALL_STUDENT = gql`
  query {
    students {
      edges {
        node {
          id
          firstname
          internalNo
          email
          studentId
        }
      }
    }
  }
`

const INVOICE_STATUS = gql`
  query {
    invoiceStatusList {
      id
      statusName
      colorCode
    }
  }
`

// check make basic api intre
// intre all thing with api
// make recive Payment table
// make all view data correct

const countTotal = data => {
  let total = 0
  data.map(({ qty, rate }) => {
    total += Math.round(qty) * Math.floor(rate)
  })
  return total
}

const InvoiceForm = ({ form, setNewInvDrawer }) => {
  const { data: allSudent, loading: allSudentLoading } = useQuery(ALL_STUDENT)
  const { data: statusData, loading: statusLoading } = useQuery(INVOICE_STATUS)
  const [subTotal, setSubTotal] = useState(0)
  const [dataTable, setDataTable] = useState([
    {
      key: 1,
      service: '',
      qty: 1,
      rate: 0,
    },
  ])

  const [
    createInvoice,
    { data: newInvoiceData, loading: newInvoiceLoading, error: newInvoiceError },
  ] = useMutation(CREATE_INVOICE)

  useEffect(() => {
    if (dataTable) {
      const totalAmount = countTotal(dataTable)
      setSubTotal(totalAmount)
    }
  }, [dataTable])

  useEffect(() => {
    if (newInvoiceData) {
      notification.success({
        message: 'New Invoice Created Sucefully',
      })
      form.resetFields()
      setNewInvDrawer(false)
    }
  }, [newInvoiceData])

  useEffect(() => {
    if (newInvoiceError) {
      notification.error({
        message: 'Create Invoice Failed',
      })
    }
  }, [newInvoiceError])

  // useEffect(() => {
  //   let total = 0;
  //   dataTable.map((item) => {
  //     total += parseInt(item.amount, 10);
  //     return undefined;
  //   });
  //   setTotalAmount(total);
  // }, [dataTable]);

  const submit = e => {
    e.preventDefault()
    form.validateFields((error, values) => {
      if (!error) {
        createInvoice({
          variables: {
            customer: values.customer,
            email: values.email,
            status: values.status,
            issueDate: moment(values.issueDate).format('YYYY-MM-DD'),
            dueDate: moment(values.dueDate).format('YYYY-MM-DD'),
            address: values.address,
            taxableSubtotal: parseFloat(values.taxableSubtotal),
            discount: parseFloat(values.discount),
            total:
              subTotal -
              (subTotal / 100) * parseFloat(form.getFieldValue('discount')) +
              (subTotal / 100) * parseFloat(form.getFieldValue('taxableSubtotal')),
            products: dataTable.map(data => ({
              product: data.service,
              qty: data.qty,
              rate: parseFloat(data.rate),
              amount: data.amount,
              tax: 0,
            })),
          },
        })
      }
    })
  }

  return (
    <div style={{ padding: '0 100px' }}>
      <Form onSubmit={submit}>
        <div style={{ display: 'flex', marginTop: 50 }}>
          <Form.Item label="Customer">
            {form.getFieldDecorator('customer', {
              rules: [{ required: true, message: 'Please select a customer!' }],
            })(
              <Select
                style={{ width: 250 }}
                placeholder="Select a customer"
                size="large"
                showSearch
                optionFilterProp="name"
                loading={allSudentLoading}
              >
                {allSudent?.students.edges.map(({ node }) => {
                  return (
                    <Option key={node.id} value={node.id} name={node.firstname}>
                      {node.firstname}
                    </Option>
                  )
                })}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="Customer Email" style={{ marginLeft: 20 }}>
            {form.getFieldDecorator('email', {
              rules: [{ required: true, message: 'Please select a customer!' }],
            })(
              <div style={{ marginTop: 0 }}>
                <Input
                  type="email"
                  style={{ width: 250, display: 'block' }}
                  placeholder="customer email"
                  size="large"
                />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <Checkbox /> Send Later
                  </div>
                  <Text
                    style={{
                      marginLeft: 'auto',
                      color: 'rgba(2, 169, 244, 1)',
                    }}
                  >
                    Cc/Bcc
                  </Text>
                </div>
              </div>,
            )}
          </Form.Item>

          <div style={{ marginLeft: 'auto' }}>
            <Text style={{ fontSize: 20, color: '#000' }}>BALANCE DUE:</Text>
            <Title style={{ marginTop: 10 }}>
              {subTotal -
                (subTotal / 100) * parseFloat(form.getFieldValue('discount')) +
                (subTotal / 100) * parseFloat(form.getFieldValue('taxableSubtotal'))}
            </Title>
          </div>
        </div>

        <div style={{ display: 'flex', marginTop: -20 }}>
          <Form.Item label="Billing Address">
            {form.getFieldDecorator('address', {
              rules: [{ required: true, message: 'Please give the Billing Adress' }],
            })(<TextArea style={{ resize: 'none', width: 250, height: 120 }} />)}
          </Form.Item>
          <Form.Item label="Status" style={{ marginBottom: 0, marginRight: 20, marginLeft: 20 }}>
            {form.getFieldDecorator('status', {
              rules: [{ required: true, message: 'Please select a status!' }],
            })(
              <Select
                style={{ width: 200 }}
                placeholder="Select a terms"
                size="large"
                loading={statusLoading}
              >
                {statusData?.invoiceStatusList.map(status => {
                  return (
                    <Option key={status.id} value={status.id}>
                      {status.statusName}
                    </Option>
                  )
                })}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="Issue date" style={{ marginRight: 20 }}>
            {form.getFieldDecorator('issueDate', {
              rules: [{ required: true, message: 'Please give the issue date' }],
            })(<DatePicker size="large" placeholder="Select the issue date" />)}
          </Form.Item>
          <Form.Item label="Due date">
            {form.getFieldDecorator('dueDate', {
              rules: [{ required: true, message: 'Please give the due date' }],
            })(<DatePicker size="large" placeholder="Select the due date" />)}
          </Form.Item>
        </div>

        <InvoiceItemsTable
          style={{ marginTop: 25 }}
          dataSource={dataTable}
          setDataSource={setDataTable}
          totalAmount={subTotal}
        />

        <div
          style={{
            marginTop: 30,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}
            >
              <Form.Item label="Taxable Subtotal" style={{ marginBottom: 3 }}>
                {form.getFieldDecorator('taxableSubtotal', { initialValue: 0 })(
                  <Input
                    size="large"
                    placeholder="Add tax"
                    type="number"
                    suffix="%"
                    min={0}
                    style={{ width: 160 }}
                  />,
                )}
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: 600,
                    marginLeft: 30,
                    marginTop: 5,
                  }}
                >
                  {subTotal -
                    (subTotal / 100) * parseFloat(form.getFieldValue('discount')) +
                    (subTotal / 100) * parseFloat(form.getFieldValue('taxableSubtotal'))}
                  $
                </Text>
              </Form.Item>
            </div>

            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Form.Item label="Discount Percent" style={{ marginBottom: 10 }}>
                {form.getFieldDecorator('discount', { initialValue: 0 })(
                  <Input
                    size="large"
                    placeholder="Give a discount"
                    type="number"
                    suffix="%"
                    style={{ width: 160 }}
                    min={0}
                  />,
                )}
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: 600,
                    marginLeft: 30,
                    marginTop: 5,
                  }}
                >
                  {subTotal - (subTotal / 100) * parseFloat(form.getFieldValue('discount'))}$
                </Text>
              </Form.Item>
            </div>

            <div style={{ marginTop: 10 }}>
              <Text style={{ fontSize: 20, fontWeight: 600 }}>Total:</Text>
              <Text style={{ fontSize: 22, fontWeight: 600, marginLeft: 10 }}>
                {subTotal -
                  (subTotal / 100) * parseFloat(form.getFieldValue('discount')) +
                  (subTotal / 100) * parseFloat(form.getFieldValue('taxableSubtotal'))}
              </Text>
            </div>
            <div style={{ marginTop: 10 }}>
              <Text style={{ fontSize: 20, fontWeight: 600 }}>Balance Due:</Text>
              <Text style={{ fontSize: 22, fontWeight: 600, marginLeft: 10 }}>
                {subTotal -
                  (subTotal / 100) * parseFloat(form.getFieldValue('discount')) +
                  (subTotal / 100) * parseFloat(form.getFieldValue('taxableSubtotal'))}
              </Text>
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            margin: '50px 0px',
            border: '1px solid #e4e9f0',
            padding: 15,
            borderRadius: 4,
          }}
        >
          <Button
            type="danger"
            onClick={() => {
              setNewInvDrawer(false)
              form.resetFields()
            }}
          >
            Cancle
          </Button>

          <Button
            htmlType="submit"
            type="primary"
            loading={newInvoiceLoading}
            style={{ marginLeft: 'auto', marginRight: 10 }}
          >
            Save
          </Button>
          <Button type="primary">Save an Send</Button>
        </div>
      </Form>
    </div>
  )
}

export default Form.create()(InvoiceForm)
