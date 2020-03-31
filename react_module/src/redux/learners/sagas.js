import { all, put, call } from 'redux-saga/effects'
const API_URL = process.env.REACT_APP_API_URL;

export function* GET_DATA() {

  const dataJSON =  yield fetch(`${API_URL}/school/learners/`, {method: "GET",headers: {"Access-Control-Allow-Origin": '*', 'database':JSON.parse(localStorage.getItem('database'))}})

  const result = yield dataJSON.json();

  yield put({
    type: 'menu/SET_STATE',
    payload: {
      GET_LEARNER:result
    },
  })
}

export default function* rootSaga() {
  yield all([
    GET_DATA(), // run once on app load to fetch menu data
  ])
}
