import actions from './actions'

const initialState = {
  loading: true,
  MasterSession: null,
  ChildSession: null,
  TargetResponse: null,
  RecordingType: 'Target',
  SessionStatus: '',
  StepActiveIndex: 0,
  StepActiveId: '',
  StimulusActiveIndex: 0,
  StimulusActiveId: '',
  TargetActiveIndex: 0,
  TargetActiveId: '',
  Count: 1,
  CorrectCount: 0,
  IncorrectCount: 0,
}

export default function sessionrecordingReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
