import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import user from './user/reducers'
import menu from './menu/reducers'
import tasks from './tasks/reducers'
import goals from './goals/reducers'
import family from './family/reducers'
import staffs from './staffs/reducers'
import student from './student/reducers'
import settings from './settings/reducers'
import learners from './learners/reducers'
import screening from './screening/reducers'
import sessionrecording from './sessionrecording/reducers'
import cogniableassessment from './cogniableassessment/reducers'
import sessiontargetallocation from './sessiontargetallocation/reducers'

export default history =>
  combineReducers({
    router: connectRouter(history),
    user,
    menu,
    tasks,
    goals,
    staffs,
    family,
    student,
    learners,
    settings,
    screening,
    sessionrecording,
    cogniableassessment,
    sessiontargetallocation,
  })
