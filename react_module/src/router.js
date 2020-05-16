import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'
import Loadable from 'react-loadable'

import Loader from 'components/LayoutComponents/Loader'
import IndexLayout from 'layouts'
import NotFoundPage from 'pages/404'

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
    path: '/user/otpVerification',
    component: loadable(() => import('pages/user/otpVerification')),
    exact: true,
  },

  // Dashboards
  {
    path: '/dashboard/clinic_admin',
    component: loadable(() => import('pages/dashboard/clinic_admin')),
  },
  {
    path: '/dashboard/therapist_admin',
    component: loadable(() => import('pages/dashboard/therapist_admin')),
  },

  // Partners
  {
    path: '/partners/laerners',
    component: loadable(() => import('components/Partners/Learners/LearnerForm')),
  },
  {
    path: '/partners/staff',
    component: loadable(() => import('views/StaffView')),
  },
  {
    path: '/partners/learner',
    component: loadable(() => import('views/LearnerView')),
  },
  {
    path: '/partners/viewlearners',
    component: loadable(() => import('pages/learners/view_learners')),
  },
  {
    path: '/partners/viewstaffs',
    component: loadable(() => import('pages/staffs/view_staffs')),
  },

  // targets
  {
    path: '/targets/suggest_target',
    component: loadable(() => import('pages/targets/TargetView')),
    exact: true,
  },
  {
    path: '/targets/suggest_target2',
    component: loadable(() => import('pages/targets/demo')),
    exact: true,
  },
  {
    path: '/targets/program',
    component: loadable(() => import('pages/program')),
  },
  {
    path: '/targets/program2',
    component: loadable(() => import('pages/program2')),
  },
  {
    path: '/targets/abc',
    component: loadable(() => import('pages/targets/ABC')),
  },
  {
    path: '/targets/allocation',
    component: loadable(() => import('pages/targets/targetAlocation')),
  },
  {
    path: '/targets/session_target',
    component: loadable(() => import('pages/session_target')),
  },
  {
    path: '/forms/intake',
    component: loadable(() => import('pages/intake')),
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
  },
  {
    path: '/targets/appointment',
    component: loadable(() => import('pages/appointment')),
  },
  // Table Responsive
  {
    path: '/therapy/tables',
    component: loadable(() => import('views/LearnerTable')),
  },
  // Target Type Mapping
  {
    path: '/therapy/targetmapping',
    component: loadable(() => import('views/TargetTypeMapping')),
  },
  // Data Recording
  {
    path: '/therapy/sessionrecording',
    component: loadable(() => import('views/DataRecording')),
  },
  {
    path: '/therapy/learnernamebinder/goals',
    component: loadable(() => import('views/Goals')),
  },
  // parent settings
  {
    path: '/parent/settings',
    component: loadable(() => import('views/ParentSettings')),
  },

  //
  {
    path: '/parent/familymember',
    component: loadable(() => import('views/FamilyMembers')),
  },

  {
    path: '/mealData/',
    component: loadable(() => import('pages/meal/index')),
  },
  {
    path: '/toiletData/',
    component: loadable(() => import('pages/ToiletData/index')),
  },
  {
    path: '/appointmentData/',
    component: loadable(() => import('pages/appointmentdata/index')),
  },
  {
    path: '/BehaviourData/',
    component: loadable(() => import('pages/BehaviourData/index')),
  },
  {
    path: '/mandData/',
    component: loadable(() => import('pages/mandData/index')),
  },
  // {
  //   path: '/family/',
  //   component: loadable(() => import('views/family')),
  // },
  {
    path: '/profileSetting/',
    component: loadable(() => import('pages/ProfileSetting/index')),
  },
  // {
  //   path: '/family/',
  //   component: loadable(() => import('views/family')),
  // },
  {
    path: '/medicalData/',
    component: loadable(() => import('pages/MadicalData/index')),
  },
  {
    path: '/toilet/',
    component: loadable(() => import('views/ToiletView')),
  },
  {
    path: '/decel/',
    component: loadable(() => import('views/decel')),
  },
  {
    path: '/mand/',
    component: loadable(() => import('views/MandData')),
  },
  // By me
  {
    path: '/dashboard/alpha/',
    component: loadable(() => import('views/parent/ParentDashboard/')),
  },
  {
    path: '/parent/sessionrecording',
    component: loadable(() => import('views/parent/videoSession')),
  },
  {
    path: '/family/',
    component: loadable(() => import('views/family/family')),
  },
  // clinic
  {
    path: '/cliniccariculam',
    component: loadable(() => import('pages/clinic/clinicCariculam')),
  },
  {
    path: '/targetsAllocationToSession/',
    component: loadable(() => import('pages/target_allocation_to_session')),
  },
  {
    path: '/target/allocation',
    component: loadable(() => import('pages/targets/targetAlocation')),
  },
  {
    path: '/sessionrecording',
    component: loadable(() => import('pages/sessionrecording')),
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
