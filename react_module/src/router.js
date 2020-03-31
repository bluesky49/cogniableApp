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

  // Dashboards
  {
    path: '/dashboard/clinic_admin',
    component: loadable(() => import('pages/dashboard/clinic_admin')),
  },

    // Partners
  {
    path: '/partners/laerners',
    component: loadable(() => import('components/Partners/Learners/LearnerForm'))
  },
  {
    path: '/partners/staff',
    component: loadable(() => import('views/StaffView'))
  },
  {
    path: '/partners/learner',
    component: loadable(() => import('views/LearnerView'))
  },
  {
    path: '/partners/viewlearners',
    component: loadable(() => import('pages/learners/view_learners'))
  },
  {
    path: '/partners/viewstaffs',
    component: loadable(() => import('views/StaffTable'))
  },

// Targets

    {
      path: '/targets/suggest_target',
      component: loadable(() => import('pages/targets/TargetView')),
      exact: true,
    },


  // Edit Profile
  {
    path: '/partners/editprofile',
    component: loadable(() => import('components/UserProfile/EditProfile'))
  },
  // Table Responsive
  {
    path: '/therapy/tables',
    component: loadable(() => import('views/LearnerTable'))
  },
  // Target Type Mapping
  {
    path: '/therapy/targetmapping',
    component: loadable(() => import('views/TargetTypeMapping'))
  },
  // Data Recording
  {
    path: '/therapy/sessionrecording',
    component: loadable(() => import('views/DataRecording'))
  }

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
