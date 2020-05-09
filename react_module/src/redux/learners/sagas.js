/* eslint-disable no-plusplus */
import { all, takeEvery, put, call } from 'redux-saga/effects'
import { notification } from 'antd'
import {
  getClinicLearners,
  updateLearner,
  createLearner,
  getLearnersDropdown,
  learnerActiveInactive,
} from 'services/learners'
import actions from './actions'

export function* GET_DATA() {
  yield put({
    type: 'learners/SET_STATE',
    payload: {
      loading: true,
    },
  })

  const response = yield call(getClinicLearners)

  if (response) {
    const learners = []
    let i = 0
    if (response.data.students.edges.length > 0) {
      for (i = 0; i < response.data.students.edges.length; i++) {
        learners.push(response.data.students.edges[i].node)
      }
    }

    yield put({
      type: 'learners/SET_STATE',
      payload: {
        LearnersList: learners,
      },
    })
  }

  yield put({
    type: 'learners/SET_STATE',
    payload: {
      loading: false,
    },
  })
}

export function* GET_LEARNERS_DROPDOWNS() {
  const response = yield call(getLearnersDropdown)

  if (response && response.data) {
    yield put({
      type: 'learners/SET_STATE',
      payload: {
        categoryList: response.data.category,
        clinicLocationList: response.data.schoolLocation.edges,
        staffDropdownList: response.data.staffs.edges,
      },
    })
  }
}

export function* EDIT_LEARNER({ payload }) {
  const response = yield call(updateLearner, payload)

  if (response && response.data) {
    notification.success({
      message: 'Learner Updated Successfully',
    })

    yield put({
      type: 'learners/UPDATE_LERNERS_LIST',
      payload: {
        object: response.data.updateStudent.student,
      },
    })

    yield put({
      type: 'learners/SET_STATE',
      payload: {
        UserProfile: response.data.updateStudent.student,
      },
    })
  }
}

export function* CREATE_LEARNER({ payload }) {
  const response = yield call(createLearner, payload)

  if (response && response.data) {
    // generating notification
    notification.success({
      message: 'Learner Created Successfully',
    })

    yield put({
      type: 'learners/APPEND_LERNERS_LIST',
      payload: {
        student: response.data.createStudent.student,
      },
    })
  }
}

export function* LEARNER_ACTIVE_INACTIVE({ payload }) {
  const response = yield call(learnerActiveInactive, payload)

  if (response && response.data) {
    // generating notification
    console.log(response.data.updateStudent.student)
    if (payload.checked === true) {
      notification.success({
        message: 'Learner Activated Successfully',
      })
    } else {
      notification.success({
        message: 'Learner Deactivated Successfully',
      })
    }

    yield put({
      type: 'learners/UPDATE_LEARNER_ACTIVE_INACTIVE',
      payload: {
        student: response.data.updateStudent.student,
      },
    })
  }
}

export default function* rootSaga() {
  yield all([
    // GET_DATA(), // run once on app load to fetch menu data
    takeEvery(actions.GET_LEARNERS, GET_DATA),
    takeEvery(actions.GET_LEARNERS_DROPDOWNS, GET_LEARNERS_DROPDOWNS),
    takeEvery(actions.EDIT_LEARNER, EDIT_LEARNER),
    takeEvery(actions.CREATE_LEARNER, CREATE_LEARNER),
    takeEvery(actions.LEARNER_ACTIVE_INACTIVE, LEARNER_ACTIVE_INACTIVE),
  ])
}
