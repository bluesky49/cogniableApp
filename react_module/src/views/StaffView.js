import React from 'react'
import { Helmet } from 'react-helmet'
// import { Tabs } from 'antd';
// import { Tabs,} from 'antd';
import StaffBasicInfo from 'components/staff/StaffBasicInfo'
// import CertificationDetails from 'components/staff/CertificationDetails'
// import HrDetails from 'components/staff/HrDetails'
// import CredentiallingInfo from 'components/staff/CredentiallingInfo'
import Authorize from 'components/LayoutComponents/Authorize'

class StaffView extends React.Component {
  render() {
    // const { TabPane } = Tabs;
    return (
      <Authorize roles={['school_admin']} redirect to="/dashboard/beta">
        <Helmet title="Partner" />
        {/* <div className="utils__title utils__title--flat mb-3">
              <strong className="text-uppercase font-size-16">Create Staff</strong>
            </div> */}
        <div className="row justify-content-md-center">
          <div className="col-sm-7">
            <div className="card">
              <div className="card-body">
                {/* <Tabs type="card">
                      <TabPane tab="Excel Upload" key="1">
                        Content of Tab Pane 1
                      </TabPane>
                      <TabPane tab="Basic Information" key="2">
                        <StaffBasicInfo />                        
                      </TabPane>
                      <TabPane tab="Hr Details" key="3">
                        <HrDetails />
                      </TabPane>
                      <TabPane tab="Certification Details" key="4">
                        <CertificationDetails />
                      </TabPane>
                      <TabPane tab="Credentialling Info" key="5">
                        <CredentiallingInfo />
                      </TabPane>
                    </Tabs> */}
                <h5>CREATE STAFF</h5>
                <hr />
                <br />
                <StaffBasicInfo />
              </div>
            </div>
          </div>
        </div>
      </Authorize>
    )
  }
}
export default StaffView
