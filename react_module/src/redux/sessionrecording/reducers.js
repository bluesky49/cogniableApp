/* eslint-disable no-useless-computed-key */
import actions from './actions'

const initialState = {
  loading: true,
  MasterSession: null,
  ChildSession: null,
  TargetResponse: {},
  RecordingType: 'Target',
  SessionStatus: 'Pending',
  StepActiveIndex: 0,
  StepActiveId: '',
  StimulusActiveIndex: 0,
  StimulusActiveId: '',
  TargetActiveIndex: 0,
  TargetActiveId: '',
  Count: 1,
  CorrectCount: 0,
  IncorrectCount: 0,
  // session id
  SessionId: '',

  PromptCodesList: [],
  // holding trial start time
  TrialStartTime: 0,
  // for disabled target recording block
  Disabled: true,
  // for storing session clock time for api calls
  CurrentSessionTime: 0,
}

export default function sessionrecordingReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    case actions.UPDATE_FIRST_TARGET_RESPONSE:
      return {
        ...state,
        TargetResponse: {
          ...state.TargetResponse,
          [action.payload.object.targets.id]: {
            ...state.TargetResponse[action.payload.object.targets.id],
            skillsId: action.payload.object.id,
            startTime: action.payload.object.durationStart,
            endTime: action.payload.object.durationEnd,
          },
        },
      }
    default:
      return state
  }
}
