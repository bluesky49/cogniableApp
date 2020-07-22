/* eslint-disable react/no-unused-state */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable array-callback-return */
/* eslint-disable eqeqeq */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable no-plusplus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-unused-expressions */
/* eslint-disable prefer-template */
/* eslint-disable prefer-destructuring */
/* eslint-disable react/jsx-closing-tag-location */

import React, { Component } from 'react'
import { Card, Progress, Typography, Button, Icon } from 'antd'
import { connect } from 'react-redux'

const { Title, Text } = Typography

@connect(({ sessionrecording }) => ({ sessionrecording }))
class RecordingBlock extends Component {

    componentDidMount() {
        const { dispatch, sessionrecording: { TargetResponse, TargetActiveId } } = this.props
        dispatch({
            type: 'sessionrecording/SET_STATE',
            payload: {
                CurrentPeakBlock: TargetResponse[TargetActiveId].peak,
            }
        })
    }

    resetZero = () => {
        document.getElementById('peakResponseButtonZero').style.color = 'gray'
        document.getElementById('peakResponseButtonZero').style.backgroundColor = '#e4e9f0'
    }

    resetTwo = () => {
        document.getElementById('peakResponseButtonTwo').style.color = 'gray'
        document.getElementById('peakResponseButtonTwo').style.backgroundColor = '#e4e9f0'
    }

    resetFour = () => {
        document.getElementById('peakResponseButtonFour').style.color = 'gray'
        document.getElementById('peakResponseButtonFour').style.backgroundColor = '#e4e9f0'
    }

    resetEight = () => {
        document.getElementById('peakResponseButtonEight').style.color = 'gray'
        document.getElementById('peakResponseButtonEight').style.backgroundColor = '#e4e9f0'
    }

    resetTen = () => {
        document.getElementById('peakResponseButtonTen').style.color = 'gray'
        document.getElementById('peakResponseButtonTen').style.backgroundColor = '#e4e9f0'
    }

    resetCurrentBlockList = () => {

        this.resetZero();
        this.resetTwo();
        this.resetFour();
        this.resetEight();
        this.resetTen();

        const { dispatch, sessionrecording: { CurrentPeakBlock } } = this.props
        const temp = []
        CurrentPeakBlock.map((item, i) => {
            if (i !== 0) {
                temp.push(item)
            }
        })
        dispatch({
            type: 'sessionrecording/SET_STATE',
            payload: {
                CurrentPeakBlock: temp,
            }
        })


    }

    responseZero = () => {
        this.resetZero();
        this.resetTwo();
        this.resetFour();
        this.resetEight();
        this.resetTen();
        // document.getElementById('peakResponseButtonZero').style.color = '#FF8080'
        document.getElementById('peakResponseButtonZero').style.backgroundColor = '#FF8080'
    }

    responseTwo = () => {
        this.resetZero();
        this.resetTwo();
        this.resetFour();
        this.resetEight();
        this.resetTen();
        // document.getElementById('peakResponseButtonTwo').style.color = '#FF9C52'
        document.getElementById('peakResponseButtonTwo').style.backgroundColor = '#FF9C52'
    }

    responseFour = () => {
        this.resetZero();
        this.resetTwo();
        this.resetFour();
        this.resetEight();
        this.resetTen();
        // document.getElementById('peakResponseButtonFour').style.color = '#FF9C52'
        document.getElementById('peakResponseButtonFour').style.backgroundColor = '#FF9C52'
    }

    responseEight = () => {
        this.resetZero();
        this.resetTwo();
        this.resetFour();
        this.resetEight();
        this.resetTen();
        // document.getElementById('peakResponseButtonEight').style.color = '#FF9C52'
        document.getElementById('peakResponseButtonEight').style.backgroundColor = '#FF9C52'
    }

    responseTen = () => {
        this.resetZero();
        this.resetTwo();
        this.resetFour();
        this.resetEight();
        this.resetTen();
        // document.getElementById('peakResponseButtonTen').style.color = '#4BAEA0'
        document.getElementById('peakResponseButtonTen').style.backgroundColor = '#4BAEA0'
    }

    render() {

        const { sessionrecording: { TargetResponse, TargetActiveId, CurrentPeakBlock } } = this.props
        // const copylist = TargetResponse[TargetActiveId].peak
        let item = null
        if (CurrentPeakBlock.length > 0) {
            item = CurrentPeakBlock[0];
        }

        return (
            <>
                <div style={{ padding: '10px' }}>
                    <Title level={4} style={{ lineHeight: '27px', display: 'inline-block' }}>Stimulus: {item?.sd?.sd}</Title>
                    <span style={{ float: 'right', display: 'inline-block' }}>
                        Trial {11 - CurrentPeakBlock.length} / 10
                    </span>
                    <br />
                    <div style={{textAlign: 'center', marginTop: '20px'}}>
                        <Button
                            id="peakResponseButtonZero"
                            style={{
                                padding: '8px auto',
                                width: '70px',
                                height: '50px',
                                marginTop: '10px',
                                marginLeft: '5px',
                                marginRight: '5px',
                                backgroundColor: '#e4e9f0'

                            }}
                            onClick={() => this.responseZero()}
                        >
                            0
                        </Button>
                        <Button
                            id="peakResponseButtonTwo"
                            style={{
                                padding: '8px auto',
                                width: '70px',
                                height: '50px',
                                marginTop: '10px',
                                marginLeft: '5px',
                                marginRight: '5px',
                                backgroundColor: '#e4e9f0'
                            }}
                            onClick={() => this.responseTwo()}
                        >
                            2
                        </Button>
                        <Button
                            id="peakResponseButtonFour"
                            style={{
                                padding: '8px auto',
                                width: '70px',
                                height: '50px',
                                marginTop: '10px',
                                marginLeft: '5px',
                                marginRight: '5px',
                                backgroundColor: '#e4e9f0'
                            }}
                            onClick={() => this.responseFour()}
                        >
                            4
                        </Button>
                        <Button
                            id="peakResponseButtonEight"
                            style={{
                                padding: '8px auto',
                                width: '70px',
                                height: '50px',
                                marginTop: '10px',
                                marginLeft: '5px',
                                marginRight: '5px',
                                backgroundColor: '#e4e9f0'
                            }}
                            onClick={() => this.responseEight()}
                        >
                            8
                        </Button>
                        <Button
                            id="peakResponseButtonTen"
                            style={{
                                padding: '8px auto',
                                width: '70px',
                                height: '50px',
                                marginTop: '10px',
                                marginLeft: '5px',
                                marginRight: '5px',
                                backgroundColor: '#e4e9f0'
                            }}
                            onClick={() => this.responseTen()}
                        >
                            10
                        </Button>
                    </div>
                    <div style={{textAlign: 'right', marginTop: '20px'}}>
                        <Button><Icon type="left" /></Button>&nbsp;&nbsp;
                        <Button onClick={this.resetCurrentBlockList}><Icon type="right" /></Button>
                    </div>
                </div>
            </>
        )
    }
}
export default RecordingBlock
