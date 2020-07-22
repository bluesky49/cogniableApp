import actions from './actions'

const initialState = {
  loading: false,
  SelectedStep: 'step1',
  QuestionsList: [],
  StepsList: [],
  isFormLoading: false,
  showQuestions: false,
  ActiveIndex: 0,
  RecordedObject: null,
  QuestionsResponse: {},
  AreasResponse: {},
  InstructionVideos: null,
  Areas: []
}

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
