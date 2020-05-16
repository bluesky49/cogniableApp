import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Button, Checkbox, Select } from 'antd'
import moment from 'moment'
import { EditOutlined } from '@ant-design/icons'
import styles from './style.module.scss'
import motherSon from '../motherSon.jpg'
import SessionCard from '../../../components/SessionCard'
import AllocatedTargetCard from '../../../components/AllocatedTargetCard'
import GoalCard from '../../../components/GoalCard'
import {
  getDomainByProgramArea,
  alreadyAlloctedTarget,
  getTargetAreaByDoimain,
  getLongTermGoals,
  getPatients,
  getShortTermGoals,
  suggestTarget,
  getGoalStatus,
  getGoalResponsibility,
} from './TargetAllocation.query'
import { arrayNotNull, notNull } from '../../../utilities'
import AddLongAndShortGoal from '../AddLongAndShortGoal'

const longGoalBtn = {
  color: '#0B35B3',
  backgroundColor: '#FFF',
  border: '1px solid #0B35B3',
}

const shortGoalBtn = {
  color: '#FFF',
  backgroundColor: '#0B35B3',
}

const searchBtnStyle = {
  color: '#FFF',
  backgroundColor: '#0B35B3',
  width: '180px',
}

const selectTargetStyle = {
  width: '120px',
  textDecoration: 'none',
  marginRight: '20px',
}

const selectPatientStyle = {
  width: '244px',
  height: '60px',
  textDecoration: 'none',
  marginRight: '20px',
  border: 0,
}

const TargetAllocation = () => {
  const [selectedStudent, setSelectedStudent] = useState('U3R1ZGVudFR5cGU6OTM=')
  const [selectedProgram, setSelectedProgram] = useState('UHJvZ3JhbUFyZWFUeXBlOjE=')

  const [longTermGoals, setLongTermGoals] = useState([])

  const [selectAllTarget, setSelectAllTarget] = useState(false)
  const [domain, setDomain] = useState([])
  const [area, setArea] = useState([])
  const [selectedTargetArea, setSelectedTargetArea] = useState([])
  const [selectedTargetDomain, setSelectedTargetDomain] = useState([])

  const [patient, setPatient] = useState([])
  const [allocatedTarget, setAllocatedTarget] = useState([])
  const [shortTermGoals, setShortTermGoals] = useState([])

  const [activeLongTermGoal, setActiveLongTermGoal] = useState(null)
  const [activeShortTermGoal, setActiveShortTermGoal] = useState(null)
  const [isAddGoalVisible, setAddGoalVisible] = useState(false)

  const [goalType, setGoalType] = useState('long')

  const onChangeselectAllTarget = ({ target: { checked } }) => {
    setSelectAllTarget(checked)
  }

  const patientOptions = [
    { id: '1', name: 'Anna Goel', image: motherSon },
    { id: '21', name: 'Anna Goel', image: motherSon },
    { id: '3', name: 'Anna Goel', image: motherSon },
    { id: '4', name: 'Anna Goel', image: motherSon },
  ]

  const getDomainByProgramAreaQuery = async pId => {
    const domainResp = await getDomainByProgramArea(pId)
    console.log('domainResp==>', domainResp)
    if (notNull(domainResp)) setDomain(domainResp.data.programDetails.domain.edges)
  }

  const getTargetAreaByDoimainQuery = async domainId => {
    const targetAreaResp = await getTargetAreaByDoimain(domainId)
    setSelectedTargetDomain(domainId)
    if (notNull(targetAreaResp)) setArea(targetAreaResp.data.targetArea.edges)
  }

  const [suggestedTarget, setSuggestedTarget] = useState([])

  const suggestedTargetQuery = async (domainId, areaId) => {
    const suggestedTargetResp = await suggestTarget(domainId, areaId)
    if (notNull(suggestedTargetResp)) setSuggestedTarget(suggestedTargetResp.data.target.edges)
  }

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
  const getPatientsQuery = async studentId => {
    const patientResp = await getPatients(studentId)
    // console.log("patientResp==>", patientResp);
    if (notNull(patientResp)) setPatient(patientResp.data.student.programArea.edges)
  }

  const onSelectArea = sArea => {
    setSelectedTargetArea(sArea)
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

    getLongTermGoalsQuery(selectedStudent, selectedProgram)

    getDomainByProgramAreaQuery(selectedProgram)

    alreadyAlloctedTargetQuery('U3R1ZGVudFR5cGU6MTYz', 'U3RhdHVzVHlwZToz', 'RG9tYWluVHlwZToxMQ==')
    //
    getPatientsQuery('U3R1ZGVudFR5cGU6OTI=')

    // const shortTermGoalResp = getShortTermGoals('TG9uZ1Rlcm1UeXBlOjEy');
    // console.log("shortTermGoalResp==>", shortTermGoalResp);
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

  const searchDomin = () => {
    suggestedTargetQuery(selectedTargetDomain, selectedTargetArea)
  }

  const handleSelectStudent = stId => {
    setSelectedStudent(stId)
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
      />
      <section className="card">
        <div className="card-header">
          <div className="utils__title">
            <strong>Target allocation to goals</strong>
          </div>
        </div>
        <div className="card-body">
          <div className={styles.feed}>
            <div className={styles.selectPatient}>
              <Select
                style={selectPatientStyle}
                size="large"
                defaultValue="Select Student"
                value={selectedStudent}
                onSelect={handleSelectStudent}
              >
                {patientOptions.map(p => {
                  return (
                    <Select.Option value="second" key={p.id}>
                      <div className={styles.patentSelectOption}>
                        <img className={styles.optionImage} src={p.image} alt={p.name} />
                        <span>{p.name}</span>
                      </div>
                    </Select.Option>
                  )
                })}
              </Select>
            </div>

            <div className={styles.partition}>
              <div className="row">
                <div className={`${styles.leftPanel} col-md-12 col-lg-3`}>
                  <div className={styles.longTermGoalWrapper}>
                    {longTermGoals.length > 0 &&
                      longTermGoals.map(ltGoal => {
                        return (
                          <div className={styles.behaviour} key={ltGoal.node.id}>
                            <div className={styles.longTermGoalEditBn}>
                              <EditOutlined onClick={() => editLongTermGoal(ltGoal)} />
                            </div>
                            <div className={styles.behaviourHeading}>
                              <span>{ltGoal.node.goalName}</span>
                            </div>
                            <div className={styles.behaviourDate}>
                              <span>{getDate(ltGoal.node)}</span>
                            </div>
                            <div className={styles.goalCardWrapper}>
                              {arrayNotNull(ltGoal.node.shorttermgoalSet.edges) &&
                                ltGoal.node.shorttermgoalSet.edges.map(sGoal => {
                                  return (
                                    <GoalCard
                                      key={sGoal.node.id}
                                      heading={sGoal.node.goalName}
                                      progess={50}
                                      onEdit={() => editShortTermGoal(ltGoal, sGoal)}
                                    />
                                  )
                                })}
                            </div>
                            <div className={styles.shortGoalBtn}>
                              <Button
                                type="primary"
                                style={shortGoalBtn}
                                onClick={() => addShortTermGoal(ltGoal)}
                              >
                                Add Short Term Goal
                              </Button>
                            </div>
                          </div>
                        )
                      })}
                  </div>

                  <div className={styles.longtGoalBtn}>
                    <Button type="default" style={longGoalBtn} onClick={addLongTermGoal}>
                      Add Long Term Goal
                    </Button>
                  </div>
                </div>

                <div className="col-md-12  col-lg-5">
                  <div className={styles.sessionBtns}>
                    <Select
                      style={selectTargetStyle}
                      defaultValue="Target Domain"
                      onSelect={getTargetAreaByDoimainQuery}
                    >
                      {domain.length > 0 &&
                        domain.map(d => {
                          return (
                            <Select.Option value={d.node.id} key={d.node.id}>
                              {d.node.domain}
                            </Select.Option>
                          )
                        })}
                    </Select>
                    <Select
                      style={selectTargetStyle}
                      defaultValue="Target Area"
                      onSelect={onSelectArea}
                    >
                      {area.map(a => {
                        return (
                          <Select.Option value={a.node.id} key={a.node.id}>
                            {a.node.Area}
                          </Select.Option>
                        )
                      })}
                    </Select>

                    <Button type="primary" style={searchBtnStyle} onClick={searchDomin}>
                      Search
                    </Button>
                  </div>

                  <div className="mb-3">
                    <Checkbox onChange={onChangeselectAllTarget} checked={selectAllTarget}>
                      Select all Target
                    </Checkbox>
                  </div>
                  <div>
                    {suggestedTarget.length > 0 &&
                      suggestedTarget.map(sTarget => {
                        return (
                          <SessionCard
                            key={sTarget.node.id}
                            image={motherSon}
                            heading={sTarget.node.targetMain.targetName}
                            receptiveLanguage="in therapy"
                          />
                        )
                      })}
                  </div>
                </div>
                <div className={`${styles.allocatedGoal} col-md-12 col-lg-4`}>
                  <div className={styles.allocatedGoalHeading}>
                    <span>Allocated Targets to STG1</span>
                  </div>

                  {allocatedTarget.length > 0 &&
                    allocatedTarget.map(aTarget => {
                      return (
                        <AllocatedTargetCard
                          key={aTarget.node.id}
                          heading={aTarget.node.targetAllcatedDetails.targetName}
                          status={aTarget.node.targetStatus.statusName}
                        />
                      )
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default TargetAllocation
