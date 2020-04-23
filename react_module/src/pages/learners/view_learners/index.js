/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-closing-bracket-location */
import React from 'react'
import { Helmet } from 'react-helmet'
import { Table, Button, Collapse, Card, Avatar, Form, Select, DatePicker, Input } from 'antd'
import Authorize from 'components/LayoutComponents/Authorize'
import { Scrollbars } from 'react-custom-scrollbars'
// import style from '../learnerform.scss'
import EditBasicInformationForm from 'components/learner/EditBasicInformationForm'
// import EditInsuranceForm from 'components/learner/EditInsuranceForm'
// import EditHealthForm from 'components/learner/EditHealthForm'
// import EditIntakeForm from 'components/learner/EditIntakeForm'
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
import client from '../../../apollo/config'

const API_URL = process.env.REACT_APP_API_URL
const { Panel } = Collapse
const { Meta } = Card
const { Search } = Input
const { RangePicker } = DatePicker

class LearnerTable extends React.Component {
  state = {
    // filteredInfo: null,
    // sortedInfo: null,
    divShow: false,
    filterShow: false,
    isLoaded: true,
    LearnersList: [],
    UserProfile: null,
    categoryList: [],
    realLearnerList: [],
  }

  componentDidMount() {
    client
      .query({
        query: gql`
          query {
            students {
              edges {
                node {
                  id
                  firstname
                  email
                  dob
                  mobileno
                  category {
                    id
                    category
                  }
                }
              }
            }
            category {
              id
              category
            }
          }
        `,
      })
      .then(result => {
        this.setState({
          isLoaded: false,
          LearnersList: result.data.students.edges,
          categoryList: result.data.category,
        })
      })
  }

  handleChange = (pagination, filters, sorter) => {
    console.log('Various parameters', pagination, filters, sorter)
    // this.setState({
    //     filteredInfo: filters,
    //     sortedInfo: sorter,

    // });
  }

  info = e => {
    client
      .query({
        query: gql`{student(id:"${e.id}"){
        id,
        firstname,
        email,
        dob,
        mobileno,
        lastname,
        gender,
        currentAddress,
        clientId,
        category{
          id,
          category
        },
        clinicLocation{
          id,
          location
        },
        authStaff{
          edges {
            node {
              id,
              name,
            }
          }
        },
      }}`,
      })
      .then(result => {
        this.setState({
          UserProfile: result.data.student,
        })
      })
    this.setState({
      divShow: true,
    })
  }

  onFinish = values => {
    console.log('Received values of form: ', values)
  }

  selectActiveStatus = value => {
    if (value === 'all') {
      client
        .query({
          query: gql`
            {
              students {
                edges {
                  node {
                    id
                    firstname
                    email
                    dob
                    mobileno
                    category {
                      id
                      category
                    }
                  }
                }
              }
            }
          `,
        })
        .then(result => {
          this.setState({
            LearnersList: result.data.students.edges,
            realLearnerList: [],
          })
        })
    }
    if (value === 'active') {
      client
        .query({
          query: gql`
            {
              students(isActive: true) {
                edges {
                  node {
                    id
                    firstname
                    email
                    dob
                    mobileno
                    category {
                      id
                      category
                    }
                  }
                }
              }
            }
          `,
        })
        .then(result => {
          this.setState({
            LearnersList: result.data.students.edges,
            realLearnerList: [],
          })
        })
    }
    if (value === 'in-active') {
      client
        .query({
          query: gql`
            {
              students(isActive: false) {
                edges {
                  node {
                    id
                    firstname
                    email
                    dob
                    mobileno
                    category {
                      id
                      category
                    }
                  }
                }
              }
            }
          `,
        })
        .then(result => {
          this.setState({
            LearnersList: result.data.students.edges,
            realLearnerList: [],
          })
        })
    }
  }

  selectCategoryOption = value => {
    if (value === 'all') {
      client
        .query({
          query: gql`
            {
              students {
                edges {
                  node {
                    id
                    firstname
                    email
                    dob
                    mobileno
                    category {
                      id
                      category
                    }
                  }
                }
              }
            }
          `,
        })
        .then(result => {
          this.setState({
            LearnersList: result.data.students.edges,
            realLearnerList: [],
          })
        })
    } else {
      client
        .query({
          query: gql`{students(category:"${value}") {edges {node {id,firstname,email,dob,mobileno,category{id,category,},}}}}`,
        })
        .then(result => {
          this.setState({
            LearnersList: result.data.students.edges,
            realLearnerList: [],
          })
        })
    }
  }

  selectDateRange = value => {
    const start = new Date(value[0]).toISOString().slice(0, 10)
    const end = new Date(value[1]).toISOString().slice(0, 10)

    client
      .query({
        query: gql`{students(createdAt_Lte: "${end}",createdAt_Gte: "${start}",) {edges {node {id,firstname,email,dob,mobileno,category{id, category,},}}}}`,
      })
      .then(result => {
        this.setState({
          LearnersList: result.data.students.edges,
          realLearnerList: [],
        })
      })
  }

  handleSearch = searchText => {
    const { LearnersList } = this.state
    const slearnerList = []
    LearnersList.map(item => slearnerList.push(item.node))

    const filteredEvents = slearnerList.filter(({ email }) => {
      email = email.toLowerCase()
      return email.includes(searchText)
    })

    console.log(filteredEvents)
    this.setState({
      realLearnerList: filteredEvents,
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
    // let { sortedInfo, filteredInfo } = this.state;
    // sortedInfo = sortedInfo || {};
    // filteredInfo = filteredInfo || {};

    const { isLoaded, LearnersList, UserProfile, categoryList, realLearnerList } = this.state

    if (!realLearnerList.length > 0) {
      LearnersList.map(item => realLearnerList.push(item.node))
    }

    if (isLoaded) {
      return <div>Loading...</div>
    }

    const columns = [
      {
        title: 'Name',
        dataIndex: 'firstname',
        key: 'firstname',
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
        title: 'Date of Birth',
        dataIndex: 'dob',
        key: 'dob',
        ellipsis: true,
      },
      {
        title: 'Contact No',
        dataIndex: 'mobileno',
        key: 'ContactNo',
        ellipsis: true,
      },
      {
        title: 'Category',
        dataIndex: 'category.category',
        key: 'category',
        ellipsis: true,
      },
      {
        title: 'Session',
        dataIndex: '',
        key: 'x',
        render: () => (
          <span>
            <a style={{ marginRight: 16, color: '#0190fe' }}>Session</a>
          </span>
        ),
      },
      {
        title: 'Program',
        dataIndex: '',
        key: 'x',
        render: () => (
          <span>
            <a style={{ color: '#0190fe' }}>Program</a>
          </span>
        ),
      },
    ]
    const { divShow, filterShow } = this.state
    const divClass = divShow ? 'col-sm-8' : 'col-sm-12'
    const detailsDiv = divShow ? { display: 'block', paddingLeft: '0' } : { display: 'none' }
    const filterDiv = filterShow
      ? {
          display: 'block',
          padding: '0',
          marginBottom: '0',
          backgroundColor: 'inherit',
        }
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
                    <a href="#/partners/learner">
                      Add Learner <PlusOutlined />
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
                    defaultValue="all"
                    onSelect={this.selectCategoryOption}
                  >
                    <Select.Option value="all">Category (All)</Select.Option>
                    {categoryList.map(item => (
                      <Select.Option value={item.id}>{item.category}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item label="" style={filterOptionStyle}>
                  <RangePicker style={{ marginTop: '3px' }} onChange={this.selectDateRange} />
                </Form.Item>
                <Form.Item label="" style={filterOptionStyle}>
                  <Search
                    placeholder="Search Learner"
                    onSearch={this.handleSearch}
                    style={{ width: 200 }}
                  />
                </Form.Item>
              </div>
            </div>
            <div className="card">
              <div className="card-body" style={{ padding: '0' }}>
                <Table
                  columns={columns}
                  onRowClick={e => this.info(e)}
                  dataSource={realLearnerList}
                  bordered
                  onChange={this.handleChange}
                />
              </div>
            </div>
          </div>

          <div className="col-sm-4" style={detailsDiv}>
            <Scrollbars style={{ height: 650 }}>
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
                      <span style={{ padding: '5px', color: '#0190fe' }}>
                        <ContactsOutlined />
                        <a> Appointment</a>
                      </span>
                      <span style={{ padding: '5px', color: '#0190fe' }}>
                        <FileDoneOutlined />
                        <a> Task</a>
                      </span>
                      <span style={{ padding: '5px', color: '#0190fe' }}>
                        <AuditOutlined />
                        <a> Attendence</a>
                      </span>
                    </p>
                    <Card style={{ marginTop: '26px', border: 'none' }}>
                      <Meta
                        avatar={
                          <Avatar
                            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                            style={{
                              width: '100px',
                              height: '100px',
                              border: '1px solid #f6f7fb',
                            }}
                          />
                        }
                        title={
                          <h5 style={{ marginTop: '20px' }}>
                            {UserProfile ? UserProfile.firstname : ''}
                            <span
                              style={{
                                float: 'right',
                                fontSize: '12px',
                                padding: '5px',
                                color: '#0190fe',
                              }}
                            >
                              <a>Inactive</a>
                            </span>
                            <span
                              style={{
                                float: 'right',
                                fontSize: '12px',
                                padding: '5px',
                              }}
                            >
                              <a style={{ color: '#0190fe' }}>Edit</a>
                            </span>
                          </h5>
                        }
                        description={
                          <div>
                            <p style={{ fontSize: '13px', marginBottom: '4px' }}>
                              Authorization Status{' '}
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
                            <p style={{ fontSize: '13px', marginBottom: '4px' }}>
                              Intake Form Status{' '}
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
                            <p style={{ fontSize: '13px', marginBottom: '0' }}>
                              Date of Start 01/01/2020
                            </p>
                          </div>
                        }
                      />
                    </Card>
                    {UserProfile ? (
                      <Collapse defaultActiveKey="1" accordion bordered={false}>
                        <Panel header="Basic Details" key="1">
                          <EditBasicInformationForm key={UserProfile.id} userinfo={UserProfile} />
                        </Panel>
                        {/* <Panel header="Insurance Details" key="2">
                      <EditInsuranceForm />
                    </Panel>
                    <Panel header="Health Details" key="3">
                      <EditHealthForm />
                    </Panel>
                    <Panel header="Intake Form" key="4">
                      <EditIntakeForm />
                    </Panel> */}
                      </Collapse>
                    ) : (
                      ''
                    )}
                  </div>
                </div>
              </div>
            </Scrollbars>
          </div>
        </div>
      </Authorize>
    )
  }
}

export default LearnerTable
