/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-indent */
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Button, Checkbox, Select } from 'antd'
import moment from 'moment'
import { EditOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
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
import AllocatedTarget from './AllocatedTarget'
import TargetsAvailable from './TargetsAvailable'

const longGoalBtn = {
  color: '#fff',
  backgroundColor: '#0B35B3',
  // border: '1px solid #0B35B3',
}

const shortGoalBtn = {
  border: 0,
  color: '#000',
  backgroundColor: '#66ff33',
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

  const alreadyAlloctedTargetQuery = async (
    studentId = 'U3R1ZGVudFR5cGU6MTYz',
    targetStatus = 'U3RhdHVzVHlwZToz',
    targetIdDomain = 'RG9tYWluVHlwZToxMQ==',
  ) => {
    const allocatedTargetResp = await alreadyAlloctedTarget(studentId, targetStatus, targetIdDomain)
    if (notNull(allocatedTargetResp))
      setAllocatedTarget(allocatedTargetResp.data.targetAllocates.edges)
  }

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

  const handleSelectTargetMode = mode => {
    setAddTargetMode(mode)
  }

  useEffect(() => {
    if (addTargetMode === 'manually') {
      setShowTargetDetailsVisible(true)
      setActiveSessionDetails(null)
    }
  }, [addTargetMode])

  const [selectedShortTermGoal, setSelectedShortTermGoal] = useState(null)
  const selectShortTermGoal = stg => {
    setSelectedShortTermGoal(stg)
  }

  useEffect(() => {}, [selectedShortTermGoal])

  const onSuccessTargetAllocation = resp => {
    setShowTargetDetailsVisible(false)
    setActiveSessionDetails(null)

    getLongTermGoalsQuery(selectedStudent, selectedProgram)

    const cloneSelectedShortTermGoal = { ...selectedShortTermGoal }

    cloneSelectedShortTermGoal.node.targetAllocateSet.edges.push({
      node: {
        ...resp.data.createTargetAllocate.target,
      },
    })

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

  return (
    <div>
      <Helmet title="Target allocation to goals" />
      <AddLongAndShortGoal
        show={isAddGoalVisible}
        onClose={handleCloseAddGoal}
        heading={addHeading}
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

      <TargetAllocationDetails
        selectedShortTermGoal={selectedShortTermGoal}
        studentId={selectedStudent}
        show={isTargetDetailsVisible}
        onClose={handleCloseTargetDetails}
        heading="Target Allocation Details"
        activeSessionDetails={activeSessionDetails}
        addTargetMode={addTargetMode}
        onSuccessTargetAllocation={onSuccessTargetAllocation}
      />

      <section className="card">
        <div className={`${styles.cardHeader} card-header`}>
          <div className="utils__title">
            <strong>Target allocation to goals</strong>
          </div>
        </div>
        <div className={`${styles.cardBody} card-body`}>
          <div className={styles.feed}>
            <div className="row">
              <div className="col-lg-8 d-flex justify-content-between">
                <div>
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
                  <div className={styles.longtGoalBtn}>
                    <Button type="default" style={longGoalBtn} onClick={addLongTermGoal}>
                      Add Long Term Goal
                    </Button>
                  </div>
                ) : (
                  <></>
                )}
              </div>
              <div className="col-lg-4">
                {selectedShortTermGoal && editAble ? (
                  <Select
                    style={{ width: 200, position: 'absolute', right: 0, top: 0 }}
                    placeholder="Allocate target mode"
                    defaultValue="Allocate target mode"
                    value={addTargetMode}
                    onSelect={handleSelectTargetMode}
                  >
                    <Select.Option value="">Allocate target mode</Select.Option>
                    <Select.Option value="list">Choose from list</Select.Option>
                    <Select.Option value="manually">Add Manually</Select.Option>
                  </Select>
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
                            {editAble ? (
                              <div className={styles.longTermGoalEditBn}>
                                <EditOutlined onClick={() => editLongTermGoal(ltGoal)} />
                              </div>
                            ) : (
                              ''
                            )}
                            <div className="row">
                              <div
                                className={
                                  addTargetMode === 'list'
                                    ? 'col-lg-12 col-md-12'
                                    : 'col-lg-8 col-md-12'
                                }
                              >
                                <span className={styles.behaviourHeading}>
                                  {ltGoal.node.goalName}
                                </span>
                                <div className={styles.behaviourDate}>
                                  <span>{getDate(ltGoal.node)}</span>
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
                                      type="primary"
                                      style={shortGoalBtn}
                                      onClick={() => addShortTermGoal(ltGoal)}
                                    >
                                      Add Short Term Goal
                                    </Button>
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
