import { all, put, call, takeEvery, select } from 'redux-saga/effects'
import { getLeftMenuData, getTopMenuData } from 'services/menu'
import actions from './actions'

export function* GET_DATA() {
  const getUser = state => state.user
  const userobj = yield select(getUser);

  const menuLeftData = yield call(getLeftMenuData)
  const menuTopData = yield call(getTopMenuData, userobj.role)


  yield put({
    type: 'menu/SET_STATE',
    payload: {
      menuLeftData,
      menuTopData,
    },
  })
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.GET_DATA, GET_DATA),
    GET_DATA(), // run once on app load to fetch menu data
  ])
}
