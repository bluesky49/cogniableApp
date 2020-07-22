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
/* eslint-disable eqeqeq */
/* eslint-disable object-shorthand */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable no-shadow */
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
  Popconfirm
} from 'antd'
import Authorize from 'components/LayoutComponents/Authorize'
import { Scrollbars } from 'react-custom-scrollbars'
import {
  ContactsOutlined,
  FileDoneOutlined,
  AuditOutlined,
  FilterOutlined,
  PlusOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  PrinterOutlined,
  CheckCircleOutlined,
  FormOutlined
} from '@ant-design/icons'
import { connect } from 'react-redux'
import { gql } from 'apollo-boost'
import EditTaskInformation from './EditTaskInformation'
import CreateTask from '../createTask'
import client from '../../../apollo/config'

const { Meta } = Card
const { RangePicker } = DatePicker


@connect(({ user, tasks }) => ({ user, tasks }))
class TaskTable extends React.Component {
  state = {
    divShow: false,
    filterShow: false,
    isLoaded: true,
    UserProfile: null,
    realTaskList: [],
    searchText: '',
    searchedColumn: '',
    filteredInfo: null,
    // for create task drawer
    visible: false,
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch({
      type: 'tasks/GET_TASKS',
    })
    dispatch({
      type: 'tasks/GET_TASKS_DROPDOWNS',
    })
  }

  handleChange = (pagination, filters, sorter) => {
    this.setState({
      filteredInfo: filters,
    })
  }

  info = e => {
    console.clear()
    console.log(e)
    const { dispatch } = this.props

    dispatch({
      type: 'tasks/SET_STATE',
      payload: {
        SelectedTask: e,
        isSelectedTask: true,
      },
    })
    this.setState({
      divShow: true,
    })

  }


  selectActiveStatus = val => {
    const { dispatch } = this.props
    if(val == 'All'){
      dispatch({
        type: 'tasks/GET_TASKS',
      })
    } 
    if(val == 'Open'){
      dispatch({
        type: 'tasks/GET_TASKS',
      })
    } 
    if(val == 'Close'){
      dispatch({
        type: 'tasks/GET_CLOSED_TASKS',
      })
    }
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

  closeTask = (e, status) => {

    console.log('close task ===> ',e , status)
    const {dispatch} = this.props
    dispatch({
      type: 'tasks/UPDATE_TASK_STATUS',
      payload: {
        id: e.id,
        status: 'VGFza1N0YXR1c1R5cGU6Mg=='
      }
    })
    // this.setState({
    //   divShow: false,
    // })
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
      tasks: { loading, TaskList, isSelectedTask, SelectedTask, createTaskLoading },
      user
    } = this.props

    if (loading) {
      return <div>Loading...</div>
    }

    const columns = [
      {
        title: 'Task Name',
        dataIndex: 'taskName',
        key: 'taskName',
        width: 250,
        fixed: 'left',
        ...this.getColumnSearchProps('taskName'),
        render:(val) => (
          <div style={{color:"blue"}}>{val}</div>
        )
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        fixed: 'left',
        width: 250,
        render:(val) => (
          <div style={{color:"blue"}}>{val}</div>
        )
      },
      {
        title: 'Status',
        dataIndex: 'status.taskStatus',
        key: 'status',
        width: 150,
        fixed: 'left',
      },
      {
        title: 'Type',
        dataIndex: 'taskType.taskType',
        key: 'taskType',
        width: 150,
        fixed: 'left',
      },
      {
        title: 'Priority',
        dataIndex: 'priority.name',
        key: 'priority',
        width: 150,
      },
      {
        title: 'StartDate',
        dataIndex: 'startDate',
        key: 'startDate',
        width: 150,
        
      },
      {
        title: 'DueDate',
        dataIndex: 'dueDate',
        key: 'dueDate',
        width: 150,
      },
      {
        title: 'Complete',
        width: 150,
        dataIndex: 'status',
        key: 'statusChange',
        render: (status, e) => (
          <span onClick={(e) => { e.stopPropagation(); }}>
            <Popconfirm title="Sure to close this task?" onConfirm={() => this.closeTask(e, status)}>
              <Button><CheckCircleOutlined style={{color:"green"}} /></Button>
            </Popconfirm>
            &nbsp;&nbsp;
            {/*
              <Button><FormOutlined /></Button>
            */}
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

    const filterOptionStyle = { display: 'inline-block', marginRight: '10px' }
    const customSpanStyle = {
      backgroundColor: '#52c41a',
      color: 'white',
      borderRadius: '3px',
      padding: '1px 5px',
    }
    // console.clear();
    // console.log(TaskList);
    return (
      <Authorize roles={['school_admin', 'therapist', 'parents']} redirect to="/dashboard/beta">
        <Helmet title="Partner" />

        <div className="row">
          <div className={divClass}>
            <div className="card" style={{ backgroundColor: 'inherit', marginBottom: '0' }}>
              <div className="card-body" style={{ padding: '0', marginBottom: '0' }}>
                <Button onClick={() => this.filterToggle(filterShow)}>
                  Filter <FilterOutlined />
                </Button>
                <p style={{ float: 'right' }}>

                  <Button onClick={this.showDrawer}>
                    Create Task <PlusOutlined />
                  </Button>
                </p>
              </div>
            </div>
            <div className="card" style={filterDiv}>
              <div className="card-body" style={{ padding: '0', marginBottom: '0' }}>
                <Form.Item label="" style={filterOptionStyle}>
                  <Select
                    style={{ width: '120px' }}
                    defaultValue="Open"
                    onSelect={val => this.selectActiveStatus(val)}
                  >
                    <Select.Option value="All">All Tasks</Select.Option>
                    <Select.Option value="Open">Open Tasks</Select.Option>
                    <Select.Option value="Close">Close Tasks</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item label="" style={filterOptionStyle}>
                  <RangePicker style={{ marginTop: '3px' }} onChange={this.selectDateRange} />
                </Form.Item>
              </div>
            </div>
            <div className="card">
              <div className="card-body" style={{ padding: '0' }}>
                {user.role !== 'parents' ? 
                  <Table
                    columns={columns}
                    onRowClick={e => this.info(e)}
                    dataSource={TaskList}
                    bordered
                    scroll={{ x: 1000 }}
                    onChange={this.handleChange}
                  />
                :
                  <Table
                    columns={columns}
                    dataSource={TaskList}
                    bordered
                    scroll={{ x: 1000 }}
                    onChange={this.handleChange}
                  />
                }
              </div>
            </div>
          </div>

          
          
          <Drawer
            title="UPDATE TASK"
            width="500px"
            placement="right"
            closable={true}
            onClose={() => this.setState({ divShow: false })}
            visible={divShow}
          >
            <EditTaskInformation key={divShow ? SelectedTask.id : null} />
          </Drawer>
          

          <Drawer
            title="CREATE TASK"
            width="700px"
            placement="right"
            closable={true}
            onClose={this.onClose}
            visible={this.state.visible}
          >
            <CreateTask />
          </Drawer>
        </div>
      </Authorize>
    )
  }
}

export default TaskTable
