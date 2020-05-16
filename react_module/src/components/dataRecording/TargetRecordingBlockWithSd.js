/* eslint-disable react/jsx-indent */
/* eslint-disable no-plusplus */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import React from 'react'
import { Card, Button, Drawer, Tooltip } from 'antd'
import { LeftOutlined, RightOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons'

class TargetRecordingBlockWithSd extends React.Component {
  state = {
    count: 1,
    percentage: 0.0,
    correct: 0,
    incorrect: 0,
    showPromptOptions: true,
    totalTrails: 10,
    visible: false,

    sdName: ['stimulus one', 'stimulus two', 'stimulus three', 'stimulus four', 'stimulus five'],
    sdTrailCount: 1,
    totalSd: 5,
    sdCount: 1,
    sdRequiredTrails: 5,
  }

  showDrawer = () => {
    this.setState({
      visible: true,
    })
  }

  onClose = () => {
    this.setState({
      visible: false,
    })
  }

  addCount(This, val) {
    if (This.state.totalTrails > val) {
      document.getElementById(`spanStyle${val - 1}`).style.backgroundColor = 'rgba(0,255,0,0.3)'
      document.getElementById('correctResponseButton').style.color = 'green'
      document.getElementById('correctResponseButton').style.borderColor = 'green'
      document.getElementById('incorrectResponseButton').style.color = 'gray'
      document.getElementById('incorrectResponseButton').style.borderColor = '#f3f2f8'
      this.setState({
        count: val + 1,
        percentage: ((This.state.correct + 1) * 100) / This.state.count,
        correct: This.state.correct + 1,
      })
      console.log(This.state.count, This.state.correct + 1)
    } else {
      const spanList = document.getElementsByClassName('spanListItems')
      let x = 0
      for (x = 0; x < spanList.length; x++) {
        spanList[x].style.backgroundColor = 'rgba(192,192,192,0.3)'
      }
      document.getElementById('correctResponseButton').style.color = 'green'
      document.getElementById('correctResponseButton').style.borderColor = 'green'
      document.getElementById('incorrectResponseButton').style.color = 'gray'
      document.getElementById('incorrectResponseButton').style.borderColor = '#f3f2f8'
      this.setState({
        count: 1,
        percentage: 0.0,
        correct: 0,
        incorrect: 0,
        sdCount: This.state.sdCount + 1,
      })
    }
  }

  showPrompt() {
    this.setState({
      showPromptOptions: false,
    })
  }

  removeCount(This, val) {
    if (This.state.totalTrails > val) {
      document.getElementById(`spanStyle${val - 1}`).style.backgroundColor = 'rgba(255,0,0,0.3)'
      document.getElementById('correctResponseButton').style.color = 'gray'
      document.getElementById('correctResponseButton').style.borderColor = '#f3f2f8'
      document.getElementById('incorrectResponseButton').style.color = 'red'
      document.getElementById('incorrectResponseButton').style.borderColor = 'red'
      this.setState({
        count: val + 1,
        percentage: (This.state.correct * 100) / This.state.count,
        incorrect: This.state.incorrect + 1,
        showPromptOptions: true,
      })
    } else {
      const spanList = document.getElementsByClassName('spanListItems')
      let x = 0
      for (x = 0; x < spanList.length; x++) {
        spanList[x].style.backgroundColor = 'rgba(192,192,192,0.3)'
      }
      document.getElementById('correctResponseButton').style.color = 'green'
      document.getElementById('correctResponseButton').style.borderColor = 'green'
      document.getElementById('incorrectResponseButton').style.color = 'gray'
      document.getElementById('incorrectResponseButton').style.borderColor = '#f3f2f8'
      this.setState({
        count: 1,
        percentage: 0.0,
        correct: 0,
        incorrect: 0,
        sdCount: This.state.sdCount + 1,
      })
    }
  }

  promptCount(This, val) {
    if (This.state.totalTrails > val) {
      document.getElementById(`spanStyle${val - 1}`).style.backgroundColor = 'rgba(255,255,0,0.3)'
      document.getElementById('correctResponseButton').style.color = 'gray'
      document.getElementById('correctResponseButton').style.borderColor = '#f3f2f8'
      document.getElementById('incorrectResponseButton').style.color = 'red'
      document.getElementById('incorrectResponseButton').style.borderColor = 'red'
      this.setState({
        count: val + 1,
        percentage: (This.state.correct * 100) / This.state.count,
        incorrect: This.state.incorrect + 1,
        showPromptOptions: true,
      })
    } else {
      const spanList = document.getElementsByClassName('spanListItems')
      let x = 0
      for (x = 0; x < spanList.length; x++) {
        spanList[x].style.backgroundColor = 'rgba(192,192,192,0.3)'
      }
      document.getElementById('correctResponseButton').style.color = 'green'
      document.getElementById('correctResponseButton').style.borderColor = 'green'
      document.getElementById('incorrectResponseButton').style.color = 'gray'
      document.getElementById('incorrectResponseButton').style.borderColor = '#f3f2f8'
      this.setState({
        count: 1,
        percentage: 0.0,
        correct: 0,
        incorrect: 0,
        sdCount: This.state.sdCount + 1,
      })
    }
  }

  nextSd(This, sdCount) {
    if (This.state.totalSd > sdCount) {
      const spanList = document.getElementsByClassName('spanListItems')
      let x = 0
      for (x = 0; x < spanList.length; x++) {
        spanList[x].style.backgroundColor = 'rgba(192,192,192,0.3)'
      }
      this.setState({
        sdCount: sdCount + 1,
        count: 1,
      })
    }
  }

  previousSd(This, sdCount) {
    if (This.state.sdCount > 1) {
      const spanList = document.getElementsByClassName('spanListItems')
      let x = 0
      for (x = 0; x < spanList.length; x++) {
        spanList[x].style.backgroundColor = 'rgba(192,192,192,0.3)'
      }
      this.setState({
        sdCount: sdCount - 1,
        count: 1,
      })
    }
  }

  render() {
    const {
      count,
      correct,
      percentage,
      incorrect,
      showPromptOptions,
      totalTrails,
      sdName,
      sdCount,
      sdTrailCount,
      totalSd,
      sdRequiredTrails,
    } = this.state
    const correctIncorrectDiv = showPromptOptions
      ? { display: 'block', textAlign: 'center', marginTop: '30px' }
      : { display: 'none' }
    const promptOptionsDiv = showPromptOptions
      ? { display: 'none' }
      : { display: 'block', textAlign: 'center', marginTop: '40px' }
    let i = 0
    const spanList = []
    for (i = 0; i < totalTrails; i++) {
      spanList.push(`spanStyle${i}`)
    }

    return (
      <>
        <Card style={{ width: '100%', backgroundColor: '#fbfbfb' }}>
          <Card
            style={{
              width: '96%',
              backgroundColor: 'white',
              margin: '10px auto',
              minHeight: '540px',
            }}
          >
            <h5 style={{ textAlign: 'center' }}>
              <a onClick={this.showDrawer}>
                18.10060 - Sits in a small group for 10 minutes, attends to the teacher/material for
                50% of the period
              </a>
            </h5>
            <br />
            <span>{percentage} % Correct</span> <span style={{ float: 'right' }}>In-Therapy</span>
            <br />
            <p style={{ textAlign: 'center', marginTop: '-4px' }}>{sdName[sdCount - 1]}</p>
            <Tooltip title="previous trail">
              <Button
                style={{ float: 'left', marginLeft: '40px' }}
                onClick={() => this.previousSd(this, sdCount)}
              >
                <LeftOutlined />
              </Button>
            </Tooltip>
            <Tooltip title="next trail">
              <Button
                style={{ float: 'right', marginRight: '40px' }}
                onClick={() => this.nextSd(this, sdCount)}
              >
                <RightOutlined />
              </Button>
            </Tooltip>
            <p style={{ textAlign: 'center', marginTop: '4px' }}>
              Stimulus {sdCount}/{totalSd}
            </p>
            <br />
            <br />
            <p style={{ textAlign: 'center' }}>
              {spanList.map(item => (
                <span>
                  <span
                    id={item}
                    className="spanListItems"
                    style={{
                      height: '6px',
                      width: '70px',
                      border: '1px solid gray',
                      backgroundColor: 'rgba(192,192,192,0.3)',
                      paddingLeft: '35px',
                      borderRadius: '8px',
                    }}
                  >
                    &nbsp;
                  </span>
                  &nbsp;&nbsp;
                </span>
              ))}
            </p>
            <p style={{ textAlign: 'center', marginTop: '30px' }}>
              Trail {count}/{totalTrails}
            </p>
            {/* <br /> */}
            <p style={correctIncorrectDiv}>
              <Button
                id="correctResponseButton"
                style={{ padding: '20px auto', width: '300px', height: '50px' }}
                onClick={() => this.addCount(this, count, correct)}
              >
                <CheckOutlined /> Correct ({correct})
              </Button>
              <Button
                id="incorrectResponseButton"
                style={{ padding: '8px auto', width: '300px', height: '50px', marginTop: '10px' }}
                onClick={() => this.showPrompt()}
              >
                <CloseOutlined /> Incorrect ({incorrect})
              </Button>{' '}
              <br />
            </p>
            <p style={promptOptionsDiv}>
              <Button
                style={{ padding: '20px auto', width: '300px', height: '50px' }}
                onClick={() => this.promptCount(this, count)}
              >
                Prompt 1
              </Button>
              <br />
              <Button
                style={{ padding: '8px auto', width: '300px', height: '50px', marginTop: '10px' }}
                onClick={() => this.promptCount(this, count)}
              >
                Prompt 2
              </Button>
              <br />
              <Button
                style={{ padding: '8px auto', width: '300px', height: '50px', marginTop: '10px' }}
                onClick={() => this.promptCount(this, count)}
              >
                Prompt 3
              </Button>
              <br />
              <Button
                style={{ padding: '8px auto', width: '300px', height: '50px', marginTop: '10px' }}
                onClick={() => this.promptCount(this, count)}
              >
                Prompt 4
              </Button>
              <br />
              <Button
                style={{ padding: '8px auto', width: '300px', height: '50px', marginTop: '10px' }}
                onClick={() => this.removeCount(this, count)}
              >
                No Response
              </Button>
            </p>
          </Card>
        </Card>
        <Drawer
          title={
            <>
              <h5>Target Instructions</h5>
              <Button style={{ float: 'right' }} onClick={this.onClose}>
                X
              </Button>
            </>
          }
          width={640}
          height={450}
          placement="bottom"
          closable={false}
          onClose={this.onClose}
          visible={this.state.visible}
          getContainer={false}
          style={{ position: 'absolute' }}
        >
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Drawer>
      </>
    )
  }
}

export default TargetRecordingBlockWithSd
