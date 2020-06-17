/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable no-shadow */
import React from 'react'
import { Redirect } from 'react-router-dom'
import { Typography } from 'antd'
import profileImg from './img/profile.jpg'
import brainImg from '../../images/brain.png'
import mandImg from '../../images/mand.png'
import mealImg from '../../images/meal.png'
import toiletImg from '../../images/toilet.png'
import medicalImg from '../../images/medical.png'

const { Title, Text } = Typography

const DailyVitalsCard = () => {

    const cardStyle = {
        background: '#FFFFFF',
        border: '1px solid #E4E9F0',
        boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
        borderRadius: 10,
        padding: '16px 12px',
        display: 'flex',
        alignItems: 'center',
        marginBottom: '10px'
    }

    return (
        <div
            style={{
                background: '#F9F9F9',
                borderRadius: 10,
                padding: '28px 27px 20px',
            }}
        >
            <Title
                style={{
                    fontSize: 20,
                    lineHeight: '27px',
                }}
            >
                Daily Vitals
            </Title>
            <a href="/#/mealData/">
                <div style={cardStyle}>
                    <img 
                        style={{
                            marginRight: '10px',
                            height: '40px'
                        }}
                        src={mealImg}
                        alt=""
                    />
                    <Text style={{ fontSize: 20, lineHeight: '27px', }}>Meal Data</Text>
                </div>
            </a>
            <a href="/#/decel/">
                <div style={cardStyle}>
                    <img 
                        style={{
                            marginRight: '10px',
                            height: '40px'
                        }}
                        src={brainImg}
                        alt=""
                    />
                    <Text style={{ fontSize: 20, lineHeight: '27px', }}>Behavior Data</Text>
                </div>
            </a>
            <a href="/#/medicalData/">
                <div style={cardStyle}>
                    <img 
                        style={{
                            marginRight: '10px',
                            height: '40px'
                        }}
                        src={medicalImg}
                        alt=""
                    />
                    <Text style={{ fontSize: 20, lineHeight: '27px', }}>Medical Data</Text>
                </div>
            </a>
            <a href="/#/mand/">
                <div style={cardStyle}>
                    <img 
                        style={{
                            marginRight: '10px',
                            height: '40px'
                        }}
                        src={mandImg}
                        alt=""
                    />
                    <Text style={{ fontSize: 20, lineHeight: '27px', }}>Mand Data</Text>
                </div>
            </a>
            <a href="/#/toilet/">
                <div style={cardStyle}>
                    <img 
                        style={{
                            marginRight: '10px',
                            height: '40px'
                        }}
                        src={toiletImg}
                        alt=""
                    />
                    <Text style={{ fontSize: 20, lineHeight: '27px', }}>Toilet Data</Text>
                </div>
            </a>
        </div>
    )
}

export default DailyVitalsCard
