import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import user from './user/reducers'
import family from './family/reducers'
import menu from './menu/reducers'
import settings from './settings/reducers'
import datarecording from './datarecording/reducers'
import goals from './goals/reducers'
import learners from './learners/reducers'
import staffs from './staffs/reducers'
import sessiontargetallocation from './sessiontargetallocation/reducers'
import sessionrecording from './sessionrecording/reducers'

export default history =>
  combineReducers({
    router: connectRouter(history),
    user,
    menu,
    settings,
    datarecording,
    goals,
    family,
    learners,
    staffs,
    sessiontargetallocation,
    sessionrecording,
  })
