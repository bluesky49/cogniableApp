/* eslint-disable react/no-unused-state */
/* eslint-disable no-unused-vars */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable prefer-const */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */

import React from 'react'
import { Helmet } from 'react-helmet'
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
import { connect } from 'react-redux'
import Highlighter from 'react-highlight-words'
import { Scrollbars } from 'react-custom-scrollbars'
import EditStaffBasicInfo from './EditStaffBasicInfo'
import CreateStaff from '../createStaff'
import Authorize from '../../../components/LayoutComponents/Authorize'
import client from '../../../apollo/config'

const { Panel } = Collapse
const { Meta } = Card
const { RangePicker } = DatePicker

@connect(({ staffs, learners }) => ({ staffs, learners }))
class StaffTable extends React.Component {
  state = {
    divShow: false,
    filterShow: false,
    staffdata: [],
    realStaffList: [],
    UserProfile: null,
    isLoaded: false,
    searchText: '',
    searchedColumn: '',
    filteredInfo: null,
    // for create learner drawer
    visible: false,
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch({
      type: 'staffs/GET_STAFFS',
    })

    dispatch({
      type: 'staffs/GET_STAFF_DROPDOWNS',
    })
  }

  info = e => {
    const { dispatch } = this.props
    dispatch({
      type: 'staffs/SET_STATE',
      payload: {
        StaffProfile: e,
        isStaffProfile: true,
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

  handleChange = (pagination, filters, sorter) => {
    //   console.log('Various parameters', pagination, filters, sorter);
    this.setState({
      filteredInfo: filters,
    })
  }

  divShowHide = () => {
    this.setState({ divShow: true })
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
    let { filteredInfo } = this.state
    filteredInfo = filteredInfo || {}

    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        // render: name => <a onClick={(e) => this.consoleValue(e, name)} onKeyPress={(e) => this.consoleValue(e, name)} role="button" tabIndex="0">{name}</a>,
        width: 150,
        fixed: 'left',
        ...this.getColumnSearchProps('name'),
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        width: 250,
        ...this.getColumnSearchProps('email'),
      },
      {
        title: 'Role',
        dataIndex: 'userRole.name',
        key: 'designation',
        width: 150,
        filters: [
          { text: 'Therapist', value: 'Therapist' },
          { text: 'Technician', value: 'Technician' },
        ],
        filteredValue: filteredInfo.designation || null,
        onFilter: (value, record) => record.userRole.name.includes(value),
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
        title: 'Join On',
        dataIndex: 'dateOfJoining',
        key: 'joining',
        width: 150,
      },
      {
        title: 'Date of Birth',
        dataIndex: 'dob',
        key: 'dob',
        width: 150,
      },
      {
        title: 'Emp Type',
        dataIndex: 'empType',
        key: 'empType',
        width: 150,
      },
      {
        title: 'Address',
        dataIndex: 'localAddress',
        key: 'local_address',
        width: 350,
      },
    ]
    const { divShow, filterShow } = this.state
    const {
      staffs,
      staffs: { StaffList, StaffProfile },
    } = this.props

    if (staffs.loading) {
      return <div>Loading...</div>
    }
    const divClass = divShow ? 'col-sm-8' : 'col-sm-12'
    const detailsDiv = divShow ? { display: 'block', paddingLeft: '0' } : { display: 'none' }
    const filterDiv = filterShow
      ? { display: 'block', padding: '0', marginBottom: '0', backgroundColor: 'inherit' }
      : { display: 'none' }
    const filterOptionStyle = { display: 'inline-block', marginRight: '10px' }
    return (
      <Authorize roles={['school_admin']} redirect to="/dashboard/beta">
        <Helmet title="Partner" />
        <div className="row">
          <div className={divClass}>
            <div className="card" style={{ backgroundColor: 'inherit', marginBottom: '0' }}>
              <div className="card-body" style={{ padding: '0', marginBottom: '0' }}>
                <Button onClick={() => this.filterToggle(filterShow)}>
                  Filter <FilterOutlined />
                </Button>
                <p style={{ float: 'right' }}>
                  {/* <Button><a href="/#/partners/staff">Add Staff <PlusOutlined /></a></Button> */}
                  <Button onClick={this.showDrawer}>
                    Add Staff <PlusOutlined />
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
              {/* <ReactHTMLTableToExcel 
                id="test-table-xls-button" 
                className="ant-btn" 
                table="stafftable"
                filename="staffs" 
                sheet="staff" 
                buttonText="Excel" 
              /> */}
              <div className="card-body" style={{ padding: '0' }}>
                <Table
                  id="stafftable"
                  columns={columns}
                  onRowClick={e => this.info(e)}
                  dataSource={StaffList}
                  bordered
                  scroll={{ x: 1000 }}
                  onChange={this.handleChange}
                />
              </div>
            </div>
          </div>
          <div className="col-sm-4" style={detailsDiv}>
            {StaffProfile ? (
              <Scrollbars key={StaffProfile.id} style={{ height: 650 }}>
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
                              style={{
                                width: '100px',
                                height: '100px',
                                border: '1px solid #f6f7fb',
                              }}
                            />
                          }
                          title={
                            <h5 style={{ marginTop: '20px' }}>
                              {StaffProfile ? StaffProfile.name : ''}
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
                      {StaffProfile ? (
                        <Collapse defaultActiveKey="1" accordion bordered={false}>
                          <Panel header="Basic Details" key="1">
                            <EditStaffBasicInfo key={StaffProfile.id} userinfo={StaffProfile} />
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
              </Scrollbars>
            ) : (
              ''
            )}
          </div>
          <Drawer
            title="CREATE STAFF"
            width="700px"
            placement="right"
            closable={false}
            onClose={this.onClose}
            visible={this.state.visible}
          >
            <CreateStaff />
          </Drawer>
        </div>
      </Authorize>
    )
  }
}

export default StaffTable
