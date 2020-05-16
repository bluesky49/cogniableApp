/* eslint-disable react/no-unused-state */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable no-unused-vars */
/* eslint-disable no-nested-ternary */

import React from 'react'
import { Helmet } from 'react-helmet'
import { Collapse, Icon, Drawer, notification, Button, Empty, Tree, Form, Select } from 'antd'
import Authorize from 'components/LayoutComponents/Authorize'
import { connect } from 'react-redux'
import { gql } from 'apollo-boost'
import client from '../apollo/config'

import LongTerm from '../components/goals/LongTerm'
import LongTermDetails from '../components/goals/LongTermGoalDetails'
import ShortTermDetails from '../components/goals/ShortTermGoalDetails'

const { Panel } = Collapse
const { TreeNode } = Tree

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`

@connect(({ goals }) => ({ goals }))
class Goals extends React.Component {
  state = {
    isLoaded: true,
    longTermGoalsList: [],
    createGoal: false,
    selectedLongTermObject: null,
    selectedShortTermObject: null,
    selectedType: '',
    learnerId: 'U3R1ZGVudFR5cGU6OTM=',
  }

  componentDidMount() {
    const { dispatch } = this.props

    client
      .query({
        query: gql`{
                longTerm(student:"${this.state.learnerId}") {
                    edges {
                        node {
                        id,
                        goalName,
                        shorttermgoalSet {
                            edges {
                                node {
                                    id,
                                    goalName,
                                    targetAllocateSet{
                                        edges {
                                            node {
                                                id,
                                                targetAllcatedDetails{
                                                    id,
                                                    targetName
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            goalStatus{
                id,
                status
            }
            goalsProgramArea{
                id,
                name
            }
            goalsAssessment{
                id,
                name
            }
            goalResponsibility{
                id,
                name
            }
            staffs {
                edges {
                    node {
                        id,
                        name,
                        email,
                    }
                }
            }
        }`,
      })
      .then(result => {
        dispatch({
          type: 'goals/SET_STATE',
          payload: {
            Loading: false,
            LearnerId: this.state.learnerId,
            LongTermGoalsList: result.data.longTerm.edges,
            GoalStatusList: result.data.goalStatus,
            GoalProgramArea: result.data.goalsProgramArea,
            GoalAssessmentList: result.data.goalsAssessment,
            GoalResponsibleList: result.data.goalResponsibility,
            StaffList: result.data.staffs.edges,
          },
        })
      })
      .catch(error => {
        // console.log(JSON.stringify(error))
        error.graphQLErrors.map(item => {
          return notification.error({
            message: 'Somthing want wrong',
            description: item.message,
          })
        })
      })
  }

  // onSelect = (selectedKeys, info) => {
  //     console.log('selected', selectedKeys, info);
  // };

  // onLongTerm = (e, id, type) => {
  //     e.preventDefault();
  //     e.stopPropagation();

  //     console.log(id)
  //     if (type === 'LTG'){
  //         client.query({
  //             query: gql`{
  //                 longTermDetail(id:"${id}") {
  //                     id,
  //                     goalName,
  //                     description,
  //                     dateInitialted,
  //                     dateEnd,
  //                     responsibility{
  //                         id,
  //                         name
  //                     }
  //                     goalStatus{
  //                         id,
  //                         status
  //                     },
  //                     student{
  //                         id,
  //                         firstname
  //                     }
  //                 }
  //             }`
  //         })
  //         .then(result => {
  //             console.log(result)
  //             this.setState({
  //                 selectedType: type,
  //                 selectedLongTermObject: result.data.longTermDetail,
  //             });
  //         })
  //         .catch(error => {
  //             error.graphQLErrors.map((item) => {
  //                 return notification.error({
  //                     message: 'Somthing want wrong',
  //                     description: item.message,
  //                 });
  //             })
  //         });
  //     }

  //     if (type === 'STG'){
  //         client.query({
  //             query: gql`{
  //                 shortTermDetail(id:"${id}") {
  //                     id,
  //                     goalName,
  //                     longTerm{
  //                         id,
  //                         goalName
  //                     }
  //                 }
  //             }`
  //         })
  //         .then(result => {
  //             console.log(result)
  //             this.setState({
  //                 selectedType: type,
  //                 selectedShortTermObject: result.data.shortTermDetail,
  //             });
  //         })
  //         // .catch(error => {
  //         //     error.graphQLErrors.map((item) => {
  //         //         return notification.error({
  //         //             message: 'Somthing want wrong',
  //         //             description: item.message,
  //         //         });
  //         //     })
  //         // });
  //     }

  // }

  onSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info.node.props)
    const { dispatch } = this.props

    if (info.node.props.goal === 'LTG') {
      client
        .query({
          query: gql`{
                    longTermDetail(id:"${selectedKeys}") {
                        id,
                        goalName,
                        description,
                        dateInitialted,
                        dateEnd,
                        responsibility{
                            id,
                            name
                        }
                        goalStatus{
                            id,
                            status
                        },
                        student{
                            id,
                            firstname
                        }
                    }
                }`,
        })
        .then(result => {
          dispatch({
            type: 'goals/SET_STATE',
            payload: {
              LongTermObject: result.data.longTermDetail,
              SelectedType: info.node.props.goal,
            },
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

    if (info.node.props.goal === 'STG') {
      client
        .query({
          query: gql`{
                    shortTermDetail(id:"${selectedKeys}") {
                        id,
                        goalName,
                        description,
                        dateInitialted,
                        dateEnd,
                        longTerm{
                            id,
                            goalName
                        },
                        programArea{
                            id,
                            name
                        },
                        assessment{
                            id,
                            name
                        },
                        responsibility{
                            id,
                            name
                        },
                        goalStatus{
                            id,
                            status
                        }
                    }
                }`,
        })
        .then(result => {
          dispatch({
            type: 'goals/SET_STATE',
            payload: {
              ShortTermObject: result.data.shortTermDetail,
              SelectedType: info.node.props.goal,
            },
          })
        })
      // .catch(error => {
      //     error.graphQLErrors.map((item) => {
      //         return notification.error({
      //             message: 'Somthing want wrong',
      //             description: item.message,
      //         });
      //     })
      // });
    }
  }

  showCreatGoal = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'goals/SET_STATE',
      payload: {
        SelectedType: 'LTG Form',
      },
    })
    this.setState({
      selectedType: 'LTG Form',
    })
  }

  onCreateGoal = () => {
    this.setState({
      createGoal: false,
    })
  }

  render() {
    const {
      isLoaded,
      longTermGoalsList,
      selectedLongTermObject,
      selectedType,
      selectedShortTermObject,
      learnerId,
    } = this.state
    const {
      goals: { Loading, LongTermGoalsList, SelectedType, LongTermObject, ShortTermObject },
    } = this.props
    if (Loading) {
      return <div>Loading...</div>
    }
    return (
      <Authorize roles={['school_admin']} redirect to="/dashboard/beta">
        <Helmet title="Goals" />
        <div className="row">
          <div className="col-lg-4">
            <section className="card">
              <div className="card-header mb-2">
                <div className="utils__title">
                  <strong>
                    Goals
                    <span>
                      <Button style={{ float: 'right' }} onClick={this.showCreatGoal}>
                        <Icon type="plus" /> LTG
                      </Button>
                    </span>
                    <span
                      style={{
                        float: 'right',
                        marginRight: '5px',
                        marginTop: '-4px',
                        textDecoration: 'none',
                      }}
                    >
                      <Form.Item label="">
                        <Select
                          style={{ width: '120px', textDecoration: 'none' }}
                          defaultValue="active"
                        >
                          <Select.Option value="active">Active</Select.Option>
                          <Select.Option value="in-active">In-active</Select.Option>
                        </Select>
                      </Form.Item>
                    </span>
                  </strong>
                </div>
              </div>
              <div className="card-body">
                <Tree
                  onSelect={this.onSelect}
                  showLine
                  blockNode
                  showIcon
                  autoExpandParent
                  // autoExpandParent={autoExpandParent}
                  defaultExpandAll
                  switcherIcon={<Icon type="down" />}
                >
                  {LongTermGoalsList.map((item, index) => (
                    <TreeNode
                      icon={<Icon type="hdd" />}
                      title={item.node.goalName}
                      key={item.node.id}
                      goal="LTG"
                    >
                      {item.node.shorttermgoalSet.edges.length > 0 ? (
                        item.node.shorttermgoalSet.edges.map((shortTermItem, lIndex) => (
                          <TreeNode
                            icon={<Icon type="file-protect" />}
                            title={shortTermItem.node.goalName}
                            key={shortTermItem.node.id}
                            goal="STG"
                          >
                            {shortTermItem.node.targetAllocateSet.edges.length > 0 ? (
                              shortTermItem.node.targetAllocateSet.edges.map(
                                (targetItem, targetIndex) => (
                                  <TreeNode
                                    title={targetItem.node.targetAllcatedDetails.targetName}
                                    key={targetItem.node.id}
                                    goal="Target"
                                  />
                                ),
                              )
                            ) : (
                              <TreeNode title="No Targets Associated with this goal" key={lIndex} />
                            )}
                          </TreeNode>
                        ))
                      ) : (
                        <TreeNode title="No Short Term goals" key={index} />
                      )}
                    </TreeNode>
                  ))}
                </Tree>

                {/* <Collapse bordered={false}>
                                {longTermGoalsList.map((item, index) => 
                                
                                <Panel header={item.node.goalName} key={index+1} extra={<Button style={{border:"none"}} onClick={(event) => this.onLongTerm(event, item.node.id, "LTG")}>view</Button>}>
                                    {item.node.shorttermgoalSet.edges.length > 0 ? 
                                    <Collapse bordered={false}>
                                        {item.node.shorttermgoalSet.edges.map((shortTermItem, lIndex) => 
                                        <Panel header={shortTermItem.node.goalName} key={lIndex+1} extra={<Icon type="eye" onClick={(event) => this.onLongTerm(event, shortTermItem.node.id, "STG")} />}>
                                            {shortTermItem.node.targetAllocateSet.edges.length > 0 ?
                                            <Collapse bordered={false}>
                                                {shortTermItem.node.targetAllocateSet.edges.map((targetItem, targetIndex) =>
                                                <Panel header={targetItem.node.id} key={targetIndex+1}>
                                                    <p>{text}</p>
                                                </Panel>                                
                                                )}
                                            </Collapse>
                                            :
                                            <p>No Targets Associated with this goal</p>
                                            }

                                        </Panel>                        
                                        )}
                                    </Collapse>
                                    :
                                    <p>No Short Term goals</p>
                                    }
                                </Panel>

                                )}
                            </Collapse> */}
              </div>
            </section>
          </div>
          <div className="col-lg-8">
            {SelectedType === '' ? (
              <section className="card">
                <div className="card-header mb-2">
                  <div className="utils__title">
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  </div>
                </div>
              </section>
            ) : SelectedType === 'LTG' ? (
              <LongTermDetails />
            ) : SelectedType === 'STG' ? (
              <ShortTermDetails />
            ) : SelectedType === 'LTG Form' ? (
              <section className="card">
                <div className="card-body mb-2">
                  <div className="utils__title">
                    <LongTerm />
                  </div>
                </div>
              </section>
            ) : (
              <section className="card">
                <div className="card-header mb-2">
                  <div className="utils__title">
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>

        <Drawer
          width="50%"
          title="Create Long Term Goal"
          placement="right"
          closable={false}
          onClose={this.onCreateGoal}
          visible={this.state.createGoal}
          getContainer={false}
        >
          <LongTerm learnerId={learnerId} />
        </Drawer>
      </Authorize>
    )
  }
}

export default Goals
