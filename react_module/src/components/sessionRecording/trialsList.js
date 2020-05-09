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

@connect(({ sessionrecording }) => ({ sessionrecording }))
class TrialsList extends Component {
  render() {
    const { dailyTrails } = this.props

    const Trials = []
    let i = 0
    for (i = 0; i < dailyTrails; i++) {
      Trials.push(
        <span
          style={{
            height: '15px',
            display: 'inline-block',
            lineHeight: '12px',
            width: '20px',
            border: '1px solid #999999',
            paddingLeft: '20px',
            borderRadius: '2px',
            marginRight: '5px',
          }}
        >
          &nbsp;
        </span>,
      )
    }

    // const {sessionrecording: {loading, MasterSession}} = this.props;

    return <>{Trials}</>
  }
}
export default TrialsList
