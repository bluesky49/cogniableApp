/* eslint-disable no-return-assign */
/* eslint-disable react/button-has-type */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-multi-assign */
/* eslint-disable prefer-template */
import React from 'react'

const leftPad = (width, n) => {
  if ((n + '').length > width) {
    return n
  }
  const padding = new Array(width).join('0')
  return (padding + n).slice(-width)
}

export default class Stopwatch extends React.Component {
  constructor(props) {
    super(props)
    ;['lap', 'update', 'reset', 'toggle'].forEach(method => {
      this[method] = this[method].bind(this)
    })

    this.state = this.initialState = {
      isRunning: false,
      lapTimes: [],
      timeElapsed: 0,
    }
  }

  toggle() {
    this.setState({ isRunning: !this.state.isRunning }, () => {
      this.state.isRunning ? this.startTimer() : clearInterval(this.timer)
    })
  }

  lap() {
    const { lapTimes, timeElapsed } = this.state
    this.setState({ lapTimes: lapTimes.concat(timeElapsed) })
  }

  reset() {
    clearInterval(this.timer)
    this.setState(this.initialState)
  }

  startTimer() {
    this.startTime = Date.now()
    this.timer = setInterval(this.update, 10)
  }

  update() {
    const delta = Date.now() - this.startTime
    this.setState({ timeElapsed: this.state.timeElapsed + delta })
    this.startTime = Date.now()
  }

  render() {
    const { isRunning, lapTimes, timeElapsed } = this.state
    return (
      <div>
        <TimeElapsed id="timer" timeElapsed={timeElapsed} />
        <button onClick={this.toggle}>{isRunning ? 'Stop' : 'Start'}</button>
        <button onClick={isRunning ? this.lap : this.reset} disabled={!isRunning && !timeElapsed}>
          {isRunning || !timeElapsed ? 'Lap' : 'Reset'}
        </button>
        {lapTimes.length > 0 && <LapTimes lapTimes={lapTimes} />}
      </div>
    )
  }
}

class TimeElapsed extends React.Component {
  getUnits() {
    const { timeElapsed } = this.props
    const seconds = timeElapsed / 1000
    return {
      min: Math.floor(seconds / 60).toString(),
      sec: Math.floor(seconds % 60).toString(),
      msec: (seconds % 1).toFixed(3).substring(2),
    }
  }

  render() {
    const units = this.getUnits()
    const { id } = this.props
    return (
      <div id={id}>
        <span>{leftPad(2, units.min)}:</span>
        <span>{leftPad(2, units.sec)}.</span>
        <span>{units.msec}</span>
      </div>
    )
  }
}

class LapTimes extends React.Component {
  render() {
    const { lapTimes } = this.props
    const rows = lapTimes.map((lapTime, index) => (
      <tr key={(index += 1)}>
        <td>{index}</td>
        <td>
          <TimeElapsed timeElapsed={lapTime} />
        </td>
      </tr>
    ))
    return (
      <table id="lap-times">
        <thead>
          <th>Lap</th>
          <th>Time</th>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    )
  }
}
