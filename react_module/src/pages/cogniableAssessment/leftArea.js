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


const { Title, Text } = Typography

@connect(({ user }) => ({ user }))
class LeftArea extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            
        }
    }

render() {
    const textStyle = {
        fontSize: '16px',
        lineHeight: '19px',
    }
    

    return (
        <>
            <div
                role="presentation"
                style={{
                    borderRadius: 10,
                    border: '2px solid #F9F9F9',
                    padding: '28px 27px 20px',
                    marginBottom: '2%',
                    display: 'block',
                    marginLeft: '10px',
                    width: '100%',
                    height: '650px',
                    overflow: 'auto'
                }}
            >
                
                
                <p>left side</p>
                
            </div>
        </>
    )
}
}

export default LeftArea
