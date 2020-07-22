import { all, takeEvery, put, call } from 'redux-saga/effects'
// import { push } from 'react-router-redux';
// import { notification } from 'antd'
import {
  login,
  RefreshToken,
  StudentIdFromUserId,
  GetUserDetailsByUsername,
  logout,
  GetStudentNameById,
  StaffIdFromUserId
} from 'services/user'
// import { GraphQLClient } from 'graphql-request'
import actions from './actions'

// const API_URL = process.env.REACT_APP_API_URL;

// const graphQLClient = new GraphQLClient('http://development.cogniable.us/apis/school/graphql', {
//   headers: {
//     database: 'india',
//   },
// })

export function* LOGIN({ payload }) {
  console.log('entered')
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
    },
  })
  const response = yield call(login, payload)

  if (response) {
    yield put({
      type: 'user/SET_STATE',
      payload: {
        id: response.tokenAuth.user.id,
        authorized: true,
        loading: false,
        role: response.tokenAuth.user.groups.edges[0].node.name,
      },
    })

    if (response.tokenAuth.user.groups.edges[0].node.name === 'parents') {
      // const result = yield call(StudentIdFromUserId, response.tokenAuth.user.id)
      localStorage.setItem(
        'studentId',
        JSON.stringify(response.tokenAuth.user.studentsSet.edges[0].node.id),
      )
      yield put({
        type: 'user/SET_STATE',
        payload: {
          studentId: response.tokenAuth.user.studentsSet.edges[0].node.id,
          parentName: response.tokenAuth.user.studentsSet.edges[0].node.parentName
        },
      })
    }

    if (response.tokenAuth.user.groups.edges[0].node.name === 'therapist') {
      // const result = yield call(StudentIdFromUserId, response.tokenAuth.user.id)
      yield put({
        type: 'user/SET_STATE',
        payload: {
          staffId: response.tokenAuth.user.staffSet.edges[0].node.id,
          staffName: response.tokenAuth.user.staffSet.edges[0].node.name
        },
      })
    }

    yield put({
      type: 'menu/GET_DATA',
    })
  }

  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: false,
    },
  })
}

export function* LOAD_CURRENT_ACCOUNT() {
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
      // role:JSON.parse(localStorage.getItem('role')),
    },
  })

  const response = yield call(RefreshToken)

  if (response && response.refreshToken) {
    console.log(response)
    const result = yield call(GetUserDetailsByUsername, response.refreshToken.payload.username)

    if (result) {
      console.log(result)

      yield put({
        type: 'user/SET_STATE',
        payload: {
          id: result.data.getuser.edges[0].node.id,
          authorized: true,
          loading: false,
          role: result.data.getuser.edges[0].node.groups.edges[0].node.name,
          // role: result.data.getuser.edges[0].node.groups[0].node.id,
        },
      })

      if (result.data.getuser.edges[0].node.groups.edges[0].node.name === 'parents') {
        const result2 = yield call(StudentIdFromUserId, result.data.getuser.edges[0].node.id)

        if (result2) {
          yield put({
            type: 'user/SET_STATE',
            payload: {
              studentId: result2.data.students.edges[0].node.id,
              parentName: result2.data.students.edges[0].node.parentName,
            },
          })
        }
      }

      if (result.data.getuser.edges[0].node.groups.edges[0].node.name === 'therapist') {
        const result3 = yield call(StaffIdFromUserId, result.data.getuser.edges[0].node.id)

        if (result3) {
          yield put({
            type: 'user/SET_STATE',
            payload: {
              staffId: result3.data.staffs.edges[0].node.id,
              staffName: result3.data.staffs.edges[0].node.name,
            },
          })
        }
      }


    }
  } else {
    localStorage.clear()
    LOGOUT()
  }

  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: false,
    },
  })
}

export function* LOGOUT() {
  yield put({
    type: 'user/SET_STATE',
    payload: {
      authorized: false,
      loading: false,
      role: '',
    },
  })
  yield put({
    type: 'family/SET_STATE',
    payload: {
      familyMembers: [],
      loading: false,
    },
  })
  yield call(logout)
  localStorage.clear()
}

export function* GET_STUDENT_NAME() {
  const response = yield call(GetStudentNameById, localStorage.getItem('studentId'))
  if (response && response.data) {
    yield put({
      type: 'user/SET_STATE',
      payload: {
        studentName: response.data.student.firstname,
      },
    })
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.LOGIN, LOGIN),
    takeEvery(actions.LOAD_CURRENT_ACCOUNT, LOAD_CURRENT_ACCOUNT),
    takeEvery(actions.LOGOUT, LOGOUT),
    takeEvery(actions.GET_STUDENT_NAME, GET_STUDENT_NAME),
    LOAD_CURRENT_ACCOUNT(), // run once on app load to check user auth
  ])
}
