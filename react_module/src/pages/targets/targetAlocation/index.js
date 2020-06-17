/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable no-else-return */
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Checkbox, Select, Icon, Typography, Drawer } from 'antd'
import moment from 'moment'
import { EditOutlined } from '@ant-design/icons'
import styles from './style.module.scss'
import GoalCard from '../../../components/GoalCard'
import {
  alreadyAlloctedTarget,
  getLongTermGoals,
  getPatients,
  getGoalStatus,
  getGoalResponsibility,
} from './TargetAllocation.query'
import { arrayNotNull, notNull } from '../../../utilities'
import AddLongAndShortGoal from '../AddLongAndShortGoal'
import TargetAllocationDetails from '../targetAllocationDetails'
import EditAllocatedTargetDetails from '../targetAllocationDetails/editAllocatedTargetDetails'
import AllocatedTarget from './AllocatedTarget'
import TargetsAvailable from './TargetsAvailable'

const { Title, Text } = Typography
const longGoalBtn = {
  color: '#fff',
  backgroundColor: '#0B35B3',
  // border: '1px solid #0B35B3',
}

const shortGoalBtn = {
  // border: 0,
  color: '#111',
  backgroundColor: '#FFF',
}

const selectPatientStyle = {
  width: '244px',
  // height: '60px',
  textDecoration: 'none',
  marginRight: '20px',
  border: 0,
}

const TargetAllocation = () => {
  let stdId = ''
  if (!(localStorage.getItem('studentId') === null) && localStorage.getItem('studentId')) {
    stdId = JSON.parse(localStorage.getItem('studentId'))
  }
  const dispatch = useDispatch();
  dispatch({
    type: 'user/GET_STUDENT_NAME',
  })

  const [selectedStudent, setSelectedStudent] = useState(stdId)
  const [programArea, setProgramArea] = useState([])

  const [selectedProgram, setSelectedProgram] = useState('')

  const [longTermGoals, setLongTermGoals] = useState([])
  const [allocatedTarget, setAllocatedTarget] = useState([])
  const [shortTermGoals, setShortTermGoals] = useState([])

  const [activeLongTermGoal, setActiveLongTermGoal] = useState(null)
  const [activeShortTermGoal, setActiveShortTermGoal] = useState(null)
  const [isAddGoalVisible, setAddGoalVisible] = useState(false)

  const [goalType, setGoalType] = useState('long')

  const [addTargetMode, setAddTargetMode] = useState('')

  const [suggestedTarget, setSuggestedTarget] = useState([])

  useEffect(() => {
    if (programArea && programArea.length > 0) {
      setSelectedProgram(programArea[0].node.id)
    }
  }, [programArea])

  // const alreadyAlloctedTargetQuery = async (
  //   studentId = 'U3R1ZGVudFR5cGU6MTYz',
  //   targetStatus = 'U3RhdHVzVHlwZToz',
  //   targetIdDomain = 'RG9tYWluVHlwZToxMQ==',
  // ) => {
  //   const allocatedTargetResp = await alreadyAlloctedTarget(studentId, targetStatus, targetIdDomain)
  //   if (notNull(allocatedTargetResp))
  //     setAllocatedTarget(allocatedTargetResp.data.targetAllocates.edges)
  // }

  const getLongTermGoalsQuery = async (studentId, program) => {
    const longTermGoalResp = await getLongTermGoals(studentId, program)
    if (notNull(longTermGoalResp)) setLongTermGoals(longTermGoalResp.data.longTerm.edges)
  }
  const getProgramAreaQuery = async studentId => {
    const patientResp = await getPatients(studentId)

    if (notNull(patientResp)) setProgramArea(patientResp?.data?.student?.programArea?.edges)
  }

  const [goalResponsibilityList, setGoalResponsibilityList] = useState([])
  const [goalStatusList, setGoalStatusList] = useState([])

  const getGoalStatusQuery = async () => {
    const goalStatusResp = await getGoalStatus()
    if (notNull(goalStatusResp)) setGoalStatusList(goalStatusResp.data.goalStatus)
  }

  const getGoalResponsibilityQuery = async () => {
    const goalResponsibilityResp = await getGoalResponsibility()
    if (notNull(goalResponsibilityResp))
      setGoalResponsibilityList(goalResponsibilityResp.data.goalResponsibility)
  }

  useEffect(() => {
    getProgramAreaQuery(selectedStudent)

    getGoalStatusQuery()

    getGoalResponsibilityQuery()

    // alreadyAlloctedTargetQuery(selectedStudent, 'U3RhdHVzVHlwZToz', 'RG9tYWluVHlwZToxMQ==')

    getLongTermGoalsQuery(selectedStudent, selectedProgram)
  }, [])

  const addShortTermGoal = ltg => {
    setGoalType('short')
    setAddGoalVisible(true)
    setActiveLongTermGoal(ltg)
  }

  const addLongTermGoal = () => {
    setAddGoalVisible(true)
    setGoalType('long')
    setActiveLongTermGoal(null)
  }

  const handleSelectProgram = pId => {
    setSelectedProgram(pId)
    getLongTermGoalsQuery(selectedStudent, pId)
  }

  const getDate = node => {
    const startDate = moment(node.dateInitialted)
    const endDate = moment(node.dateEnd)
    const diff = parseInt(moment(endDate).diff(moment(startDate), 'months', true), 0)
    const date =
      `${moment(startDate).format('MMMM DD.')} ${moment(endDate).format('MMMM DD, YYYY')}` +
      `, ${diff > 0 ? `${diff} Months` : ''}`
    return date
  }

  const handleCloseAddGoal = () => {
    setGoalType('long')
    setAddGoalVisible(false)
    setActiveLongTermGoal(null)
  }

  const editLongTermGoal = ltg => {
    setGoalType('long-edit')
    setAddGoalVisible(true)
    setActiveLongTermGoal(ltg)
  }

  const editShortTermGoal = (ltg, stg) => {
    setGoalType('short-edit')
    setAddGoalVisible(true)
    setActiveLongTermGoal(ltg)
    setActiveShortTermGoal(stg)
  }

  const onSuccessAddEditGoal = (resp, type) => {
    setAddGoalVisible(false)
    if (type === 'long') {
      setLongTermGoals(state => [...[{ node: resp.data.createLongTerm.details }], ...state])
    } else if (type === 'long-edit') {
      setLongTermGoals(state =>
        state.map(lg => {
          if (lg.node.id === activeLongTermGoal.node.id) {
            return { node: resp.data.updateLongTerm.details }
          }
          return lg
        }),
      )
    } else if (type === 'short') {
      setLongTermGoals(state =>
        state.map(lg => {
          if (lg.node.id === activeLongTermGoal.node.id) {
            if ('shorttermgoalSet' in lg.node) {
              lg.node.shorttermgoalSet.edges.push({ node: resp.data.createShortTerm.details })
            } else {
              lg = {
                ...lg,
                node: {
                  ...lg.node,
                  shorttermgoalSet: {
                    edges: [...[{ node: resp.data.createShortTerm.details }]],
                  },
                },
              }
            }
            return lg
          }
          return lg
        }),
      )
    } else if (type === 'short-edit') {
      setLongTermGoals(state =>
        state.map(lg => {
          if (lg.node.id === activeLongTermGoal.node.id) {
            const lgIdx = lg.node.shorttermgoalSet.edges.findIndex(
              d => d.node.id === activeShortTermGoal.node.id,
            )
            lg.node.shorttermgoalSet.edges[lgIdx] = { node: resp.data.updateShortTerm.details }
            return lg
          }
          return lg
        }),
      )
    }
  }

  const [isTargetDetailsVisible, setShowTargetDetailsVisible] = useState(false)
  const [activeSessionDetails, setActiveSessionDetails] = useState(null)


  const handleCloseTargetDetails = () => {
    setShowTargetDetailsVisible(false)
    setActiveSessionDetails(null)
  }

  const allocateSessionToTarget = session => {
    setShowTargetDetailsVisible(true)
    setActiveSessionDetails(session)
  }

  const [selectedShortTermGoal, setSelectedShortTermGoal] = useState(null)
  const selectShortTermGoal = stg => {
    setSelectedShortTermGoal(stg)
  }

  useEffect(() => {}, [selectedShortTermGoal])


  // Edit target

  const [isEditAllocatedTargetVisible, setEditAllocatedTargetVisible] = useState(false)
  const [activeAllocatedTarget, setActiveAllocatedTarget] = useState(null)
  
  const handleCloseEditTargetDetails = () => {
    setEditAllocatedTargetVisible(false)
    setActiveAllocatedTarget(null)
  }


  const editAllocatedTarget = node => {
    setEditAllocatedTargetVisible(true)
    setActiveAllocatedTarget(node)
    console.log('got the id', node.id)
  }

  const onSuccessEditTargetAllocation = resp => {
    const cloneSelectedShortTermGoal = { 
        ...selectedShortTermGoal,
        node : {
          ...selectedShortTermGoal.node,
            targetAllocateSet : {
              ...selectedShortTermGoal.node.targetAllocateSet,
                edges: [
                  ...selectedShortTermGoal.node.targetAllocateSet.edges.map(item => {
                    if( item.node.id === resp.data.updateTargetAllocate.target.id){
                      return {
                          node: resp.data.updateTargetAllocate.target
                      }
                    }
                    else{
                      return item
                    }
                  })
                ]
            }
        }
    }
    console.log(cloneSelectedShortTermGoal)
    setSelectedShortTermGoal(cloneSelectedShortTermGoal)
    setEditAllocatedTargetVisible(false)
    setActiveAllocatedTarget(null)
    

    // console.log(longTermGoals, selectedShortTermGoal)


    // const newLongTermGoal = {
    //   ...longTermGoals.map(item => {
    //     return {
    //       ...item.node,
    //       shorttermgoalSet : {
    //         ...item.node.shorttermgoalSet,
    //           edges: {
    //             ...item.node.shorttermgoalSet.edges.map(sItem => {
    //               if (sItem.node.id === selectedShortTermGoal.node.id ){
    //                 return {
    //                   ...sItem,
    //                     node : {
    //                       ...sItem.node,
    //                         targetAllocateSet: {
    //                           ...sItem.node.targetAllocateSet,
    //                             edges: {
    //                               ...sItem.node.targetAllocateSet.edges.map(tItem => {
    //                                 if( tItem.node.id === resp.data.updateTargetAllocate.id){
    //                                   return {
    //                                     ...tItem,
    //                                       node: resp.data.updateTargetAllocate
    //                                   }
    //                                 }
    //                                 else{
    //                                   return tItem
    //                                 }
    //                               })
    //                             }
    //                         }
    //                     }
    //                 }
    //               }
    //               else{
    //                 return sItem
    //               }
    //             })
    //           } 
    //       }
    //     }
    //   })
    // }

    // if (addTargetMode === 'list') {
    //   setSuggestedTarget(item =>
    //     item.filter(target => target.node.id !== activeSessionDetails.node.id),
    //   )
    // }

   



    // if (cloneSelectedShortTermGoal.node.targetAllocateSet){

    //   cloneSelectedShortTermGoal = {
    //     ...cloneSelectedShortTermGoal.node,
    //     targetAllocateSet: {
    //       ...cloneSelectedShortTermGoal.node.targetAllocateSet, 
    //       edges: {
    //         ...cloneSelectedShortTermGoal.node.targetAllocateSet.edges.map(item => {
    //           if (item.node.id === resp.data.updateTargetAllocate.id) {
    //             return resp.data.updateTargetAllocate.object
    //           }
    //           return item
    //         })
    //       }
    //     }
    //   }

    // }

  }

  // End of Edit allocated target


  // for close sugegsted target area
  const closeSuggestedTargetArea = () => {
    setAddTargetMode('')
    setSelectedShortTermGoal(null)
  }

  const handleSelectTargetMode = mode => {
    setAddTargetMode(mode)
  }

  useEffect(() => {
    if (addTargetMode === 'manually') {
      setShowTargetDetailsVisible(true)
      setActiveSessionDetails(null)
    }
  }, [addTargetMode])

  

  const onSuccessTargetAllocation = resp => {
    setShowTargetDetailsVisible(false)
    setActiveSessionDetails(null)

    // getLongTermGoalsQuery(selectedStudent, selectedProgram)

    const cloneSelectedShortTermGoal = { ...selectedShortTermGoal }

    if (cloneSelectedShortTermGoal.node.targetAllocateSet){
      cloneSelectedShortTermGoal.node.targetAllocateSet.edges.unshift({
        node: {
          ...resp.data.createTargetAllocate.target,
        },
      })
    }
    else{
      cloneSelectedShortTermGoal.node = {...cloneSelectedShortTermGoal.node, targetAllocateSet: {edges: [{node : {...resp.data.createTargetAllocate.target}}]}}
      // console.log(cloneSelectedShortTermGoal)
    }

    setSelectedShortTermGoal(cloneSelectedShortTermGoal)

    if (addTargetMode === 'list') {
      setSuggestedTarget(item =>
        item.filter(target => target.node.id !== activeSessionDetails.node.id),
      )
    }
  }

  const role = useSelector(state => state.user.role)
  let editAble = true
  if (role === 'parents') {
    editAble = false
  }
  let addHeading = 'Update short term details'
  if (goalType === 'long') {
    addHeading = 'Add long term details'
  } else if (goalType === 'long-edit') {
    addHeading = 'Update long term details'
  } else if (goalType === 'short') {
    addHeading = 'Add short term details'
  }

  const studentName = useSelector(state => state.user.studentName)

  return (
    <div>
      <Helmet title="Target allocation to goals" />

      {/* Goals Drawer */}
      <Drawer
        title={addHeading}
        placement="right"
        closable={true}
        width={550}
        onClose={handleCloseAddGoal}
        visible={isAddGoalVisible}
      >
        <AddLongAndShortGoal
          type={goalType}
          activeLongTermGoal={activeLongTermGoal}
          activeShortTermGoal={activeShortTermGoal}
          student={selectedStudent}
          program={selectedProgram}
          goalResponsibilityList={goalResponsibilityList}
          goalStatusList={goalStatusList}
          onSuccess={onSuccessAddEditGoal}
          editAble={editAble}
        />
      </Drawer>

      {/* Target Allocation Drawer */}
      <Drawer
        title="Target Allocation"
        placement="right"
        closable={true}
        width={650}
        onClose={handleCloseTargetDetails}
        visible={isTargetDetailsVisible}
      >
        <TargetAllocationDetails
          key={Math.random()}
          selectedShortTermGoal={selectedShortTermGoal}
          studentId={selectedStudent}
          activeSessionDetails={activeSessionDetails}
          addTargetMode={addTargetMode}
          onSuccessTargetAllocation={onSuccessTargetAllocation}
        />
      </Drawer>

      {/* Edit Allocated Target Drawer */}
      <Drawer
        title="Edit Allocated Target Details"
        placement="right"
        closable={true}
        width={650}
        onClose={handleCloseEditTargetDetails}
        visible={isEditAllocatedTargetVisible}
      >
        <EditAllocatedTargetDetails
          key={Math.random()}
          selectedShortTermGoal={selectedShortTermGoal}
          studentId={selectedStudent}
          activeAllocatedTarget={activeAllocatedTarget}
          onSuccessTargetAllocation={onSuccessEditTargetAllocation}
          editAble={editAble}
        />
      </Drawer>

      

      <section className="card">
        <div className="card-header" style={{padding: 0}}>
          <div>
            <Title 
              style={{
                fontSize: 20,
                lineHeight: '27px',
                marginLeft: '40px'
              }}
            >
              {studentName}&apos;s goals
            </Title>
          </div>
        </div>
        <div className={`${styles.cardBody} card-body`}>
          <div className={styles.feed}>
            <div className="row">
              <div className="col-lg-12 d-flex">
                <div style={{paddingBottom: '10px'}}>
                  <Select
                    style={selectPatientStyle}
                    // size="large"
                    defaultValue="Select Program"
                    value={selectedProgram}
                    onSelect={handleSelectProgram}
                  >
                    {programArea &&
                      programArea.map(p => {
                        return (
                          <Select.Option value={p.node.id} key={p.node.id}>
                            {p.node.name}
                          </Select.Option>
                        )
                      })}
                  </Select>
                </div>
                {editAble ? (
                  <>
                    
                    <Button type="default" style={longGoalBtn} onClick={addLongTermGoal}>
                      <Icon type="plus" /> LT Goal
                    </Button>
                    
                    {addTargetMode === 'list' ?
                      <>
                        
                        <Button type="default" style={{marginLeft: '466px'}} onClick={closeSuggestedTargetArea}>
                          X
                        </Button>
                        
                      </>
                    :
                      ''
                    }
                  </>
                ) : (
                  <></>
                )}
              {/* </div>
              <div className="col-lg-4"> */}
                {selectedShortTermGoal && editAble ? (
                  <>
                    <Select
                      style={{ width: 200, position: 'absolute', right: 0, top: 0 }}
                      placeholder="Select Target selection"
                      value={addTargetMode}
                      onSelect={handleSelectTargetMode}
                    >
                      <Select.Option value="" hidden>Select Target selection</Select.Option>
                      <Select.Option value="list">Choose from Library</Select.Option>
                      <Select.Option value="manually">Add Manually</Select.Option>
                    </Select>
                  </>
                ) : (
                  <></>
                )}
              </div>
            </div>

            <div className={styles.partition}>
              <div className="row">
                <div
                  className={`${styles.leftPanel} col-md-12 ${
                    addTargetMode === 'list' ? 'col-lg-3' : 'col-lg-8'
                  }`}
                >
                  <div className={styles.longTermGoalWrapper}>
                    {longTermGoals &&
                      longTermGoals.length > 0 &&
                      longTermGoals.map(ltGoal => {
                        return (
                          <div className={styles.behaviour} key={ltGoal.node.id}>
                            <div className="row">
                              <div
                                className={
                                  addTargetMode === 'list'
                                    ? 'col-lg-12 col-md-12'
                                    : 'col-lg-8 col-md-12'
                                }
                              >
                                <span className={styles.behaviourHeading}>
                                  <Title
                                    style={{
                                      fontSize: 20,
                                      lineHeight: '27px',
                                    }}
                                  >
                                    {ltGoal.node.goalName}
                                  </Title>
                                </span>
                                <div className={styles.behaviourDate}>
                                  <Text
                                    style={{
                                      fontSize: 18,
                                      lineHeight: '27px',
                                    }}
                                  >
                                    {getDate(ltGoal.node)}
                                  </Text>
                                  {/* <span></span> */}
                                </div>
                              </div>
                              <div
                                className={
                                  addTargetMode === 'list'
                                    ? 'col-lg-12 col-md-12'
                                    : 'col-lg-4 col-md-12'
                                }
                              >
                                {editAble ? (
                                  <div className={styles.shortGoalBtn}>
                                    <Button
                                      style={shortGoalBtn}
                                      onClick={() => addShortTermGoal(ltGoal)}
                                    >
                                      <Icon type="plus" /> ST Goal
                                    </Button>
                                    &nbsp;
                                    <Button onClick={() => editLongTermGoal(ltGoal)}><EditOutlined /> LT Goal</Button>
                                  </div>
                                ) : (
                                  ''
                                )}
                              </div>
                            </div>
                            <div className={styles.goalCardWrapper}>
                              {'shorttermgoalSet' in ltGoal.node &&
                                arrayNotNull(ltGoal.node.shorttermgoalSet.edges) &&
                                ltGoal.node.shorttermgoalSet.edges.map((sGoal, index) => {
                                  return (
                                    <GoalCard
                                      selected={
                                        selectedShortTermGoal !== null &&
                                        selectedShortTermGoal.node.id === sGoal.node.id
                                      }
                                      editAble={editAble}
                                      key={sGoal.node.id}
                                      heading={sGoal.node.goalName}
                                      progess={50}
                                      onEdit={() => editShortTermGoal(ltGoal, sGoal)}
                                      selectShortTermGoal={() => selectShortTermGoal(sGoal)}
                                    />
                                  )
                                })}
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </div>

                {addTargetMode === 'list' ? (
                  <TargetsAvailable
                    selectedStudent={selectedStudent}
                    selectedProgram={selectedProgram}
                    allocateSessionToTarget={allocateSessionToTarget}
                    suggestedTarget={suggestedTarget}
                    setSuggestedTarget={setSuggestedTarget}
                  />
                ) : (
                  <></>
                )}

                {selectedShortTermGoal ? (
                  <AllocatedTarget
                    editAble={editAble}
                    editAllocatedTarget={editAllocatedTarget}
                    allocatedTarget={selectedShortTermGoal?.node?.targetAllocateSet?.edges}
                  />
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default TargetAllocation
