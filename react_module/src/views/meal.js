/* eslint-disable react/destructuring-assignment */
import React from 'react'
import { Helmet } from 'react-helmet'
import Authorize from 'components/LayoutComponents/Authorize'
import {
  Row,
  Col,
  Card,
  Button,
  Collapse,
  Form,
  Select,
  Input,
  Calendar,
  DatePicker,
  Drawer,
} from 'antd'
import { ArrowRightOutlined, PlusOutlined, FilterOutlined } from '@ant-design/icons'
import Iframe from 'react-iframe'
import { connect } from 'react-redux'
import { gql } from 'apollo-boost'
import MealForm from 'components/meal_and_medical/mealform'
import client from '../apollo/config'

const { Panel } = Collapse
const { RangePicker } = DatePicker
const { Search } = Input

const layout = {
  labelCol: {
    span: 6,
  },
}

@connect(({ user }) => ({ user }))
class meal extends React.Component {
  state = {
    divShow: false,
    loading: true,
    // foodtypes: [],
    foodlist: [],
    filterShow: false,
    visible: false,
  }

  componentDidMount() {
    const {
      user: { studentId },
    } = this.props
    client
      .query({
        query: gql`query {getFood(student:"${studentId}"){
          edges{
              node{
                 id,
                 mealType,
                 mealName,
                 waterIntake,
                 date,
                 mealTime,
                 note,
                 foodType{
                     id,
                     name
                 }
              }
          }
      }
    }`,
      })
      .then(result => {
        console.log(result)
        this.setState({
          loading: false,
          foodlist: result.data.getFood.edges,
        })
      })
  }

  divShowHide = () => {
    this.setState({ divShow: true })
  }

  consoleValue = e => {
    e.preventDefault()
    this.setState({
      divShow: true,
    })
  }

  filterMealType = value => {
    const {
      user: { studentId },
    } = this.props
    if (value !== 'all') {
      client
        .query({
          query: gql`query {getFood(student:"${studentId}", mealType:"${value}"){
              edges{
                  node{
                     id,
                     mealType,
                     mealName,
                     waterIntake,
                     date,
                     mealTime,
                     note,
                     foodType{
                         id,
                         name
                     }
                  }
              }
          }
        }`,
        })
        .then(result => {
          this.setState({
            foodlist: result.data.getFood.edges,
          })
        })
    } else {
      client
        .query({
          query: gql`query {getFood(student:"${studentId}"){
              edges{
                  node{
                     id,
                     mealType,
                     mealName,
                     waterIntake,
                     date,
                     mealTime,
                     note,
                     foodType{
                         id,
                         name
                     }
                  }
              }
          }
        }`,
        })
        .then(result => {
          this.setState({
            foodlist: result.data.getFood.edges,
          })
        })
    }
  }

  onPanelChange = value => {
    const {
      user: { studentId },
    } = this.props
    const date = new Date(value).toISOString().slice(0, 10)
    client
      .query({
        query: gql`query {getFood(student:"${studentId}", date_Gte:"${date}", date_Lte:"${date}"){
            edges{
                node{
                   id,
                   mealType,
                   mealName,
                   waterIntake,
                   date,
                   mealTime,
                   note,
                   foodType{
                       id,
                       name
                   }
                }
            }
        }
      }`,
      })
      .then(result => {
        this.setState({
          foodlist: result.data.getFood.edges,
        })
      })
  }

  handleSearch = value => {
    console.log(value)
    const {
      user: { studentId },
    } = this.props
    client
      .query({
        query: gql`query {getFood(student:"${studentId}", mealName_Icontains:"${value}"){
            edges{
                node{
                   id,
                   mealType,
                   mealName,
                   waterIntake,
                   date,
                   mealTime,
                   note,
                   foodType{
                       id,
                       name
                   }
                }
            }
        }
      }`,
      })
      .then(result => {
        this.setState({
          foodlist: result.data.getFood.edges,
        })
      })
  }

  onFinish = values => {
    alert()
    console.log(values)
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
    const filterOptionStyle = { display: 'inline-block', marginRight: '10px' }
    const { divShow, foodlist, loading, filterShow } = this.state
    const filterDiv = filterShow
      ? {
          display: 'block',
          padding: '0',
          marginBottom: '0',
          backgroundColor: 'inherit',
          border: 'none',
        }
      : { display: 'none' }
    return (
      <Authorize roles={['school_admin', 'parents']} redirect to="/dashboard/beta">
        <Helmet title="Dashboard Alpha" />
        <Row gutter={24}>
          {/* <Col span={6}>
            <Card style={{height:"550px"}}>
              <div>
                <Collapse accordion>
                  <Panel header="Filter" key="1">
                    <Form.Item {...layout} label="Type">
                      <Select style={{width:'190px'}} defaultValue="all" onSelect={this.filterMealType}>
                        <Select.Option value="all">All</Select.Option>
                        <Select.Option value="Breakfast">Breakfast</Select.Option>
                        <Select.Option value="Lunch">Lunch</Select.Option>
                        <Select.Option value="Snacks">Snacks</Select.Option>
                        <Select.Option value="Dinner">Dinner</Select.Option>
                      </Select>
                    </Form.Item>
                  
                    <Form.Item {...layout} label="Search">
                      <Search
                        placeholder="Search Food Name..."
                        onSearch={this.handleSearch}
                        style={{ width: "190px" }}
                      />
                    </Form.Item>
                  </Panel>
                  <Panel header="Filter by date" key="2">
                    <div className="site-calendar-demo-card">
                      <Calendar fullscreen={false} onChange={this.onPanelChange} />
                    </div>,

                  </Panel>
               
                </Collapse>,
                
              </div>
            </Card>
          </Col> */}
          <Col span={4}>&nbsp;</Col>
          <Col span={16}>
            <div
              className="card"
              style={{ backgroundColor: 'inherit', marginBottom: '0px', border: 'none' }}
            >
              <h5 style={{ display: 'inline-block' }}>Add Meal Data</h5>

              <span>
                <Button
                  style={{ float: 'right', marginTop: '-40px', marginLeft: '10px' }}
                  onClick={this.showDrawer}
                >
                  ADD MEAL DATA <PlusOutlined />
                </Button>
                <Button
                  onClick={() => this.filterToggle(filterShow)}
                  style={{ float: 'right', marginTop: '-40px', marginRight: '165px' }}
                >
                  Filters <FilterOutlined />
                </Button>
              </span>
              <div className="card" style={filterDiv}>
                <div className="card-body" style={{ padding: '0', marginBottom: '0' }}>
                  <Form.Item label="" style={filterOptionStyle}>
                    <Select style={{ width: '120px' }} value="select">
                      <Select.Option value="select">status</Select.Option>
                      <Select.Option value="active">Active</Select.Option>
                      <Select.Option value="in-active">In-active</Select.Option>
                    </Select>
                  </Form.Item>
                  <Form.Item label="" style={filterOptionStyle}>
                    <Select style={{ width: '120px' }} value="select">
                      <Select.Option value="select">category</Select.Option>
                      <Select.Option value="home">Home</Select.Option>
                      <Select.Option value="center">center</Select.Option>
                    </Select>
                  </Form.Item>
                  <Form.Item label="" style={filterOptionStyle}>
                    <Select style={{ width: '140px' }} value="select">
                      <Select.Option value="select">intake form status</Select.Option>
                      <Select.Option value="active">Active</Select.Option>
                      <Select.Option value="in-active">In-active</Select.Option>
                    </Select>
                  </Form.Item>
                  <Form.Item label="" style={filterOptionStyle}>
                    <Select style={{ width: '130px' }} value="select">
                      <Select.Option value="select">authorization</Select.Option>
                      <Select.Option value="active">Active</Select.Option>
                      <Select.Option value="in-active">In-active</Select.Option>
                    </Select>
                  </Form.Item>
                  <Form.Item label="" style={filterOptionStyle}>
                    <Select style={{ width: '120px' }} value="select">
                      <Select.Option value="select">show hide field</Select.Option>
                    </Select>
                  </Form.Item>
                </div>
              </div>
            </div>
            {/* <Card>
              <Row>
                <Col span={4}>
                  <div className="embed-responsive embed-responsive-16by9" style={{ borderRadius: "8px", width: "100%" }}>
                    <Iframe
                      url="https://www.youtube.com/embed/3w1c4sF4ZTg"
                    />
                  </div>

                </Col>
                <Col span={14}>
                  <div style={{ marginLeft: "30px" }}>
                    <h4>Text about Meal Data</h4>
                    <p> 6 min </p>
                    <Button type="link" style={{ padding: 0 }}> Read Instructions <ArrowRightOutlined /></Button>
                  </div>

                </Col>
                <Col span={6}>
                  <p style={{ float: 'right' }}>
                    <Button onClick={(e) => this.consoleValue(e)}>ADD MEAL DATA <PlusOutlined /></Button>
                  </p>
                </Col>
              </Row>
            </Card> */}

            {!foodlist.length && !loading ? (
              <Card style={{ marginTop: '20px' }}>
                {' '}
                <Row>
                  {' '}
                  <div className="text-center"> No Records! </div>{' '}
                </Row>{' '}
              </Card>
            ) : (
              ''
            )}
            {foodlist.map(food => (
              <Card style={{ marginTop: '5px' }}>
                <Row>
                  <div className="text-left">
                    <Col span={8}>
                      <h4>{food.node.mealType}</h4>
                      <p>{food.node.mealName}</p>
                      <p>{food.node.waterIntake}</p>
                    </Col>
                    <Col span={8} className="text-center">
                      <p style={{ fontSize: '16px' }}>{food.node.mealTime}</p>
                    </Col>
                    <Col span={8} className="text-right">
                      <a>
                        <p>
                          {' '}
                          <strong>{food.node.foodType ? food.node.foodType.name : ''}</strong>
                        </p>
                      </a>
                    </Col>
                  </div>
                </Row>
              </Card>
            ))}
          </Col>
          <Col span={4}>&nbsp;</Col>

          {/* {divShow  &&
          <Col span={8}>
            <div>
              <Card>
                <Button style={{marginRight: '-12px', float:'right', border:'none', padding:'none'}} onClick={() => this.setState({divShow:false})}> <b>X</b> </Button>
                <br />
                <MealForm />
              </Card>
            </div>
          </Col>
          } */}
          <Drawer
            title="Add Meal Data"
            width="40%"
            placement="right"
            closable={false}
            onClose={this.onClose}
            visible={this.state.visible}
          >
            <MealForm />
          </Drawer>
        </Row>
      </Authorize>
    )
  }
}

export default meal
