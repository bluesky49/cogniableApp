/* eslint-disable no-plusplus */
/* eslint-disable object-shorthand */
/* eslint-disable prefer-destructuring */
import { all, takeEvery, put, call, select } from 'redux-saga/effects'
import { notification } from 'antd'
import {
  getData,
} from 'services/cogniableassessment'
import actions from './actions'

export function* GET_DATA() {
  yield put({
    type: 'cogniableassessment/SET_STATE',
    payload: {
      loading: true,
    },
  })
  
  const response = yield call(getData)

  if (response) {
    console.log(response)
  }

  yield put({
    type: 'cogniableassessment/SET_STATE',
    payload: {
      loading: false,
    },
  })
}


export default function* rootSaga() {
  yield all([
    // GET_DATA(), // run once on app load to fetch menu data
    takeEvery(actions.LOAD_DATA, GET_DATA),
  ])
}
