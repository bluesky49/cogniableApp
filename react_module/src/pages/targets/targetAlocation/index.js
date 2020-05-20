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
  color: '#0B35B3',
  backgroundColor: '#FFF',
  border: '1px solid #0B35B3',
}

const shortGoalBtn = {
  color: '#FFF',
  backgroundColor: '#0B35B3',
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

  const [selectedProgram, setSelectedProgram] = useState('UHJvZ3JhbUFyZWFUeXBlOjE=')

  const [longTermGoals, setLongTermGoals] = useState([])
  const [allocatedTarget, setAllocatedTarget] = useState([])
  const [shortTermGoals, setShortTermGoals] = useState([])

  const [activeLongTermGoal, setActiveLongTermGoal] = useState(null)
  const [activeShortTermGoal, setActiveShortTermGoal] = useState(null)
  const [isAddGoalVisible, setAddGoalVisible] = useState(false)

  const [goalType, setGoalType] = useState('long')

  const [addTargetMode, setAddTargetMode] = useState('')

  const [suggestedTarget, setSuggestedTarget] = useState([])

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
    if (notNull(patientResp)) setProgramArea(patientResp.data.student.programArea.edges)
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
    getGoalStatusQuery()
    getGoalResponsibilityQuery()

    // alreadyAlloctedTargetQuery(selectedStudent, 'U3RhdHVzVHlwZToz', 'RG9tYWluVHlwZToxMQ==')

    getProgramAreaQuery(selectedStudent)

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

  const onSuccessAddEditGoal = () => {
    setAddGoalVisible(false)
    getLongTermGoalsQuery(selectedStudent, selectedProgram)
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

  return (
    <div>
      <Helmet title="Target allocation to goals" />
      <AddLongAndShortGoal
        show={isAddGoalVisible}
        onClose={handleCloseAddGoal}
        heading={goalType === 'long' ? 'Add long term details' : 'Add short term details'}
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
            <div className={styles.selectPatient}>
              <div>
                <Select
                  style={selectPatientStyle}
                  // size="large"
                  defaultValue="Select Program"
                  value={selectedProgram}
                  onSelect={handleSelectProgram}
                >
                  {programArea.map(p => {
                    return (
                      <Select.Option value={p.node.id} key={p.node.id}>
                        {p.node.name}
                      </Select.Option>
                    )
                  })}
                </Select>
              </div>

              {selectedShortTermGoal && editAble ? (
                <div>
                  <Select
                    style={{ width: 200 }}
                    placeholder="Allocate target mode"
                    defaultValue="Allocate target mode"
                    value={addTargetMode}
                    onSelect={handleSelectTargetMode}
                  >
                    <Select.Option value="">Allocate target mode</Select.Option>
                    <Select.Option value="list">Choose from list</Select.Option>
                    <Select.Option value="manually">Add Manually</Select.Option>
                  </Select>
                </div>
              ) : (
                <></>
              )}
            </div>

            <div className={styles.partition}>
              <div className="row">
                <div
                  className={`${styles.leftPanel} col-md-12 ${
                    addTargetMode === 'list' ? 'col-lg-3' : 'col-lg-8'
                  }`}
                >
                  <div className={styles.longTermGoalWrapper}>
                    {longTermGoals.length > 0 &&
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
                            <div>
                              <span className={styles.behaviourHeading}>
                                {ltGoal.node.goalName}
                              </span>
                            </div>
                            <div className={styles.behaviourDate}>
                              <span>{getDate(ltGoal.node)}</span>
                            </div>
                            <div className={styles.goalCardWrapper}>
                              {arrayNotNull(ltGoal.node.shorttermgoalSet.edges) &&
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
                        )
                      })}
                  </div>
                  {editAble ? (
                    <div className={styles.longtGoalBtn}>
                      <Button type="default" style={longGoalBtn} onClick={addLongTermGoal}>
                        Add Long Term Goal
                      </Button>
                    </div>
                  ) : (
                    ''
                  )}
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
                    allocatedTarget={selectedShortTermGoal.node.targetAllocateSet.edges}
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
