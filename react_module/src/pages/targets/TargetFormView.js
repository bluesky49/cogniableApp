import React from 'react';
import { Helmet } from 'react-helmet'
import TargetForm from 'components/therapy/TargetForm'
import Authorize from 'components/LayoutComponents/Authorize'


class TargetFormView extends React.Component {
    render() {    
        return (
        
          <Authorize roles={['admin']} redirect to="/dashboard/beta">
            <Helmet title="Partner" />
            <div className="row justify-content-md-center">
              <div className="col-sm-7">
                <div className="card">
                  <div className="card-body">
                    <TargetForm />
                  </div>
                </div>
              </div>
            </div>
          </Authorize>
        
        )
      }
    }
export default TargetFormView
