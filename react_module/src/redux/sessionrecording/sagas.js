/* eslint-disable no-plusplus */
/* eslint-disable vars-on-top */
/* eslint-disable no-var */
import { all, takeEvery, put, call } from 'redux-saga/effects'
import { getTargets } from 'services/sessionrecording'
import actions from './actions'

export function* GET_DATA({ payload }) {
  yield put({
    type: 'sessionrecording/SET_STATE',
    payload: {
      loading: true,
    },
  })

  const response = yield call(getTargets, payload)

  if (response && response.data) {
    yield put({
      type: 'sessionrecording/SET_STATE',
      payload: {
        MasterSession: response.data.getsession,
      },
    })
  }

  yield put({
    type: 'sessionrecording/SET_STATE',
    payload: {
      loading: false,
    },
  })
}

export default function* rootSaga() {
  yield all([takeEvery(actions.LOAD_SESSION, GET_DATA)])
}
