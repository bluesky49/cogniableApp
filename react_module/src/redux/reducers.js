import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import user from './user/reducers'
import family from './family/reducers'
import menu from './menu/reducers'
import settings from './settings/reducers'
import datarecording from './datarecording/reducers'
import goals from './goals/reducers'

export default history =>
  combineReducers({
    router: connectRouter(history),
    user,
    menu,
    settings,
    datarecording,
    goals,
    family,
  })
