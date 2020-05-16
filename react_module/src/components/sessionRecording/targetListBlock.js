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
/* eslint-disable no-var */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-unused-expressions */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/jsx-closing-tag-location */

import React, { Component } from 'react'
import { Card, Progress, Typography } from 'antd'
import { connect } from 'react-redux'
import Scroll from 'react-scroll'
import TrialsList from './trialsList'

const { Element, Link } = Scroll

@connect(({ sessionrecording }) => ({ sessionrecording }))
class Target extends Component {
  componentDidMount() {
    const {
      dispatch,
      sessionrecording: { Disabled, TargetActiveId, TargetActiveIndex },
    } = this.props
    document.getElementById(TargetActiveId).click()
    document.getElementsByClassName('targetElements')[TargetActiveIndex].style.border =
      '2px solid #bae7ff'
  }

  resetCorrectIncorrectButtonStyle = () => {
    var element = document.getElementById('correctResponseButton')

    // If it isn't "undefined" and it isn't "null", then it exists.
    if (typeof element != 'undefined' && element != null) {
      document.getElementById('correctResponseButton').style.color = 'gray'
      document.getElementById('correctResponseButton').style.borderColor = '#e4e9f0'
      document.getElementById('incorrectResponseButton').style.color = 'gray'
      document.getElementById('incorrectResponseButton').style.borderColor = '#e4e9f0'
    } else {
      console.log('Buttons does not not exits')
    }
  }

  updateSessionClockTime = () => {
    // updatig current clock time to store
    document.getElementById('updateSessionCurrentTimeInStore').click()
  }

  updateStartTrialClockTime = () => {
    // updatig trial start time to store
    document.getElementById('updateStartTrialTimeInStore').click()
  }

  changeTarget = index => {
    const {
      dispatch,
      sessionrecording: { Disabled, TargetActiveId, MasterSession, TargetActiveIndex },
    } = this.props
    if (Disabled) {
      alert('Please Start Session Clock first')
    } else {
      // scrolling target to top
      document.getElementById(TargetActiveId).click()
      document.getElementsByClassName('targetElements')[index].style.border = '2px solid #bae7ff'
      document.getElementsByClassName('targetElements')[TargetActiveIndex].style.border = 'none'
      // updating start trial time
      this.updateStartTrialClockTime()
      // updatig current clock time to store
      this.updateSessionClockTime()
      // reseting response button color
      this.resetCorrectIncorrectButtonStyle()
      // updating previous target end time
      dispatch({
        type: 'sessionrecording/TARGET_UPDATE',
        payload: {
          targetId: TargetActiveId,
        },
      })

      // Updating target index and target id to store
      dispatch({
        type: 'sessionrecording/SET_STATE',
        payload: {
          TargetActiveIndex: index,
          TargetActiveId: MasterSession.targets.edges[index].node.id,
        },
      })

      // checking new target recording if not exist creating new target skills model instance
      dispatch({
        type: 'sessionrecording/CREATE_NEW_TARGET_INSTANCE',
        payload: {
          targetId: MasterSession.targets.edges[index].node.id,
          targetIndex: index,
        },
      })
    }
  }

  render() {
    const { Meta } = Card
    const {
      sessionrecording: { loading, MasterSession },
    } = this.props

    const trialsDivStyle = { marginTop: '25px' }

    if (loading) {
      return 'Loading Targets...'
    }

    return (
      <>
        <Element
          name="test7"
          className="element"
          id="containerElement"
          style={{
            position: 'relative',
            height: '500px',
            overflow: 'scroll',
            // marginBottom: '100px'
          }}
        >
          {MasterSession ? (
            MasterSession.targets.edges.map((item, index) => (
              <>
                <Element
                  className="targetElements"
                  style={{ padding: '4px', borderRadius: '8px' }}
                  name={item.node.id}
                >
                  <a onClick={() => this.changeTarget(index)}>
                    <>
                      <Card hoverable style={{ width: '100%', maxHeight: '350px' }}>
                        <Meta title={item.node.targetAllcatedDetails.targetName} />
                        <div style={trialsDivStyle}>
                          {item.node.sd.edges.length > 0 ? (
                            <>
                              {item.node.sd.edges.map(item2 => (
                                <>
                                  <span>Stimulus : {item2.node.sd} </span>
                                  <br />
                                  <TrialsList
                                    key={item.node.id}
                                    id={item.node.id}
                                    sdKey={item2.node.id}
                                    stepKey=""
                                    dailyTrails={item.node.targetAllcatedDetails.DailyTrials}
                                    boxWidth="20px"
                                  />
                                  <br />
                                </>
                              ))}
                            </>
                          ) : item.node.steps.edges.length > 0 ? (
                            <>
                              {item.node.steps.edges.map(item3 => (
                                <>
                                  <span>Step : {item3.node.step} </span>
                                  <br />
                                  <TrialsList
                                    key={item.node.id}
                                    id={item.node.id}
                                    sdKey=""
                                    stepKey={item3.node.id}
                                    dailyTrails={item.node.targetAllcatedDetails.DailyTrials}
                                    boxWidth="20px"
                                  />
                                  <br />
                                </>
                              ))}
                            </>
                          ) : (
                            <TrialsList
                              key={item.node.id}
                              id={item.node.id}
                              sdKey=""
                              stepKey=""
                              dailyTrails={item.node.targetAllcatedDetails.DailyTrials}
                              boxWidth="20px"
                            />
                          )}
                        </div>
                      </Card>
                    </>
                  </a>
                </Element>
                <Link
                  activeClass="active"
                  id={item.node.id}
                  to={item.node.id}
                  spy={true}
                  smooth={true}
                  duration={250}
                  style={{ display: 'hidden' }}
                  containerId="containerElement"
                >
                  &nbsp;
                </Link>
              </>
            ))
          ) : (
            <p>Loading Targets...</p>
          )}
        </Element>

        {/* {MasterSession
          ? MasterSession.targets.edges.map((item, index) => (
            <>
              <Card
                hoverable
                style={{ width: '100%', maxHeight: '350px', marginBottom: '20px' }}
              >
                <Meta title={item.node.targetAllcatedDetails.targetName} />
                <div style={trialsDivStyle}>
                  {item.node.sd.edges.length > 0 ?

                    <>
                      {item.node.sd.edges.map(item2 =>
                        <>
                          <span>Stimulus : {item2.node.sd} </span>
                          <br />
                          <TrialsList
                            key={item.node.id}
                            id={item.node.id}
                            sdKey={item2.node.id}
                            stepKey=''
                            dailyTrails={item.node.targetAllcatedDetails.DailyTrials}
                            boxWidth='20px'
                          />
                          <br />
                        </>
                      )}
                    </>

                    :
                    item.node.steps.edges.length > 0 ?
                      <>
                        {item.node.steps.edges.map(item3 =>
                          <>
                            <span>Step : {item3.node.step} </span>
                            <br />
                            <TrialsList
                              key={item.node.id}
                              id={item.node.id}
                              sdKey=''
                              stepKey={item3.node.id}
                              dailyTrails={item.node.targetAllcatedDetails.DailyTrials}
                              boxWidth='20px'
                            />
                            <br />
                          </>
                        )}
                      </>
                      :
                      <TrialsList
                        key={item.node.id}
                        id={item.node.id}
                        sdKey=''
                        stepKey=''
                        dailyTrails={item.node.targetAllcatedDetails.DailyTrials}
                        boxWidth='20px'
                      />
                  }
                </div>
              </Card>

            </>
          ))
          : ''
        } */}
      </>
    )
  }
}
export default Target
