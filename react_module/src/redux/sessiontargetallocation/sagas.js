/* eslint-disable no-plusplus */
/* eslint-disable object-shorthand */
/* eslint-disable array-callback-return */

import { all, takeEvery, put, call, select } from 'redux-saga/effects'
import { notification } from 'antd'
import {
  getAllocatedTargets,
  updateSessionTargets,
  updateSessionDetails,
} from 'services/sessiontargetallocation'
import actions from './actions'

export function* GET_DATA({ payload }) {
  yield put({
    type: 'sessiontargetallocation/SET_STATE',
    payload: {
      loading: true,
    },
  })

  const response = yield call(getAllocatedTargets, payload)

  if (response) {
    let morning = null
    let afternoon = null
    let evening = null
    // selecting morning session id from store
    const mSessionId = yield select(state => state.sessiontargetallocation.MorningSessionId)
    // selecting afternoon session id from store
    const aSessionId = yield select(state => state.sessiontargetallocation.AfternoonSessionId)
    // selecting evening session id from store
    const eSessionId = yield select(state => state.sessiontargetallocation.EveningSessionId)
    if (response.data.GetStudentSession && response.data.GetStudentSession.edges.length > 0) {
      response.data.GetStudentSession.edges.map(item => {
        // selecting morning session into the response list
        if (item.node.sessionName.id === mSessionId) {
          morning = item.node
        }
        // selecting afternoon session into the response list
        if (item.node.sessionName.id === aSessionId) {
          afternoon = item.node
        }
        // selecting evening session into the response list
        if (item.node.sessionName.id === eSessionId) {
          evening = item.node
        }
      })
    }

    yield put({
      type: 'sessiontargetallocation/SET_STATE',
      payload: {
        AllocatedTargetsList: response.data.targetAllocates.edges,
        MorningSession: morning,
        AfternoonSession: afternoon,
        EveningSession: evening,
        FamilyMemberList: response.data.student.family.members.edges,
      },
    })
  }

  yield put({
    type: 'sessiontargetallocation/SET_STATE',
    payload: {
      loading: false,
    },
  })
}

export function* UPDATE_SESSION({ payload }) {
  console.log(payload)
  const response = yield call(updateSessionTargets, payload)

  if (response && response.data) {
    notification.success({
      message: 'Session Updated Successfully',
    })

    if (payload.session === 'Morning') {
      yield put({
        type: 'sessiontargetallocation/SET_STATE',
        payload: {
          MorningSession: response.data.updateSessionTargets.session,
        },
      })
    }
    if (payload.session === 'Afternoon') {
      yield put({
        type: 'sessiontargetallocation/SET_STATE',
        payload: {
          AfternoonSession: response.data.updateSessionTargets.session,
        },
      })
    }
    if (payload.session === 'Evening') {
      yield put({
        type: 'sessiontargetallocation/SET_STATE',
        payload: {
          EveningSession: response.data.updateSessionTargets.session,
        },
      })
    }
  }
}

export function* UPDATE_SESSION_DETAILS({ payload }) {
  const currentSession = yield select(state => state.sessiontargetallocation.CurrentSession)
  let sessionObject = null
  if (currentSession === 'Morning') {
    // selecting morning session id from store
    sessionObject = yield select(state => state.sessiontargetallocation.MorningSession)
  }
  if (currentSession === 'Afternoon') {
    // selecting morning session id from store
    sessionObject = yield select(state => state.sessiontargetallocation.AfternoonSession)
  }
  if (currentSession === 'Evening') {
    // selecting morning session id from store
    sessionObject = yield select(state => state.sessiontargetallocation.EveningSession)
  }

  // console.log(payload)
  const response = yield call(updateSessionDetails, {
    payload: payload,
    sessionObject: sessionObject,
  })

  if (response && response.data) {
    notification.success({
      message: 'Session Updated Successfully',
    })
    console.log(response)
    console.log(response.data.updateMasterSession.details)
    if (currentSession === 'Morning') {
      // Updating morning session store value
      yield put({
        type: 'sessiontargetallocation/SET_STATE',
        payload: {
          MorningSession: response.data.updateMasterSession.details,
        },
      })
    }
    if (currentSession === 'Afternoon') {
      // Updating morning session store value
      yield put({
        type: 'sessiontargetallocation/SET_STATE',
        payload: {
          AfternoonSession: response.data.updateMasterSession.details,
        },
      })
    }
    if (currentSession === 'Evening') {
      // Updating morning session store value
      yield put({
        type: 'sessiontargetallocation/SET_STATE',
        payload: {
          EveningSession: response.data.updateMasterSession.details,
        },
      })
    }
  }

  yield put({
    type: 'sessiontargetallocation/SET_STATE',
    payload: {
      loading: false,
    },
  })
}

export default function* rootSaga() {
  yield all([
    // GET_DATA(), // run once on app load to fetch menu data
    takeEvery(actions.GET_ALLOCATED_TARGETS, GET_DATA),
    takeEvery(actions.UPDATE_SESSION, UPDATE_SESSION),
    takeEvery(actions.UPDATE_SESSION_DETAILS, UPDATE_SESSION_DETAILS),
  ])
}
