/* eslint-disable react/no-unused-state */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable array-callback-return */
/* eslint-disable eqeqeq */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable no-plusplus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-unused-expressions */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/jsx-closing-tag-location */

import React, { Component } from 'react'
import { Card, Progress, Typography } from 'antd'
import { connect } from 'react-redux'
import TrialsList from './trialsList'

@connect(({ sessionrecording }) => ({ sessionrecording }))
class Target extends Component {
  render() {
    const { Meta } = Card
    let progress = ['#FF9C52', '#4BAEA0', '#FF8080', '0', '0', '0', '0', '0']
    progress = progress.map(data => {
      if (data) {
        return (
          <span
            style={{
              height: '15px',
              display: 'inline-block',
              lineHeight: '12px',
              width: '20px',
              border: '1px solid #F5F5F5',
              backgroundColor: data,
              paddingLeft: '20px',
              borderRadius: '2px',
              marginRight: '5px',
            }}
          >
            &nbsp;
          </span>
        )
      }
      return null
    }, {})

    const {
      sessionrecording: { loading, MasterSession },
    } = this.props

    const trialsDivStyle = { marginTop: '25px' }

    if (loading) {
      return 'Loading Targets...'
    }

    return (
      <>
        {MasterSession
          ? MasterSession.targets.edges.map((item, index) => (
              <>
                {index === 0 ? (
                  <Card
                    hoverable
                    style={{ width: '100%', maxHeight: '350px', marginBottom: '20px' }}
                    cover={
                      <img
                        alt="example"
                        src="https://www.familyeducation.com/sites/default/files/2019-03/traits-babies-inherit-from-their-father_feature.jpg"
                        style={{ height: '150px' }}
                      />
                    }
                  >
                    <Meta title={item.node.targetAllcatedDetails.targetName} />
                    <div style={trialsDivStyle}>
                      <TrialsList
                        key={item.id}
                        dailyTrails={item.node.targetAllcatedDetails.DailyTrials}
                      />
                    </div>
                  </Card>
                ) : (
                  <Card
                    hoverable
                    style={{ width: '100%', maxHeight: '350px', marginBottom: '20px' }}
                  >
                    <Meta title={item.node.targetAllcatedDetails.targetName} />
                    <div style={trialsDivStyle}>
                      <TrialsList
                        key={item.id}
                        dailyTrails={item.node.targetAllcatedDetails.DailyTrials}
                      />
                    </div>
                  </Card>
                )}
              </>
            ))
          : ''}
      </>
    )
  }
}
export default Target
