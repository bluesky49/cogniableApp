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
  {
    path: '/dashboard/alpha/',
    component: loadable(() => import('pages/parent/ParentDashboard/')),
  },
  // Partners
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
    path: '/targets/program',
    component: loadable(() => import('pages/program')),
  },
  {
    path: '/targets/program2',
    component: loadable(() => import('pages/program2')),
  },
  {
    path: '/target/allocation',
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

  // Daily Vitals
  {
    path: '/mealData/',
    component: loadable(() => import('pages/meal/index')),
  },
  {
    path: '/toilet/',
    component: loadable(() => import('pages/ToiletData/index')),
  },
  {
    path: '/decel/',
    component: loadable(() => import('pages/BehaviourData/index')),
  },
  {
    path: '/mand/',
    component: loadable(() => import('pages/mandData/index')),
  },
  {
    path: '/medicalData/',
    component: loadable(() => import('pages/MedicalData/index')),
  },
  {
    path: '/family/',
    component: loadable(() => import('views/family/family')),
  },

  // Tutorials videos
  {
    path: '/tutorials/step1',
    component: loadable(() => import('pages/tutorials/step1')),
  },
  {
    path: '/tutorials/step2',
    component: loadable(() => import('pages/tutorials/step2')),
  },
  {
    path: '/tutorials/step3',
    component: loadable(() => import('pages/tutorials/step3')),
  },

  // Settings
  {
    path: '/profileSetting/',
    component: loadable(() => import('pages/ProfileSetting/index')),
  },

  // clinic
  {
    path: '/cliniccariculam',
    component: loadable(() => import('pages/clinicCariculam')),
  },
  {
    path: '/targetsAllocationToSession/',
    component: loadable(() => import('pages/target_allocation_to_session')),
  },
  {
    path: '/sessionrecording',
    component: loadable(() => import('pages/sessionrecording')),
  },
  {
    path: '/sessionsummary',
    component: loadable(() => import('pages/session_summary')),
    exact: true,
  },
  {
    path: '/sessionDetails',
    component: loadable(() => import('pages/sessionDetails/index')),
  },
  {
    path: '/partners/staffManagement',
    component: loadable(() => import('pages/StaffManagement/index')),
  },
  {
    path: '/appointmentData/',
    component: loadable(() => import('pages/appointmentdata/index')),
  },

  // Therapist Urls
  {
    path: '/therapistStudent',
    component: loadable(() => import('pages/tharepist_students')),
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
