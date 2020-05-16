import React from 'react'
import { PlusOutlined } from '@ant-design/icons'
import styles from './style.module.scss'
import motherSon from '../../pages/targets/motherSon.jpg'

const SessionCard = ({ image = { motherSon }, heading = '', receptiveLanguage = '' }) => {
  return (
    <div className={styles.sessionCard}>
      <div className={styles.sessionCardWrapper}>
        <div>
          <img className={styles.sessionCardImg} src={image} alt="mother" />
        </div>
        <div>
          <div className={styles.sessionHeading}>
            <span>{heading}</span>
          </div>
          <div>
            <span className={styles.language}>Receptive Language</span>
            <span className={styles.therepy}>{receptiveLanguage}</span>
          </div>
        </div>
      </div>
      <div className={styles.addSessionBtn}>
        <PlusOutlined />
      </div>
    </div>
  )
}

export default SessionCard
