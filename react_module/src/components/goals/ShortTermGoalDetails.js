/* eslint-disable react/no-unused-state */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-indent */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable no-nested-ternary */

import React from 'react'
import { Drawer, Button, Icon, Empty} from 'antd';
import { connect } from 'react-redux'
import EditShortTerm from './EditShortTerm'
import SuggesTarget from './SuggestTarget'

@connect(({ goals }) => ({ goals }))
class ShortTermDetails extends React.Component {
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
                ShortTermDisplay: 'Edit STG',
            }
        })
        // this.setState({
        //     display: 'Edit STG',
        // });
    };
    
    onClose = () => {
        this.setState({
            visible: false,
        });
    };

    showCreatGoal = () => {
        this.setState({
            createGoal: true,
        });
    };
    
    onCreateGoal = () => {
        this.setState({
            createGoal: false,
        });
    };

    UpdateShortGoal = (result) =>{
        this.props.onEdit(result); 
    }

    showDetails = () => {
        // this.setState({
        //     display:'STG Details'
        // })
        const { dispatch } = this.props;
        dispatch({
            type: 'goals/SET_STATE',
            payload:{
                ShortTermDisplay: 'STG Details',
            }
        })
    }
    
  render() {
    const {goal, learnerId, goals:{ShortTermObject, ShortTermDisplay}} = this.props;
    const {display} = this.state;

    return (
        <>
            <section className="card">
                <div className="card-header mb-2">
                    <div className="utils__title text-center">
                        <strong>Short Term Goal <span style={{float:"right"}}><Button onClick={this.showDrawer}><Icon type="edit" /></Button>&nbsp;<Button onClick={this.showCreatGoal}><Icon type="plus" /> Allocate Targets</Button></span></strong>
                    </div>
                    <hr />
                </div>

                {ShortTermDisplay === 'STG Details' ? 
                    <div className="card-body">
                        
                        <h5 className="mb-3 text-black">
                            <strong>Goal Name : {ShortTermObject.goalName} </strong>
                        </h5>
                        
                        <dl className="row">
                        <dt className="col-xl-3">Goal Description:</dt>
                        <dd className="col-xl-9">{ShortTermObject.description ? ShortTermObject.description : ""}</dd>
                        <dt className="col-xl-3">Date Initialted:</dt>
                        <dd className="col-xl-9">{ShortTermObject.dateInitialted ? ShortTermObject.dateInitialted : ""}</dd>
                        <dt className="col-xl-3">End Date:</dt>
                        <dd className="col-xl-9">{ShortTermObject.dateEnd ? ShortTermObject.dateEnd : ""}</dd>
                        <dt className="col-xl-3">Responsibility:</dt>
                        <dd className="col-xl-9">{ShortTermObject.responsibility ? ShortTermObject.responsibility.name : ""}</dd>
                        <dt className="col-xl-3">Goal Status:</dt>
                        <dd className="col-xl-9">{ShortTermObject.goalStatus ? ShortTermObject.goalStatus.status : ""}</dd>
                        </dl>
                    </div>
                :

                    ShortTermDisplay === 'Edit STG' ?

                    <div className="card-body">
                        <div className="row">
                            <div className="col-sm-12">
                                <Button style={{float:"right"}} onClick={this.showDetails}>X</Button>
                            </div>
                        </div>
                        
                        <EditShortTerm />
                    </div>


                    :

                    <div className="card-body mb-2">
                        <div className="utils__title">
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        </div>
                    </div>
                }
            </section>
            <Drawer
                width="70%"
                title="Allocate Targets"
                placement="right"
                closable={false}
                onClose={this.onCreateGoal}
                visible={this.state.createGoal}
                getContainer={false}    
            >
                <SuggesTarget learnerId={learnerId} key={ShortTermObject.id} goal={ShortTermObject} />
            </Drawer>
        </>
    )}
}

export default ShortTermDetails
