import React from 'react'
import { Icon, Typography } from 'antd'
import styles from './style.module.scss'

const { Text } = Typography
const NumberCard = ({ title, unit = '', number, setNumber }) => {
  const onChange = type => {
    if (type === 'i') setNumber(number + 1)
    else if (type === 'd') setNumber(number - 1)
  }

  return (
    <div className={styles.timeCard}>
      <div>
        <Text className={styles.title}>{title}</Text>
      </div>

      <div>
        <Icon type="minus" onClick={() => onChange('d')} />
        <Text className={styles.number}>
          {number}
          {unit}
        </Text>
        <Icon type="plus" onClick={() => onChange('i')} />
      </div>
    </div>
  )
}

export default NumberCard
