import React, { useEffect, useState } from 'react'
import { Form, Input, Button, DatePicker, Select } from 'antd'
import moment from 'moment'
import style from './style.module.scss'
import RightDrawer from '../../../components/RightDrawer'
import {
  createLongTermGoal,
  createShortTermGoal,
  updateLongTermGoal,
  updateShortTermGoal,
} from '../targetAlocation/TargetAllocation.query'

const selectStyle = {
  width: '100%',
  height: '48px',
  zIndex: '1000',
}

const AddLongAndShortGoal = props => {
  const {
    show,
    onClose,
    heading,
    type,
    student,
    program,
    activeLongTermGoal,
    goalResponsibilityList,
    goalStatusList,
    onSuccess,
    activeShortTermGoal,
  } = props

  useEffect(() => {
    if (type === 'long-edit') {
      setEndDate(moment(activeLongTermGoal.node.dateEnd, 'YYYY-MM-DD'))
      setDateIntiated(moment(activeLongTermGoal.node.dateInitialted, 'YYYY-MM-DD'))
      setDescription(activeLongTermGoal.node.description)
      setGoalName(activeLongTermGoal.node.goalName)
      setGoalStatus(activeLongTermGoal.node.goalStatus.id)
      setResponsible(activeLongTermGoal.node.responsibility.id)
      console.log('activeLongTermGoal.node.dateEnd==>', activeLongTermGoal.node.dateEnd)
      console.log('activeLongTermGoal==>', moment(activeLongTermGoal, 'YYYY-MM-DD'))
    } else if (type === 'short-edit') {
      setEndDate(moment(activeShortTermGoal.node.dateEnd, 'YYYY-MM-DD'))
      setDateIntiated(moment(activeShortTermGoal.node.dateInitialted, 'YYYY-MM-DD'))
      setDescription(activeShortTermGoal.node.description)
      setGoalName(activeShortTermGoal.node.goalName)
      setGoalStatus(activeShortTermGoal.node.goalStatus.id)
      setResponsible(activeShortTermGoal.node.responsibility.id)
    } else {
      resetForm()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type])

  const resetForm = () => {
    setEndDate('')
    setDateIntiated('')
    setDescription('')
    setGoalName('')
    setGoalStatus('')
    setResponsible('')
  }
  const [goalName, setGoalName] = useState('')
  const [description, setDescription] = useState('')
  const [dateIntiated, setDateIntiated] = useState('')
  const [endDate, setEndDate] = useState('')
  const [responsible, setResponsible] = useState('')
  const [goalStatus, setGoalStatus] = useState('')
  // const [assessment, setAssessment] = useState('')

  const handleOnChange = ({ target: { name, value } }) => {
    if (name === 'goalName') setGoalName(value)
    else if (name === 'description') setDescription(value)
  }

  const handleSelectResponsible = resp => {
    setResponsible(resp)
  }

  const addGoal = async () => {
    const startDate = moment(dateIntiated).format('YYYY-MM-DD')
    const endDate1 = moment(endDate).format('YYYY-MM-DD')

    const data = {
      student,
      goalName,
      description,
      startDate,
      endDate1,
      responsible,
      goalStatus,
      program,
    }

    if (type === 'long') {
      const createLongTermGoalResp = await createLongTermGoal(
        student,
        goalName,
        description,
        startDate,
        endDate1,
        responsible,
        goalStatus,
        program,
      )
      if (createLongTermGoalResp) {
        onSuccess()
      }
    } else if (type === 'long-edit') {
      const updateLongTermGoalResp = await updateLongTermGoal(
        student,
        goalName,
        description,
        startDate,
        endDate1,
        responsible,
        goalStatus,
        program,
        activeLongTermGoal.node.id,
      )
      if (updateLongTermGoalResp) {
        onSuccess()
      }
    } else if (type === 'short') {
      const createShortTermGoalResp = await createShortTermGoal(
        activeLongTermGoal.node.id,
        student,
        goalName,
        description,
        startDate,
        endDate1,
        '',
        responsible,
        goalStatus,
      )
      if (createShortTermGoalResp) {
        onSuccess()
      }
    } else if (type === 'short-edit') {
      const updateShortTermGoalResp = await updateShortTermGoal(
        activeLongTermGoal.node.id,
        student,
        goalName,
        description,
        startDate,
        endDate1,
        '',
        responsible,
        goalStatus,
        activeShortTermGoal.node.id,
      )
      if (updateShortTermGoalResp) {
        onSuccess()
      }
    }
  }

  const handleSelectGoalStatus = gs => {
    setGoalStatus(gs)
  }

  // const handleSelectAssessment = as => {
  //   setAssessment(as)
  // }

  const handleChangeDateIntiated = date => {
    setDateIntiated(date)
  }

  const handleChangeEndDate = date => {
    setEndDate(date)
  }

  return (
    <RightDrawer show={show} onClose={onClose} heading={heading}>
      <div className={style.form}>
        <Form
          name="basic"
          initialValues={{
            remember: true,
          }}
        >
          <Form.Item
            label="Goal Name"
            name="goalName"
            rules={[
              {
                required: true,
                message: 'Please input Goal Name!',
              },
            ]}
          >
            <Input name="goalName" value={goalName} onChange={handleOnChange} />
          </Form.Item>
          <Form.Item
            label="Description"
            name="Description"
            rules={[
              {
                required: true,
                message: 'Please input your Description',
              },
            ]}
          >
            <Input.TextArea name="description" value={description} onChange={handleOnChange} />
          </Form.Item>
          <Form.Item
            className={style.formItem}
            label="Date Intiated"
            name="dateIntiated"
            rules={[
              {
                required: true,
                message: 'Please input Date Intiated',
              },
            ]}
          >
            <DatePicker
              className={style.datepicker}
              // value={moment(dateIntiated).format('YYYY-MM-DD')}
              onChange={handleChangeDateIntiated}
            />
          </Form.Item>
          <Form.Item
            className={style.formItem}
            label="End Date"
            name="endDate"
            rules={[
              {
                required: true,
                message: 'Please input End Date',
              },
            ]}
          >
            <DatePicker
              className={style.datepicker}
              // value={moment(endDate ).format('YYYY-MM-DD')}
              onChange={handleChangeEndDate}
            />
          </Form.Item>
          <Form.Item
            label="Responsible"
            name="responsible"
            rules={[
              {
                required: true,
                message: 'Please Select Responsible',
              },
            ]}
          >
            <Select
              style={selectStyle}
              defaultValue="Responsible"
              value={responsible}
              size="large"
              onSelect={handleSelectResponsible}
            >
              {goalResponsibilityList.map(gsl => {
                return (
                  <Select.Option value={gsl.id} key={gsl.id}>
                    {gsl.name}
                  </Select.Option>
                )
              })}
            </Select>
          </Form.Item>
          <Form.Item
            label="Goal Status"
            name="Goal Status"
            rules={[
              {
                required: true,
                message: 'Please Select Goal Status',
              },
            ]}
          >
            <Select
              style={selectStyle}
              defaultValue="Goal Status"
              size="large"
              value={goalStatus}
              onSelect={handleSelectGoalStatus}
            >
              {goalStatusList.map(gsl => {
                return (
                  <Select.Option value={gsl.id} key={gsl.id}>
                    {gsl.status}
                  </Select.Option>
                )
              })}
            </Select>
          </Form.Item>

          {/* {
            type === "short" ? (
              <Form.Item
                label="Assessment"
                name="Assessment"
                rules={[
                  {
                    required: true,
                    message: 'Please select Assessment',
                  },
                ]}
              >
                <Select
                  style={selectStyle}
                  size="large"
                  defaultValue="Assessment"
                  value={assessment}
                  onSelect={handleSelectAssessment}
                >
                  <Select.Option value="Client">Client</Select.Option>
                  <Select.Option value="Parent/Caregiver">Parent/Caregiver</Select.Option>
                  <Select.Option value="Service Provider">Service Provider</Select.Option>
                </Select>
              </Form.Item>
            ):
              <></>
          } */}

          <Form.Item>
            <Button onClick={addGoal} className={style.searchBtn} type="primary" htmlType="submit">
              Search
            </Button>
          </Form.Item>
        </Form>
      </div>
    </RightDrawer>
  )
}

export default AddLongAndShortGoal
