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
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable camelcase */
/* eslint-disable prefer-const */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable prefer-template */

import React from 'react'
import {
    Row,
    Col,
    Card,
    Button,
    Typography,
    Affix,
} from 'antd'
import { connect } from 'react-redux'
import { ResponsivePie } from '@nivo/pie'
import { gql } from 'apollo-boost'
import client from '../../apollo/config'

var moment = require('moment');

const { Title, Text } = Typography

class LeftArea extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            GraphData: [],
            statusselected: null
        }
    }

    componentWillMount() {
        let { start_date, end_date, selectedprogram, domainSelected, statusselected } = this.props;

        start_date = moment(start_date).format('YYYY-MM-DD');
        end_date = moment(end_date).format('YYYY-MM-DD');
        const studentId = localStorage.getItem('studentId')

        client.query({
            query: gql`{
                domainPercentage(student: ${studentId}, dateGte:"${start_date}", dateLte:"${end_date}", programArea:"${selectedprogram}", targetStatus:"${statusselected}"){
                    id
                    domain
                    tarCount
                }
            }`,
            fetchPolicy: "network-only"
        })
        .then(result => {
            let data = []
            for (let i in result.data.domainPercentage) {
                if (result.data.domainPercentage[i].tarCount > 0){
                    data.push({
                        "id": result.data.domainPercentage[i].id,
                        "label": result.data.domainPercentage[i].domain,
                        "value": result.data.domainPercentage[i].tarCount
                    })
                }
            }
            console.log(result)
            this.setState({
                GraphData: data
            })
        })
    }

    render() {
        const textStyle = {
            fontSize: '16px',
            lineHeight: '19px',
        }

        const { GraphData } = this.state;

        return (
            <>
                <div
                    role="presentation"
                    style={{
                        borderRadius: 10,
                        border: '2px solid #F9F9F9',
                        // padding: '28px 27px 20px',
                        display: 'block',
                        // marginLeft: '10px',
                        width: '100%',
                        height: '450px',
                        // overflowY: 'auto'
                    }}
                >
                    {GraphData &&
                        <ResponsivePie
                            data={GraphData}
                            // sliceLabel="value2"
                            margin={{ top: 40, right: 80, bottom: 80, left: 0 }}
                            innerRadius={0.5}
                            padAngle={2}
                            cornerRadius={3}
                            colors={{ scheme: 'paired' }}
                            borderWidth={1}
                            borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                            radialLabel={function(e){return e.label+" ("+e.value+")"}}
                            radialLabelsSkipAngle={10}
                            radialLabelsTextXOffset={6}
                            radialLabelsTextColor="#333333"
                            radialLabelsLinkOffset={0}
                            radialLabelsLinkDiagonalLength={16}
                            radialLabelsLinkHorizontalLength={24}
                            radialLabelsLinkStrokeWidth={1}
                            radialLabelsLinkColor={{ from: 'color' }}
                            slicesLabelsSkipAngle={10}
                            slicesLabelsTextColor="#333333"
                            animate={true}
                            motionStiffness={90}
                            motionDamping={15}
                            defs={[
                                {
                                    id: 'dots',
                                    type: 'patternDots',
                                    background: 'inherit',
                                    color: 'rgba(255, 255, 255, 0.3)',
                                    size: 4,
                                    padding: 1,
                                    stagger: true
                                },
                                {
                                    id: 'lines',
                                    type: 'patternLines',
                                    background: 'inherit',
                                    color: 'rgba(255, 255, 255, 0.3)',
                                    rotation: -45,
                                    lineWidth: 6,
                                    spacing: 10
                                }
                            ]}
                            legends={[
                                {
                                    anchor: 'right',
                                    direction: 'column',
                                    translateY: 20,
                                    translateX: -1,
                                    itemWidth: 100,
                                    itemHeight: 25,
                                    itemTextColor: '#999',
                                    symbolSize: 18,
                                    symbolShape: 'circle',
                                    effects: [
                                        {
                                            on: 'hover',
                                            style: {
                                                itemTextColor: '#000'
                                            }
                                        }
                                    ]
                                }
                            ]}
                        />}
                </div>
            </>
        )
    }
}

export default LeftArea
