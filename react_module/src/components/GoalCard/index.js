import React from 'react'
import { Progress } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import styles from './style.module.scss'

const GoalCard = ({ heading = '', progess = '0', onEdit }) => {
  return (
    <div className={styles.card}>
      <div className={styles.longTermGoalEditBn}>
        <EditOutlined onClick={onEdit} />
      </div>
      <div>
        <span className={styles.heading}>{heading}</span>
      </div>
      <div>
        <Progress
          type="line"
          percent={progess}
          showInfo={false}
          strokeWidth={8}
          strokeColor="#E58425"
        />
      </div>
    </div>
  )
}

export default GoalCard
