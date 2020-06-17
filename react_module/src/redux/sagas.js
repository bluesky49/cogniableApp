import { all } from 'redux-saga/effects'
import user from './user/sagas'
import menu from './menu/sagas'
import tasks from './tasks/sagas'
import goals from './goals/sagas'
import family from './family/sagas'
import staffs from './staffs/sagas'
import student from './student/sagas'
import learners from './learners/sagas'
import settings from './settings/sagas'
import screening from './screening/sagas'
import sessionrecording from './sessionrecording/sagas'
import cogniableassessment from './cogniableassessment/sagas'
import sessiontargetallocation from './sessiontargetallocation/sagas'

export default function* rootSaga() {
  yield all([
    user(),
    menu(),
    tasks(),
    goals(),
    staffs(),
    family(),
    student(),
    learners(),
    settings(),
    screening(),
    sessionrecording(),
    cogniableassessment(),
    sessiontargetallocation(),
  ])
}
