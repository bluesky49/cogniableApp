/* eslint-disable react/no-unused-state */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable no-underscore-dangle */
/* eslint-disable eqeqeq */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable no-plusplus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-useless-concat */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/jsx-closing-tag-location */

import React from 'react'
import { Helmet } from 'react-helmet'
import {
  Row,
  Col,
  Select,
  Form,
  Collapse,
  Tree,
  Icon,
  DatePicker,
  notification,
  Empty,
  Button,
} from 'antd'
import Authorize from 'components/LayoutComponents/Authorize'
import { connect } from 'react-redux'
import TargetListBlock from '../../components/sessionRecording/targetListBlock'
import SessionClock from '../../components/sessionRecording/sessionClock'

@connect(({ sessionrecording }) => ({ sessionrecording }))
class DataRecording extends React.Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  componentWillMount() {
    const { dispatch } = this.props

    dispatch({
      type: 'sessionrecording/LOAD_SESSION',
      payload: {
        masterSessionId: 'U2Vzc2lvblR5cGU6MTU=',
      },
    })
  }

  render() {
    const style2 = {
      border: '1px solid #f4f6f8',
      overflow: 'hidden',
      position: 'relative',
      minHeight: '500px',
    }
    const style3 = {
      border: '1px solid #f4f6f8',
      height: '600px',
      backgroundColor: 'white',
      padding: '10px',
    }
    const targetBlockStyle = { height: '450px', overflow: 'auto' }

    return (
      <div>
        <Helmet title="Session" />
        <Row>
          <Col xs={24} sm={18} md={18} lg={18} xl={18} style={style2}>
            1
          </Col>

          <Col xs={0} sm={6} md={6} lg={6} xl={6} style={style3}>
            <SessionClock />
            <div style={targetBlockStyle}>
              <TargetListBlock />
            </div>
          </Col>
        </Row>
      </div>
    )
  }
}

export default DataRecording
