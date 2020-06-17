/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable prefer-const */
/* eslint-disable object-shorthand */
import React from 'react'
import { Helmet } from 'react-helmet'
import Highlighter from 'react-highlight-words'
import {
  Table,
  Button,
  Collapse,
  Card,
  Avatar,
  Form,
  Select,
  DatePicker,
  Input,
  Icon,
  Drawer,
  Switch,
} from 'antd'
import Authorize from 'components/LayoutComponents/Authorize'
import { Scrollbars } from 'react-custom-scrollbars'
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
import { connect } from 'react-redux'
import { gql } from 'apollo-boost'
import EditBasicInformation from './EditBasicInformation'
import CreateLearner from '../createLearner'
import client from '../../../apollo/config'

const { Panel } = Collapse
const { Meta } = Card
const { Search } = Input
const { RangePicker } = DatePicker

@connect(({ user, learners }) => ({ user, learners }))
class LearnerTable extends React.Component {
  state = {
    divShow: false,
    filterShow: false,
    isLoaded: true,
    UserProfile: null,
    realLearnerList: [],
    searchText: '',
    searchedColumn: '',
    filteredInfo: null,
    // for create learner drawer
    visible: false,
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch({
      type: 'learners/GET_LEARNERS',
    })
    dispatch({
      type: 'learners/GET_LEARNERS_DROPDOWNS',
    })
  }

  handleChange = (pagination, filters, sorter) => {
    this.setState({
      filteredInfo: filters,
    })
  }

  info = e => {
    const { dispatch } = this.props
    // setting student id to local storage for further operations
    localStorage.setItem('studentId', JSON.stringify(e.id))

    dispatch({
      type: 'learners/SET_STATE',
      payload: {
        UserProfile: e,
        isUserProfile: true,
      },
    })
    this.setState({
      divShow: true,
    })
  }

  showDrawer = () => {
    this.setState({
      visible: true,
    })
  }

  onClose = () => {
    this.setState({
      visible: false,
    })
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

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),

    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select())
      }
    },
    render: text =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
        text
      ),
  })

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm()
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    })
  }

  handleReset = clearFilters => {
    clearFilters()
    this.setState({ searchText: '' })
  }

  learnerActiveInactive = checked => {
    const {
      dispatch,
      learners: { UserProfile },
    } = this.props
    console.log(UserProfile.id, checked)

    dispatch({
      type: 'learners/LEARNER_ACTIVE_INACTIVE',
      payload: {
        id: UserProfile.id,
        checked: checked,
      },
    })
  }

  showProgram = () => {
    console.log('===> studnet selected')
    window.location.href = '/#/therapistStudent'
  }

  showSession = () => {
    console.log('===> studnet selected')
    window.location.href = '/#/sessionDetails'
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
    let { filteredInfo } = this.state
    filteredInfo = filteredInfo || {}
    const {
      learners: { loading, LearnersList, isUserProfile, UserProfile },
    } = this.props

    if (loading) {
      return <div>Loading...</div>
    }

    const columns = [
      {
        title: 'Name',
        dataIndex: 'firstname',
        key: 'firstname',
        // render: name => <a onClick={(e) => this.consoleValue(e, name)} onKeyPress={(e) => this.consoleValue(e, name)} role="button" tabIndex="0">{name}</a>,
        width: 150,
        fixed: 'left',
        ...this.getColumnSearchProps('firstname'),
      },
      {
        title: 'Session',
        width: 100,
        key: 'x',
        fixed: 'left',
        render: () => (
          <span>
            <Button onClick={this.showSession} style={{ color: '#0190fe', border: 'none' }}>
              Session
            </Button>
          </span>
        ),
      },
      {
        title: 'Program',
        width: 100,
        key: 'y',
        fixed: 'left',
        render: () => (
          <span>
            <Button onClick={this.showProgram} style={{ color: '#0190fe', border: 'none' }}>
              Program
            </Button>
          </span>
        ),
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        width: 250,
        ...this.getColumnSearchProps('email'),
      },
      {
        title: 'Date of Birth',
        dataIndex: 'dob',
        key: 'dob',
        width: 150,
      },
      {
        title: 'Contact No',
        dataIndex: 'mobileno',
        key: 'ContactNo',
        width: 150,
      },
      {
        title: 'Client Id',
        dataIndex: 'clientId',
        key: 'clientId',
        width: 150,
      },
      {
        title: 'Gender',
        dataIndex: 'gender',
        key: 'gender',
        width: 150,
        filters: [
          { text: 'Male', value: 'male' },
          { text: 'Female', value: 'female' },
        ],
        filteredValue: filteredInfo.gender || null,
        onFilter: (value, record) => record.gender.includes(value),
      },
      {
        title: 'Category',
        dataIndex: 'category.category',
        key: 'category',
        width: 150,
        filters: [
          { text: 'Home', value: 'Home' },
          { text: 'Center', value: 'Center' },
          { text: 'Remote', value: 'Remote' },
        ],
        filteredValue: filteredInfo.category || null,
        onFilter: (value, record) => record.category.category.includes(value),
      },
      {
        title: 'Address',
        dataIndex: 'currentAddress',
        key: 'address',
        width: 300,
      },
      {
        title: 'Clinic Location',
        dataIndex: 'clinicLocation.location',
        key: 'location',
        width: 150,
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

    const filterOptionStyle = { display: 'inline-block', marginRight: '10px' }
    const customSpanStyle = {
      backgroundColor: '#52c41a',
      color: 'white',
      borderRadius: '3px',
      padding: '1px 5px',
    }

    return (
      <Authorize roles={['school_admin', 'therapist']} redirect to="/dashboard/beta">
        <Helmet title="Partner" />

        <div className="row">
          <div className={divClass}>
            <div className="card" style={{ backgroundColor: 'inherit', marginBottom: '0' }}>
              <div className="card-body" style={{ padding: '0', marginBottom: '0' }}>
                <Button onClick={() => this.filterToggle(filterShow)}>
                  Filter <FilterOutlined />
                </Button>
                <p style={{ float: 'right' }}>
                  {/* <Button>
                    <a href="#/partners/learner">
                      Add Learner <PlusOutlined />
                    </a>
                  </Button> */}
                  <Button onClick={this.showDrawer}>
                    Add Learner <PlusOutlined />
                  </Button>
                  {/* <Button>
                    Excel <FileExcelOutlined />
                  </Button>
                  <Button>
                    PDF <FilePdfOutlined />
                  </Button>
                  <Button>
                    Print <PrinterOutlined />
                  </Button> */}
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
                  <RangePicker style={{ marginTop: '3px' }} onChange={this.selectDateRange} />
                </Form.Item>
              </div>
            </div>
            <div className="card">
              <div className="card-body" style={{ padding: '0' }}>
                <Table
                  columns={columns}
                  onRowClick={e => this.info(e)}
                  dataSource={LearnersList}
                  bordered
                  scroll={{ x: 1000 }}
                  onChange={this.handleChange}
                />
              </div>
            </div>
          </div>

          <div className="col-sm-4" style={detailsDiv}>
            {UserProfile ? (
              <Scrollbars key={UserProfile.id} style={{ height: 650 }}>
                <div className="card" style={{ minHeight: '600px', border: '1px solid #f4f6f8' }}>
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
                                {UserProfile.isActive === true ? (
                                  <Switch
                                    checkedChildren={<Icon type="check" />}
                                    unCheckedChildren={<Icon type="close" />}
                                    defaultChecked
                                    onChange={this.learnerActiveInactive}
                                  />
                                ) : (
                                  <Switch
                                    checkedChildren={<Icon type="check" />}
                                    unCheckedChildren={<Icon type="close" />}
                                    onChange={this.learnerActiveInactive}
                                  />
                                )}
                              </span>
                              {/* <span style={{float: 'right', fontSize: '12px', padding: '5px',}}>
                              <a style={{ color: '#0190fe' }}>Edit</a>
                            </span> */}
                            </h5>
                          }
                          description={
                            <div>
                              <p style={{ fontSize: '13px', marginBottom: '4px' }}>
                                Authorization Status <span style={customSpanStyle}>Active</span>
                              </p>
                              <p style={{ fontSize: '13px', marginBottom: '4px' }}>
                                Intake Form Status <span style={customSpanStyle}>Active</span>
                              </p>
                              <p style={{ fontSize: '13px', marginBottom: '0' }}>
                                Date of Start 01/01/2020
                              </p>
                            </div>
                          }
                        />
                      </Card>
                      {isUserProfile ? (
                        <EditBasicInformation key={UserProfile.id} />
                      ) : (
                        // <Collapse defaultActiveKey="1" accordion bordered={false}>
                        //   <Panel header="Basic Details" key="1">
                        //     <EditBasicInformation key={UserProfile.id} />
                        //   </Panel>
                        //   <Panel header="Insurance Details" key="2">
                        //     <EditInsuranceForm />
                        //   </Panel>
                        //   <Panel header="Health Details" key="3">
                        //     <EditHealthForm />
                        //   </Panel>
                        //   <Panel header="Intake Form" key="4">
                        //     <EditIntakeForm />
                        //   </Panel>
                        // </Collapse>
                        ''
                      )}
                    </div>
                  </div>
                </div>
              </Scrollbars>
            ) : (
              ''
            )}
          </div>
          <Drawer
            title="CREATE LEARNER"
            width="700px"
            placement="right"
            closable={false}
            onClose={this.onClose}
            visible={this.state.visible}
          >
            <CreateLearner CloseDrawer={this.onClose}  />
          </Drawer>
        </div>
      </Authorize>
    )
  }
}

export default LearnerTable
