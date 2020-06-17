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

@connect(({ user }) => ({ user }))
class RightArea
 extends React.Component {
    constructor(props) {
        super(props)

        this.state = {

        }
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
                <div
                    style={cardStyle}
                >
                    <Text style={textStyle}>Start New Assessment</Text>
                </div>

                <AssessmentForm />
                
            </div>
        </>
    )
}
}

export default RightArea

