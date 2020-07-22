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
/* eslint-disable react/no-did-update-set-state */

import React from 'react'
import { Helmet } from 'react-helmet'
import ReactPlayer from 'react-player'
import {
  Row,
  Col,
  Card,
  Drawer,
  Select,
  Form,
  Collapse,
  Tree,
  Icon,
  DatePicker,
  notification,
  Empty,
  Button,
  Typography,
} from 'antd'
import { Redirect } from 'react-router-dom'
import Authorize from 'components/LayoutComponents/Authorize'
import { connect } from 'react-redux'
import moment from 'moment'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import TargetListBlock from '../../components/sessionRecording/targetListBlock'
import SessionClock from '../../components/sessionRecording/sessionClock'
import TrialsList from '../../components/sessionRecording/trialsList'
import DataRecordingBlock from './dataRecordingBlock'
import PeakRecordingBlock from './peakRecordingBlock'
import PeakTrialBoxes from './trialsBoxes'
import SessionSummary from '../session_summary/index'
import RecordView from './RecordView'

const { Title, Text } = Typography

@connect(({ sessionrecording }) => ({ sessionrecording }))
class DataRecording extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      // for behavior recording drawer
      visible: false,
      // for target instruction drawer
      targetVisible: false,
      // redirecting sessionId does not exist
      redirect: false,

      videoLoading: false,
      videoUrl: null
    }
  }

  componentDidMount() {
    const {
      dispatch,
      sessionrecording: { SessionId, SessionDate },
    } = this.props

    if (SessionId === '') {
      this.setState({
        redirect: true,
      })
    } else {
      dispatch({
        type: 'sessionrecording/LOAD_SESSION',
        payload: {
          masterSessionId: SessionId,
          date: SessionDate !== null ? SessionDate : moment().format('YYYY-MM-DD')
          // masterSessionId: 'U2Vzc2lvblR5cGU6MTI3Nw==',
        },
      })
    }
  }

  getVideoUrl(index){
    console.log('video function ')
    const {dispatch, sessionrecording: {MasterSession, TargetActiveIndex}} = this.props
    dispatch({
      type: 'sessionrecording/SET_STATE',
      payload: {
        VideoUrl: '',
        VideoLoading: true
      }
    })
    if (MasterSession.targets.edges[index].node.videos.edges.length > 0) {
      const videoNode = MasterSession.targets.edges[index].node.videos.edges[0];
      const targetVideoUrl = videoNode.node.url;
      console.log(targetVideoUrl)
      // const isVideoAvailable = true;
      // let res = targetVideoUrl.substring(18);
      // const videoId = targetVideoUrl.substring(targetVideoUrl.lastIndexOf('/') + 1);
      const videoId = targetVideoUrl.split('/')[3];
      
      // return videoId
      console.log(videoId)

      dispatch({
        type: 'sessionrecording/SET_STATE',
        payload: {
          VideoUrl: `https://player.vimeo.com/video/${videoId}/`,
          VideoAvailable: true,
          VideoLoading: false
        }
      })

      // fetch(`https://player.vimeo.com/video/${videoId}/config`,{
      //   headers: {
      //     'Access-Control-Allow-Origin': '*',
      //     'Access-Control-Allow-Methods': '*',
      //   },
      // })
      //   .then(res => res.json())
      //   .then(res => {
      //     // this.setState({
      //     //   videoUrl: res.request.files.hls.cdns[res.request.files.hls.default_cdn].url,
      //     //   videoLoading: false
      //     // });

      //     dispatch({
      //       type: 'sessionrecording/SET_STATE',
      //       payload: {
      //         VideoUrl: res.request.files.hls.cdns[res.request.files.hls.default_cdn].url,
      //         VideoAvailable: true
      //       }
      //     })

      //   })
      //   .catch(err => {
      //     console.log(JSON.stringify(err))
      //   });
    } else {
      dispatch({
        type: 'sessionrecording/SET_STATE',
        payload: {
          VideoAvailable: false,
          VideoLoading: false
        }
      })
    }
  }


  showDrawer = () => {
    this.setState({
      visible: true,
    })
  }

  onClose = () => {
    this.setState({
      visible: false,
    })
  }

  showTargetDrawer = () => {
    this.setState({
      targetVisible: true,
    })
  }

  onTargetClose = () => {
    this.setState({
      targetVisible: false,
    })
  }

  resetCorrectIncorrectButtonStyle = () => {
    var element = document.getElementById('correctResponseButton')

    // If it isn't "undefined" and it isn't "null", then it exists.
    if (typeof element != 'undefined' && element != null) {
      document.getElementById('correctResponseButton').style.color = 'gray'
      document.getElementById('correctResponseButton').style.borderColor = '#e4e9f0'
      document.getElementById('incorrectResponseButton').style.color = 'gray'
      document.getElementById('incorrectResponseButton').style.borderColor = '#e4e9f0'
    } else {
      console.log('Buttons does not not exits')
    }
  }

  updateSessionClockTime = () => {
    // updatig current clock time to store
    document.getElementById('updateSessionCurrentTimeInStore').click()
  }

  updateStartTrialClockTime = () => {
    // updatig trial start time to store
    document.getElementById('updateStartTrialTimeInStore').click()
  }

  changeTarget = () => {
    const {
      dispatch,
      sessionrecording: {
        TargetActiveIndex,
        TargetActiveId,
        MasterSession,
        CorrectCount,
        IncorrectCount,
        Count,
      },
    } = this.props

    document.getElementById(MasterSession.targets.edges[TargetActiveIndex + 1].node.id).click()
    document.getElementsByClassName('targetElements')[TargetActiveIndex + 1].style.border =
      '2px solid #bae7ff'
    document.getElementsByClassName('targetElements')[TargetActiveIndex].style.border = 'none'

    // updating start trial time
    this.updateStartTrialClockTime()
    // updatig current clock time to store
    this.updateSessionClockTime()
    this.resetCorrectIncorrectButtonStyle()
    // updating previous target end time
    dispatch({
      type: 'sessionrecording/TARGET_UPDATE',
      payload: {
        targetId: TargetActiveId,
      },
    })

    // Updating target index and target id to store
    dispatch({
      type: 'sessionrecording/SET_STATE',
      payload: {
        TargetActiveIndex: TargetActiveIndex + 1,
        TargetActiveId: MasterSession.targets.edges[TargetActiveIndex + 1].node.id,
      },
    })

    // creating new target skills model instance
    dispatch({
      type: 'sessionrecording/CREATE_NEW_TARGET_INSTANCE',
      payload: {
        targetId: MasterSession.targets.edges[TargetActiveIndex + 1].node.id,
        targetIndex: TargetActiveIndex + 1,
      },
    })

    // load video
    this.getVideoUrl(TargetActiveIndex + 1)
  }
  

  moveToPreviousTarget = () => {
    const {
      dispatch,
      sessionrecording: {
        TargetActiveIndex,
        TargetActiveId,
        MasterSession,
        CorrectCount,
        IncorrectCount,
        Count,
      },
    } = this.props
    // updating start trial time
    this.updateStartTrialClockTime()
    // updatig current clock time to store
    this.updateSessionClockTime()
    this.resetCorrectIncorrectButtonStyle()
    // updating previous target end time
    dispatch({
      type: 'sessionrecording/TARGET_UPDATE',
      payload: {
        targetId: TargetActiveId,
      },
    })

    document.getElementById(MasterSession.targets.edges[TargetActiveIndex - 1].node.id).click()
    document.getElementsByClassName('targetElements')[TargetActiveIndex - 1].style.border =
      '2px solid #bae7ff'
    document.getElementsByClassName('targetElements')[TargetActiveIndex].style.border = 'none'

    // Updating target index and target id to store
    dispatch({
      type: 'sessionrecording/SET_STATE',
      payload: {
        TargetActiveIndex: TargetActiveIndex - 1,
        TargetActiveId: MasterSession.targets.edges[TargetActiveIndex - 1].node.id,
      },
    })

    // Updating target index and target id to store
    dispatch({
      type: 'sessionrecording/CREATE_NEW_TARGET_INSTANCE',
      payload: {
        targetIndex: TargetActiveIndex - 1,
        targetId: MasterSession.targets.edges[TargetActiveIndex - 1].node.id,
      },
    })

    // load video
    this.getVideoUrl(TargetActiveIndex - 1)
  }


  render() {
    const {
      sessionrecording: { loading, Disabled, MasterSession, TargetActiveIndex, ChildSession, VideoAvailable, VideoLoading, VideoUrl },
    } = this.props

    // const dis = false

    const style2 = Disabled
      ? {
          border: '1px solid #f4f6f8',
          overflow: 'hidden',
          position: 'relative',
          minHeight: '600px',
          pointerEvents: 'none',
          opacity: '0.4',
        }
      : {
          border: '1px solid #f4f6f8',
          overflow: 'hidden',
          position: 'relative',
          minHeight: '600px',
        }

    const style3 = {
      border: '1px solid #f4f6f8',
      height: '600px',
      backgroundColor: 'white',
      padding: '10px',
    }
    const targetBlockStyle = { height: '450px', overflow: 'auto' }
    const borderOnePixel = { border: '1px solid #f4f6f8' }

    const { redirect } = this.state

    if (redirect) {
      return <Redirect to="/" />
    }

    if (loading) {
      return 'Loading session data...'
    }

    // if (!loading && ChildSession && ChildSession.id && ChildSession.status === 'COMPLETED') {
    //   return <SessionSummary />
    // }

    const peakId = 'VGFyZ2V0RGV0YWlsVHlwZTo4'

    return (
      <Authorize roles={['school_admin', 'therapist', 'parents']} redirect to="/dashboard/beta">
        <Helmet title="Session" />
        <Row>
          {/* Main target recording area */}
          <Col xs={24} sm={18} md={18} lg={18} xl={18} style={style2}>
            {/* Header block details */}
            <Card bodyStyle={{ padding: '5px' }}>
              {MasterSession.targets.edges.length > 0 ? (
                <>
                  <Title level={3} style={{ display: 'inline-block', width: '85%' }}>
                    Target :{' '}
                    {
                      MasterSession.targets.edges[TargetActiveIndex].node.targetAllcatedDetails
                        .targetName
                    }
                  </Title>
                  <span style={{ float: 'right', display: 'inline-block' }}>
                    Target {TargetActiveIndex + 1} / {MasterSession.targets.edgeCount}
                  </span>
                  <Button style={{ marginTop: '15px' }} onClick={this.showTargetDrawer}>
                    Target Instruction
                  </Button>
                  {/* <p
                    style={{
                      display: 'inline-block',
                      width: '30%',
                      marginLeft: '50px',
                      color: '#0B35B3',
                    }}
                  >
                    {MasterSession.targets.edges[TargetActiveIndex].node?.targetId?.domain?.domain}
                  </p> */}
                  <Button style={{ float: 'right', marginTop: '15px' }} onClick={this.showDrawer}>
                    BR
                  </Button>
                </>
              ) : (
                ''
              )}
            </Card>
            {/* End of Header block details */}
            <Row>
              {/* Target video section */}
              <Col xs={24} sm={24} md={12} lg={12} xl={12} style={borderOnePixel}>
                <Card bodyStyle={{ padding: '5px', border: 'none' }} style={{ border: 'none' }}>
                  {MasterSession.targets.edges[TargetActiveIndex].node.videos.edges.length > 0 ? (
                    <>
                      {/* <iframe
                        width="100%"
                        height="250px"
                        title="0"
                        src={MasterSession.targets.edges[TargetActiveIndex].node.videos.edges[0].node.url}
                        frameborder="0"
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen
                      /> */}
                      {VideoLoading === true ? 
                        <p>Loading video...</p>
                      :
                        <>
                          {VideoAvailable === true ?

                            <ReactPlayer url={VideoUrl} controls height="250px" width="100%" />
                            :
                            <Empty />
                          }
                        </>
                      }
                      
                      
                    </>
                    )
                  :
                    <Empty style={{height: '250px'}} />
                  }
                </Card>
              </Col>
              {/* End of target video section */}
              {/* Target recording section */}
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                {MasterSession.targets.edges[TargetActiveIndex].node.targetAllcatedDetails.targetType.id === peakId ?
                  <PeakRecordingBlock />
                :
                  <DataRecordingBlock />
                }
              </Col>
              {/* End of Target recording section */}
            </Row>
            {/* Trials list section */}
            <Card bodyStyle={{ padding: '5px', border: 'none' }} style={{ border: 'none' }}>
            {MasterSession.targets.edges[TargetActiveIndex].node.targetAllcatedDetails.targetType.id === peakId ?
              <PeakTrialBoxes
                trails={10}
                boxWidth='65px'
                boxHeight='20px'
              />
              :
              <>
              {MasterSession.targets.edges[TargetActiveIndex].node.sd.edges.length > 0 ? (
                <>
                  {MasterSession.targets.edges[TargetActiveIndex].node.sd.edges.map(item2 => (
                    <>
                      <span>Stimulus : {item2.node.sd} </span>
                      <br />
                      <TrialsList
                        key={MasterSession.targets.edges[TargetActiveIndex].node.id}
                        id={MasterSession.targets.edges[TargetActiveIndex].node.id}
                        sdKey={item2.node.id}
                        stepKey=""
                        dailyTrails={
                          MasterSession.targets.edges[TargetActiveIndex].node.targetAllcatedDetails
                            .DailyTrials
                        }
                        boxWidth="35px"
                      />
                      <br />
                    </>
                  ))}
                </>
              ) : MasterSession.targets.edges[TargetActiveIndex].node.steps.edges.length > 0 ? (
                <>
                  {MasterSession.targets.edges[TargetActiveIndex].node.steps.edges.map(item3 => (
                    <>
                      <span>Step : {item3.node.step} </span>
                      <br />
                      <TrialsList
                        key={MasterSession.targets.edges[TargetActiveIndex].node.id}
                        id={MasterSession.targets.edges[TargetActiveIndex].node.id}
                        sdKey=""
                        stepKey={item3.node.id}
                        dailyTrails={
                          MasterSession.targets.edges[TargetActiveIndex].node.targetAllcatedDetails
                            .DailyTrials
                        }
                        boxWidth="35px"
                      />
                      <br />
                    </>
                  ))}
                </>
              ) : (
                <TrialsList
                  key={MasterSession.targets.edges[TargetActiveIndex].node.id}
                  id={MasterSession.targets.edges[TargetActiveIndex].node.id}
                  sdKey=""
                  stepKey=""
                  dailyTrails={
                    MasterSession.targets.edges[TargetActiveIndex].node.targetAllcatedDetails
                      .DailyTrials
                  }
                  boxWidth="35px"
                />
              )}
              </>
              }

              {/* <TrialsList 
                key={MasterSession.targets.edges[TargetActiveIndex].node.id}
                id={MasterSession.targets.edges[TargetActiveIndex].node.id}
                sdKey=''
                stepKey=''
                dailyTrails={MasterSession.targets.edges[TargetActiveIndex].node.targetAllcatedDetails.DailyTrials}
                boxWidth='35px' 
              /> */}
              <br />
              {MasterSession.targets.edgeCount > TargetActiveIndex + 1 ? (
                <>
                  <Button style={{ float: 'right' }} onClick={this.changeTarget}>
                    Next
                  </Button>
                  &nbsp;
                  {/* <Button onClick={this.saveData} type="primary">Save and Next</Button>  */}
                </>
              ) : (
                <>
                  <Button style={{ float: 'right' }} disabled>
                    Next
                  </Button>
                  &nbsp;
                  {/* <Button onClick={this.saveData} type="primary">Save</Button> */}
                </>
              )}

              {TargetActiveIndex === 0 ? (
                <>
                  <Button style={{ float: 'right', marginRight: '10px' }} disabled>
                    Prev
                  </Button>
                  &nbsp;
                  {/* <Button onClick={this.saveData} type="primary">Save and Next</Button>  */}
                </>
              ) : (
                <>
                  <Button
                    style={{ float: 'right', marginRight: '10px' }}
                    onClick={this.moveToPreviousTarget}
                  >
                    Prev
                  </Button>
                  &nbsp;
                  {/* <Button onClick={this.saveData} type="primary">Save</Button> */}
                </>
              )}
            </Card>
            {/* End of Trials list section */}
            {this.state.visible && (
              <Drawer
                height="90%"
                placement="bottom"
                closable={false}
                onClose={this.onClose}
                visible={this.state.visible}
                getContainer={false}
                style={{ position: 'absolute' }}
              >
                <RecordView />
              </Drawer>
            )}
            <Drawer
              height="90%"
              placement="bottom"
              closable={false}
              onClose={this.onClose}
              visible={this.state.visible}
              getContainer={false}
              style={{ position: 'absolute' }}
            >
              <RecordView />
            </Drawer>
            <Drawer
              title="Target Instruction"
              width="40%"
              placement="left"
              closable={false}
              onClose={this.onTargetClose}
              visible={this.state.targetVisible}
              getContainer={false}
              style={{ position: 'absolute' }}
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: MasterSession.targets.edges[TargetActiveIndex].node.targetInstr,
                }}
              />
            </Drawer>
          </Col>
          {/* End of Main target recording area */}
          {/* clock and target list portion */}
          <Col xs={0} sm={6} md={6} lg={6} xl={6} style={style3}>
            <SessionClock />
            <div style={targetBlockStyle}>
              <TargetListBlock />
            </div>
          </Col>
          {/* End of clock and target list portion */}
        </Row>
      </Authorize>
    )
  }
}

export default DataRecording
