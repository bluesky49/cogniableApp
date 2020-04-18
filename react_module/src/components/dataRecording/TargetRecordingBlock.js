/* eslint-disable react/jsx-indent */
/* eslint-disable no-plusplus */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable array-callback-return */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable no-nested-ternary */
/* eslint-disable eqeqeq */
/* eslint-disable spaced-comment */
/* eslint-disable no-var */
/* eslint-disable vars-on-top */

import React from 'react'
import { Card, Button, Drawer, Empty, notification, Icon, Collapse, Row, Col } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { connect } from 'react-redux'
import { gql } from "apollo-boost";
import moment from 'moment';
import client from '../../apollo/config'

import style from './style.module.scss'

import TargetBehaviorReduction from './TargetBehaviorReduction'
import TargetPeakDataRecording from './TargetPeakDataRecording'

const {Panel} = Collapse;

@connect(({ datarecording }) => ({ datarecording }))
class TargetRecordingBlock extends React.Component {

  state = {
    // count: 1,
    // percentage: 0.0,
    // correct: 0,
    // incorrect: 0,
    showPromptOptions: true,
    visible: false,

    recordingType : 'Target',

    promptCodesList: [],
    saveButton: true
  }

  componentDidMount() {

    client.query({
      query: gql`{
        promptCodes {
          id,
          promptName 
        }
      }`
    })
    .then(result => {
        this.setState({
          promptCodesList: result.data.promptCodes,
        })
    })
    .catch(error => { 
      return notification.error({
        message: 'Somthing want wrong getting prompt codes',
      }); 
    });

  }


  resetTrailsBoxStyle = () => {
    let i = 0;
    const elements = document.getElementsByClassName("tarilSpanClass");
    for (i = 0; i < elements.length; i++) {
        elements[i].style.backgroundColor = "#F5F5F5";
    }


  }


  resetCorrectIncorrectButtonStyle = () => {

    var element = document.getElementById("correctResponseButton");
 
    //If it isn't "undefined" and it isn't "null", then it exists.
    if(typeof(element) != 'undefined' && element != null){
      document.getElementById("correctResponseButton").style.color = "gray";
      document.getElementById("correctResponseButton").style.borderColor = "#e4e9f0";
      document.getElementById("incorrectResponseButton").style.color = "gray";
      document.getElementById("incorrectResponseButton").style.borderColor = "#e4e9f0";
    } else{
        console.log('not exits buttons')
    }

    
  }


  resetPercentage = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'datarecording/SET_STATE',
      payload: {
        count: 1,
        percentage: 0.0,
        correct: 0,
        incorrect: 0,
      }
    })
    
  }

  closePromptOptions = () => {
    this.setState({
      showPromptOptions: true
    })
    
  }

  addCorrectTrail = (val) => {
    document.getElementById(`spanStyle${val - 1}`).style.backgroundColor = "#4BAEA0";
    document.getElementById("correctResponseButton").style.color = "#4BAEA0";
    document.getElementById("correctResponseButton").style.borderColor = "#4BAEA0";
    document.getElementById("incorrectResponseButton").style.color = "gray";
    document.getElementById("incorrectResponseButton").style.borderColor = "#e4e9f0";

    const { dispatch, datarecording: { count, correct } } = this.props;
    dispatch({
      type: 'datarecording/SET_STATE',
      payload: {
        // count: val + 1,
        percentage: ((correct + 1) * 100 / count),
        correct: correct + 1,
      }
    })
    
  }




  addInCorrectTrail = (val) => {
    document.getElementById(`spanStyle${val - 1}`).style.backgroundColor = "#FF8080";
    document.getElementById("correctResponseButton").style.color = "gray";
    document.getElementById("correctResponseButton").style.borderColor = "#e4e9f0";
    document.getElementById("incorrectResponseButton").style.color = "#FF8080";
    document.getElementById("incorrectResponseButton").style.borderColor = "#FF8080";
    this.setState({
      showPromptOptions: true
    })

    const { dispatch, datarecording: { count, correct, incorrect } } = this.props;

    dispatch({
      type: 'datarecording/SET_STATE',
      payload: {
        // count: val + 1,
        percentage: ((correct) * 100 / count),
        incorrect: incorrect + 1,
      }
    })
  }


  addPromptTrail = (val) => {
    document.getElementById(`spanStyle${val - 1}`).style.backgroundColor = "#FF9C52";
    document.getElementById("correctResponseButton").style.color = "gray";
    document.getElementById("correctResponseButton").style.borderColor = "#e4e9f0";
    document.getElementById("incorrectResponseButton").style.color = "#FF9C52";
    document.getElementById("incorrectResponseButton").style.borderColor = "#FF9C52";
    this.setState({
      showPromptOptions: true
    })

    const { dispatch, datarecording: { count, correct, incorrect } } = this.props;

    dispatch({
      type: 'datarecording/SET_STATE',
      payload: {
        // count: val + 1,
        percentage: ((correct) * 100 / count),
        incorrect: incorrect + 1,
      }
    })
  }


  moveToNextTrail = () => {
    const { dispatch, datarecording: { count } } = this.props;

    dispatch({
      type: 'datarecording/SET_STATE',
      payload: {
        count: count + 1,
      }
    })

    this.resetCorrectIncorrectButtonStyle();

  }

  moveToPrevTrail = () => {
    const { dispatch, datarecording: { count } } = this.props;

    dispatch({
      type: 'datarecording/SET_STATE',
      payload: {
        count: count - 1,
      }
    })

    this.resetCorrectIncorrectButtonStyle();

  }


  showDrawer = () => { this.setState({ visible: true}) };


  onClose = () => {this.setState({visible: false})};


  // changeRecordingTypeSd = (type) => {
  //   const { dispatch, datarecording: { TargetInitialValue, TargetList, StimulusActiveIndex } } = this.props;
  //   if (type){

  //     this.resetPercentage();

  //     dispatch({
  //       type: 'datarecording/SET_STATE',
  //       payload: {
  //         Correct: [],
  //         Incorrect: [],
  //         RecordingType: 'Sd',
  //         StimulusActiveKey: TargetList[TargetInitialValue - 1].node.sd.edges[StimulusActiveIndex - 1].node.id

  //       }
  //     })

  //     this.resetTrailsBoxStyle();

  //   }
  //   else{
  //     this.resetPercentage();

  //     dispatch({
  //       type: 'datarecording/SET_STATE',
  //       payload: {
  //         Correct: [],
  //         Incorrect: [],
  //         RecordingType: 'Target',
  //         StimulusActiveKey: '',
  //         StimulusActiveIndex: 1
          
  //       }
  //     })
  //     this.resetTrailsBoxStyle();

  //   }
  // }


  // CHANGE TO NEXT STIMULUS
  changeStimulus = () => {

    const { dispatch, datarecording: { TargetInitialValue, TargetList, StimulusActiveIndex, StimulusActiveKey } } = this.props;

    dispatch({
      type: 'datarecording/SET_STATE',
      payload: {
        Correct: [],
        Incorrect: [],
        StimulusActiveKey: TargetList[TargetInitialValue - 1].node.sd.edges[StimulusActiveIndex].node.id,
        StimulusActiveIndex: StimulusActiveIndex +1,

      }
    })

    this.resetPercentage();
    this.resetTrailsBoxStyle();
    this.resetCorrectIncorrectButtonStyle();

  }


  // CHANGE TO PREVIOUS STIMULUS
  previousStimulus = () => {
    // perform animation
    this.clientedetail();
    const { dispatch, datarecording: { TargetInitialValue, TargetList, StimulusActiveIndex, StimulusActiveKey } } = this.props;

    dispatch({
      type: 'datarecording/SET_STATE',
      payload: {
        Correct: [],
        Incorrect: [],
        StimulusActiveKey: TargetList[TargetInitialValue - 1].node.sd.edges[StimulusActiveIndex - 1].node.id,
        StimulusActiveIndex: StimulusActiveIndex - 1,

      }
    })

    this.resetPercentage();
    this.resetTrailsBoxStyle();
    this.resetCorrectIncorrectButtonStyle();

  }


  // CHANGE CURRENT STEP
  stepChange = (key, index) => {
    console.log(key, index)
    const { dispatch } = this.props;

    dispatch({
      type: 'datarecording/SET_STATE',
      payload: {
        Correct: [],
        Incorrect: [],
        StepActiveKey: key,

      }
    })

    this.resetPercentage();
    this.resetTrailsBoxStyle();
    this.resetCorrectIncorrectButtonStyle();

  }


  changeTarget = () => {
    const { dispatch, datarecording: { TargetInitialValue, TargetList, TargetActiveKey, RecordingType } } = this.props;

    let sdKey = '';
    let stepKey = '';
    if (TargetList[TargetInitialValue].node.sd.edges.length > 0){
      sdKey = TargetList[TargetInitialValue].node.sd.edges[0].node.id
    }
    if (TargetList[TargetInitialValue].node.steps.edges.length > 0){
      stepKey = TargetList[TargetInitialValue].node.steps.edges[0].node.id
    }


    dispatch({
      type: 'datarecording/SET_STATE',
      payload: {
        TargetInitialValue: TargetInitialValue + 1,
        TargetActiveKey: TargetList[TargetInitialValue].node.id,
        Correct: [],
        Incorrect: [],
        RecordingType: 'Target',
        StimulusActiveIndex: 1,
        StimulusActiveKey: sdKey,
        StepActiveIndex: 1,
        StepActiveKey: stepKey,

      }
    })

    if (RecordingType === 'Behavior'){
      console.log('1')
    }
    else{

      this.resetPercentage();
      this.resetTrailsBoxStyle();
      this.resetCorrectIncorrectButtonStyle();

      // for target automatic scroll
      document.getElementsByClassName("targetElements")[TargetInitialValue].style.backgroundColor = "#bae7ff";
      document.getElementsByClassName("targetElements")[TargetInitialValue-1].style.backgroundColor = "white";
      document.getElementById(TargetActiveKey).click();
    }

  }


  addCount(This, val) {
    

    const { dispatch, datarecording: { TargetActiveKey, correct, incorrect, count } } = this.props;
    if (count > (correct+incorrect)){
      this.addCorrectTrail(val);
      dispatch({
        type: 'datarecording/UPDATE_RESPONSE',
        payload: {
          id: TargetActiveKey,
          response: { trail: count, response: "Correct" },
          index: count,
        }
      })
      dispatch({
        type: 'datarecording/UPDATE_CORRECT_LIST',
        payload: {
          valueCorrect: correct + 1,
          valueInCorrect: incorrect,
          index: count,
        }
      })

      client.mutate({
        mutation: gql`mutation {
          sessionRecording(
            input:{
              targets:"${TargetActiveKey}", 
              sessions:"U2Vzc2lvbk5hbWVUeXBlOjE=",
              dataMode:"Probe",
              sessionRecord:[{trial:"Correct", prompt:"", sd:"", step:""}],
            }
          )
          { 
            details{
              id,
            }
          }
        }`
      })
      .then(result => {
        notification.success({
          message: 'Data Recorded Successfully',                
        });
      })
      .catch(err => { 
        console.log(err)
        notification.error({
          message: 'Somthing want wrong',
        }); 
      });
    }
    else{
      alert('Write Update Code!!!')
    }


  }


  showPrompt() {
    this.setState({
      showPromptOptions: false
    })
  }


  removeCount(This, val) {
    this.closePromptOptions();
    const { dispatch, datarecording: { TargetActiveKey, correct, incorrect, count} } = this.props;
    if (count > (correct+incorrect)){
    this.addInCorrectTrail(val);
    dispatch({
      type: 'datarecording/UPDATE_RESPONSE',
      payload: {
        id: TargetActiveKey,
        response: { trail: count, response: 'InCorrect' },
        index: count,
      }
    })

    dispatch({
      type: 'datarecording/UPDATE_CORRECT_LIST',
      payload: {
        valueCorrect: correct,
        valueInCorrect: incorrect +1,
        index: count,
      }
    })

    client.mutate({
      mutation: gql`mutation {
        sessionRecording(
          input:{
            targets:"${TargetActiveKey}", 
            sessions:"U2Vzc2lvbk5hbWVUeXBlOjE=",
            dataMode:"Probe",
            sessionRecord:[{trial:"Error", prompt:"", sd:"", step:""}],
          }
        )
        { 
          details{
            id,
          }
        }
      }`
    })
    .then(result => {
      notification.success({
        message: 'Data Recorded Successfully',                
      });
    })
    .catch(err => { 
      console.log(err)
      notification.error({
        message: 'Somthing want wrong',
      }); 
    });
  }
  else{
    alert('Write Update Code!!!')
  }

  }


  promptCount(This, val, promptObject) {
    this.closePromptOptions();

    const { dispatch, datarecording: { TargetActiveKey, correct, incorrect, count } } = this.props;
    if (count > (correct+incorrect)){
    this.addPromptTrail(val);
    dispatch({
      type: 'datarecording/UPDATE_RESPONSE',
      payload: {
        id: TargetActiveKey,
        response: { trail: count, response: 'Prompt', obj: promptObject },
        index: count,
      }
    })

    dispatch({
      type: 'datarecording/UPDATE_CORRECT_LIST',
      payload: {
        valueCorrect: correct,
        valueInCorrect: incorrect +1,
        index: count,
      }
    })

    client.mutate({
      mutation: gql`mutation {
        sessionRecording(
          input:{
            targets:"${TargetActiveKey}", 
            sessions:"U2Vzc2lvbk5hbWVUeXBlOjE=",
            dataMode:"Probe",
            sessionRecord:[{trial:"Prompt", prompt:"${promptObject.id}", sd:"", step:""}],
          }
        )
        { 
          details{
            id,
          }
        }
      }`
    })
    .then(result => {
      notification.success({
        message: 'Data Recorded Successfully',                
      });
    })
    .catch(err => { 
      console.log(err)
      notification.error({
        message: 'Somthing want wrong',
      }); 
    });
  }
  else{
    alert('Write Update Code!!!')
  }

  }

  // code for stimulus data recording 

  addStimulusCount(This, val) {
    

    const { dispatch, datarecording: { StimulusActiveKey, TargetActiveKey, correct, incorrect, count} } = this.props;
    if (count > (correct+incorrect)){
    this.addCorrectTrail(val);
    dispatch({
      type: 'datarecording/UPDATE_SD_RESPONSE',
      payload: {
        id: StimulusActiveKey,
        response: { trail: count, response: "Correct" },
        index: count,
      }
    })
    dispatch({
      type: 'datarecording/UPDATE_CORRECT_LIST',
      payload: {
        valueCorrect: correct + 1,
        valueInCorrect: incorrect,
        index: count,
      }
    })

    client.mutate({
      mutation: gql`mutation {
        sessionRecording(
          input:{
            targets:"${TargetActiveKey}", 
            sessions:"U2Vzc2lvbk5hbWVUeXBlOjE=",
            dataMode:"Probe",
            sessionRecord:[{trial:"Correct", prompt:"", sd:"${StimulusActiveKey}", step:""}],
          }
        )
        { 
          details{
            id,
          }
        }
      }`
    })
    .then(result => {
      notification.success({
        message: 'Data Recorded Successfully',                
      });
    })
    .catch(err => { 
      console.log(err)
      notification.error({
        message: 'Somthing want wrong',
      }); 
    });
  }
  else{
    alert('Write Update Code!!!')
  }

  }


  removeStimulusCount(This, val) {
    this.closePromptOptions();
    const { dispatch, datarecording: { StimulusActiveKey, TargetActiveKey, correct, incorrect, count } } = this.props;
    if (count > (correct+incorrect)){
    this.addInCorrectTrail(val);
    dispatch({
      type: 'datarecording/UPDATE_SD_RESPONSE',
      payload: {
        id: StimulusActiveKey,
        response: { trail: count, response: 'InCorrect' },
        index: count,
      }
    })

    dispatch({
      type: 'datarecording/UPDATE_CORRECT_LIST',
      payload: {
        valueCorrect: correct,
        valueInCorrect: incorrect +1,
        index: count,
      }
    })

    client.mutate({
      mutation: gql`mutation {
        sessionRecording(
          input:{
            targets:"${TargetActiveKey}", 
            sessions:"U2Vzc2lvbk5hbWVUeXBlOjE=",
            dataMode:"Probe",
            sessionRecord:[{trial:"Error", prompt:"", sd:"${StimulusActiveKey}", step:""}],
          }
        )
        { 
          details{
            id,
          }
        }
      }`
    })
    .then(result => {
      notification.success({
        message: 'Data Recorded Successfully',                
      });
    })
    .catch(err => { 
      console.log(err)
      notification.error({
        message: 'Somthing want wrong',
      }); 
    });
  }
  else{
    alert('Write Update Code!!!')
  }

  }


  promptStimulusCount(This, val, promptObject) {
    
    this.closePromptOptions();
    const { dispatch, datarecording: { StimulusActiveKey, TargetActiveKey, correct, incorrect, count } } = this.props;
    if (count > (correct+incorrect)){
    this.addPromptTrail(val);
    dispatch({
      type: 'datarecording/UPDATE_SD_RESPONSE',
      payload: {
        id: StimulusActiveKey,
        response: { trail: count, response: 'Prompt', obj: promptObject },
        index: count,
      }
    })

    dispatch({
      type: 'datarecording/UPDATE_CORRECT_LIST',
      payload: {
        valueCorrect: correct,
        valueInCorrect: incorrect +1,
        index: count,
      }
    })

    client.mutate({
      mutation: gql`mutation {
        sessionRecording(
          input:{
            targets:"${TargetActiveKey}", 
            sessions:"U2Vzc2lvbk5hbWVUeXBlOjE=",
            dataMode:"Probe",
            sessionRecord:[{trial:"Prompt", prompt:"${promptObject.id}", sd:"${StimulusActiveKey}", step:""}],
          }
        )
        { 
          details{
            id,
          }
        }
      }`
    })
    .then(result => {
      notification.success({
        message: 'Data Recorded Successfully',                
      });
    })
    .catch(err => { 
      console.log(err)
      notification.error({
        message: 'Somthing want wrong',
      }); 
    });
  }
  else{
    alert('Write Update Code!!!')
  }

  }

  // End of Stimulus recording

  // STARTING CODE FOR STEP DATA RECORDING

   addStepCount(This, val) {
    

    const { dispatch, datarecording: { StepActiveKey, TargetActiveKey, correct, incorrect, count} } = this.props;
    if (count > (correct+incorrect)){
    this.addCorrectTrail(val);
    dispatch({
      type: 'datarecording/UPDATE_STEP_RESPONSE',
      payload: {
        id: StepActiveKey,
        response: { trail: count, response: "Correct" },
        index: count,
      }
    })
    dispatch({
      type: 'datarecording/UPDATE_CORRECT_LIST',
      payload: {
        valueCorrect: correct + 1,
        valueInCorrect: incorrect,
        index: count,
      }
    })

    client.mutate({
      mutation: gql`mutation {
        sessionRecording(
          input:{
            targets:"${TargetActiveKey}", 
            sessions:"U2Vzc2lvbk5hbWVUeXBlOjE=",
            dataMode:"Probe",
            sessionRecord:[{trial:"Correct", prompt:"", sd:"", step:"${StepActiveKey}"}],
          }
        )
        { 
          details{
            id,
          }
        }
      }`
    })
    .then(result => {
      notification.success({
        message: 'Data Recorded Successfully',                
      });
    })
    .catch(err => { 
      console.log(err)
      notification.error({
        message: 'Somthing want wrong',
      }); 
    });
  }
  else{
    alert('Write Update Code!!!')
  }

  }

  removeStepCount(This, val) {
    
    this.closePromptOptions();
    const { dispatch, datarecording: { StepActiveKey, TargetActiveKey, correct, incorrect, count } } = this.props;
    if (count > (correct+incorrect)){
    this.addInCorrectTrail(val);
    dispatch({
      type: 'datarecording/UPDATE_STEP_RESPONSE',
      payload: {
        id: StepActiveKey,
        response: { trail: count, response: 'InCorrect' },
        index: count,
      }
    })

    dispatch({
      type: 'datarecording/UPDATE_CORRECT_LIST',
      payload: {
        valueCorrect: correct,
        valueInCorrect: incorrect +1,
        index: count,
      }
    })

    client.mutate({
      mutation: gql`mutation {
        sessionRecording(
          input:{
            targets:"${TargetActiveKey}", 
            sessions:"U2Vzc2lvbk5hbWVUeXBlOjE=",
            dataMode:"Probe",
            sessionRecord:[{trial:"Error", prompt:"", sd:"", step:"${StepActiveKey}"}],
          }
        )
        { 
          details{
            id,
          }
        }
      }`
    })
    .then(result => {
      notification.success({
        message: 'Data Recorded Successfully',                
      });
    })
    .catch(err => { 
      console.log(err)
      notification.error({
        message: 'Somthing want wrong',
      }); 
    });
  }
  else{
    alert('Write Update Code!!!')
  }

  }


  promptStepCount(This, val, promptObject) {
    this.closePromptOptions();

    const { dispatch, datarecording: { StepActiveKey, TargetActiveKey, correct, incorrect, count } } = this.props;
    if (count > (correct+incorrect)){
    this.addPromptTrail(val);
    dispatch({
      type: 'datarecording/UPDATE_STEP_RESPONSE',
      payload: {
        id: StepActiveKey,
        response: { trail: count, response: 'Prompt', obj: promptObject },
        index: count,
      }
    })

    dispatch({
      type: 'datarecording/UPDATE_CORRECT_LIST',
      payload: {
        valueCorrect: correct,
        valueInCorrect: incorrect +1,
        index: count,
      }
    })

    client.mutate({
      mutation: gql`mutation {
        sessionRecording(
          input:{
            targets:"${TargetActiveKey}", 
            sessions:"U2Vzc2lvbk5hbWVUeXBlOjE=",
            dataMode:"Probe",
            sessionRecord:[{trial:"Prompt", prompt:"${promptObject.id}", sd:"", step:"${StepActiveKey}"}],
          }
        )
        { 
          details{
            id,
          }
        }
      }`
    })
    .then(result => {
      notification.success({
        message: 'Data Recorded Successfully',                
      });
    })
    .catch(err => { 
      console.log(err)
      notification.error({
        message: 'Somthing want wrong',
      }); 
    });
  }
  else{
    alert('Write Update Code!!!')
  }

  }

  // END OF STEP DATA RECORDING CODE



  render() {
    const { datarecording: { TargetList, TargetInitialValue, TargetListLength, TargetActiveKey, StimulusActiveIndex, RecordingType, count, correct, percentage, incorrect, } } = this.props;
    const { showPromptOptions, promptCodesList, saveButton, recordingType } = this.state;

    if (!(TargetListLength > 0)) {
      return <Empty />
    }

    const correctIncorrectDiv = showPromptOptions ? { display: 'block', textAlign: 'center', marginTop: '20px' } : { display: 'none' }
    const promptOptionsDiv = showPromptOptions ? { display: 'none' } : { display: 'block', textAlign: 'center', marginTop: '40px' }

    const promptCodeButtonStyle = { padding: '8px auto', width: "300px", height: "50px", marginTop: '10px' }

    const saveButtonStyle = saveButton ? {display:"inline-block"} : {display: 'none'}
    const nextButtonStyle = saveButton ? {display:"none"} : {display: 'inline-block'}

    let i = 0
    const spanList = []
    for (i = 0; i < TargetList[TargetInitialValue - 1].node.targetAllcatedDetails.DailyTrials; i++) {
      spanList.push(`spanStyle${i}`)
    }



    return (
      <>

        <div disabled style={{ backgroundColor: 'inherit', border: "none", position: 'relative', overflow: 'hidden', paddingTop: "0px" }}>
          <Card style={{ width: '96%', backgroundColor: 'white', margin: '0px auto', minHeight: "540px", border: "none" }}>
            <h5 style={{ textAlign: 'center', minHeight: "70px" }}>
              <a>{TargetList[TargetInitialValue - 1].node.targetAllcatedDetails.targetName}</a><br />
              {/* <span style={{ fontSize: '14px', color: "rgba(95, 95, 95, 0.75)" }}><Button type="link" onClick={this.showDrawer}>Target Instruction</Button></span> */}
            </h5>
            <br />

            <p><span>{percentage} % Correct</span> <span style={{ float: 'right' }}>{TargetList[TargetInitialValue - 1].node.targetStatus.statusName}</span></p>
            {/* {TargetList[TargetInitialValue - 1].node.sd.edges.length > 0 ?
              <span style={{float:'right'}}>
                Stimulus : <Switch onChange={this.changeRecordingTypeSd} checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="close" />} />
              </span>
            :
              ''
            } */}
            <br />
            <br />

            
            {RecordingType === 'Target' ? 

              <>
            
              {TargetList[TargetInitialValue - 1].node.sd.edges.length > 0 ?

                <>
                  <p style={{textAlign:'center'}}>
                    
                    Stimulus {StimulusActiveIndex}/{TargetList[TargetInitialValue - 1].node.sd.edges.length}
                    
                  </p>
                  
                  <Row>
                    <Col xs={4} style={{ height:'200px',paddingTop:'15%', paddingLeft:"7%"}}>
                      { StimulusActiveIndex > 1 ? 
                        <>
                          <Button type="link" onClick={this.previousStimulus}><Icon type="arrow-left" /></Button>
                        </>
                      :
                        <Button disabled type="link"><Icon type="arrow-left" /></Button>
                      }
                    </Col>
                    <Col xs={16} style={{borderRadius:'8px', backgroundColor:'#F5F5F5'}}>
                      
                          <div id="guardadoC">
                            <p style={{textAlign:'center', marginTop:'15px'}}>{TargetList[TargetInitialValue - 1].node.sd.edges[StimulusActiveIndex-1].node.sd}</p>
                              <p style={{ textAlign: 'center', marginTop: "25px" }}>
                                <span>
                                  {count === 1 ?
                                    <Button disabled type="link"><Icon type="arrow-left" /></Button>
                                  :
                                    <Button onClick={this.moveToPrevTrail} type="link"><Icon type="arrow-left" /></Button>
                                  }
                                </span>
                                Trial {count}/{TargetList[TargetInitialValue - 1].node.targetAllcatedDetails.DailyTrials}
                                <span>
                                  {count === TargetList[TargetInitialValue - 1].node.targetAllcatedDetails.DailyTrials ?
                                    <Button disabled type="link"><Icon type="arrow-right" /></Button>
                                  :
                                    <Button onClick={this.moveToNextTrail} type="link"><Icon type="arrow-right" /></Button>
                                  }
                                </span>
                              </p>
                            {/* <br /> */}
                            <p style={correctIncorrectDiv}>
                              {count > TargetList[TargetInitialValue - 1].node.targetAllcatedDetails.DailyTrials ? 
                                <>
                                  <Button id="correctResponseButton" disabled style={{ padding: '20px auto', width: "300px", height: "50px" }} onClick={() => this.addStimulusCount(this, count, correct)}><CheckOutlined /> Correct ({correct})</Button>
                                  <Button id="incorrectResponseButton" disabled style={{ padding: '8px auto', width: "300px", height: "50px", marginTop: '10px' }} onClick={() => this.showPrompt()}><CloseOutlined /> Incorrect ({incorrect})</Button> <br />
                                </> 
                              : 
                                <>
                                  <Button id="correctResponseButton" style={{ padding: '20px auto', width: "300px", height: "50px" }} onClick={() => this.addStimulusCount(this, count, correct)}><CheckOutlined /> Correct ({correct})</Button>
                                  <Button id="incorrectResponseButton" style={{ padding: '8px auto', width: "300px", height: "50px", marginTop: '10px' }} onClick={() => this.showPrompt()}><CloseOutlined /> Incorrect ({incorrect})</Button> <br />
                                </>
                              }
                              
                            </p>
                            <p style={promptOptionsDiv}>
                              {promptCodesList.map((item) => 
                                <>
                                  <Button style={promptCodeButtonStyle} onClick={() => this.promptStimulusCount(this, count, item)}>{item.promptName}</Button>
                                  <br />
                                </>
                              )}
                              <Button style={promptCodeButtonStyle} onClick={() => this.removeStimulusCount(this, count)}>No Response</Button>
                            </p>                          
                          </div>
                    </Col>
                    <Col xs={4} style={{height:'200px',paddingTop:'15%', paddingRight:"10%"}}>
                      {TargetList[TargetInitialValue - 1].node.sd.edges.length > StimulusActiveIndex ? 
                        <>
                          <Button onClick={this.changeStimulus} type="link"><Icon type="arrow-right" /></Button>
                        </>
                      :                      
                        <Button disabled type="link"><Icon type="arrow-right" /></Button>
                      }
                    </Col>
                  </Row>
                  
                </>

                  
                    

                

              :

                TargetList[TargetInitialValue - 1].node.steps.edges.length > 0  ? 

                    <Collapse accordion destroyInactivePanel={true} onChange={this.stepChange} defaultActiveKey={TargetList[TargetInitialValue - 1].node.steps.edges[0].node.id}>
                      {TargetList[TargetInitialValue - 1].node.steps.edges.map((step, index) => 

                        <Panel header={<>Step {index+1} : {step.node.step} </>} index={index} key={step.node.id}>
                        
                          <p style={{ textAlign: 'center', marginTop: "40px" }}>
                            <span>
                              {count === 1 ?
                                <Button disabled type="link"><Icon type="arrow-left" /></Button>
                              :
                                <Button onClick={this.moveToPrevTrail} type="link"><Icon type="arrow-left" /></Button>
                              }
                            </span>
                            Trial {count}/{TargetList[TargetInitialValue - 1].node.targetAllcatedDetails.DailyTrials}
                            <span>
                              {count === TargetList[TargetInitialValue - 1].node.targetAllcatedDetails.DailyTrials ?
                                <Button disabled type="link"><Icon type="arrow-right" /></Button>
                              :
                                <Button onClick={this.moveToNextTrail} type="link"><Icon type="arrow-right" /></Button>
                              }
                            </span>
                          </p>
                          <p style={correctIncorrectDiv}>
                            {count > TargetList[TargetInitialValue - 1].node.targetAllcatedDetails.DailyTrials ? 
                              <>
                                <Button id="correctResponseButton" disabled style={{ padding: '20px auto', width: "300px", height: "50px" }} onClick={() => this.addStepCount(this, count, correct)}><CheckOutlined /> Correct ({correct})</Button>
                                <Button id="incorrectResponseButton" disabled style={{ padding: '8px auto', width: "300px", height: "50px", marginTop: '10px' }} onClick={() => this.showPrompt()}><CloseOutlined /> Incorrect ({incorrect})</Button> <br />
                              </> 
                            : 
                              <>
                                <Button id="correctResponseButton" style={{ padding: '20px auto', width: "300px", height: "50px" }} onClick={() => this.addStepCount(this, count, correct)}><CheckOutlined /> Correct ({correct})</Button>
                                <Button id="incorrectResponseButton" style={{ padding: '8px auto', width: "300px", height: "50px", marginTop: '10px' }} onClick={() => this.showPrompt()}><CloseOutlined /> Incorrect ({incorrect})</Button> <br />
                              </>
                            }
                            
                          </p>
                          <p style={promptOptionsDiv}>
                            {promptCodesList.map((item) => 
                              <>
                                <Button style={promptCodeButtonStyle} onClick={() => this.promptStepCount(this, count, item)}>{item.promptName}</Button>
                                <br />
                              </>
                            )}
                            <Button style={promptCodeButtonStyle} onClick={() => this.removeStepCount(this, count)}>No Response</Button>
                          </p>
                        </Panel>

                      )
                    }
                    </Collapse>
                  
                  :

                    <>
                      <p style={{ textAlign: 'center', marginTop: "40px" }}>
                        <span>
                          {count === 1 ?
                            <Button disabled type="link"><Icon type="arrow-left" /></Button>
                          :
                            <Button onClick={this.moveToPrevTrail} type="link"><Icon type="arrow-left" /></Button>
                          }
                        </span>
                        Trial {count}/{TargetList[TargetInitialValue - 1].node.targetAllcatedDetails.DailyTrials}
                        <span>
                          {count === TargetList[TargetInitialValue - 1].node.targetAllcatedDetails.DailyTrials ?
                            <Button disabled type="link"><Icon type="arrow-right" /></Button>
                          :
                            <Button onClick={this.moveToNextTrail} type="link"><Icon type="arrow-right" /></Button>
                          }
                        </span>
                      </p>
                      {/* <br /> */}
                      <p style={correctIncorrectDiv}>
                        {count > TargetList[TargetInitialValue - 1].node.targetAllcatedDetails.DailyTrials ? 
                          <>
                            <Button id="correctResponseButton" disabled style={{ padding: '20px auto', width: "300px", height: "50px" }} onClick={() => this.addCount(this, count, correct)}><CheckOutlined /> Correct ({correct})</Button>
                            <Button id="incorrectResponseButton" disabled style={{ padding: '8px auto', width: "300px", height: "50px", marginTop: '10px' }} onClick={() => this.showPrompt()}><CloseOutlined /> Incorrect ({incorrect})</Button> <br />
                          </> 
                        : 
                          <>
                            <Button id="correctResponseButton" style={{ padding: '20px auto', width: "300px", height: "50px" }} onClick={() => this.addCount(this, count, correct)}><CheckOutlined /> Correct ({correct})</Button>
                            <Button id="incorrectResponseButton" style={{ padding: '8px auto', width: "300px", height: "50px", marginTop: '10px' }} onClick={() => this.showPrompt()}><CloseOutlined /> Incorrect ({incorrect})</Button> <br />
                          </>
                        }
                        
                      </p>
                      <p style={promptOptionsDiv}>
                        {promptCodesList.map((item) => 
                          <>
                            <Button style={promptCodeButtonStyle} onClick={() => this.promptCount(this, count, item)}>{item.promptName}</Button>
                            <br />
                          </>
                        )}
                        <Button style={promptCodeButtonStyle} onClick={() => this.removeCount(this, count)}>No Response</Button>
                      </p>
                    
                    </>   
              
              }


              






                <p style={{ textAlign: 'center', marginTop: "80px" }}>
                  {/* <span style={{float:'right', marginRight:'25px', display:'block'}}><Button type="link"><Icon type="left" /></Button><Button type="link"><Icon type="right" /></Button></span> */}
                  {/* <br /> */}
                  <br />
                  {spanList.map((item) => <span><span id={item} className="tarilSpanClass" style={{ height: "15px", display: "inline-block", lineHeight: "12px", width: "45px", border: "1px solid #F5F5F5", backgroundColor: "#F5F5F5", paddingLeft: "35px", borderRadius: "2px" }}>&nbsp;</span>&nbsp;&nbsp;</span>)}
                </p>

              </>
            
            :
              ''
            }

            {RecordingType === 'Behavior' ? 
              <>
                {/* <TargetBehaviorReduction key={TargetList[TargetInitialValue - 1].node.id} /> */}
                <TargetPeakDataRecording key={TargetList[TargetInitialValue - 1].node.id} />
              </>
            :
              ''
            }

            <p style={{ marginTop: '20px' }}>Target {TargetInitialValue}/{TargetListLength} 
              <span style={{ float: 'right' }}>

                {TargetList.length > TargetInitialValue ? 
                  <>
                    <Button onClick={this.changeTarget} type="primary">Next</Button>&nbsp; 
                    {/* <Button onClick={this.saveData} type="primary">Save and Next</Button>  */}
                  </> 
                : 
                  <>
                    <Button disabled type="primary">Next</Button>&nbsp; 
                    {/* <Button onClick={this.saveData} type="primary">Save</Button> */}
                  </>
                }
                
                
                {/* <Button onClick={this.changeTarget} type="primary" style={nextButtonStyle}>Next</Button> 
                <Button onClick={this.saveData} type="primary" style={saveButtonStyle}>Save</Button> */}
              </span> 
            </p>

          </Card>

          <Drawer
            title={
              <>
                <h5>Target Interactions</h5>
                <Button style={{ float: 'right' }} onClick={this.onClose}>X</Button>
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
            {/* {TargetList[TargetInitialValue - 1].node.targetInstr} */}
            <div dangerouslySetInnerHTML={{ __html: TargetList[TargetInitialValue - 1].node.targetInstr }} />
          </Drawer>

        </div>

      </>
    )
  }
}

export default TargetRecordingBlock
