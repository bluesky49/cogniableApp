/* eslint-disable react/no-unused-state */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable no-underscore-dangle */
/* eslint-disable eqeqeq */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable no-plusplus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-useless-concat */
/* eslint-disable import/no-extraneous-dependencies */

import React from 'react'
import { Helmet } from 'react-helmet'
import {
  Row,
  Col,
  Select,
  Form,
  Collapse,
  Tree,
  Icon,
  DatePicker,
  notification,
  Empty,
  Button,
} from 'antd'
import { gql } from 'apollo-boost'
import Authorize from 'components/LayoutComponents/Authorize'
import { connect } from 'react-redux'
import Scroll from 'react-scroll'
import Timer from 'react-compound-timer'
import client from '../apollo/config'

import TargetGraph from '../components/dataRecording/TargetGraph'
// import RecordingBlock from '../components/dataRecording/RecordingBlock'
import TargetRecordingBlock from '../components/dataRecording/TargetRecordingBlock'
import TargetRecordingBlockWithSd from '../components/dataRecording/TargetRecordingBlockWithSd'
import TargetRecordingBlockWithStep from '../components/dataRecording/TargetRecordingBlockWithStep'
import TargetBehaviorReduction from '../components/dataRecording/TargetBehaviorReduction'
// import TargetPeakDataRecording from '../components/dataRecording/TargetPeakDataRecording'

const { Element, Link } = Scroll

const { Panel } = Collapse
const { TreeNode } = Tree

@connect(({ datarecording }) => ({ datarecording }))
class DataRecording extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      learnerId: 'U3R1ZGVudFR5cGU6OTI=',
      targetType: 'target',
      currentStatus: '',
      currentTargetType: '',
      currentDate: '',
      SelectedTargetObject: null,

      isLoaded: true,
      targetList: [],
      sessionTypeList: [],
      targetStatusList: [],
      targetTypeList: [],
      video: false,
    }

    this.child = React.createRef()
  }

  componentDidMount() {
    const { learnerId } = this.state

    const { dispatch } = this.props
    dispatch({
      type: 'datarecording/TARGET_LIST',
      payload: {
        learner: learnerId,
      },
    })

    client
      .query({
        query: gql`
          {
            targetStatus {
              id
              statusName
            }
            types {
              id
              typeTar
            }
          }
        `,
      })
      .then(result => {
        this.setState({
          targetStatusList: result.data.targetStatus,
          targetTypeList: result.data.types,
          isLoaded: false,
        })
      })
      .catch(error => {
        error.graphQLErrors.map(item => {
          return notification.error({
            message: 'Somthing want wrong',
            description: item.message,
          })
        })
      })
  }

  selectStatus = value => {
    const { learnerId } = this.state
    let queryGQL = null
    console.log(value)

    if (value === 'all') {
      // this.setState({
      //   currentStatus: ''
      // })
      queryGQL = gql`{ targetAllocates(studentId:"${learnerId}")
        {
          edges {
            node {
              id,
              time,
              goalName,
              targetInstr,
              targetStatus{
                statusName
            },
              targetAllcatedDetails{
                id,
                targetName,
                dateBaseline,
                DailyTrials,
                consecutiveDays,
              },
              videos{
                  edges{
                      node{
                          id,
                          url
                      }
                  }
              },
              sd{
                  edges{
                      node{
                          id,
                          sd
                      }
                  }
              },
              steps{
                  edges{
                      node{
                          id,
                          step
                      }
                  }
              }
          }
        }
      }`
    } else {
      this.setState({
        currentStatus: value,
      })
      queryGQL = gql`{ targetAllocates(studentId:"${learnerId}", targetStatus:"${value}")
        {
          edges {
            node {
              id,
              time,
              goalName,
              targetInstr,
              targetStatus{
                statusName
            },
              targetAllcatedDetails{
                id,
                targetName,
                dateBaseline,
                DailyTrials,
                consecutiveDays,
            },
            videos{
                edges{
                    node{
                        id,
                        url
                    }
                }
            },
            sd{
                edges{
                    node{
                        id,
                        sd
                    }
                }
            },
            steps{
                edges{
                    node{
                        id,
                        step
                    }
                }
            }
            }
          }
        }
      }`
    }

    const { dispatch } = this.props

    client
      .query({ query: queryGQL })
      .then(result => {
        dispatch({
          type: 'datarecording/UPDATE_TARGET_STATUS',
          payload: {
            data: result,
          },
        })

        // this.setState({
        //   targetList: result.data.targetAllocates.edges,
        // })
      })
      .catch(error => {
        error.graphQLErrors.map(item => {
          return notification.error({
            message: 'Somthing want wrong',
            description: item.message,
          })
        })
      })
  }

  onSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info)
  }

  changeTarget = index => {
    const {
      dispatch,
      datarecording: { TargetInitialValue, TargetList, TargetActiveKey },
    } = this.props

    let sdKey = ''
    let stepKey = ''

    if (TargetList[index].node.sd.edges.length > 0) {
      sdKey = TargetList[index].node.sd.edges[0].node.id
    }

    if (TargetList[index].node.steps.edges.length > 0) {
      stepKey = TargetList[index].node.steps.edges[0].node.id
    }

    dispatch({
      type: 'datarecording/SET_STATE',
      payload: {
        TargetInitialValue: index + 1,
        TargetActiveKey: TargetList[index].node.id,
        Correct: [],
        Incorrect: [],
        RecordingType: 'Target',
        StimulusActiveKey: sdKey,
        StimulusActiveIndex: 1,
        StapActiveKey: stepKey,
        StapActiveIndex: 1,
        count: 1,
        percentage: 0.0,
        correct: 0,
        incorrect: 0,
      },
    })

    let i = 0
    const elements = document.getElementsByClassName('tarilSpanClass')
    for (i = 0; i < elements.length; i++) {
      elements[i].style.backgroundColor = '#F5F5F5'
    }
    document.getElementById('correctResponseButton').style.color = 'gray'
    document.getElementById('correctResponseButton').style.borderColor = 'gray'
    document.getElementById('incorrectResponseButton').style.color = 'gray'
    document.getElementById('incorrectResponseButton').style.borderColor = 'gray'

    // for target automatic scroll
    document.getElementsByClassName('targetElements')[index].style.backgroundColor = '#bae7ff'
    document.getElementsByClassName('targetElements')[
      TargetInitialValue - 1
    ].style.backgroundColor = 'white'
    // document.getElementById(TargetActiveKey).click();
  }

  startSession = time => {
    console.log(time)
    const ts = new Date(time)
    console.log(ts.toLocaleTimeString())

    const { dispatch } = this.props
    dispatch({
      type: 'datarecording/SET_STATE',
      payload: {
        SessionStatus: 'Started',
      },
    })
  }

  pauseSession = time => {
    const { dispatch } = this.props
    dispatch({
      type: 'datarecording/SET_STATE',
      payload: {
        SessionStatus: 'Paused',
      },
    })
  }

  endSession = time => {
    const { dispatch } = this.props
    dispatch({
      type: 'datarecording/SET_STATE',
      payload: {
        SessionStatus: 'Ended',
      },
    })
  }

  render() {
    const style1 = {
      border: '1px solid #f6f7fb',
      minHeight: '700px',
      backgroundColor: 'white',
      padding: '5px',
    }
    const style2 = {
      border: '1px solid #f6f7fb',
      overflow: 'hidden',
      position: 'relative',
      minHeight: '700px',
    }
    const style3 = { border: '1px solid #f6f7fb', Height: '700px', backgroundColor: 'white' }
    const {
      video,
      isLoaded,
      targetList,
      sessionTypeList,
      targetStatusList,
      sessionTypeId,
      targetType,
      targetTypeList,
      SelectedTargetObject,
    } = this.state
    const {
      datarecording: { TargetList, TargetActiveKey, SessionStatus },
    } = this.props
    if (isLoaded) {
      return 'Loading...'
    }

    return (
      <div>
        <Helmet title="Session" />
        <Row
          style={{
            padding: '0',
            marginRight: '-30px',
            marginLeft: '-30px',
            marginTop: '0',
            display: 'flex',
          }}
        >
          <Col xs={0} sm={6} md={6} lg={5} xl={5} style={style1}>
            <Collapse bordered={false} defaultActiveKey={['2']}>
              <Panel header="Clock" key="2" style={{ paddingBottom: '0' }}>
                <Timer initialTime={0} startImmediately={false}>
                  {({ start, resume, pause, stop, reset, getTime }) => (
                    <React.Fragment>
                      <h6 style={{ textAlign: 'center', fontSize: '30px' }}>
                        <span style={{ textAlign: 'center' }}>
                          <Timer.Hours
                            formatValue={value => `${value < 10 ? `0${value}` : value} : `}
                          />
                          <Timer.Minutes
                            formatValue={value => `${value < 10 ? `0${value}` : value} : `}
                          />
                          <Timer.Seconds
                            formatValue={value => `${value < 10 ? `0${value}` : value} `}
                          />
                        </span>
                      </h6>
                      <br />
                      <div style={{ textAlign: 'center' }}>
                        {SessionStatus === 'NotStarted' ? (
                          <Button
                            onClick={() => {
                              start()
                              this.startSession(getTime())
                            }}
                          >
                            <Icon type="caret-right" />
                            Start Session
                          </Button>
                        ) : (
                          ''
                        )}

                        {SessionStatus === 'Started' ? (
                          <>
                            <Button
                              onClick={() => {
                                this.pauseSession(getTime())
                                stop()
                              }}
                            >
                              Pause
                            </Button>
                            &nbsp;
                            <Button
                              onClick={() => {
                                this.endSession(getTime())
                                stop()
                              }}
                            >
                              End
                            </Button>
                          </>
                        ) : (
                          ''
                        )}
                        {SessionStatus === 'Paused' ? (
                          <>
                            <Button
                              onClick={() => {
                                start()
                                this.startSession(getTime())
                              }}
                            >
                              <Icon type="caret-right" />
                              Resume Session
                            </Button>
                          </>
                        ) : (
                          ''
                        )}
                        {SessionStatus === 'Ended' ? (
                          <>
                            <p>Session Completed!!</p>
                          </>
                        ) : (
                          ''
                        )}
                        {/* <Button onClick={pause}><Icon type="pause" /></Button>
                                <Button onClick={resume}>Resume</Button> */}
                        {/* <Button onClick={() => { this.consoleTime(getTime()); stop(); }}><Icon type="stop" /></Button>
                                <Button onClick={reset}><Icon type="undo" /></Button> */}
                      </div>
                    </React.Fragment>
                  )}
                </Timer>
              </Panel>
              <Panel header="Filters" key="1" style={{ paddingBottom: '0' }}>
                <Form
                  layout={{ labelCol: { span: 4 }, wrapperCol: { span: 14 } }}
                  labelAlign="left"
                  initialValues={{ size: 'middle' }}
                  size="middle"
                >
                  <Form.Item label="">
                    <Select placeholder="Select status" onSelect={this.selectStatus}>
                      <Select.Option value="all">All</Select.Option>
                      {targetStatusList.map(item => (
                        <Select.Option value={item.id}>{item.statusName}</Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item label="" style={{ marginTop: '-25px' }}>
                    <Select placeholder="Select target type">
                      {targetTypeList.map(item => (
                        <Select.Option value={item.id}>{item.typeTar}</Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item label="" style={{ marginTop: '-25px' }}>
                    <Select placeholder="Select target objective">
                      <Select.Option value="0">Skill Acquisition</Select.Option>
                      <Select.Option value="1">Behavior Reduction</Select.Option>
                      <Select.Option value="2">Maintenance </Select.Option>
                    </Select>
                  </Form.Item>

                  <Form.Item label="" style={{ marginTop: '-25px' }}>
                    <DatePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Form>
              </Panel>
            </Collapse>

            {/* <Element
              name="test7"
              className="element"
              id="containerElement"
              style={{
                position: 'relative',
                height: '600px',
                overflow: 'scroll',
                marginBottom: '100px'
              }}
            >

              {TargetList.length > 0 ?
                TargetList.map((item, index) =>

                  <>
                    <Element className="targetElements" style={{padding:"4px"}} name={item.node.id}><a onClick={() => this.changeTarget(index)}><Icon type="book" /> <span>{item.node.targetAllcatedDetails.targetName}</span></a></Element>
                    <Link activeClass="active" id={item.node.id} to={item.node.id} spy={true} smooth={true} duration={250} style={{display:'hidden'}} containerId="containerElement">&nbsp;</Link>
                  </>
                )
              :
                <p>no</p>
              }

            </Element> */}

            <Element
              name="test7"
              className="element"
              id="containerElement"
              style={{
                position: 'relative',
                height: '600px',
                overflow: 'scroll',
                marginBottom: '100px',
              }}
            >
              {TargetList.length > 0 ? (
                TargetList.map((item, index) => (
                  <>
                    <Element
                      className="targetElements"
                      style={{ padding: '4px', borderRadius: '8px' }}
                      name={item.node.id}
                    >
                      <a onClick={() => this.changeTarget(index)}>
                        {/* <Icon type="book" /> <span>{item.node.targetAllcatedDetails.targetName}</span> */}

                        <Tree
                          showLine
                          blockNode
                          autoExpandParent
                          selectable={false}
                          defaultExpandAll
                          switcherIcon={<Icon type="down" />}
                          onSelect={this.onSelect}
                        >
                          <TreeNode
                            title={item.node.targetAllcatedDetails.targetName}
                            key={item.node.id}
                          >
                            {item.node.sd.edges.length > 0 ? (
                              <TreeNode title="Stimulus" key={`"${item.node.id}"` + 'sd'} disabled>
                                {item.node.sd.edges.map(sdItem => (
                                  <>
                                    <TreeNode
                                      title={sdItem.node.sd}
                                      key={sdItem.node.id}
                                      goal="sd"
                                    />
                                  </>
                                ))}
                              </TreeNode>
                            ) : (
                              ''
                            )}
                            {item.node.steps.edges.length > 0 ? (
                              <TreeNode title="Steps" key={`"${item.node.id}"` + 'step'} disabled>
                                {item.node.steps.edges.map(stepItem => (
                                  <>
                                    <TreeNode
                                      title={stepItem.node.step}
                                      key={stepItem.node.id}
                                      goal="step"
                                    />
                                  </>
                                ))}
                              </TreeNode>
                            ) : (
                              ''
                            )}
                          </TreeNode>
                        </Tree>
                      </a>
                    </Element>
                    {/* <Link activeClass="active" id={item.node.id} to={item.node.id} spy={true} smooth={true} duration={250} style={{display:'hidden'}} containerId="containerElement">&nbsp;</Link> */}
                  </>
                ))
              ) : (
                <p>Loading Targets...</p>
              )}

              {TargetList.length > 0
                ? TargetList.map((item, index) => (
                    <>
                      <div style={{ width: '200px' }}>
                        <Link
                          activeClass="active"
                          id={item.node.id}
                          to={item.node.id}
                          spy={true}
                          smooth={true}
                          duration={250}
                          style={{ display: 'hidden' }}
                          containerId="containerElement"
                        >
                          &nbsp;
                        </Link>
                      </div>
                    </>
                  ))
                : ''}
            </Element>

            {/* <Element
              name="test7"
              className="element"
              id="containerElement"
              style={{
                position: 'relative',
                height: '600px',
                overflow: 'scroll',
                marginBottom: '100px'
              }}
            >

              <Tree showLine blockNode autoExpandParent defaultExpandAll switcherIcon={<Icon type="down" />} onSelect={this.onSelect}>
                <TreeNode title="Targets" key="0">
                  {TargetList.length > 0 ?
                    TargetList.map((item, index) =>

                      <>
                        <TreeNode title={<Element className="targetElements" name={item.node.id}>{item.node.targetAllcatedDetails.targetName}</Element>} key={item.node.id} />
                      </>
                    )
                  :
                    <TreeNode title="No Target Associated in this session" key="0-0" />
                  }
                </TreeNode>
              </Tree>

              {TargetList.length > 0 ?
                TargetList.map((item, index) =>


                <Link id={item.node.id} to={item.node.id} spy={true} smooth={true} duration={250} style={{display:'hidden'}} containerId="containerElement">&nbsp;</Link>

                )
              :
                <p>1</p>
              }

            </Element> */}

            {/* <Tree showLine blockNode autoExpandParent defaultExpandAll switcherIcon={<Icon type="down" />} onSelect={this.onSelect}>
                <TreeNode title="Targets" key="0">
                  {TargetList.length > 0 ?
                    TargetList.map((item, index) =>

                      <>
                        <TreeNode title={<Element name={index}>{item.node.targetAllcatedDetails.targetName}</Element>} key={item.node.id} />
                        <TreeNode title={<Link activeClass="active" id={item.node.id} to={index} spy={true} smooth={true} duration={250} containerId="containerElement">link</Link>} key={item.node.id} />
                      </>
                    )
                  :
                    <TreeNode title="No Target Associated in this session" key="0-0" />
                  }
                </TreeNode>
              </Tree> */}
          </Col>

          <Col xs={24} sm={6} md={6} lg={11} xl={11} style={style2}>
            {targetType === 'target' ? (
              <TargetRecordingBlock target={SelectedTargetObject} targetList={TargetList} />
            ) : targetType === 'sd' ? (
              <TargetRecordingBlockWithSd />
            ) : targetType === 'step' ? (
              <TargetRecordingBlockWithStep />
            ) : targetType === 'behaviorReduction' ? (
              <TargetBehaviorReduction />
            ) : (
              <Empty />
            )}
          </Col>

          <Col xs={0} sm={6} md={6} lg={8} xl={8} style={style3}>
            <TargetGraph />
          </Col>
        </Row>
      </div>
    )
  }
}

export default DataRecording
