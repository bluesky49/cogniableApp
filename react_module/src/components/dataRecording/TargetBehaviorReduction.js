/* eslint-disable react/jsx-indent */
/* eslint-disable no-plusplus */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/button-has-type */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/no-unused-state */

import React from 'react'
import {Card, Button, Drawer, Form, Input, Select, Icon } from 'antd';
import Timer from 'react-compound-timer'

const layout = {
  labelCol: {
    span: 12,
  },
  wrapperCol: {
    span: 12,
  },
};

class TargetBehaviorReduction extends React.Component {

    state = {
        visible: false,
        irt: 0,
        frequency:0,
    }

    showDrawer = () => {
        this.setState({
            visible: true,
        });
    };
    
    onClose = () => {
        this.setState({
            visible: false,
        });
    };
    
    addIRT = (val) => {
        this.setState({
            irt: val+1
        })
    }

    removeIRT = (val) => {
        if (val > 0){
            this.setState({
                irt: val-1
            })
        }
    }

    addFrequency = (val) => {
        this.setState({
            frequency: val+1
        })
    }

    removeFrequency = (val) => {
        if (val > 0){
            this.setState({
                frequency: val-1
            })
        }
    }

    consoleTime = (time) => {
      console.log(time)
      const ts = new Date(time);
      console.log(ts.toLocaleTimeString());

    }
    
  render() {
      const {irt, frequency} = this.state;

    return (
        <>
                  <Form {...layout} style={{padding:'0 80px'}}>
                    <h6>IRT : {irt} <span style={{float:'right'}}><Button style={{width:"80px"}} onClick={() => this.removeIRT(irt)}><Icon type="minus" /></Button>&nbsp; <Button onClick={() => this.addIRT(irt)} style={{width:"80px"}}><Icon type="plus" /></Button></span></h6> <br />
                    <h6>Frequency : {frequency} <span style={{float:'right'}}><Button onClick={() => this.removeFrequency(frequency)} style={{width:"80px"}}><Icon type="minus" /></Button>&nbsp; <Button onClick={() => this.addFrequency(frequency)} style={{width:"80px"}}><Icon type="plus" /></Button></span></h6><br />
                    <Timer
                      initialTime={0}
                      startImmediately={false}
                        
                    >
                      {({ start, resume, pause, stop, reset, getTime }) => (
                            <React.Fragment>
                                <h6>Duration : 
                                  <span style={{marginLeft:'10px'}}>
                                    <Timer.Hours formatValue={(value) => `${(value < 10 ? `0${value}` : value)} : `} /> 
                                    <Timer.Minutes formatValue={(value) => `${(value < 10 ? `0${value}` : value)} : `} /> 
                                    <Timer.Seconds formatValue={(value) => `${(value < 10 ? `0${value}` : value)} `} /> 
                                  </span>
                                  <span style={{float:'right'}}>
                                    <Button onClick={start}><Icon type="caret-right" /></Button>
                                    {/* <Button onClick={pause}><Icon type="pause" /></Button> */}
                                    {/* <Button onClick={resume}>Resume</Button> */}
                                    <Button onClick={() => { this.consoleTime(getTime()); stop(); }}><Icon type="stop" /></Button>
                                    <Button onClick={reset}><Icon type="undo" /></Button>
                                  </span>
                                </h6>
                            </React.Fragment>
                        )}
                    </Timer>
                    <br />
                    <Timer
                      initialTime={0}
                      startImmediately={false}
                        
                    >
                      {({ start, resume, pause, stop, reset, getTime }) => (
                            <React.Fragment>
                                <h6>Total Duration : 
                                  <span style={{marginLeft:'10px'}}>
                                    <Timer.Hours formatValue={(value) => `${(value < 10 ? `0${value}` : value)} : `} /> 
                                    <Timer.Minutes formatValue={(value) => `${(value < 10 ? `0${value}` : value)} : `} /> 
                                    <Timer.Seconds formatValue={(value) => `${(value < 10 ? `0${value}` : value)} `} /> 
                                  </span>
                                  <span style={{float:'right'}}>
                                    <Button onClick={start}><Icon type="caret-right" /></Button>
                                    {/* <Button onClick={pause}><Icon type="pause" /></Button> */}
                                    {/* <Button onClick={resume}>Resume</Button> */}
                                    <Button onClick={() => { this.consoleTime(getTime()); stop(); }}><Icon type="stop" /></Button>
                                    <Button onClick={reset}><Icon type="undo" /></Button>
                                  </span>
                                </h6>
                            </React.Fragment>
                        )}
                    </Timer>


                    {/* <Form.Item label="" style={{marginBottom:'0'}}>
                      <Input placeholder="input placeholder" />
                      
                    </Form.Item> */}
                    <br />
                    <Form.Item label="Intensity" labelAlign="left">
                      <Select placeholder="Select intensity" style={{ width:'100%'}}>
                        <Select.Option value="mild">Mild</Select.Option>
                        <Select.Option value="in-therapy">In-Therapy</Select.Option>
                        <Select.Option value="in-maintenance">In-Maintenance</Select.Option>
                      </Select>
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary">Submit</Button>
                    </Form.Item>
                  </Form>
        </>
    )
  }
}

export default TargetBehaviorReduction
