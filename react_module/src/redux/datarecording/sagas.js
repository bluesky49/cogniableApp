/* eslint-disable no-plusplus */
/* eslint-disable vars-on-top */
/* eslint-disable no-var */
import { all, put, takeEvery, call } from 'redux-saga/effects'
import { getTargets } from 'services/datarecording'
import actions from './actions'

export function* GET_DATA({ payload }) {
  yield put({
    type: 'datarecording/SET_STATE',
    payload: {
      TargetList: [],
      TargetInitialValue: 1,
      TargetListLength: 0,
      TargetActiveKey: '',
      TargetsResponse: {},
    },
  })

  const data = yield call(getTargets, payload)

  if (data) {
    let activeKey = ''
    var responseList = {}
    let sdActiveKey = ''
    var sdResponseList = {}
    let stepActiveKey = ''
    var stepResponseList = {}
    if (data.data.targetAllocates.edges.length > 0) {
      activeKey = data.data.targetAllocates.edges[0].node.id

      let i = 0
      for (i = 0; i < data.data.targetAllocates.edges.length; i++) {
        responseList[data.data.targetAllocates.edges[i].node.id] = []

        let j = 0
        if (data.data.targetAllocates.edges[i].node.sd.edges.length > 0) {
          sdActiveKey = data.data.targetAllocates.edges[i].node.sd.edges[0].node.id
          // console.log('reached')
          for (j = 0; j < data.data.targetAllocates.edges[i].node.sd.edges.length; j++) {
            sdResponseList[data.data.targetAllocates.edges[i].node.sd.edges[j].node.id] = []
          }
        }

        let k = 0
        if (data.data.targetAllocates.edges[i].node.steps.edges.length > 0) {
          stepActiveKey = data.data.targetAllocates.edges[i].node.steps.edges[0].node.id
          // console.log('reached')
          for (k = 0; k < data.data.targetAllocates.edges[i].node.steps.edges.length; k++) {
            stepResponseList[data.data.targetAllocates.edges[i].node.steps.edges[k].node.id] = []
          }
        }
      }
    }
    yield put({
      type: 'datarecording/SET_STATE',
      payload: {
        TargetList: data.data.targetAllocates.edges,
        TargetListLength: data.data.targetAllocates.edges.length,
        TargetActiveKey: activeKey,
        TargetInitialValue: 1,
        TargetsResponse: responseList,
        SdResponse: sdResponseList,
        StimulusActiveKey: sdActiveKey,
        StepActiveKey: stepActiveKey,
        StepResponse: stepResponseList,
      },
    })
  }
}

export function* UPDATE_TARGET_STATUS_RESPONSE({ payload }) {
  yield put({
    type: 'datarecording/SET_STATE',
    payload: {
      TargetList: [],
      TargetInitialValue: 1,
      TargetListLength: 0,
      TargetActiveKey: '',
      TargetsResponse: {},
      SdResponse: {},
      StepResponse: {},
      Correct: [],
      Incorrect: [],
      StimulusActiveKey: '',
      StimulusActiveIndex: 1,
      StepActiveKey: '',
      StepActiveIndex: 1,
      RecordingType: 'Target',

      count: 1,
      percentage: 0.0,
      correct: 0,
      incorrect: 0,
    },
  })

  const { data } = payload

  if (data) {
    let activeKey = ''
    var responseList = {}
    let sdActiveKey = ''
    var sdResponseList = {}
    let stepActiveKey = ''
    var stepResponseList = {}
    if (data.data.targetAllocates.edges.length > 0) {
      activeKey = data.data.targetAllocates.edges[0].node.id

      let i = 0
      for (i = 0; i < data.data.targetAllocates.edges.length; i++) {
        responseList[data.data.targetAllocates.edges[i].node.id] = []

        let j = 0
        if (data.data.targetAllocates.edges[i].node.sd.edges.length > 0) {
          sdActiveKey = data.data.targetAllocates.edges[i].node.sd.edges[0].node.id
          // console.log('reached')
          for (j = 0; j < data.data.targetAllocates.edges[i].node.sd.edges.length; j++) {
            sdResponseList[data.data.targetAllocates.edges[i].node.sd.edges[j].node.id] = []
          }
        }

        let k = 0
        if (data.data.targetAllocates.edges[i].node.steps.edges.length > 0) {
          stepActiveKey = data.data.targetAllocates.edges[i].node.steps.edges[0].node.id
          // console.log('reached')
          for (k = 0; k < data.data.targetAllocates.edges[i].node.steps.edges.length; k++) {
            stepResponseList[data.data.targetAllocates.edges[i].node.steps.edges[k].node.id] = []
          }
        }
      }
    }
    yield put({
      type: 'datarecording/SET_STATE',
      payload: {
        TargetList: data.data.targetAllocates.edges,
        TargetListLength: data.data.targetAllocates.edges.length,
        TargetActiveKey: activeKey,
        TargetInitialValue: 1,
        TargetsResponse: responseList,
        SdResponse: sdResponseList,
        StimulusActiveKey: sdActiveKey,
        StepActiveKey: stepActiveKey,
        StepResponse: stepResponseList,
      },
    })
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.TARGET_LIST, GET_DATA), // run once on app load to fetch menu data
    takeEvery(actions.UPDATE_TARGET_STATUS, UPDATE_TARGET_STATUS_RESPONSE),
  ])
}
