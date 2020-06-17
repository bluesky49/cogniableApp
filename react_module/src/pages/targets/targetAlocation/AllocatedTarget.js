import React, { useEffect, useState } from 'react'
import { Typography } from 'antd'
import styles from './style.module.scss'
import AllocatedTargetCard from '../../../components/AllocatedTargetCard'
import { alreadyAlloctedTarget } from './TargetAllocation.query'
import { notNull } from '../../../utilities'

const { Title } = Typography

const AllocatedTarget = ({ allocatedTarget, editAllocatedTarget, editAble }) => {
  return (
    <div className={`${styles.allocatedGoal} col-md-12 col-lg-4`}>
      <div className={styles.allocatedGoalHeading}>
        <Title style={{ fontSize: 18, lineHeight: '25px' }}>Allocated Targets</Title>
      </div>

      <div className={styles.availableTargetWrapper}>
        {allocatedTarget && allocatedTarget.length > 0 ? (
          allocatedTarget.map(aTarget => {
            return (
              <AllocatedTargetCard
                editAble={editAble}
                editAllocatedTarget={editAllocatedTarget}
                key={aTarget.node.id}
                node={aTarget.node}
                heading={aTarget.node.targetAllcatedDetails.targetName}
                status={aTarget.node.targetStatus.statusName}
              />
            )
          })
        ) : (
          <div className="text-center font-size-24">
            <span>No Targets Available</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default AllocatedTarget
