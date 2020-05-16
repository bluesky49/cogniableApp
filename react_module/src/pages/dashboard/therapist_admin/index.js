import React from 'react'
import { Layout, Row, Col } from 'antd'
import { Helmet } from 'react-helmet'
import Authorize from 'components/LayoutComponents/Authorize'
import InfoCard from 'components/dashboard/InfoCard'
import doctorIcon from 'icons/doctor.png'
import parentCildIcon from 'icons/parentChild.png'
import safeGardIcon from 'icons/safeGard.png'
import LearnersCard from './LearnersCard'
import TargetStatusCard from './TargetStatusCard'
import AppiorMentsCard from './AppiorMentsCard'
import TasksCard from './TasksCard'

const { Content } = Layout

class DashboardAlpha extends React.Component {
  render() {
    return (
      <Authorize roles={['therapist']} redirect to="/dashboard/beta">
        <Helmet title="Dashboard Alpha" />
        <Layout style={{ backgroundColor: '#F2F4F8', padding: '0px' }}>
          <Content
            style={{
              padding: '0px',
              maxWidth: 1300,
              width: '100%',
              margin: '0px auto',
            }}
          >
            <Row style={{ width: '100%', margin: 0 }} gutter={[41, 0]}>
              <Col span={16} style={{ paddingLeft: 0 }}>
                <TargetStatusCard />
                <AppiorMentsCard style={{ marginTop: 13 }} />
                <TasksCard style={{ marginTop: 27 }} />
              </Col>
              <Col span={8} style={{ paddingRight: 0 }}>
                <LearnersCard />
              </Col>
            </Row>

            {/* Last Row */}
            <Row gutter={[45, 0]} style={{ marginTop: 41 }}>
              <Col xs={24} lg={8}>
                <InfoCard title="Acceptance & Commitment" icon={safeGardIcon} />
              </Col>
              <Col xs={24} lg={8}>
                <InfoCard title="Verified Doctors" icon={doctorIcon} />
              </Col>
              <Col xs={24} lg={8}>
                <InfoCard
                  title="Parent  Community"
                  icon={parentCildIcon}
                  style={{ marginRight: 0 }}
                />
              </Col>
            </Row>
          </Content>
        </Layout>
      </Authorize>
    )
  }
}

export default DashboardAlpha
