/* eslint-disable no-plusplus */
/* eslint-disable vars-on-top */
/* eslint-disable no-var */
/* eslint-disable prefer-destructuring */
/* eslint-disable dot-notation */
/* eslint-disable array-callback-return */
/* eslint-disable object-shorthand */
/* eslint-disable prefer-const */
/* eslint-disable no-lonely-if */
import { all, takeEvery, put, call, select } from 'redux-saga/effects'
import {
  getTargets,
  getChildSessionData,
  createChildSession,
  updateChildSessionDuration,
  finishChildSession,
  createFirstTragetAndTrialInstance,
  recordTargetCorrectTrial,
  updateTargetEndTime,
  createNewTargetInstance,
  updateTargetTrial,
  recordTargetStimulusTrial,
  recordTargetStepTrial,
} from 'services/sessionrecording'
import actions from './actions'

const debug = true

export function* UpdateDuration() {
  // selecting child session id for creating child session
  const childSessionId = yield select(state => state.sessionrecording.ChildSession.id)
  const sessionDuration = yield select(state => state.sessionrecording.CurrentSessionTime)
  // updating session duration
  yield call(updateChildSessionDuration, { id: childSessionId, duration: sessionDuration })
}

export function* GET_DATA({ payload }) {
  yield put({
    type: 'sessionrecording/SET_STATE',
    payload: {
      loading: true,
      MasterSession: null,
      ChildSession: null,
      TargetResponse: {},
      RecordingType: 'Target',
      SessionStatus: 'Pending',
      StepActiveIndex: 0,
      StepActiveId: '',
      StimulusActiveIndex: 0,
      StimulusActiveId: '',
      TargetActiveIndex: 0,
      TargetActiveId: '',
      Count: 1,
      CorrectCount: 0,
      IncorrectCount: 0,

      // holding trial start time
      TrialStartTime: 0,
      // for disabled target recording block
      Disabled: true,
      // for storing session clock time for api calls
      CurrentSessionTime: 0,
    },
  })

  const response = yield call(getTargets, payload)

  if (response && response.data) {
    const targetResponse = {}
    let targetId = ''
    let stimulusId = ''
    let stepId = ''
    let i = 0
    if (response.data.getsession.targets.edgeCount > 0) {
      const targets = response.data.getsession.targets
      targetId = targets.edges[0].node.id

      if (targets.edges[0].node.sd && targets.edges[0].node.sd.edges.length > 0) {
        stimulusId = targets.edges[0].node.sd.edges[0].node.id
      } else if (targets.edges[0].node.steps && targets.edges[0].node.steps.edges.length > 0) {
        stepId = targets.edges[0].node.steps.edges[0].node.id
      }

      for (i = 0; i < targets.edgeCount; i++) {
        targetResponse[targets.edges[i].node.id] = {}
        targetResponse[targets.edges[i].node.id]['target'] = []

        if (targets.edges[i].node.sd && targets.edges[i].node.sd.edges.length > 0) {
          let j = 0
          targetResponse[targets.edges[i].node.id]['sd'] = {}
          for (j = 0; j < targets.edges[i].node.sd.edges.length; j++) {
            targetResponse[targets.edges[i].node.id]['sd'][
              targets.edges[i].node.sd.edges[j].node.id
            ] = []
          }
        }
        if (targets.edges[i].node.steps && targets.edges[i].node.steps.edges.length > 0) {
          let k = 0
          targetResponse[targets.edges[i].node.id]['step'] = {}
          for (k = 0; k < targets.edges[i].node.steps.edges.length; k++) {
            targetResponse[targets.edges[i].node.id]['step'][
              targets.edges[i].node.steps.edges[k].node.id
            ] = []
          }
        }
      }
    }

    yield put({
      type: 'sessionrecording/SET_STATE',
      payload: {
        MasterSession: response.data.getsession,
        PromptCodesList: response.data.promptCodes,
        TargetResponse: targetResponse,
        TargetActiveId: targetId,
        StimulusActiveId: stimulusId,
        StepActiveId: stepId,
      },
    })

    // if child session exist
    if (response.data.getChildSession && response.data.getChildSession.edges.length > 0) {
      let sessionStatus = 'Paused'
      if (response.data.getChildSession.edges[0].node.status === 'COMPLETED') {
        sessionStatus = 'Completed'
      }
      yield put({
        type: 'sessionrecording/SET_STATE',
        payload: {
          ChildSession: response.data.getChildSession.edges[0].node,
          SessionStatus: sessionStatus,
          TrialStartTime: response.data.getChildSession.edges[0].node.duration,
        },
      })

      if (debug) {
        console.log('====> now checking child session recording')
      }
      // if data recording present
      const childResponse = yield call(getChildSessionData, {
        id: response.data.getChildSession.edges[0].node.id,
      })

      if (childResponse && childResponse.data) {
        if (debug) {
          console.log('====> found child session recording')
        }
        // updating targets response in store
        childResponse.data.getSessionRecordings.edges.map(item => {
          targetResponse[item.node.targets.id] = {
            ...targetResponse[item.node.targets.id],
            skillsId: item.node.id,
            startTime: item.node.durationStart,
            endTime: item.node.durationEnd,
          }

          if (item.node.sessionRecord.edges.length > 0) {
            item.node.sessionRecord.edges.map(recordingItem => {
              if (recordingItem.node.sd) {
                targetResponse[item.node.targets.id]['sd'][recordingItem.node.sd.id] = [
                  ...targetResponse[item.node.targets.id]['sd'][recordingItem.node.sd.id],
                  recordingItem.node,
                ]
              } else if (recordingItem.node.step) {
                targetResponse[item.node.targets.id]['step'][recordingItem.node.step.id] = [
                  ...targetResponse[item.node.targets.id]['step'][recordingItem.node.step.id],
                  recordingItem.node,
                ]
              } else {
                targetResponse[item.node.targets.id]['target'] = [
                  ...targetResponse[item.node.targets.id]['target'],
                  recordingItem.node,
                ]
              }
            })
          }
        })

        // Updating other info according to recordings like Count, IncorrectCount, CorrectCount, TargetActiveIndex, TargetActiveId

        let currentCount = 1
        let currentCorrectCount = 0
        let currentIncorrectCount = 0
        let targetIndex = 0
        // let targetId = ''
        let stimulusIndex = 0
        // let stimulusId = ''
        let stepIndex = 0
        // let stepId = ''

        const edgeLength = childResponse.data.getSessionRecordings.edges.length
        if (edgeLength > 0) {
          const lastObject = childResponse.data.getSessionRecordings.edges[edgeLength - 1].node

          // Updating TargetActiveIndex, TargetActiveId
          if (response.data.getsession.targets.edgeCount > 0) {
            response.data.getsession.targets.edges.map((item, index) => {
              if (item.node.id === lastObject.targets.id) {
                targetIndex = index
                targetId = lastObject.targets.id

                if (item.node.sd && item.node.sd.edges.length > 0) {
                  stimulusId = item.node.sd.edges[0].node.id
                } else {
                  stimulusId = ''
                }
                if (item.node.steps && item.node.steps.edges.length > 0) {
                  stepId = item.node.steps.edges[0].node.id
                } else {
                  stepId = ''
                }

                const lastObjectEdgeCount = lastObject.sessionRecord.edges.length
                // updating stimulus or step index and id to store
                if (lastObjectEdgeCount > 0) {
                  const lastObjectLastEntry =
                    lastObject.sessionRecord.edges[lastObjectEdgeCount - 1].node
                  if (lastObjectLastEntry.sd) {
                    stimulusId = lastObjectLastEntry.sd.id
                    item.node.sd.edges.map((sdItem, sdIndex) => {
                      if (sdItem.node.id === stimulusId) {
                        stimulusIndex = sdIndex
                      }
                    })
                  } else if (lastObjectLastEntry.step) {
                    stepId = lastObjectLastEntry.step.id
                    item.node.steps.edges.map((stepsItem, stepsIndex) => {
                      if (stepsItem.node.id === stepId) {
                        stepIndex = stepsIndex
                      }
                    })
                  }
                }
              }
            })
          }

          // updating Count, CorrectCount & IncorrectCount
          if (stimulusId !== '') {
            console.log(targetId)
            if (targetResponse[targetId].sd[stimulusId].length > 0) {
              currentCount = targetResponse[targetId].sd[stimulusId].length + 1
              targetResponse[targetId].sd[stimulusId].map(recordingItem => {
                if (recordingItem.trial === 'CORRECT') {
                  currentCorrectCount += 1
                }
                if (recordingItem.trial === 'ERROR') {
                  currentIncorrectCount += 1
                }
                if (recordingItem.trial === 'PROMPT') {
                  currentIncorrectCount += 1
                }
              })
            }
          } else if (!(stepId === '')) {
            if (targetResponse[targetId].step[stepId].length > 0) {
              currentCount = targetResponse[targetId].step[stepId].length + 1
              targetResponse[targetId].step[stepId].map(recordingItem => {
                if (recordingItem.trial === 'CORRECT') {
                  currentCorrectCount += 1
                }
                if (recordingItem.trial === 'ERROR') {
                  currentIncorrectCount += 1
                }
                if (recordingItem.trial === 'PROMPT') {
                  currentIncorrectCount += 1
                }
              })
            }
          } else {
            if (targetResponse[targetId].target.length > 0) {
              currentCount = targetResponse[targetId].target.length + 1
              targetResponse[targetId].target.map(recordingItem => {
                if (recordingItem.trial === 'CORRECT') {
                  currentCorrectCount += 1
                }
                if (recordingItem.trial === 'ERROR') {
                  currentIncorrectCount += 1
                }
                if (recordingItem.trial === 'PROMPT') {
                  currentIncorrectCount += 1
                }
              })
            }
          }

          // if(lastObject.sessionRecord.edges.length > 0){
          //     currentCount = lastObject.sessionRecord.edges.length + 1
          //     lastObject.sessionRecord.edges.map(recordingItem => {
          //         if (recordingItem.node.trial === 'CORRECT'){
          //             currentCorrectCount += 1
          //         }
          //         if (recordingItem.node.trial === 'ERROR'){
          //             currentIncorrectCount += 1
          //         }
          //         if (recordingItem.node.trial === 'PROMPT'){
          //             currentIncorrectCount += 1
          //         }
          //     })
          // }
        }

        yield put({
          type: 'sessionrecording/SET_STATE',
          payload: {
            TargetResponse: targetResponse,
            Count: currentCount,
            CorrectCount: currentCorrectCount,
            IncorrectCount: currentIncorrectCount,
            TargetActiveIndex: targetIndex,
            TargetActiveId: targetId,
            StepActiveIndex: stepIndex,
            StepActiveId: stepId,
            StimulusActiveIndex: stimulusIndex,
            StimulusActiveId: stimulusId,
          },
        })
      }
    }
  }

  yield put({
    type: 'sessionrecording/SET_STATE',
    payload: {
      loading: false,
    },
  })
}

// not in use
export function* GET_CHILD_SESSION_DATA({ payload }) {
  const response = yield call(getChildSessionData, payload)
  if (response && response.data) {
    yield put({
      type: 'sessionrecording/SET_STATE',
      payload: {
        CorrectCount: 0,
      },
    })
  }
}

export function* START_SESSION({ payload }) {
  // selecting master session id for creating child session
  const masterSessionId = yield select(state => state.sessionrecording.MasterSession.id)
  // creating child session object
  const response = yield call(createChildSession, masterSessionId)
  if (response && response.data && response.data.startSession) {
    yield put({
      type: 'sessionrecording/SET_STATE',
      payload: {
        ChildSession: response.data.startSession.details,
        SessionStatus: 'InProgress',
      },
    })

    // selecting master session
    const masterSession = yield select(state => state.sessionrecording.MasterSession)

    if (masterSession.targets.edgeCount > 0) {
      // create first target instance in system
      const result = yield call(createFirstTragetAndTrialInstance, {
        childId: response.data.startSession.details.id,
        targetId: masterSession.targets.edges[0].node.id,
        targetStatusId: masterSession.targets.edges[0].node.targetStatus.id,
      })
      // updating response in redux store
      if (result && result.data) {
        yield put({
          type: 'sessionrecording/UPDATE_FIRST_TARGET_RESPONSE',
          payload: {
            object: result.data.sessionRecording.details,
          },
        })
      }
    }
  }
}

export function* PAUSE_SESSION({ payload }) {
  // selecting child session id for creating child session
  const childSessionId = yield select(state => state.sessionrecording.ChildSession.id)
  // updating session duration
  const response = yield call(updateChildSessionDuration, {
    id: childSessionId,
    duration: payload.duration,
  })
  if (response && response.data && response.data.changeSessionStatus) {
    yield put({
      type: 'sessionrecording/SET_STATE',
      payload: {
        ChildSession: response.data.changeSessionStatus.details,
        SessionStatus: 'Paused',
      },
    })
  }
}

export function* RESUME_SESSION({ payload }) {
  // const response = yield call(getTargets)

  // if (response && response.data) {
  yield put({
    type: 'sessionrecording/SET_STATE',
    payload: {
      SessionStatus: 'InProgress',
    },
  })
  // }
}

export function* END_SESSION({ payload }) {
  // selecting child session id for creating child session
  const childSessionId = yield select(state => state.sessionrecording.ChildSession.id)
  // updating session duration
  const response = yield call(finishChildSession, {
    id: childSessionId,
    duration: payload.duration,
  })
  console.log(response)
  if (response && response.data && response.data.changeSessionStatus) {
    yield put({
      type: 'sessionrecording/SET_STATE',
      payload: {
        ChildSession: response.data.changeSessionStatus.details,
        SessionStatus: 'Completed',
      },
    })
  }
}

export function* TARGET_CORRECT({ payload }) {
  // selecting child session id for creating child session
  const childSessionId = yield select(state => state.sessionrecording.ChildSession.id)
  const targetActiveId = yield select(state => state.sessionrecording.TargetActiveId)
  const trialStartTime = yield select(state => state.sessionrecording.TrialStartTime)
  const currentSessionTime = yield select(state => state.sessionrecording.CurrentSessionTime)
  const masterSession = yield select(state => state.sessionrecording.MasterSession)
  const targetActiveIndex = yield select(state => state.sessionrecording.TargetActiveIndex)
  // selecting status id of the target
  const sessionStatusId = masterSession.targets.edges[targetActiveIndex].node.targetStatus.id
  // updating session duration
  const response = yield call(recordTargetCorrectTrial, {
    childId: childSessionId,
    statusId: sessionStatusId,
    targetId: targetActiveId,
    start: trialStartTime,
    end: currentSessionTime,
    promptId: payload.promptId,
    response: payload.response,
  })
  if (response && response.data && response.data.sessionRecording) {
    const targetResponse = yield select(state => state.sessionrecording.TargetResponse)
    targetResponse[targetActiveId].target = []
    response.data.sessionRecording.details.sessionRecord.edges.map(item => {
      targetResponse[targetActiveId].target = [...targetResponse[targetActiveId].target, item.node]
    })

    yield put({
      type: 'sessionrecording/SET_STATE',
      payload: {
        TargetResponse: targetResponse,
      },
    })
    // update session duration
    yield put({
      type: 'sessionrecording/UPDATE_DURATION',
    })
  }
}

export function* TARGET_UPDATE({ payload }) {
  // selecting child session id for creating child session
  const currentSessionTime = yield select(state => state.sessionrecording.CurrentSessionTime)
  const targetResponse = yield select(state => state.sessionrecording.TargetResponse)

  // getting skillsId for target
  const skillsId = targetResponse[payload.targetId].skillsId
  const previousTargetTime = targetResponse[payload.targetId].endTime

  if (previousTargetTime === 0) {
    const response = yield call(updateTargetEndTime, {
      skillsId: skillsId,
      endTime: currentSessionTime,
    })
    if (response && response.data) {
      // updating target end time in redux store
      targetResponse[payload.targetId].endTime = response.data.updateTargetRec.details.durationEnd

      yield put({
        type: 'sessionrecording/SET_STATE',
        payload: {
          TargetResponse: targetResponse,
        },
      })
    }
  }
  // update session duration
  yield put({
    type: 'sessionrecording/UPDATE_DURATION',
  })
}

export function* CREATE_NEW_TARGET_INSTANCE({ payload }) {
  // selecting child session id for creating child session
  const currentSessionTime = yield select(state => state.sessionrecording.CurrentSessionTime)
  const targetResponse = yield select(state => state.sessionrecording.TargetResponse)
  const childSessionId = yield select(state => state.sessionrecording.ChildSession.id)
  const masterSession = yield select(state => state.sessionrecording.MasterSession)
  // selecting status id of the target
  const sessionStatusId = masterSession.targets.edges[payload.targetIndex].node.targetStatus.id
  // console.log(childSessionId, sessionStatusId, payload.targetId, currentSessionTime)
  const targetObject = masterSession.targets.edges[payload.targetIndex].node
  let stimulusId = ''
  let stepId = ''

  if (targetObject.sd.edges.length > 0) {
    stimulusId = targetObject.sd.edges[0].node.id
  } else if (targetObject.steps.edges.length > 0) {
    stepId = targetObject.steps.edges[0].node.id
  }

  if (!targetResponse[payload.targetId].skillsId) {
    const response = yield call(createNewTargetInstance, {
      childId: childSessionId,
      statusId: sessionStatusId,
      targetId: payload.targetId,
      start: currentSessionTime,
    })
    if (response && response.data) {
      // updating target end time in redux store
      targetResponse[payload.targetId] = {
        ...targetResponse[payload.targetId],
        skillsId: response.data.sessionRecording.details.id,
        startTime: response.data.sessionRecording.details.durationStart,
        endTime: response.data.sessionRecording.details.durationEnd,
      }
      yield put({
        type: 'sessionrecording/SET_STATE',
        payload: {
          TargetResponse: targetResponse,
          Count: 1,
          CorrectCount: 0,
          IncorrectCount: 0,
          StepActiveIndex: 0,
          StepActiveId: stepId,
          StimulusActiveIndex: 0,
          StimulusActiveId: stimulusId,
        },
      })
    }
  } else {
    let currentCount = 1
    let currentCorrectCount = 0
    let currentIncorrectCount = 0

    // updating Count, CorrectCount & IncorrectCount

    // if(targetResponse[payload.targetId].target.length > 0){
    //     currentCount = targetResponse[payload.targetId].target.length + 1
    //     targetResponse[payload.targetId].target.map(recordingItem => {
    //         if (recordingItem.trial === 'CORRECT'){
    //             currentCorrectCount += 1
    //         }
    //         if (recordingItem.trial === 'ERROR'){
    //             currentIncorrectCount += 1
    //         }
    //         if (recordingItem.trial === 'PROMPT'){
    //             currentIncorrectCount += 1
    //         }
    //     })
    // }

    if (targetResponse[payload.targetId].sd) {
      if (targetResponse[payload.targetId].sd[targetObject.sd.edges[0].node.id].length > 0) {
        currentCount =
          targetResponse[payload.targetId].sd[targetObject.sd.edges[0].node.id].length + 1
        targetResponse[payload.targetId].sd[targetObject.sd.edges[0].node.id].map(recordingItem => {
          if (recordingItem.trial === 'CORRECT') {
            currentCorrectCount += 1
          }
          if (recordingItem.trial === 'ERROR') {
            currentIncorrectCount += 1
          }
          if (recordingItem.trial === 'PROMPT') {
            currentIncorrectCount += 1
          }
        })
      }
    } else if (targetResponse[payload.targetId].step) {
      if (targetResponse[payload.targetId].step[targetObject.steps.edges[0].node.id].length > 0) {
        currentCount =
          targetResponse[payload.targetId].step[targetObject.steps.edges[0].node.id].length + 1
        targetResponse[payload.targetId].step[targetObject.steps.edges[0].node.id].map(
          recordingItem => {
            if (recordingItem.trial === 'CORRECT') {
              currentCorrectCount += 1
            }
            if (recordingItem.trial === 'ERROR') {
              currentIncorrectCount += 1
            }
            if (recordingItem.trial === 'PROMPT') {
              currentIncorrectCount += 1
            }
          },
        )
      }
    } else {
      if (targetResponse[payload.targetId].target.length > 0) {
        currentCount = targetResponse[payload.targetId].target.length + 1
        targetResponse[payload.targetId].target.map(recordingItem => {
          if (recordingItem.trial === 'CORRECT') {
            currentCorrectCount += 1
          }
          if (recordingItem.trial === 'ERROR') {
            currentIncorrectCount += 1
          }
          if (recordingItem.trial === 'PROMPT') {
            currentIncorrectCount += 1
          }
        })
      }
    }

    yield put({
      type: 'sessionrecording/SET_STATE',
      payload: {
        Count: currentCount,
        CorrectCount: currentCorrectCount,
        IncorrectCount: currentIncorrectCount,
        StepActiveIndex: 0,
        StepActiveId: stepId,
        StimulusActiveIndex: 0,
        StimulusActiveId: stimulusId,
      },
    })
  }
  // update session duration
  yield put({
    type: 'sessionrecording/UPDATE_DURATION',
  })
}

export function* UPDATE_TARGET_TRIAL({ payload }) {
  // selecting target response object from store
  const targetResponse = yield select(state => state.sessionrecording.TargetResponse)
  const targetActiveId = yield select(state => state.sessionrecording.TargetActiveId)
  const count = yield select(state => state.sessionrecording.Count)
  // update target trial query

  const response = yield call(updateTargetTrial, {
    object: payload.object,
    response: payload.response,
    promptId: payload.promptId,
  })
  if (response && response.data) {
    // updating target end time in redux store
    if (
      targetResponse[targetActiveId].target[count - 1].id === response.data.updateTrial.details.id
    ) {
      targetResponse[targetActiveId].target[count - 1] = response.data.updateTrial.details
    }

    yield put({
      type: 'sessionrecording/SET_STATE',
      payload: {
        TargetResponse: targetResponse,
      },
    })
  }
  // update session duration
  yield put({
    type: 'sessionrecording/UPDATE_DURATION',
  })
}

// not in use
export function* SET_PREVIOUS_COUNTS({ payload }) {
  // selecting target response object from store
  const targetResponse = yield select(state => state.sessionrecording.TargetResponse)
  const masterSession = yield select(state => state.sessionrecording.MasterSession)
  // console.log(childSessionId, sessionStatusId, payload.targetId, currentSessionTime)
  const targetObject = masterSession.targets.edges[payload.targetIndex].node

  let stepId = ''
  let stimulusId = ''
  let currentCount = 1
  let currentCorrectCount = 0
  let currentIncorrectCount = 0

  if (targetObject.sd.edges.length > 0) {
    stimulusId = targetObject.sd.edges[0].node.id
  } else if (targetObject.steps.edges.length > 0) {
    stepId = targetObject.steps.edges[0].node.id
  }

  // updating Count, CorrectCount & IncorrectCount

  if (targetResponse[payload.targetId].sd) {
    if (targetResponse[payload.targetId].sd[targetObject.sd.edges[0].node.id].length > 0) {
      currentCount =
        targetResponse[payload.targetId].sd[targetObject.sd.edges[0].node.id].length + 1
      targetResponse[payload.targetId].sd[targetObject.sd.edges[0].node.id].map(recordingItem => {
        if (recordingItem.trial === 'CORRECT') {
          currentCorrectCount += 1
        }
        if (recordingItem.trial === 'ERROR') {
          currentIncorrectCount += 1
        }
        if (recordingItem.trial === 'PROMPT') {
          currentIncorrectCount += 1
        }
      })
    }
  } else if (targetResponse[payload.targetId].step) {
    if (targetResponse[payload.targetId].step[targetObject.steps.edges[0].node.id].length > 0) {
      currentCount =
        targetResponse[payload.targetId].step[targetObject.steps.edges[0].node.id].length + 1
      targetResponse[payload.targetId].step[targetObject.steps.edges[0].node.id].map(
        recordingItem => {
          if (recordingItem.trial === 'CORRECT') {
            currentCorrectCount += 1
          }
          if (recordingItem.trial === 'ERROR') {
            currentIncorrectCount += 1
          }
          if (recordingItem.trial === 'PROMPT') {
            currentIncorrectCount += 1
          }
        },
      )
    }
  } else {
    if (targetResponse[payload.targetId].target.length > 0) {
      currentCount = targetResponse[payload.targetId].target.length + 1
      targetResponse[payload.targetId].target.map(recordingItem => {
        if (recordingItem.trial === 'CORRECT') {
          currentCorrectCount += 1
        }
        if (recordingItem.trial === 'ERROR') {
          currentIncorrectCount += 1
        }
        if (recordingItem.trial === 'PROMPT') {
          currentIncorrectCount += 1
        }
      })
    }
  }

  yield put({
    type: 'sessionrecording/SET_STATE',
    payload: {
      Count: currentCount,
      CorrectCount: currentCorrectCount,
      IncorrectCount: currentIncorrectCount,
      StepActiveIndex: 0,
      StepActiveId: stepId,
      StimulusActiveIndex: 0,
      StimulusActiveId: stimulusId,
    },
  })
}

export function* CHANGE_STIMULUS({ payload }) {
  // selecting target response object from store
  const targetResponse = yield select(state => state.sessionrecording.TargetResponse)

  let currentCount = 1
  let currentCorrectCount = 0
  let currentIncorrectCount = 0

  // updating Count, CorrectCount & IncorrectCount

  if (targetResponse[payload.targetId].sd[payload.stimulusId].length > 0) {
    currentCount = targetResponse[payload.targetId].sd[payload.stimulusId].length + 1
    targetResponse[payload.targetId].sd[payload.stimulusId].map(recordingItem => {
      if (recordingItem.trial === 'CORRECT') {
        currentCorrectCount += 1
      }
      if (recordingItem.trial === 'ERROR') {
        currentIncorrectCount += 1
      }
      if (recordingItem.trial === 'PROMPT') {
        currentIncorrectCount += 1
      }
    })
  }

  yield put({
    type: 'sessionrecording/SET_STATE',
    payload: {
      Count: currentCount,
      CorrectCount: currentCorrectCount,
      IncorrectCount: currentIncorrectCount,
      StimulusActiveIndex: payload.stimulusIndex,
      StimulusActiveId: payload.stimulusId,
    },
  })
}

export function* TARGET_SD_CORRECT({ payload }) {
  // selecting child session id for creating child session
  const childSessionId = yield select(state => state.sessionrecording.ChildSession.id)
  const targetActiveId = yield select(state => state.sessionrecording.TargetActiveId)
  const trialStartTime = yield select(state => state.sessionrecording.TrialStartTime)
  const currentSessionTime = yield select(state => state.sessionrecording.CurrentSessionTime)
  const masterSession = yield select(state => state.sessionrecording.MasterSession)
  const targetActiveIndex = yield select(state => state.sessionrecording.TargetActiveIndex)
  // selecting status id of the target
  const sessionStatusId = masterSession.targets.edges[targetActiveIndex].node.targetStatus.id
  // updating session duration
  const response = yield call(recordTargetStimulusTrial, {
    childId: childSessionId,
    statusId: sessionStatusId,
    targetId: targetActiveId,
    start: trialStartTime,
    end: currentSessionTime,
    promptId: payload.promptId,
    response: payload.response,
    sdId: payload.sdId,
  })
  if (response && response.data && response.data.sessionRecording) {
    const targetResponse = yield select(state => state.sessionrecording.TargetResponse)
    targetResponse[targetActiveId].sd[payload.sdId] = []
    response.data.sessionRecording.details.sessionRecord.edges.map(item => {
      if (item.node.sd.id === payload.sdId) {
        targetResponse[targetActiveId].sd[payload.sdId] = [
          ...targetResponse[targetActiveId].sd[payload.sdId],
          item.node,
        ]
      }
    })

    yield put({
      type: 'sessionrecording/SET_STATE',
      payload: {
        TargetResponse: targetResponse,
      },
    })
  }
  // update session duration
  yield put({
    type: 'sessionrecording/UPDATE_DURATION',
  })
}

export function* UPDATE_TARGET_SD_TRIAL({ payload }) {
  // selecting target response object from store
  const targetResponse = yield select(state => state.sessionrecording.TargetResponse)
  const targetActiveId = yield select(state => state.sessionrecording.TargetActiveId)
  const count = yield select(state => state.sessionrecording.Count)
  // update target trial query

  const response = yield call(updateTargetTrial, {
    object: payload.object,
    response: payload.response,
    promptId: payload.promptId,
  })
  if (response && response.data) {
    // updating target end time in redux store
    if (
      targetResponse[targetActiveId].sd[payload.object.sd.id][count - 1].id ===
      response.data.updateTrial.details.id
    ) {
      targetResponse[targetActiveId].sd[payload.object.sd.id][count - 1] =
        response.data.updateTrial.details
    }

    yield put({
      type: 'sessionrecording/SET_STATE',
      payload: {
        TargetResponse: targetResponse,
      },
    })
  }
  // update session duration
  yield put({
    type: 'sessionrecording/UPDATE_DURATION',
  })
}

export function* CHANGE_STEP({ payload }) {
  // selecting target response object from store
  const targetResponse = yield select(state => state.sessionrecording.TargetResponse)

  let currentCount = 1
  let currentCorrectCount = 0
  let currentIncorrectCount = 0

  // updating Count, CorrectCount & IncorrectCount

  if (targetResponse[payload.targetId].step[payload.stepId].length > 0) {
    currentCount = targetResponse[payload.targetId].step[payload.stepId].length + 1
    targetResponse[payload.targetId].step[payload.stepId].map(recordingItem => {
      if (recordingItem.trial === 'CORRECT') {
        currentCorrectCount += 1
      }
      if (recordingItem.trial === 'ERROR') {
        currentIncorrectCount += 1
      }
      if (recordingItem.trial === 'PROMPT') {
        currentIncorrectCount += 1
      }
    })
  }

  yield put({
    type: 'sessionrecording/SET_STATE',
    payload: {
      Count: currentCount,
      CorrectCount: currentCorrectCount,
      IncorrectCount: currentIncorrectCount,
      StepActiveIndex: payload.stepIndex,
      StepActiveId: payload.stepId,
    },
  })
}

export function* TARGET_STEP_CORRECT({ payload }) {
  // selecting child session id for creating child session
  const childSessionId = yield select(state => state.sessionrecording.ChildSession.id)
  const targetActiveId = yield select(state => state.sessionrecording.TargetActiveId)
  const trialStartTime = yield select(state => state.sessionrecording.TrialStartTime)
  const currentSessionTime = yield select(state => state.sessionrecording.CurrentSessionTime)
  const masterSession = yield select(state => state.sessionrecording.MasterSession)
  const targetActiveIndex = yield select(state => state.sessionrecording.TargetActiveIndex)
  // selecting status id of the target
  const sessionStatusId = masterSession.targets.edges[targetActiveIndex].node.targetStatus.id
  // updating session duration
  const response = yield call(recordTargetStepTrial, {
    childId: childSessionId,
    statusId: sessionStatusId,
    targetId: targetActiveId,
    start: trialStartTime,
    end: currentSessionTime,
    promptId: payload.promptId,
    response: payload.response,
    stepId: payload.stepId,
  })
  if (response && response.data && response.data.sessionRecording) {
    const targetResponse = yield select(state => state.sessionrecording.TargetResponse)
    targetResponse[targetActiveId].step[payload.stepId] = []
    response.data.sessionRecording.details.sessionRecord.edges.map(item => {
      if (item.node.step.id === payload.stepId) {
        targetResponse[targetActiveId].step[payload.stepId] = [
          ...targetResponse[targetActiveId].step[payload.stepId],
          item.node,
        ]
      }
    })

    yield put({
      type: 'sessionrecording/SET_STATE',
      payload: {
        TargetResponse: targetResponse,
      },
    })
  }

  // update session duration
  yield put({
    type: 'sessionrecording/UPDATE_DURATION',
  })
}

export function* UPDATE_TARGET_STEP_TRIAL({ payload }) {
  // selecting target response object from store
  const targetResponse = yield select(state => state.sessionrecording.TargetResponse)
  const targetActiveId = yield select(state => state.sessionrecording.TargetActiveId)
  const count = yield select(state => state.sessionrecording.Count)
  // update target trial query

  const response = yield call(updateTargetTrial, {
    object: payload.object,
    response: payload.response,
    promptId: payload.promptId,
  })
  if (response && response.data) {
    // updating target end time in redux store
    if (
      targetResponse[targetActiveId].step[payload.object.step.id][count - 1].id ===
      response.data.updateTrial.details.id
    ) {
      targetResponse[targetActiveId].step[payload.object.step.id][count - 1] =
        response.data.updateTrial.details
    }

    yield put({
      type: 'sessionrecording/SET_STATE',
      payload: {
        TargetResponse: targetResponse,
      },
    })
  }
  // update session duration
  yield put({
    type: 'sessionrecording/UPDATE_DURATION',
  })
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.LOAD_SESSION, GET_DATA),
    takeEvery(actions.GET_CHILD_SESSION_DATA, GET_CHILD_SESSION_DATA),
    takeEvery(actions.START_SESSION, START_SESSION),
    takeEvery(actions.PAUSE_SESSION, PAUSE_SESSION),
    takeEvery(actions.RESUME_SESSION, RESUME_SESSION),
    takeEvery(actions.END_SESSION, END_SESSION),
    takeEvery(actions.TARGET_CORRECT, TARGET_CORRECT),
    takeEvery(actions.TARGET_UPDATE, TARGET_UPDATE),
    takeEvery(actions.CREATE_NEW_TARGET_INSTANCE, CREATE_NEW_TARGET_INSTANCE),
    takeEvery(actions.UPDATE_TARGET_TRIAL, UPDATE_TARGET_TRIAL),
    takeEvery(actions.SET_PREVIOUS_COUNTS, SET_PREVIOUS_COUNTS),
    takeEvery(actions.CHANGE_STIMULUS, CHANGE_STIMULUS),
    takeEvery(actions.TARGET_SD_CORRECT, TARGET_SD_CORRECT),
    takeEvery(actions.UPDATE_TARGET_SD_TRIAL, UPDATE_TARGET_SD_TRIAL),
    takeEvery(actions.CHANGE_STEP, CHANGE_STEP),
    takeEvery(actions.TARGET_STEP_CORRECT, TARGET_STEP_CORRECT),
    takeEvery(actions.UPDATE_TARGET_STEP_TRIAL, UPDATE_TARGET_STEP_TRIAL),
    takeEvery(actions.UPDATE_DURATION, UpdateDuration),
  ])
}
