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
    Form,
    Input,
    Select,
    Typography,
} from 'antd'
import { connect } from 'react-redux'


const { Title, Text } = Typography
const { TextArea } = Input
const { Option } = Select

@connect(({ user, cogniableassessment }) => ({ user, cogniableassessment }))
class Assessment extends React.Component {
    constructor(props) {
        super(props)

        this.state = {

        }
    }

    render() {

        return (
            <>
                {/* <Form
                    onSubmit={e => SubmitForm(e, this)}
                    name="control-ref"
                    style={{ marginLeft: 0, position: 'relative', ...style }}
                >
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Form.Item label="Date">
                            {form.getFieldDecorator('date', {
                                rules: [{ required: true, message: 'Please Select a Date!' }],
                            })(<DatePicker placeholder="Select Date" />)}
                        </Form.Item>
                    </div>

                    <Form.Item label="Intensity">
                        {form.getFieldDecorator('intensity', {
                            rules: [{ required: true, message: 'Please Select a intensity!' }],
                        })(
                            <Select style={{ width: '100%' }} placeholder="Select a Intensity" size="large">
                                <Option key={1} value="Severe">Severe</Option>
                            </Select>,
                        )}
                    </Form.Item>

                    <Form.Item label="Note">
                        {form.getFieldDecorator('note')(
                            <TextArea
                                style={{
                                    resize: 'none',
                                    width: '100%',
                                    height: 180,
                                }}
                            />,
                        )}
                    </Form.Item>

                    <Form.Item>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Button
                                type="primary"
                                htmlType="submit"
                                style={{
                                    width: 180,
                                    height: 40,
                                    background: '#0B35B3',
                                }}
                                loading={loading}
                            >
                                Save Data
                            </Button>
                        </div>
                    </Form.Item>
                </Form> */}
            </>
        )
    }
}

export default Form.create()(Assessment)

