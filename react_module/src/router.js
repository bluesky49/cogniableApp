import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'
import Loadable from 'react-loadable'

import Loader from 'components/LayoutComponents/Loader'
import IndexLayout from 'layouts'
import NotFoundPage from 'pages/404'

import invCom from 'pages/Invoices'

const loadable = loader =>
  Loadable({
    loader,
    delay: false,
    loading: () => <Loader />,
  })

const routes = [
  // System Pages
  {
    path: '/user/login',
    component: loadable(() => import('pages/user/login')),
    exact: true,
  },
  {
    path: '/user/forgot',
    component: loadable(() => import('pages/user/forgot')),
    exact: true,
  },
  {
    path: '/user/signup',
    component: loadable(() => import('pages/user/signup')),
    exact: true,
  },
  {
    path: '/user/phone',
    component: loadable(() => import('pages/user/phone')),
    exact: true,
  },
  {
    path: '/user/forgotpass',
    component: loadable(() => import('pages/user/forgot/changepass')),
    exact: true,
  },
  {
    path: '/user/otpVerification',
    component: loadable(() => import('pages/user/otpVerification')),
    exact: true,
  },

  // Dashboards
  {
    path: '/dashboard/clinic_admin',
    component: loadable(() => import('pages/dashboard/clinic_admin')),
    exact: true,
  },
  {
    path: '/dashboard/therapist_admin',
    component: loadable(() => import('pages/dashboard/therapist_admin')),
    exact: true,
  },
  {
    path: '/dashboard/alpha/',
    component: loadable(() => import('pages/parent/ParentDashboard/')),
    exact: true,
  },
  // Partners
  {
    path: '/partners/viewlearners',
    component: loadable(() => import('pages/learners/view_learners')),
    exact: true,
  },
  {
    path: '/partners/viewstaffs',
    component: loadable(() => import('pages/staffs/view_staffs')),
    exact: true,
  },
  {
    path: '/partners/staffManagement',
    component: loadable(() => import('pages/StaffManagement')),
    exact: true,
  },

  {
    path: '/screenningData',
    component: loadable(() => import('pages/screenAssessment')),
    exact: true,
  },

  // targets
  {
    path: '/targets/program',
    component: loadable(() => import('pages/program')),
    exact: true,
  },
  {
    path: '/targets/program2',
    component: loadable(() => import('pages/program2')),
    exact: true,
  },
  {
    path: '/target/allocation',
    component: loadable(() => import('pages/targets/targetAlocation')),
    exact: true,
  },
  {
    path: '/targets/target_by_status',
    component: loadable(() => import('pages/graphs/targetByStatus')),
    exact: true,
  },
  {
    path: '/analytics/abagraph',
    component: loadable(() => import('pages/graphs/abagraph')),
    exact: true,
  },
  {
    path: '/analytics/timeline',
    component: loadable(() => import('pages/graphs/timeline')),
    exact: true,
  },
  {
    path: '/analytics/domainmastered',
    component: loadable(() => import('pages/graphs/domainmastered')),
    exact: true,
  },
  {
    path: '/targets/session_target',
    component: loadable(() => import('pages/session_target')),
    exact: true,
  },
  {
    path: '/analytics/report1',
    component: loadable(() => import('pages/graphs/report1')),
    exact: true,
  },
  {
    path: '/forms/intake',
    component: loadable(() => import('pages/intake')),
    exact: true,
  },

  // Course
  {
    path: '/course/courseview',
    component: loadable(() => import('pages/courseview')),
    exact: true,
  },
  {
    path: '/course/coursedetail/',
    component: loadable(() => import('pages/courseview/coursedetail')),
    exact: true,
  },

  // Edit Profile
  {
    path: '/partners/editprofile',
    component: loadable(() => import('components/UserProfile/EditProfile')),
    exact: true,
  },
  {
    path: '/targets/program_pdf',
    component: loadable(() => import('pages/program_pdf')),
    exact: true,
  },
  {
    path: '/targets/appointment',
    component: loadable(() => import('pages/appointment')),
    exact: true,
  },

  // Daily Vitals
  {
    path: '/mealData/',
    component: loadable(() => import('pages/meal/index')),
    exact: true,
  },
  {
    path: '/toilet/',
    component: loadable(() => import('pages/ToiletData/index')),
    exact: true,
  },
  {
    path: '/appointmentData/',
    component: loadable(() => import('pages/appointmentdata/index')),
    exact: true,
  },
  {
    path: '/decel/',
    component: loadable(() => import('pages/BehaviourData/index')),
    exact: true,
  },
  {
    path: '/mand/',
    component: loadable(() => import('pages/mandData/index')),
    exact: true,
  },
  {
    path: '/medicalData/',
    component: loadable(() => import('pages/MedicalData/index')),
    exact: true,
  },
  {
    path: '/family/',
    component: loadable(() => import('views/family/family')),
    exact: true,
  },
  {
    path: '/abc/',
    component: loadable(() => import('pages/abcData/index')),
    exact: true,
  },

  // Tutorials videos
  {
    path: '/tutorials/step1',
    component: loadable(() => import('pages/tutorials/step1')),
    exact: true,
  },
  {
    path: '/tutorials/step2',
    component: loadable(() => import('pages/tutorials/step2')),
    exact: true,
  },
  {
    path: '/tutorials/step3',
    component: loadable(() => import('pages/tutorials/step3')),
    exact: true,
  },

  // PEAK
  {
    path: '/peak',
    component: loadable(() => import('pages/PEAK')),
    exact: true,
  },
  {
    path: '/peakAssign',
    component: loadable(() => import('pages/PEAK/PeakAssign')),
    exact: true,
  },
  {
    path: '/peakResult/',
    component: loadable(() => import('pages/PEAK/PeakResult')),
    exact: true,
  },

  // Settings -- parent
  {
    path: '/profileSetting/',
    component: loadable(() => import('pages/ProfileSetting/index')),
    exact: true,
  },
  // staff
  {
    path: '/staffProfile/',
    component: loadable(() => import('pages/staffProfile')),
    exact: true,
  },
  // clinic
  {
    path: '/clinicProfile',
    component: loadable(() => import('pages/ClinicProfile')),
    exact: true,
  },

  // Progress Graph
  {
    path: '/progressGraph',
    component: loadable(() => import('pages/ProgressGraph')),
    exact: true,
  },
  // Daily response rate graph
  {
    path: '/dailyResponseRate',
    component: loadable(() => import('pages/DailyResponseRate')),
    exact: true,
  },
  // Sessions Graph
  {
    path: '/sessions',
    component: loadable(() => import('pages/Sessions')),
    exact: true,
  },
  // Goals Graph
  {
    path: '/goals',
    component: loadable(() => import('pages/Goals')),
    exact: true,
  },


  // community, doctors & commitments
  {
    path: '/parent/community',
    component: loadable(() => import('pages/community')),
    exact: true,
  },
  {
    path: '/chat',
    component: loadable(() => import('pages/chat')),
    exact: true,
  },
  {
    path: '/doctor',
    component: loadable(() => import('pages/doctor')),
    exact: true,
  },

  // Assessments
  {
    path: '/cogniableAssessment',
    component: loadable(() => import('pages/cogniableAssessment')),
    exact: true,
  },
  {
    path: '/cliniccariculam',
    component: loadable(() => import('pages/clinicCariculam')),
    exact: true,
  },
  {
    path: '/targetsAllocationToSession/',
    component: loadable(() => import('pages/target_allocation_to_session')),
    exact: true,
  },
  {
    path: '/sessionrecording',
    component: loadable(() => import('pages/sessionrecording')),
    exact: true,
  },
  {
    path: '/sessionsummary',
    component: loadable(() => import('pages/session_summary')),
    exact: true,
  },
  {
    path: '/sessionDetails',
    component: loadable(() => import('pages/sessionDetails/index')),
    exact: true,
  },
  {
    path: '/viewTask',
    component: loadable(() => import('pages/Tasks/view_Task')),
    exact: true,
  },

  {
    path: '/invoices',
    component: invCom,
    exact: true,
  },


  // Therapist Urls 
  // Program
  {
    path: '/therapistStudent',
    component: loadable(() => import('pages/tharepist_students')),
    exact: true,
  },
  // Program Daily Vitals
  {
    path: '/therapistStudentDailyVitals',
    component: loadable(() => import('pages/tharepist_students/ProgramDailyVitals')),
    exact: true,
  },
  // Program Sessions
  {
    path: '/therapistStudentSessions',
    component: loadable(() => import('pages/tharepist_students/ProgramSession')),
    exact: true,
  },
  // Program Graphs
  {
    path: '/therapistStudentGraphs',
    component: loadable(() => import('pages/tharepist_students/ProgramGraphs')),
    exact: true,
  },
  // Program Assessments
  {
    path: '/therapistStudentAssessments',
    component: loadable(() => import('pages/tharepist_students/ProgramAssessments')),
    exact: true,
  },
  {
    path: '/workdone',
    component: loadable(() => import('pages/WorkDone/index')),
  },

  // VB-MAPP urls
  {
    path: '/therapy/vbmapps/new',
    component: loadable(() => import('pages/vbmapps/new')),
    exact: true,
  },
  {
    path: '/therapy/vbmapps/list',
    component: loadable(() => import('pages/vbmapps/assessmentsList')),
    exact: true,
  },
  {
    path: '/therapy/vbmapps/milestonesGroups',
    component: loadable(() => import('pages/vbmapps/milestonesGroups')),
    exact: true,
  },
  {
    path: '/therapy/vbmapps/barriersGroups',
    component: loadable(() => import('pages/vbmapps/barriersGroups')),
    exact: true,
  },
  {
    path: '/therapy/vbmapps/eesaGroups',
    component: loadable(() => import('pages/vbmapps/eesaGroups')),
    exact: true,
  },
  {
    path: '/therapy/vbmapps/taskGroups',
    component: loadable(() => import('pages/vbmapps/taskGroups')),
    exact: true,
  },
  {
    path: '/therapy/vbmapps/transitionGroups',
    component: loadable(() => import('pages/vbmapps/transitionGroups')),
    exact: true,
  },

]

class Router extends React.Component {
  render() {
    const { history } = this.props
    return (
      <ConnectedRouter history={history}>
        <IndexLayout>
          <Switch>
            <Route exact path="/" render={() => <Redirect to="/user/login" />} />
            {routes.map(route => (
              <Route
                path={route.path}
                component={route.component}
                key={route.path}
                exact={route.exact}
              />
            ))}
            <Route component={NotFoundPage} />
          </Switch>
        </IndexLayout>
      </ConnectedRouter>
    )
  }
}

export default Router
