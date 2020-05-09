import actions from './actions'

const initialState = {
  StaffList: [],
  loading: true,
  StaffProfile: null,
  isStaffProfile: false,
  UserRole: [],
  clinicLocationList: [],
}

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
