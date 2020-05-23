import React, { useEffect, useState } from 'react'
import { Button, Checkbox, Select } from 'antd'
import styles from './style.module.scss'
import SessionCard from '../../../components/SessionCard'
import motherSon from '../motherSon.jpg'
import {
  getDomainByProgramArea,
  getTargetAreaByDoimain,
  suggestTarget,
} from './TargetAllocation.query'
import { notNull } from '../../../utilities'

const selectTargetStyle = {
  width: '120px',
  textDecoration: 'none',
  marginRight: '20px',
}

const searchBtnStyle = {
  color: '#FFF',
  backgroundColor: '#0B35B3',
  width: '180px',
}

const TargetsAvailable = ({
  selectedStudent,
  selectedProgram,
  allocateSessionToTarget,
  suggestedTarget,
  setSuggestedTarget,
}) => {
  const [domain, setDomain] = useState([])
  const [selectedTargetDomain, setSelectedTargetDomain] = useState([])
  const [area, setArea] = useState([])
  const [selectedTargetArea, setSelectedTargetArea] = useState([])

  const [selectAllTarget, setSelectAllTarget] = useState(false)

  const getDomainByProgramAreaQuery = async pId => {
    const domainResp = await getDomainByProgramArea(pId)
    if (notNull(domainResp)) setDomain(domainResp.data.programDetails.domain.edges)
  }

  const getTargetAreaByDoimainQuery = async domainId => {
    const targetAreaResp = await getTargetAreaByDoimain(domainId)
    setSelectedTargetDomain(domainId)
    if (notNull(targetAreaResp)) setArea(targetAreaResp.data.targetArea.edges)
  }

  const onSelectArea = sArea => {
    setSelectedTargetArea(sArea)
  }

  const searchDomin = () => {
    suggestedTargetQuery(selectedTargetDomain, selectedTargetArea)
  }

  const suggestedTargetQuery = async (domainId, areaId) => {
    const suggestedTargetResp = await suggestTarget(domainId, areaId)
    if (notNull(suggestedTargetResp)) setSuggestedTarget(suggestedTargetResp.data.target.edges)
  }

  const onChangeselectAllTarget = ({ target: { checked } }) => {
    setSelectAllTarget(checked)
  }

  useEffect(() => {
    getDomainByProgramAreaQuery(selectedProgram)
  }, [])

  return (
    <div className="col-md-12  col-lg-5">
      <div className={styles.sessionBtns}>
        <Select
          style={selectTargetStyle}
          defaultValue="Target Domain"
          onSelect={getTargetAreaByDoimainQuery}
        >
          {domain &&
            domain.length > 0 &&
            domain.map(d => {
              return (
                <Select.Option value={d.node.id} key={d.node.id}>
                  {d.node.domain}
                </Select.Option>
              )
            })}
        </Select>
        <Select style={selectTargetStyle} defaultValue="Target Area" onSelect={onSelectArea}>
          {area &&
            area.map(a => {
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
      <div className={styles.targetWrapper}>
        {suggestedTarget &&
          suggestedTarget.length > 0 &&
          suggestedTarget.map(sTarget => {
            return (
              <SessionCard
                key={sTarget.node.id}
                image={motherSon}
                heading={sTarget.node.targetMain.targetName}
                receptiveLanguage="in therapy"
                allocateSessionToTarget={() => allocateSessionToTarget(sTarget)}
              />
            )
          })}
      </div>
    </div>
  )
}

export default TargetsAvailable
