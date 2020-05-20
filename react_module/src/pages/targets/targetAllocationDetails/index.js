import React, { useEffect, useState } from 'react'
import { Avatar, Button, Col, Form, Icon, Input, Select, Typography } from 'antd'
import moment from 'moment'
import styles from './style.module.scss'
import RightDrawer from '../../../components/RightDrawer'
import motherAndSon from '../motherSon.jpg'
import NumberCard from './NumberCard'
import {
  createTargetAllocate,
  getSearchSd,
  getSearchSteps,
  getTargetDetailsOptions,
} from '../targetAlocation/TargetAllocation.query'

const { Text } = Typography
const { Option } = Select

const TargetAllocationDetails = ({
  selectedShortTermGoal,
  studentId,
  show,
  onClose,
  heading,
  activeSessionDetails,
  addTargetMode,
  onSuccessTargetAllocation,
  editAble,
}) => {
  const [selectedMasteryCriteria, setSelectedMasteryCriteria] = useState('')
  const [dailyTrials, setDailyTrials] = useState(0)
  const [sessionConsecutiveDays, setSessionConsecutiveDays] = useState(0)
  const [status, setStatus] = useState('')
  const [selectedSteps, setSelectedSteps] = useState([])
  const [selectedSd, setSelectedSd] = useState([])

  const [stimulus, setStimulus] = useState('')
  const [targetInstructions, setTargetInstructions] = useState('')
  const [inputTargetName, setInputTargetName] = useState('')

  const [searchSd, setSearchSd] = useState([])
  const [searchStep, setSearchStep] = useState([])

  const [domain, setDomain] = useState([])
  const [goalsProgramArea, setGoalsProgramArea] = useState([])
  const [masteryCriteria, setMasteryCriteria] = useState([])
  const [promptCodes, setPromptCodes] = useState([])
  const [targetStatus, setTargetStatus] = useState([])
  const [types, setTypes] = useState([])

  const [selectedTargetType, setSelectedTargetType] = useState('')

  const handleOnChange = ({ target: { name, value } }) => {
    if (name === 'status') setStatus(value)
    else if (name === 'Stimulus') setStimulus(value)
    else if (name === 'targetInstructions') setTargetInstructions(value)
    else if (name === 'targetName') setInputTargetName(value)
  }

  useEffect(() => {
    if (activeSessionDetails) {
      const { targetName } = activeSessionDetails.node.targetMain
      setInputTargetName(targetName)
    }
  }, [activeSessionDetails])

  const onChangeNumber = (type, num) => {
    if (type === 'sdt') setDailyTrials(num)
    else if (type === 'scd') setSessionConsecutiveDays(num)
  }

  const handleSave = async () => {
    let targetId = ''
    if (activeSessionDetails) {
      const { id } = activeSessionDetails.node.targetMain
      targetId = id
    }

    const data = {
      // selectedShortTermGoal.node.id,
      targetId,
      studentId,
      status,
      // moment().format('YYYY-MM-DD'),
      targetInstructions,
      selectedMasteryCriteria,
      inputTargetName,
      dailyTrials,
      sessionConsecutiveDays,
      selectedSd,
      selectedSteps,
    }

    const stepsListSelected = []
    if (selectedSteps) {
      selectedSteps.map(item => stepsListSelected.push(`"${item}"`))
    }

    const sdList = []
    if (selectedSd) {
      selectedSd.map(item => sdList.push(`"${item}"`))
    }

    const createTargetAllocateResp = await createTargetAllocate(
      selectedShortTermGoal.node.id,
      targetId,
      studentId,
      status,
      '',
      moment().format('YYYY-MM-DD'),
      targetInstructions,
      selectedMasteryCriteria,
      inputTargetName,
      dailyTrials,
      sessionConsecutiveDays,
      selectedTargetType,
      '',
      sdList,
      stepsListSelected,
    )

    if (createTargetAllocateResp) {
      onSuccessTargetAllocation(createTargetAllocateResp)
    }
  }

  const getTargetDetailsOptionsQuery = async () => {
    const targetOptionsResp = await getTargetDetailsOptions()
    if (targetOptionsResp) {
      setDomain(targetOptionsResp.data.domain)
      setGoalsProgramArea(targetOptionsResp.data.goalsProgramArea)
      setMasteryCriteria(targetOptionsResp.data.masteryCriteria)
      setPromptCodes(targetOptionsResp.data.promptCodes)
      setTargetStatus(targetOptionsResp.data.targetStatus)
      setTypes(targetOptionsResp.data.types)
    }
  }

  useEffect(() => {
    getTargetDetailsOptionsQuery()

    getSearchStepQuery('as')
    getSearchSdQuery('as')
  }, [])

  const handleSelect = (data, name) => {
    if (name === 'masteryCriteria') setSelectedMasteryCriteria(data)
    else if (name === 'status') setStatus(data)
    else if (name === 'steps') setSelectedSteps(data)
    else if (name === 'sd') setSelectedSd(data)
    else if (name === 'targetType') setSelectedTargetType(data)
  }

  const getSearchSdQuery = async text => {
    const searchSdResp = await getSearchSd(text)
    if (searchSdResp) {
      setSearchSd(searchSdResp?.data?.targetSd?.edges)
    }
  }

  const getSearchStepQuery = async text => {
    const searchStepResp = await getSearchSteps(text)
    if (searchStepResp) {
      setSearchStep(searchStepResp?.data?.targetStep?.edges)
    }
  }

  const handleChangeSelectText = (text, type) => {
    if (type === 'step') getSearchStepQuery(text)
    else if (type === 'sd') getSearchSdQuery(text)
  }

  return (
    <RightDrawer show={show} onClose={onClose} heading={heading}>
      <div className={styles.form}>
        <Avatar className={styles.image} src={motherAndSon} shape="square" size="large" />
        <div>
          <Text className={styles.subHeading}>
            <span className={styles.name}>Kunal</span> selects an item that doesn’t share the same
            features
          </Text>
        </div>

        <div className={styles.receptiveLanguage}>
          <Text className={styles.desc}>Receptive Language</Text>
          <span className={styles.dot} />
          <Text className={styles.type}>Narrative</Text>
        </div>

        <Form
          name="basic"
          initialValues={{
            remember: true,
          }}
        >
          <Form.Item
            label="Target Name"
            name="Target Name"
            rules={[
              {
                required: true,
                message: 'Please input target name',
              },
            ]}
          >
            <Input name="targetName" value={inputTargetName} onChange={handleOnChange} />
          </Form.Item>
          <Form.Item
            label="Target Type"
            name="Target Type"
            rules={[
              {
                required: true,
                message: 'Please input Target Type!',
              },
            ]}
          >
            <Select
              size="large"
              name="targetType"
              value={selectedTargetType}
              onSelect={s => handleSelect(s, 'targetType')}
            >
              {types &&
                types.reverse().map(s => {
                  return (
                    <Select.Option value={s.id} key={s.id}>
                      {s.typeTar}
                    </Select.Option>
                  )
                })}
            </Select>
          </Form.Item>

          <Form.Item
            label="Mastery Criteria"
            name="masteryCriteria"
            rules={[
              {
                required: true,
                message: 'Please input status!',
              },
            ]}
          >
            <Select
              size="large"
              name="masteryCriteria"
              value={selectedMasteryCriteria}
              className={styles.height48}
              onSelect={s => handleSelect(s, 'masteryCriteria')}
            >
              {masteryCriteria &&
                masteryCriteria.map(s => {
                  return (
                    <Select.Option value={s.id} key={s.id}>
                      <>
                        <span>Consecutive Days: {s.consecutiveDays}</span>&nbsp;|&nbsp;
                        <span>Min Trial: {s.minTrial}</span>&nbsp;|&nbsp;
                        <span>Response Percentage: {s.responsePercentage}</span>
                      </>
                    </Select.Option>
                  )
                })}
            </Select>
          </Form.Item>

          <div className="mb-3">
            <Text className={styles.cardsHead}>Session</Text>
            <NumberCard
              title="Daily Trials"
              number={dailyTrials}
              setNumber={num => onChangeNumber('sdt', num)}
            />
            <NumberCard
              title="Consecutive Days"
              number={sessionConsecutiveDays}
              setNumber={num => onChangeNumber('scd', num)}
              unit="%"
            />
          </div>

          <Form.Item
            label="Status"
            name="status"
            rules={[
              {
                required: true,
                message: 'Please input status!',
              },
            ]}
          >
            <Select
              size="large"
              name="status"
              value={status}
              onSelect={s => handleSelect(s, 'status')}
            >
              {targetStatus &&
                targetStatus.reverse().map(s => {
                  return (
                    <Select.Option value={s.id} key={s.id}>
                      {s.statusName}
                    </Select.Option>
                  )
                })}
            </Select>
          </Form.Item>

          <Form.Item
            label="Steps"
            name="Steps"
            rules={[
              {
                required: true,
                message: 'Please input target Instructions',
              },
            ]}
          >
            <Select
              mode="tags"
              size="large"
              placeholder="Please select"
              disabled={selectedSd.length > 0}
              onChange={s => handleSelect(s, 'steps')}
              onSearch={t => handleChangeSelectText(t, 'step')}
              style={{ width: '100%' }}
            >
              {searchStep.map(s => {
                return (
                  <Option key={s.node.id} value={s.node.step}>
                    {s.node.step}
                  </Option>
                )
              })}
            </Select>
          </Form.Item>
          <Form.Item
            label="Sd"
            name="Sd"
            rules={[
              {
                required: true,
                message: 'Please input target Instructions',
              },
            ]}
          >
            <Select
              mode="tags"
              disabled={selectedSteps.length > 0}
              size="large"
              placeholder="Please select"
              onChange={s => handleSelect(s, 'sd')}
              onSearch={t => handleChangeSelectText(t, 'sd')}
            >
              {searchSd.map(s => {
                return (
                  <Option key={s.node.id} value={s.node.sd}>
                    {s.node.sd}
                  </Option>
                )
              })}
            </Select>
          </Form.Item>

          <Form.Item
            label="Target Instructions"
            name="Target Instructions"
            rules={[
              {
                required: true,
                message: 'Please input target Instructions',
              },
            ]}
          >
            <Input.TextArea
              name="targetInstructions"
              value={targetInstructions}
              onChange={handleOnChange}
            />
          </Form.Item>
          <Form.Item>
            <Button
              onClick={handleSave}
              className={styles.searchBtn}
              type="primary"
              htmlType="submit"
            >
              Save
            </Button>
          </Form.Item>
        </Form>
      </div>
    </RightDrawer>
  )
}

export default TargetAllocationDetails
