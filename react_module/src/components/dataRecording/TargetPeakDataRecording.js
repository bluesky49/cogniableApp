/* eslint-disable react/jsx-indent */
/* eslint-disable no-plusplus */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react/no-unused-state */

import React from 'react'
import {Card, Button, Drawer, Tooltip, Row, Col } from 'antd';
import { LeftOutlined,RightOutlined,CheckOutlined,CloseOutlined } from '@ant-design/icons';

class TargetPeakDataRecording extends React.Component {

    state = {
        count : 1,
        percentage: 0.0,
        correct: 0,
        incorrect: 0,
        showPromptOptions:true,
        totalTrails : 1,
        visible: false,

        sdName: ['stimulus one','stimulus two', 'stimulus three', 'stimulus four', 'stimulus five'],
        sdTrailCount:1,
        totalSd:5,
        sdCount:1,
        sdRequiredTrails:5,
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

    addCount(This, val){
        if (This.state.totalTrails > val){
            this.setState({
                count: val+1 ,
                percentage: ((This.state.correct+1)*100/This.state.count),
                correct: This.state.correct +1,
            })
            console.log(This.state.count, This.state.correct+1)
        }
        else{            
            this.setState({
                count: 1 ,
                percentage: 0.0,
                correct: 0,
                incorrect: 0,
                sdCount: This.state.sdCount+1,
                showPromptOptions: true 
            })
        }
    }

    showPrompt(){
        this.setState({
            showPromptOptions: false
        })

    }

    removeCount(This, val){
        if (This.state.totalTrails > val){
            this.setState({
                count:val+1,
                percentage: ((This.state.correct)*100/This.state.count), 
                incorrect: This.state.incorrect +1, 
                showPromptOptions: true          
            })
        }
        else{
            this.setState({
                count: 1 ,
                percentage: 0.0,
                correct: 0,
                incorrect: 0,
                sdCount: This.state.sdCount+1,
                showPromptOptions: true 
            })
        }
      
    }  

    promptCount(This, val){
        if (This.state.totalTrails > val){
            this.setState({
                count:val+1,
                percentage: ((This.state.correct)*100/This.state.count), 
                incorrect: This.state.incorrect +1, 
                showPromptOptions: true          
            })
        }
        else{
            this.setState({
                count: 1 ,
                percentage: 0.0,
                correct: 0,
                incorrect: 0,
                sdCount: This.state.sdCount+1,
                showPromptOptions: true 
            })
        }
      
    } 


    nextSd(This, sdCount){
        if (This.state.totalSd > sdCount){
            
            this.setState({
                sdCount: sdCount+1,
                count: 1,
            })
        }
    }

    previousSd(This, sdCount){
        if (This.state.sdCount > 1){
            
            this.setState({
                sdCount: sdCount-1,
                count: 1,
            })
        }
    }

    
    
    
  render() {
    const {count,correct, percentage, incorrect, showPromptOptions, totalTrails, sdName, sdCount, sdTrailCount, totalSd, sdRequiredTrails } = this.state;
    const correctIncorrectDiv = showPromptOptions ? {display:'block',textAlign:'center', marginTop:'30px'} : {display:'none'}
    const promptOptionsDiv = showPromptOptions ? {display:'none'} : {display:'block',textAlign:'center', marginTop:'40px'}
    let i = 0
    const spanList = []
    for (i=0; i< totalTrails;i++){   
        spanList.push(`spanStyle${i}`)
    }


    return (
        <>

            {/* <Card style={{ width: '100%', backgroundColor:'#fbfbfb'}}>
              <Card style={{ width: '96%', backgroundColor: 'white', margin:'10px auto', minHeight:"540px"}}>
                <h5 style={{textAlign:'center'}}><a onClick={this.showDrawer}>18.10060 - Sits in a small group for 10 minutes, attends to the teacher/material for 50% of the period</a></h5>
                <br />
                <span>{percentage} % Correct</span> <span style={{float:'right'}}>In-Therapy</span>
                <br /> */}
                <br />
                <p style={{textAlign:'center', marginTop:'-4px'}}>{sdName[sdCount-1]}</p>
                <Tooltip title="previous trail">
                  <Button style={{float:'left', marginLeft:'40px'}} onClick={()=>this.previousSd(this, sdCount)}><LeftOutlined /></Button>
                </Tooltip>
                
                <Tooltip title="next trail">
                  <Button style={{float:'right', marginRight:'40px'}} onClick={()=>this.nextSd(this, sdCount)}><RightOutlined /></Button>
                </Tooltip>
                
                <p style={{textAlign:'center', marginTop:'4px'}}>Stimulus {sdCount}/{totalSd}</p>
                <br />
                
                {/* <br /> */}
                <p style={correctIncorrectDiv}>
                  <Button id="correctResponseButton" style={{padding:'20px auto', marginRight:"5px", width:"70px", height:"50px"}} onClick={()=> this.addCount(this, count, correct)}>0</Button>
                  <Button id="correctResponseButton" style={{padding:'20px auto', marginRight:"5px", width:"70px", height:"50px"}} onClick={()=> this.addCount(this, count, correct)}>2</Button>
                  <Button id="correctResponseButton" style={{padding:'20px auto', marginRight:"5px", width:"70px", height:"50px"}} onClick={()=> this.addCount(this, count, correct)}>4</Button>
                  <Button id="correctResponseButton" style={{padding:'20px auto', marginRight:"5px", width:"70px", height:"50px"}} onClick={()=> this.addCount(this, count, correct)}>8</Button>
                  <Button id="incorrectResponseButton" style={{padding:'8px auto', width:"70px", height:"50px", marginTop:'10px'}} onClick={()=> this.showPrompt()}>10</Button> <br />
                </p>
                <p style={promptOptionsDiv}>
                  <Button style={{padding:'20px auto', width:"300px", height:"50px"}} onClick={()=> this.promptCount(this, count)}>Prompt 1</Button><br />
                  <Button style={{padding:'8px auto', width:"300px", height:"50px", marginTop:'10px'}} onClick={()=> this.promptCount(this, count)}>Prompt 2</Button><br />
                  <Button style={{padding:'8px auto', width:"300px", height:"50px", marginTop:'10px'}} onClick={()=> this.promptCount(this, count)}>Prompt 3</Button><br />
                  <Button style={{padding:'8px auto', width:"300px", height:"50px", marginTop:'10px'}} onClick={()=> this.promptCount(this, count)}>Prompt 4</Button><br />
                  <Button style={{padding:'8px auto', width:"300px", height:"50px", marginTop:'10px'}} onClick={()=> this.removeCount(this, count)}>No Response</Button>
                </p>
                <br />
                <div style={{border:'1px solid #f2f2f2', padding:'10px', borderRadius:'5px'}}>
                  <h6>Scoreboard</h6>
                  <br />
                  {sdName.map((item, key) => <Row><Col sm={4}><Button style={{padding:"0 10px"}}>Stimulus {key+1}</Button></Col> <Col sm={20}>: <Button style={{width:"40px", padding:"0 10px", backgroundColor:'#4BAEA0', color:'white'}}>10</Button><Button style={{width:"40px", padding:"0 10px", backgroundColor:'#FF8080', color:'white'}}>0</Button><Button style={{width:"40px", padding:"0 10px", backgroundColor:'#FF9C52', color:'white'}}>8</Button><Button style={{width:"40px", padding:"0 10px"}}></Button><Button style={{width:"40px", padding:"0 10px"}}></Button><Button style={{width:"40px", padding:"0 10px"}}></Button><Button style={{width:"40px", padding:"0 10px"}}></Button><Button style={{width:"40px", padding:"0 10px"}}></Button><Button style={{width:"40px", padding:"0 10px"}}></Button><Button style={{width:"40px", padding:"0 10px"}}></Button></Col></Row>)}
                </div>

                
              {/* </Card>


            </Card>
            <Drawer
              title={
                <>
                  <h5>Target Instructions</h5>
                  <Button style={{float:'right'}} onClick={this.onClose}>X</Button>
                </>
              }
              width={640}
              height={450}
              placement="bottom"
              closable={false}
              onClose={this.onClose}
              visible={this.state.visible}
              getContainer={false}
              style={{ position: 'absolute' }}
            >
              <p>Some contents...</p>
              <p>Some contents...</p>
              <p>Some contents...</p>
            </Drawer> */}
        </>
    )
  }
}

export default TargetPeakDataRecording
