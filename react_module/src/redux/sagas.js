import { all } from 'redux-saga/effects'
import user from './user/sagas'
import family from './family/sagas'
import menu from './menu/sagas'
import settings from './settings/sagas'
import datarecording from './datarecording/sagas'
import goals from './goals/sagas'

export default function* rootSaga() {
  yield all([user(), menu(), settings(), datarecording(), goals(), family()])
}
