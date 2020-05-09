/* eslint-disable no-plusplus */
import { all, takeEvery, put, call } from 'redux-saga/effects'
import { notification } from 'antd'
import { getClinicStaffs, getStaffDropdown } from 'services/staffs'
import actions from './actions'

export function* GET_DATA() {
  yield put({
    type: 'staffs/SET_STATE',
    payload: {
      loading: true,
    },
  })

  const response = yield call(getClinicStaffs)

  if (response) {
    const staffs = []
    let i = 0
    if (response.data.staffs.edges.length > 0) {
      for (i = 0; i < response.data.staffs.edges.length; i++) {
        staffs.push(response.data.staffs.edges[i].node)
      }
    }

    yield put({
      type: 'staffs/SET_STATE',
      payload: {
        StaffList: staffs,
      },
    })
  }

  yield put({
    type: 'staffs/SET_STATE',
    payload: {
      loading: false,
    },
  })
}

export function* GET_STAFF_DROPDOWNS() {
  const response = yield call(getStaffDropdown)
  if (response && response.data) {
    yield put({
      type: 'staffs/SET_STATE',
      payload: {
        // UserRole : response.data.userRole,
        clinicLocationList: response.data.schoolLocation.edges,
      },
    })
  }
}

export default function* rootSaga() {
  yield all([
    // GET_DATA(), // run once on app load to fetch menu data
    takeEvery(actions.GET_STAFFS, GET_DATA),
    takeEvery(actions.GET_STAFF_DROPDOWNS, GET_STAFF_DROPDOWNS),
  ])
}
