import React from 'react'
import { Helmet } from 'react-helmet'
import { Table, Button, Collapse, Card, Avatar, Form, Select, DatePicker } from 'antd'

import Authorize from 'components/LayoutComponents/Authorize'

import EditStaffBasicInfo from 'components/staff/EditStaffBasicInfo'

import ReactHTMLTableToExcel from 'react-html-table-to-excel'
// import EditHrDetails from 'components/staff/EditHrDetails'
// import EditCertificationDetails from 'components/staff/EditCertificationDetails'
// import EditHealthForm from 'components/learner/EditHealthForm'
import {
  ContactsOutlined,
  FileDoneOutlined,
  AuditOutlined,
  UserOutlined,
  FilterOutlined,
  PlusOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  PrinterOutlined,
} from '@ant-design/icons'
import { gql } from 'apollo-boost'
import client from '../apollo/config'

const { Panel } = Collapse
const { Meta } = Card
const { RangePicker } = DatePicker

class StaffTable extends React.Component {
  state = {
    divShow: false,
    filterShow: false,
    staffdata: [],
    realStaffList: [],
    UserProfile: null,
    isLoaded: true,
  }

  componentDidMount() {
    client
      .query({
        query: gql`
          {
            staffs {
              edges {
                node {
                  id
                  name
                  email
                  gender
                  localAddress
                  userRole {
                    id
                    name
                  }
                }
              }
            }
          }
        `,
      })
      .then(result => {
        this.setState({
          isLoaded: false,
          staffdata: result.data.staffs.edges,
        })
      })
  }

  info = e => {
    client
      .query({
        query: gql`{staff(id:"${e.id}"){
          id,
          name,
          email,
          gender,
          localAddress,
          designation,
          empType,
          salutation,
          dateOfJoining,
          dob,
          surname,
          contactNo,
          emergencyContact,
          emergencyName,
          employeeId,
          clinicLocation{
            id,
            location
          },
          userRole{
            id,
            name
          }
          
        }}`,
      })
      .then(result => {
        this.setState({
          UserProfile: result.data.staff,
        })
      })
    this.setState({
      divShow: true,
    })
  }

  handleChange = (pagination, filters, sorter) => {
    console.log('Various parameters', pagination, filters, sorter)
  }

  divShowHide = () => {
    this.setState({ divShow: true })
  }

  onFinish = values => {
    alert()
    console.log('Received values of form: ', values)
  }

  selectActiveStatus = value => {
    if (value === 'all') {
      client
        .query({
          query: gql`
            {
              staffs {
                edges {
                  node {
                    id
                    name
                    email
                    gender
                    localAddress
                  }
                }
              }
            }
          `,
        })
        .then(result => {
          this.setState({
            staffdata: result.data.staffs.edges,
            realStaffList: [],
          })
        })
    }
    if (value === 'active') {
      client
        .query({
          query: gql`
            {
              staffs(isActive: true) {
                edges {
                  node {
                    id
                    name
                    email
                    gender
                    localAddress
                  }
                }
              }
            }
          `,
        })
        .then(result => {
          this.setState({
            staffdata: result.data.staffs.edges,
            realStaffList: [],
          })
        })
    }
    if (value === 'in-active') {
      client
        .query({
          query: gql`
            {
              staffs(isActive: false) {
                edges {
                  node {
                    id
                    name
                    email
                    gender
                    localAddress
                  }
                }
              }
            }
          `,
        })
        .then(result => {
          this.setState({
            staffdata: result.data.staffs.edges,
            realStaffList: [],
          })
        })
    }
  }

  selectCategoryOption = value => {
    this.setState({
      isLoaded: true,
    })
    if (value === 'select') {
      client
        .query({
          query: gql`
            {
              staffs {
                edges {
                  node {
                    id
                    name
                    email
                    gender
                    localAddress
                    userRole {
                      id
                      name
                    }
                  }
                }
              }
            }
          `,
        })
        .then(result => {
          this.setState({
            isLoaded: false,
            staffdata: result.data.staffs.edges,
            realStaffList: [],
          })
        })
    }
    if (value === 'therapist') {
      client
        .query({
          query: gql`
            {
              staffs(userRole: "VXNlclJvbGVUeXBlOjE=") {
                edges {
                  node {
                    id
                    name
                    email
                    gender
                    localAddress
                    userRole {
                      id
                      name
                    }
                  }
                }
              }
            }
          `,
        })
        .then(result => {
          this.setState({
            isLoaded: false,
            staffdata: result.data.staffs.edges,
            realStaffList: [],
          })
        })
    } else if (value === 'technician') {
      client
        .query({
          query: gql`
            {
              staffs(userRole: "VXNlclJvbGVUeXBlOjI=") {
                edges {
                  node {
                    id
                    name
                    email
                    gender
                    localAddress
                    userRole {
                      id
                      name
                    }
                  }
                }
              }
            }
          `,
        })
        .then(result => {
          this.setState({
            isLoaded: false,
            staffdata: result.data.staffs.edges,
            realStaffList: [],
          })
        })
    }
  }

  selectGenderOption = value => {
    this.setState({
      isLoaded: true,
    })
    if (value === 'male') {
      client
        .query({
          query: gql`
            {
              staffs(gender: "male") {
                edges {
                  node {
                    id
                    name
                    email
                    gender
                    localAddress
                    userRole {
                      id
                      name
                    }
                  }
                }
              }
            }
          `,
        })
        .then(result => {
          this.setState({
            isLoaded: false,
            staffdata: result.data.staffs.edges,
            realStaffList: [],
          })
        })
    } else if (value === 'female') {
      client
        .query({
          query: gql`
            {
              staffs(gender: "female") {
                edges {
                  node {
                    id
                    name
                    email
                    gender
                    localAddress
                    userRole {
                      id
                      name
                    }
                  }
                }
              }
            }
          `,
        })
        .then(result => {
          this.setState({
            isLoaded: false,
            staffdata: result.data.staffs.edges,
            realStaffList: [],
          })
        })
    }
  }

  selectDateRange = value => {
    this.setState({
      isLoaded: true,
    })
    const start = new Date(value[0]).toISOString().slice(0, 10)
    const end = new Date(value[1]).toISOString().slice(0, 10)

    client
      .query({
        query: gql`{staffs(dateOfJoining_Gte: "${start}",dateOfJoining_Lte: "${end}",) {edges {node {id,name,email,gender,localAddress,userRole{id,name}}}}}`,
      })
      .then(result => {
        this.setState({
          isLoaded: false,
          staffdata: result.data.staffs.edges,
          realStaffList: [],
        })
      })
  }

  filterToggle(toggle) {
    if (toggle) {
      this.setState({
        filterShow: false,
      })
    } else {
      this.setState({
        filterShow: true,
      })
    }
  }

  render() {
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        // render: name => <a onClick={(e) => this.consoleValue(e, name)} onKeyPress={(e) => this.consoleValue(e, name)} role="button" tabIndex="0">{name}</a>,
        ellipsis: true,
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        ellipsis: true,
      },
      {
        title: 'Role',
        dataIndex: 'userRole.name',
        key: 'designation',
        ellipsis: true,
      },
      {
        title: 'Gender',
        dataIndex: 'gender',
        key: 'gender',
        ellipsis: true,
      },
      {
        title: 'Address',
        dataIndex: 'localAddress',
        key: 'local_address',
        ellipsis: true,
      },
    ]
    const { divShow, filterShow, staffdata, UserProfile, isLoaded, realStaffList } = this.state

    if (!realStaffList.length > 0) {
      staffdata.map(item => realStaffList.push(item.node))
    }

    if (isLoaded) {
      return <div>Loading...</div>
    }
    const divClass = divShow ? 'col-sm-8' : 'col-sm-12'
    const detailsDiv = divShow ? { display: 'block', paddingLeft: '0' } : { display: 'none' }
    const filterDiv = filterShow
      ? { display: 'block', padding: '0', marginBottom: '0', backgroundColor: 'inherit' }
      : { display: 'none' }
    // const {Column} = Table;
    const filterOptionStyle = { display: 'inline-block', marginRight: '10px' }
    return (
      <Authorize roles={['school_admin']} redirect to="/dashboard/beta">
        <Helmet title="Partner" />
        {/* <div className="utils__title utils__title--flat mb-3">
          <strong className="text-uppercase font-size-16">Responsive Tables</strong>
        </div> */}
        <div className="row">
          <div className={divClass}>
            <div className="card" style={{ backgroundColor: 'inherit', marginBottom: '0' }}>
              <div className="card-body" style={{ padding: '0', marginBottom: '0' }}>
                <Button onClick={() => this.filterToggle(filterShow)}>
                  Filter <FilterOutlined />
                </Button>
                <p style={{ float: 'right' }}>
                  <Button>
                    <a href="/#/partners/staff">
                      Add Staff <PlusOutlined />
                    </a>
                  </Button>
                  <Button>
                    Excel <FileExcelOutlined />
                  </Button>
                  <Button>
                    PDF <FilePdfOutlined />
                  </Button>
                  <Button>
                    Print <PrinterOutlined />
                  </Button>
                </p>
              </div>
            </div>
            <div className="card" style={filterDiv}>
              <div className="card-body" style={{ padding: '0', marginBottom: '0' }}>
                <Form.Item label="" style={filterOptionStyle}>
                  <Select
                    style={{ width: '120px' }}
                    defaultValue="all"
                    onSelect={this.selectActiveStatus}
                  >
                    <Select.Option value="all">Status (All)</Select.Option>
                    <Select.Option value="active">Active</Select.Option>
                    <Select.Option value="in-active">In-active</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item label="" style={filterOptionStyle}>
                  <Select
                    style={{ width: '120px' }}
                    defaultValue="select"
                    onSelect={this.selectCategoryOption}
                  >
                    <Select.Option value="select">Category (All)</Select.Option>
                    <Select.Option value="therapist">Therapist</Select.Option>
                    <Select.Option value="technician">Technician</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item label="" style={filterOptionStyle}>
                  <Select
                    style={{ width: '120px' }}
                    defaultValue="select"
                    onSelect={this.selectGenderOption}
                  >
                    <Select.Option value="select">Gender (All)</Select.Option>
                    <Select.Option value="male">Male</Select.Option>
                    <Select.Option value="female">Female</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item label="" style={filterOptionStyle}>
                  <RangePicker style={{ marginTop: '3px' }} onChange={this.selectDateRange} />
                </Form.Item>
              </div>
            </div>
            <div className="card">
              <ReactHTMLTableToExcel
                id="test-table-xls-button"
                className="ant-btn"
                table="stafftable"
                filename="staffs"
                sheet="staff"
                buttonText="Excel"
              />
              <div className="card-body" style={{ padding: '0' }}>
                <Table
                  id="stafftable"
                  columns={columns}
                  onRowClick={e => this.info(e)}
                  dataSource={realStaffList}
                  bordered
                  onChange={this.handleChange}
                />
              </div>
            </div>
          </div>
          <div className="col-sm-4" style={detailsDiv}>
            <div className="card" style={{ minHeight: '600px' }}>
              <div className="card-body">
                <div className="table-operations" style={{ marginBottom: '16px' }}>
                  <Button
                    style={{
                      marginRight: '-12px',
                      float: 'right',
                      border: 'none',
                      padding: 'none',
                    }}
                    onClick={() => this.setState({ divShow: false })}
                  >
                    X
                  </Button>
                </div>
                <div>
                  <p style={{ textAlign: 'center' }}>
                    <span style={{ padding: '5px' }}>
                      <ContactsOutlined /> Appointment
                    </span>
                    <span style={{ padding: '5px' }}>
                      <FileDoneOutlined /> Task
                    </span>
                    <span style={{ padding: '5px' }}>
                      <AuditOutlined /> Attendence
                    </span>
                    <span style={{ padding: '5px' }}>
                      <UserOutlined /> Timesheet
                    </span>
                  </p>
                  <Card style={{ marginTop: '26px', border: 'none' }}>
                    <Meta
                      avatar={
                        <Avatar
                          src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                          style={{ width: '100px', height: '100px', border: '1px solid #f6f7fb' }}
                        />
                      }
                      title={
                        <h5 style={{ marginTop: '20px' }}>
                          {UserProfile ? UserProfile.name : ''}
                          {/* <span style={{float:'right', fontSize:'12px', padding:'5px'}}>delete</span>
                          <span style={{float:'right', fontSize:'12px', padding:'5px'}}>edit</span> */}
                        </h5>
                      }
                      description={
                        <div>
                          <p style={{ fontSize: '13px', marginBottom: '4px' }}>
                            {' '}
                            Therapist{' '}
                            <span
                              style={{
                                backgroundColor: '#52c41a',
                                color: 'white',
                                borderRadius: '3px',
                                padding: '1px 5px',
                              }}
                            >
                              Active
                            </span>
                          </p>
                        </div>
                      }
                    />
                  </Card>
                  {UserProfile ? (
                    <Collapse defaultActiveKey="1" accordion bordered={false}>
                      <Panel header="Basic Details" key="1">
                        <EditStaffBasicInfo key={UserProfile.id} userinfo={UserProfile} />
                      </Panel>
                      {/* <Panel header="HR Details" key="2">
                        <EditHrDetails />
                      </Panel>
                      <Panel header="Health Details" key="3">
                        <EditCertificationDetails />
                      </Panel>
                      <Panel header="Intake Form" key="4">
                        <EditHealthForm />
                      </Panel> */}
                    </Collapse>
                  ) : (
                    ''
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Authorize>
    )
  }
}

export default StaffTable
