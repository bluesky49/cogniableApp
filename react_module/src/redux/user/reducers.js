import actions from './actions'

const initialState = {
  id: '',
  authorized: false,
  loading: false,
  role: '',
  studentId: '',
}

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
