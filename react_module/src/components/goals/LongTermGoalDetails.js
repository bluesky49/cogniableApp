/* eslint-disable react/no-unused-state */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-indent */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable no-nested-ternary */

import React from 'react'
import { Button, Icon, Empty} from 'antd';
import { connect } from 'react-redux'
import ShortTerm from './ShortTerm'
import EditLongTerm from './EditLongTerm'

@connect(({ goals }) => ({ goals }))
class LongTermDetails extends React.Component {
    constructor(props){
        super(props);

        this.state = {        
            visible: false,
            createGoal: false,
        }
    }

    showDrawer = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'goals/SET_STATE',
            payload:{
                LongTermDisplay: 'Edit LTG',
            }
        })
    };
    
    onClose = () => {
        this.setState({
            visible: false,
        });
    };

    showCreatGoal = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'goals/SET_STATE',
            payload:{
                LongTermDisplay: 'STG Form',
            }
        })
    };
    
    onCreateGoal = () => {
        this.setState({
            createGoal: false,
        });
    };

    showDetails = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'goals/SET_STATE',
            payload:{
                LongTermDisplay: 'LTG Details',
            }
        })
    }
      
      
    
  render() {
    const { goals:{LongTermDisplay, LongTermObject}} = this.props;

    return (
        <>
            
            
            <section className="card">
                <div className="card-header mb-2">
                    <div className="utils__title text-center">
                        <strong>Long Term Goal <span style={{float:"right"}}><Button onClick={this.showDrawer}><Icon type="edit" /></Button>&nbsp;<Button onClick={this.showCreatGoal}><Icon type="plus" /> STG</Button></span></strong>
                    </div>
                    <hr />
                </div>

                {LongTermDisplay === 'LTG Details'?

                    <div className="card-body">
                        
                        <h5 className="mb-3 text-black">
                            <strong>Goal Name : {LongTermObject.goalName} </strong>
                        </h5>
                        
                        <dl className="row">
                        <dt className="col-xl-3">Goal Description:</dt>
                        <dd className="col-xl-9">{LongTermObject.description ? LongTermObject.description : ""}</dd>
                        <dt className="col-xl-3">Date Initialted:</dt>
                        <dd className="col-xl-9">{LongTermObject.dateInitialted ? LongTermObject.dateInitialted : ""}</dd>
                        <dt className="col-xl-3">End Date:</dt>
                        <dd className="col-xl-9">{LongTermObject.dateEnd ? LongTermObject.dateEnd : ""}</dd>
                        <dt className="col-xl-3">Responsibility:</dt>
                        <dd className="col-xl-9">{LongTermObject.responsibility ? LongTermObject.responsibility.name : ""}</dd>
                        <dt className="col-xl-3">Goal Status:</dt>
                        <dd className="col-xl-9">{LongTermObject.goalStatus ? LongTermObject.goalStatus.status : ""}</dd>
                        </dl>
                    </div>
                
                :
                    LongTermDisplay === 'Edit LTG' ?

                        <div className="card-body">
                            <div className="row">
                                <div className="col-sm-12">
                                    <Button style={{float:"right"}} onClick={this.showDetails}>X</Button>
                                </div>
                            </div>
                            
                            <EditLongTerm />
                        </div>


                    :
                        LongTermDisplay === 'STG Form' ?

                            <div className="card-body">
                                <div className="row">
                                    <div className="col-sm-12">
                                        <Button style={{float:"right"}} onClick={this.showDetails}>X</Button>
                                    </div>
                                </div>
                                
                                <ShortTerm />
                            </div>


                        :
                    
                            <div className="card-body mb-2">
                                <div className="utils__title">
                                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                </div>
                            </div>

                }

            </section>
        </>
    )}
}

export default LongTermDetails
