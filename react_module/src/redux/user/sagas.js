import { all, takeEvery, put, call } from 'redux-saga/effects'
// import { push } from 'react-router-redux';
// import { notification } from 'antd'
import { login, RefreshToken } from 'services/user'
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
  const response = yield call(login,payload)

  if(response)
  {
    yield put({
      type: 'user/SET_STATE',
      payload: {
        id: response.tokenAuth.user.id,
        authorized: true,
        loading: false,
        role:response.tokenAuth.user.groups.edges[0].node.name,
      },
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
    },
  })

  const response = yield call(RefreshToken)

  if(response)
  {
    yield put({
      type: 'user/SET_STATE',
      payload: {
        authorized: true,
        loading: false,
        role:JSON.parse(localStorage.getItem('role')),
      },
    })
  }
  else {
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
      role:"",
    },
  })

  localStorage.setItem('database', "");
  localStorage.setItem('token',  "");
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.LOGIN, LOGIN),
    takeEvery(actions.LOAD_CURRENT_ACCOUNT, LOAD_CURRENT_ACCOUNT),
    takeEvery(actions.LOGOUT, LOGOUT),
    LOAD_CURRENT_ACCOUNT(), // run once on app load to check user auth
  ])
}
