import React, { Component } from 'react'
import { Card } from 'antd'
import { ArrowRightOutlined } from '@ant-design/icons'
import styles from './style.module.scss'

class DataRecordingTh extends Component {
  render() {
    return (
      <>
        <a href="#/mand/">
          <Card style={{ marginTop: '6%', borderRadius: '10px', cursor: 'pointer' }}>
            <div className={styles.detailcardTwoItem} key={1}>
              <div className={styles.cardtwoheader}>
                <p className={styles.dataName}>Add Mand Data</p>
                {/* <p className={styles.dataDesc}>Breakfast, Lunch & Dinner</p> */}
              </div>
              <div className={styles.cardTwoicon}>
                <ArrowRightOutlined style={{ color: 'darkblue', fontSize: '25px' }} />
              </div>
            </div>
          </Card>
        </a>
        <a href="/#/decel/">
          <Card style={{ marginTop: '6%', borderRadius: '10px', cursor: 'pointer' }}>
            <div className={styles.detailcardTwoItem} key={1}>
              <div className={styles.cardtwoheader}>
                <p className={styles.dataName}>Add Behavior Data</p>
                {/* <p className={styles.dataDesc}>Breakfast, Lunch & Dinner</p> */}
              </div>
              <div className={styles.cardTwoicon}>
                <ArrowRightOutlined style={{ color: 'darkblue', fontSize: '25px' }} />
              </div>
            </div>
          </Card>
        </a>
        <a href="/#/toilet/">
          <Card style={{ marginTop: '6%', borderRadius: '10px', cursor: 'pointer' }}>
            <div className={styles.detailcardTwoItem} key={1}>
              <div className={styles.cardtwoheader}>
                <p className={styles.dataName}>Add Toilet Data</p>
                {/* <p className={styles.dataDesc}>Breakfast, Lunch & Dinner</p> */}
              </div>
              <div className={styles.cardTwoicon}>
                <ArrowRightOutlined style={{ color: 'darkblue', fontSize: '25px' }} />
              </div>
            </div>
          </Card>
        </a>
        <a href="/#/mealData/">
          <Card style={{ marginTop: '6%', borderRadius: '10px', cursor: 'pointer' }}>
            <div className={styles.detailcardTwoItem} key={1}>
              <div className={styles.cardtwoheader}>
                <p className={styles.dataName}>Add Meal Data</p>
                {/* <p className={styles.dataDesc}>Breakfast, Lunch & Dinner</p> */}
              </div>
              <div className={styles.cardTwoicon}>
                <ArrowRightOutlined style={{ color: 'darkblue', fontSize: '25px' }} />
              </div>
            </div>
          </Card>
        </a>
        <a href="/#/medicalData/">
          <Card style={{ marginTop: '6%', borderRadius: '10px', cursor: 'pointer' }}>
            <div className={styles.detailcardTwoItem} key={1}>
              <div className={styles.cardtwoheader}>
                <p className={styles.dataName}>Add Medical Data</p>
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
export default DataRecordingTh
