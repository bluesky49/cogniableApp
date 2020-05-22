import React, { Component } from 'react'
import { Card } from 'antd'
import { ArrowRightOutlined } from '@ant-design/icons'
import styles from './style.module.scss'

class MealData extends Component {
  render() {
    return (
      <>
        <a href="/#/targetsAllocationToSession/">
          <Card style={{ marginTop: '6%', borderRadius: '10px', cursor: 'pointer' }}>
            <div className={styles.detailcardTwoItem} key={1}>
              <div className={styles.cardtwoheader}>
                <p className={styles.dataName}>Target Allocation To Sessions</p>
                {/* <p className={styles.dataDesc}>Breakfast, Lunch & Dinner</p> */}
              </div>
              <div className={styles.cardTwoicon}>
                <ArrowRightOutlined style={{ color: 'darkblue', fontSize: '25px' }} />
              </div>
            </div>
          </Card>
        </a>
        <a href="/#/sessionDetails">
          <Card style={{ marginTop: '6%', borderRadius: '10px', cursor: 'pointer' }}>
            <div className={styles.detailcardTwoItem} key={1}>
              <div className={styles.cardtwoheader}>
                <p className={styles.dataName}>Students Sessions</p>
                {/* <p className={styles.dataDesc}>Breakfast, Lunch & Dinner</p> */}
              </div>
              <div className={styles.cardTwoicon}>
                <ArrowRightOutlined style={{ color: 'darkblue', fontSize: '25px' }} />
              </div>
            </div>
          </Card>
        </a>
        <a href="https://www.google.com">
          <Card style={{ marginTop: '6%', borderRadius: '10px', cursor: 'pointer' }}>
            <div className={styles.detailcardTwoItem} key={1}>
              <div className={styles.cardtwoheader}>
                <p className={styles.dataName}>Appointments</p>
                {/* <p className={styles.dataDesc}>Breakfast, Lunch & Dinner</p> */}
              </div>
              <div className={styles.cardTwoicon}>
                <ArrowRightOutlined style={{ color: 'darkblue', fontSize: '25px' }} />
              </div>
            </div>
          </Card>
        </a>
      </>
    )
  }
}
export default MealData
