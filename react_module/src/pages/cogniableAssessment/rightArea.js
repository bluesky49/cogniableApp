/* eslint-disable react/no-unused-state */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable no-underscore-dangle */
/* eslint-disable eqeqeq */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable no-plusplus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-useless-concat */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable no-var */
/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-expressions */

import React from 'react'
import {
    Row,
    Col,
    Card,
    Button,
    Typography,
} from 'antd'
import { connect } from 'react-redux'
import AssessmentForm from './AssessmentForm'


const { Title, Text } = Typography

@connect(({ user, cogniableassessment }) => ({ user, cogniableassessment }))
class RightArea
 extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            newAssessment: false,

        }
    }

    closeForm = (val) => {
        this.setState({
            newAssessment: val
        })
    }

    loadAssessment = id => {
        const {dispatch} = this.props
        dispatch({
            type: 'cogniableassessment/LOAD_ASSESSMENT_OBJECT',
            payload: {
                objectId: id
            }
        })
    }

render() {

    const cardStyle = {
        background: '#FFFFFF',
        border: '1px solid #E4E9F0',
        boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
        borderRadius: 10,
        padding: '16px 12px',
        alignItems: 'center',
        display: 'block',
        width: '100%',
        marginBottom: '20px',
        lineHeight: '27px',
        curser: 'pointer',
    }

    const selectedCardStyle = {
        background: '#E58425',
        border: '1px solid #E4E9F0',
        color: '#fff',
        boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
        borderRadius: 10,
        padding: '16px 12px',
        alignItems: 'center',
        display: 'block',
        width: '100%',
        marginBottom: '20px',
        lineHeight: '27px'
    }

    const textStyle = {
        fontSize: '14px',
        lineHeight: '19px',
        fontWeight: 600,
    }

    const titleStyle = {
        fontSize: '20px',
        lineHeight: '27px',
        marginTop: '5px',
    }

    const selectedTextStyle = {
        fontSize: '14px',
        lineHeight: '19px',
        fontWeight: 600,
        color: '#fff'
    }

    const selectedTitleStyle = {
        fontSize: '20px',
        lineHeight: '27px',
        marginTop: '5px',
        color: '#fff'
    }

    const {newAssessment} = this.state
    const {cogniableassessment:{ AssessmentList, AssessmentObject}} = this.props

    return (
        <>
            <div
                style={{
                    background: '#F9F9F9',
                    borderRadius: 10,
                    padding: '28px 27px 20px',
                    display: 'block',
                    width: '100%',
                    minHeight: '650px',
                }}
            >
                
                {newAssessment ? 
                    <AssessmentForm closeAssessmentForm={this.closeForm} />    
                
                :
                    <>
                        <div
                            style={{marginBottom: '20px'}}
                        >
                            <Button 
                                type="primary"
                                onClick={() => this.setState({newAssessment: true})}
                                style={{
                                    width: '100%',
                                    height: 40,
                                    background: '#0B35B3',
                                    boxShadow: '0px 2px 4px rgba(96, 97, 112, 0.16), 0px 0px 1px rgba(40, 41, 61, 0.04) !importent',
                                    borderRadius: 8,
                                    fontSize: 17,
                                    fontWeight: 'bold',
                                    marginTop: 10,
                                }}
                            >
                                Start New Assessment
                            </Button>

                        </div>
                        {AssessmentList.map((item) => 
                            <div
                                style={AssessmentObject?.id === item.node.id ? selectedCardStyle : cardStyle}
                            >
                                <Button type="link" onClick={() => this.loadAssessment(item.node.id)}><Text style={textStyle}>{item.node.name ? item.node.name : item.node.id}</Text></Button>
                            </div>
                        )}

                        {/* <div
                            style={cardStyle}
                        >
                            <Button 
                                type="link" 
                                onClick={() => this.loadAssessment('Q29nbmlhYmxlQXNzZXNzbWVudFR5cGU6NTc=')} 
                            >
                                <Text style={textStyle}>Demo Assessment</Text>
                            </Button>
                        </div> */}
                    </>
                }
                
                
            </div>
        </>
    )
}
}

export default RightArea

