import React from 'react'
import { Button, Progress } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import styles from './style.module.scss'

const GoalCard = ({
  heading = '',
  progess = '0',
  onEdit,
  selectShortTermGoal,
  selected,
  editAble,
}) => {
  let headingStyle = {}
  let selectedCardStyle = {}

  if (selected) {
    headingStyle = {
      color: '#fff',
    }
    selectedCardStyle = {
      background: '#E58425',
    }
  }
  return (
    <Button className={styles.card} style={selectedCardStyle} onClick={selectShortTermGoal}>
      {editAble ? (
        <div className={styles.longTermGoalEditBn}>
          <EditOutlined onClick={onEdit} />
        </div>
      ) : (
        ''
      )}
      <div>
        <span className={styles.heading} style={headingStyle}>
          {heading}
        </span>
      </div>
      <div>
        <Progress
          type="line"
          percent={progess}
          showInfo={false}
          strokeWidth={8}
          strokeColor={selected ? '#000 ' : '#E58425'}
        />
      </div>
    </Button>
  )
}

export default GoalCard
