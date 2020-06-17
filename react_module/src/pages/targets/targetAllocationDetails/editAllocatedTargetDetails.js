/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react'
import { Avatar, Button, Col, Form, Icon, Input, Select, Typography, notification } from 'antd'
import moment from 'moment'
import CKEditor from "react-ckeditor-component";
import styles from './style.module.scss'
import motherAndSon from '../motherSon.jpg'
import NumberCard from './NumberCard'
import {
  updateAllocatedTarget,
  getSearchSd,
  getSearchSteps,
  getTargetDetailsOptions,
} from '../targetAlocation/TargetAllocation.query'

const { Text } = Typography
const { Option } = Select

const TargetAllocationDetails = ({
  selectedShortTermGoal,
  studentId,
  activeAllocatedTarget,
  onSuccessTargetAllocation,
  editAble,
}) => {
  const [loading, setLoading] = useState(false)
  const [selectedMasteryCriteria, setSelectedMasteryCriteria] = useState('')
  const [dailyTrials, setDailyTrials] = useState(0)
  const [sessionConsecutiveDays, setSessionConsecutiveDays] = useState(0)
  const [status, setStatus] = useState('')
  const [selectedSteps, setSelectedSteps] = useState([])
  const [selectedSd, setSelectedSd] = useState([])

  const [stimulus, setStimulus] = useState('')
  const [targetInstructions, setTargetInstructions] = useState('')
  const [inputTargetName, setInputTargetName] = useState('')
  const [inputTargetVideo, setInputTargetVideo] = useState('')

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
    else if (name === 'targetVideo') setInputTargetVideo(value)
  }


  function onEditorChange(evt) {
    // console.log(evt.editor.getData())
    setTargetInstructions(evt.editor.getData())
  }

  console.log(activeAllocatedTarget)

  useEffect(() => {
    if (activeAllocatedTarget) {
      const { targetInstr } = activeAllocatedTarget
      const { targetName, targetType, consecutiveDays, DailyTrials } = activeAllocatedTarget.targetAllcatedDetails
      setInputTargetName(targetName)
      setDailyTrials(DailyTrials)
      setSessionConsecutiveDays(consecutiveDays)
      setSelectedTargetType(targetType.id)
      setStatus(activeAllocatedTarget.targetStatus.id)
      setTargetInstructions(targetInstr)
      // console.log(targetInstr)
      setSelectedMasteryCriteria(activeAllocatedTarget.masteryCriteria.id)

      if (activeAllocatedTarget.sd.edges.length > 0) {
        const allocatedSdList = []
        activeAllocatedTarget.sd.edges.map(item => {
          allocatedSdList.push(item.node.sd)
        })
        // console.log(allocatedSdList)
        setSelectedSd(allocatedSdList)
      }
      if (activeAllocatedTarget.steps.edges.length > 0) {
        const allocatedStepList = []
        activeAllocatedTarget.steps.edges.map(item => {
          allocatedStepList.push(item.node.step)
          // console.log(item.node.step)
        })
        // console.log(allocatedStepList)
        setSelectedSteps(allocatedStepList)
      }

      if (activeAllocatedTarget.videos.edges.length > 0) {
        const allocatedVideo = activeAllocatedTarget.videos.edges[0].node.url
        setInputTargetVideo(allocatedVideo)
      }

    }
  }, [activeAllocatedTarget])

  const onChangeNumber = (type, num) => {
    if (type === 'sdt') setDailyTrials(num)
    else if (type === 'scd') setSessionConsecutiveDays(num)
  }

  const handleSave = async () => {

    setLoading(true)

    const stepsListSelected = []
    if (selectedSteps) {
      selectedSteps.map(item => stepsListSelected.push(item))
    }

    const sdList = []
    if (selectedSd) {
      selectedSd.map(item => sdList.push(item))
    }

    const editAllocatedTargetResp = await updateAllocatedTarget(
      activeAllocatedTarget.id,
      status,
      targetInstructions,
      selectedMasteryCriteria,
      inputTargetName,
      dailyTrials,
      sessionConsecutiveDays,
      selectedTargetType,
      sdList,
      stepsListSelected,
      inputTargetVideo
    )

    setLoading(false)
    if (editAllocatedTargetResp) {
      notification.success({
        message: 'Target Updated Successfully',
      })
      onSuccessTargetAllocation(editAllocatedTargetResp)
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
    <div className={styles.form}>
      <Avatar className={styles.image} src={motherAndSon} shape="square" size="large" />

      <Form name="basic">
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
                  // <Select.Option value={s.id} key={s.id}>
                  //   <>
                  //     <span>Consecutive Days: {s.consecutiveDays}</span>&nbsp;|&nbsp;
                  //     <span>Min Trial: {s.minTrial}</span>&nbsp;|&nbsp;
                  //     <span>Response Percentage: {s.responsePercentage}</span>
                  //   </>
                  // </Select.Option>
                  <Select.Option value={s.id} key={s.id}>{s.name}</Select.Option>
                )
              })}
          </Select>
        </Form.Item>

        <div className="mb-3">
          <Text className={styles.cardsHead}>Session</Text>
          <NumberCard
            title="Daily Trials"
            maxValue={26}
            number={dailyTrials}
            setNumber={num => onChangeNumber('sdt', num)}
          />
          <NumberCard
            title="Consecutive Days"
            number={sessionConsecutiveDays}
            setNumber={num => onChangeNumber('scd', num)}
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
            value={selectedSteps}
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
            value={selectedSd}
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
          <CKEditor
            name="targetInstructions"
            activeClass="p10"
            content={targetInstructions}
            events={{
              "change": onEditorChange
            }}
          />
        </Form.Item>
        <Form.Item
          label="Target Video Link"
          name="Target Video"
        >
          <Input name="targetVideo" value={inputTargetVideo} onChange={handleOnChange} />
        </Form.Item>
        <Form.Item>
          <Button
            onClick={handleSave}
            className={styles.searchBtn}
            type="primary"
            loading={loading}
            htmlType="submit"
          >
            Save
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default TargetAllocationDetails
