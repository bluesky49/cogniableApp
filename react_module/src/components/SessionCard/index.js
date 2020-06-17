import React from 'react'
import { PlusOutlined, CopyOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import styles from './style.module.scss'
import motherSon from '../../pages/targets/motherSon.jpg'

const SessionCard = ({
  image = { motherSon },
  heading = '',
  receptiveLanguage = '',
  allocateSessionToTarget,
  allocated
}) => {
  return (
    <div className={allocated ? styles.sessionCardAllocated : styles.sessionCard}>
      <div className={styles.sessionCardWrapper}>
        <div>
          <img className={styles.sessionCardImg} src={image} alt="mother" />
        </div>
        <div>
          <div className={styles.sessionHeading}>
            <span>{heading}</span>
          </div>
          <div>
            {/* <span className={styles.language}>Receptive Language</span> */}
            {/* <span className={styles.therepy}>{receptiveLanguage}</span> */}
          </div>
        </div>
      </div>
      <Button className={styles.addSessionBtn} onClick={allocateSessionToTarget}>
        {allocated ? <CopyOutlined /> : <PlusOutlined />}
      </Button>
    </div>
  )
}

export default SessionCard
