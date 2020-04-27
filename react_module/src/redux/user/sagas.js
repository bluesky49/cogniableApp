import { all, takeEvery, put, call } from 'redux-saga/effects'
// import { push } from 'react-router-redux';
// import { notification } from 'antd'
import {
  login,
  RefreshToken,
  StudentIdFromUserId,
  GetUserDetailsByUsername,
  logout,
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

  if (response) {
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
          role: JSON.parse(localStorage.getItem('role')),
        },
      })

      if (result.data.getuser.edges[0].node.groups.edges[0].node.name === 'parents') {
        const result2 = yield call(StudentIdFromUserId, result.data.getuser.edges[0].node.id)

        if (result2) {
          yield put({
            type: 'user/SET_STATE',
            payload: {
              studentId: result2.data.students.edges[0].node.id,
            },
          })
        }
      }
    }
  } else {
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

  localStorage.setItem('database', '')
  localStorage.setItem('token', '')
  localStorage.setItem('role', '')
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.LOGIN, LOGIN),
    takeEvery(actions.LOAD_CURRENT_ACCOUNT, LOAD_CURRENT_ACCOUNT),
    takeEvery(actions.LOGOUT, LOGOUT),
    LOAD_CURRENT_ACCOUNT(), // run once on app load to check user auth
  ])
}
