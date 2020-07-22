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
/* eslint-disable object-shorthand */
/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-expressions */

import React from 'react'
import { Helmet } from 'react-helmet'
import {
    Layout,
    Row,
    Col,
    Card,
    Button,
    Typography,
} from 'antd'
import { Redirect } from 'react-router-dom'
import Authorize from 'components/LayoutComponents/Authorize'
import { connect } from 'react-redux'
import RightArea from './rightArea'
import LeftArea from './leftArea'


const { Title, Text } = Typography
const { Content } = Layout

@connect(({ user, cogniableassessment }) => ({ user, cogniableassessment }))
class Screeing extends React.Component {
    constructor(props) {
        super(props)

        this.state = {

        }
    }

    componentDidMount(){
        const {dispatch} = this.props
        const studentId = JSON.parse(localStorage.getItem('studentId'))
        dispatch({
            type: 'cogniableassessment/LOAD_DATA',
            payload: {
                studentId: studentId
            }
        })

    }

    render() {
        const {cogniableassessment: {loading}} = this.props

        const studId = localStorage.getItem('studentId')
        if (!studId){
            return <Redirect to="/" />
        }

        if(loading){
            return "Loading..."
        }

        return (
            <>
                <Helmet title="CogniAble Assessment" />
                <Layout style={{ padding: '0px' }}>
                    <Content
                        style={{
                            padding: '0px 20px',
                            maxWidth: 1300,
                            width: '100%',
                            margin: '0px auto',
                        }}
                    >
                        <Row>
                            <Col sm={8}>
                                <RightArea style={{marginRight: '10px'}} />
                            </Col>
                            <Col sm={16}>
                                <LeftArea />   
                            </Col>
                        </Row>
                    </Content>
                </Layout>
            </>
        )
    }
}

export default Screeing
