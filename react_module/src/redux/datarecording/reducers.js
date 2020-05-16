import actions from './actions'

const initialState = {
  TargetList: [],
  TargetInitialValue: 1,
  TargetListLength: 0,
  TargetActiveKey: '',
  TargetsResponse: {},
  SdResponse: {},
  StepResponse: {},
  Correct: [],
  Incorrect: [],
  StimulusActiveKey: '',
  StimulusActiveIndex: 1,
  StepActiveKey: '',
  StepActiveIndex: 1,
  RecordingType: 'Target',
  SessionStatus: 'NotStarted',

  count: 1,
  percentage: 0.0,
  correct: 0,
  incorrect: 0,
}

export default function datarecordingReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    case actions.UPDATE_RESPONSE:
      return {
        ...state,
        TargetsResponse: {
          ...state.TargetsResponse,
          [action.payload.id]: [
            ...state.TargetsResponse[action.payload.id].slice(0, action.payload.index),
            action.payload.response,
            ...state.TargetsResponse[action.payload.id].slice(action.payload.index),
          ],
        },
      }
    case actions.UPDATE_CORRECT_LIST:
      return {
        ...state,
        Correct: [
          ...state.Correct.slice(0, action.payload.index),
          action.payload.valueCorrect,
          ...state.Correct.slice(action.payload.index),
        ],
        Incorrect: [
          ...state.Incorrect.slice(0, action.payload.index),
          action.payload.valueInCorrect,
          ...state.Incorrect.slice(action.payload.index),
        ],
      }
    case actions.UPDATE_SD_RESPONSE:
      return {
        ...state,
        SdResponse: {
          ...state.SdResponse,
          [action.payload.id]: [
            ...state.SdResponse[action.payload.id].slice(0, action.payload.index),
            action.payload.response,
            ...state.SdResponse[action.payload.id].slice(action.payload.index),
          ],
        },
      }
    case actions.UPDATE_STEP_RESPONSE:
      return {
        ...state,
        StepResponse: {
          ...state.StepResponse,
          [action.payload.id]: [
            ...state.StepResponse[action.payload.id].slice(0, action.payload.index),
            action.payload.response,
            ...state.StepResponse[action.payload.id].slice(action.payload.index),
          ],
        },
      }
    default:
      return state
  }
}
