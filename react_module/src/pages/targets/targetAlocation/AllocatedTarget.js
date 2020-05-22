import React, { useEffect, useState } from 'react'
import styles from './style.module.scss'
import AllocatedTargetCard from '../../../components/AllocatedTargetCard'
import { alreadyAlloctedTarget } from './TargetAllocation.query'
import { notNull } from '../../../utilities'

const AllocatedTarget = ({ allocatedTarget }) => {
  return (
    <div className={`${styles.allocatedGoal} col-md-12 col-lg-4`}>
      <div className={styles.allocatedGoalHeading}>
        <span>Allocated Targets to STG1</span>
      </div>

      <div className={styles.availableTargetWrapper}>
        {allocatedTarget && allocatedTarget.length > 0 ? (
          allocatedTarget.map(aTarget => {
            return (
              <AllocatedTargetCard
                key={aTarget.node.id}
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
