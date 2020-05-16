import React from 'react'
import styles from './style.module.scss'

const AllocatedTargetCard = ({ heading = '', status = '' }) => {
  return (
    <div className={styles.card}>
      <div>
        <span className={styles.heading}>{heading}</span>
      </div>
      <div className={styles.statusWrapper}>
        <span>STATUS : {status}</span>
      </div>
    </div>
  )
}

export default AllocatedTargetCard
