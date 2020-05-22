/* eslint-disable no-plusplus */
/* eslint-disable vars-on-top */
/* eslint-disable no-var */
/* eslint-disable no-unused-vars */
import { all, put, takeEvery, call } from 'redux-saga/effects'
import actions from './actions'

export function* SOME_FUNCTION({ payload }) {
  yield put({
    type: 'student/SET_STATE',
    payload: {
      Loading: true,
    },
  })
}

export default function* rootSaga() {
  yield all([takeEvery(actions.SOME_FUNCTION, SOME_FUNCTION)])
}
