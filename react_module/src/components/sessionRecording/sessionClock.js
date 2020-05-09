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

import React from 'react'
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
import { connect } from 'react-redux'
import Timer from 'react-compound-timer'

@connect(({ sessionrecording }) => ({ sessionrecording }))
class SessionClock extends React.Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  startSession = time => {
    console.log(time)
    const ts = new Date(time)
    console.log(ts.toLocaleTimeString())
  }

  pauseSession = time => {}

  endSession = time => {}

  render() {
    const SessionStatus = 'NotStarted'

    return (
      <div style={{ padding: '10px' }}>
        <Timer initialTime={0} startImmediately={false}>
          {({ start, resume, pause, stop, reset, getTime }) => (
            <React.Fragment>
              <h6 style={{ textAlign: 'center', fontSize: '30px' }}>
                <span style={{ textAlign: 'center' }}>
                  <Timer.Hours formatValue={value => `${value < 10 ? `0${value}` : value} : `} />
                  <Timer.Minutes formatValue={value => `${value < 10 ? `0${value}` : value} : `} />
                  <Timer.Seconds formatValue={value => `${value < 10 ? `0${value}` : value} `} />
                </span>
              </h6>
              <br />
              <div style={{ textAlign: 'center' }}>
                {SessionStatus === 'NotStarted' ? (
                  <Button
                    onClick={() => {
                      start()
                      this.startSession(getTime())
                    }}
                  >
                    <Icon type="caret-right" />
                    Start Session
                  </Button>
                ) : (
                  ''
                )}
                {SessionStatus === 'Started' ? (
                  <>
                    <Button
                      onClick={() => {
                        this.pauseSession(getTime())
                        stop()
                      }}
                    >
                      Pause
                    </Button>
                    &nbsp;
                    <Button
                      onClick={() => {
                        this.endSession(getTime())
                        stop()
                      }}
                    >
                      End
                    </Button>
                  </>
                ) : (
                  ''
                )}
                {SessionStatus === 'Paused' ? (
                  <>
                    <Button
                      onClick={() => {
                        start()
                        this.startSession(getTime())
                      }}
                    >
                      <Icon type="caret-right" />
                      Resume Session
                    </Button>
                  </>
                ) : (
                  ''
                )}
                {SessionStatus === 'Ended' ? (
                  <>
                    <p>Session Completed!!</p>
                  </>
                ) : (
                  ''
                )}
                {/* <Button onClick={pause}><Icon type="pause" /></Button>
                                <Button onClick={resume}>Resume</Button> */}
                {/* <Button onClick={() => { this.consoleTime(getTime()); stop(); }}><Icon type="stop" /></Button>
                                <Button onClick={reset}><Icon type="undo" /></Button> */}
              </div>
            </React.Fragment>
          )}
        </Timer>
      </div>
    )
  }
}

export default SessionClock
