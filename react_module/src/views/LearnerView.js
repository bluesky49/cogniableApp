import React from 'react'
import { Helmet } from 'react-helmet'
import BasicInformationForm from 'components/learner/BasicInformationForm'
// import InsuranceForm from 'components/learner/InsuranceForm'
// import IntakeForm from 'components/learner/IntakeForm'
// import HealthForm from 'components/learner/HealthForm'
// import ExcelUpload from 'components/learner/ExcelUpload'

// import { Tabs } from 'antd';
import Authorize from 'components/LayoutComponents/Authorize'
// import style from '../learnerform.scss'

class LearnerView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };

  }

  render() {
    // const { TabPane } = Tabs;
    return (
      <Authorize roles={["school_admin"]} redirect to="/dashboard/beta">
        <Helmet title="Partner" />
        {/* <div className="utils__title utils__title--flat mb-3">
          <strong className="text-uppercase font-size-16">Create Learner</strong>
        </div> */}
        <div className="row justify-content-md-center">
          <div className="col-sm-7">
            <div className="card">
              <div className="card-body">

                {/* <Tabs type="card">
                  <TabPane tab="Excel Upload" key="1">
                    <br />
                    <ExcelUpload />
                  </TabPane>
                  <TabPane tab="Basic Details" key="2">
                    <BasicInformationForm />
                  </TabPane>
                  <TabPane tab="Insurance Details" key="3">
                    <InsuranceForm />
                  </TabPane>
                  <TabPane tab="Health Details" key="4">
                    <HealthForm />
                  </TabPane>
                  <TabPane tab="Intake Form" key="5">
                    <IntakeForm />
                  </TabPane>
                  <TabPane tab="Settings" key="6">
                    Content of Tab Pane 3
                  </TabPane>
                </Tabs> */}

                <h5>CREATE LEARNER</h5>
                <hr />
                <br />
                <BasicInformationForm />


              </div>
            </div>
          </div>
        </div>
      </Authorize>
    )
  }
}

export default LearnerView
