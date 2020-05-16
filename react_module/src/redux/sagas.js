import { all } from 'redux-saga/effects'
import user from './user/sagas'
import family from './family/sagas'
import menu from './menu/sagas'
import goals from './goals/sagas'
import staffs from './staffs/sagas'
import learners from './learners/sagas'
import settings from './settings/sagas'
import datarecording from './datarecording/sagas'
import sessionrecording from './sessionrecording/sagas'
import sessiontargetallocation from './sessiontargetallocation/sagas'

export default function* rootSaga() {
  yield all([
    user(),
    menu(),
    goals(),
    staffs(),
    family(),
    learners(),
    settings(),
    datarecording(),
    sessionrecording(),
    sessiontargetallocation(),
  ])
}
