/* eslint-disable react/jsx-indent */
import React from 'react'
import { Helmet } from 'react-helmet'
import { Row, Col, Card, Button, Layout, Icon, Badge, Typography, Progress } from 'antd'
import Authorize from 'components/LayoutComponents/Authorize'
import './videoSession.scss'
import Stimulus from 'components/parentsSession'
import Staps from 'components/parentsSession/steps'
import Target from 'components/parentsSession/target'
import SessionClock from 'components/parentsSession/sessionClock'

class VideoSession extends React.Component {
  constructor() {
    super()
    this.state = {
      Box: { paddingBottom: '20px', paddingLeft: '210px', paddingRight: '210px' },
      span: 16,
      borderBox: {
        paddingBottom: '20px',
        textAlign: 'center',
        marginLeft: '10px',
        marginRight: '10px',
      },
      Incorect: false,
      dataType: {},
      IncorectBtn: {
        backgroundColor: 'white',
        color: 'black',
        height: '70px',
        width: '70%',
      },
      correctbtn: {
        backgroundColor: 'white',
        color: 'black',
        height: '70px',
        width: '70%',
      },
      arr: [
        {
          type: 'target',
        },
        {
          type: 'stimulus',
          data: [0, 1, 2, 3, 4, 5, 6, 7],
        },
        {
          type: 'steps',
          data: [0, 1, 2, 3, 4, 5, 6, 7],
        },
      ],
    }
  }

  handleArow = () => {
    const { Box } = this.state
    if (Box.paddingLeft === '210px') {
      this.setState({
        Box: {
          paddingBottom: '20px',
          paddingLeft: '0px',
          paddingRight: '0px',
        },
        span: 8,
      })
    } else {
      this.setState({
        Box: {
          paddingBottom: '20px',
          paddingLeft: '210px',
          paddingRight: '210px',
        },
        span: 16,
      })
    }
  }

  handleIncorectbtn = () => {
    this.setState({
      Incorect: true,
    })
  }

  handlePrompt = () => {
    this.setState({
      Incorect: false,
      IncorectBtn: {
        backgroundColor: '#FF8080',
        color: 'white',
        height: '70px',
        width: '70%',
      },
    })
  }

  handleRight = () => {
    this.setState({
      dataType: { type: 'staps' },
      IncorectBtn: {
        backgroundColor: 'white',
        color: 'black',
        height: '70px',
        width: '70%',
      },
      correctbtn: {
        backgroundColor: 'white',
        color: 'black',
        height: '70px',
        width: '70%',
      },
      borderBox: {
        border: '1px solid',
        paddingBottom: '20px',
        textAlign: 'center',
        marginLeft: '50px',
        marginRight: '50px',
      },
    })
  }

  handleLeft = () => {
    this.setState({
      dataType: { type: 'stimulus' },
      IncorectBtn: {
        backgroundColor: 'white',
        color: 'black',
        height: '70px',
        width: '70%',
      },
      correctbtn: {
        backgroundColor: 'white',
        color: 'black',
        height: '70px',
        width: '70%',
      },
      borderBox: {
        border: '1px solid',
        paddingBottom: '20px',
        textAlign: 'center',
        marginLeft: '50px',
        marginRight: '50px',
      },
    })
  }

  handlCorrect = () => {
    this.setState({
      correctbtn: {
        backgroundColor: '#4BAEA0',
        color: 'white',
        height: '70px',
        width: '70%',
      },
    })
  }

  handleLeftBtnArrow = () => {
    this.setState({ dataType: { type: 'staps' } })
  }

  handleRightBtnArrow = () => {
    this.setState({ dataType: { type: 'stimulus' } })
  }

  render() {
    const { Content } = Layout
    const { Title, Text } = Typography
    const { Meta } = Card
    const { Box, span, Incorect, IncorectBtn, correctbtn, arr, dataType, borderBox } = this.state
    const stimulus = (
      <div style={{ textAlign: 'center' }}>
        <Text style={{ padding: '10px' }}>
          Stimulus Description <br /> &nbsp;&nbsp;&nbsp;Stimulus 1 of 3{' '}
        </Text>
      </div>
    )
    const staps = (
      <div style={{ textAlign: 'center' }}>
        <Text style={{ padding: '10px' }}>
          Steps Description <br />
          &nbsp;&nbsp;&nbsp; Stimulus 1to 3
        </Text>
      </div>
    )
    const prompt = arr[1].data.map(data => {
      if (data) {
        return (
          <div style={{ textAlign: 'center', paddingTop: '10px' }}>
            <Button
              onClick={() => this.handlePrompt()}
              style={{
                backgroundColor: '#f2f4f8',
                height: '40px',
                width: '60%',
              }}
            >
              Prompt {data.data}
            </Button>
          </div>
        )
      }
      return null
    })
    let progress = ['#FF9C52', '#4BAEA0', '#f42733', '0', '0', '0', '0', '0']
    progress = progress.map(data => {
      if (data) {
        return (
          <Text>
            &nbsp;
            <Progress
              showInfo={false}
              status="active"
              strokeColor={data}
              percent={100}
              style={{ width: '10%' }}
            />
            &nbsp;
          </Text>
        )
      }
      return null
    }, {})
    return (
      <Authorize roles={['school_admin', 'parents']} to="/dashboard/beta">
        <Helmet title="Partner" />
        <Layout>
          <Content>
            <Row>
              <Col span={span} style={Box}>
                <Title type="secondary" style={{ paddingTop: '20px' }} level={4}>
                  MORNING SESSION{' '}
                </Title>
                <Card
                  hoverable
                  cover={
                    <img
                      alt="example"
                      src="https://www.familyeducation.com/sites/default/files/2019-03/traits-babies-inherit-from-their-father_feature.jpg"
                      style={{ maxHeight: '300px' }}
                    />
                  }
                >
                  <Meta
                    title="Kunal names the Presented Complex action by watching "
                    description="visual perfaction "
                  />
                  {!dataType.type ? progress : null}
                  <div>
                    <br />
                    {dataType.type === 'staps' ? staps : null}
                    {dataType.type === 'stimulus' ? stimulus : null}
                    <br />
                    {dataType.type ? (
                      <Button
                        style={{
                          float: 'left',
                          transition: '.60s ease',
                          marginTop: '120px',
                        }}
                        onClick={() => this.handleLeftBtnArrow()}
                      >
                        <Icon type="left" />
                      </Button>
                    ) : null}
                    {dataType.type ? (
                      <Button
                        style={{ float: 'right', transition: '.60s ease', marginTop: '120px' }}
                        onClick={() => this.handleRightBtnArrow()}
                      >
                        <Icon type="right" />
                      </Button>
                    ) : null}
                    <div style={borderBox}>
                      <br />
                      <Text style={{ border: '1px solid ', padding: '8px' }}>
                        <Icon type="left" />
                        &nbsp; Daily Trail 6 &nbsp;
                        <Icon type="right" />
                      </Text>
                      <br />
                      <br />
                      {Incorect === true ? (
                        prompt
                      ) : (
                        <div>
                          <Button
                            style={correctbtn}
                            onClick={() => {
                              this.handlCorrect()
                            }}
                          >
                            Correct&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <Badge count={10} style={{ backgroundColor: 'grey' }} /> <br />
                          </Button>
                          <br />

                          <br />
                          <Button
                            style={IncorectBtn}
                            onClick={() => {
                              this.handleIncorectbtn()
                            }}
                          >
                            Incorrect &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <Badge count={10} style={{ backgroundColor: 'grey' }} /> <br />
                          </Button>
                        </div>
                      )}
                    </div>
                    {dataType.type === 'staps' ? <Staps data={dataType.data} /> : null}
                    {dataType.type === 'stimulus' ? <Stimulus data={dataType.data} /> : null}
                    <br />
                    <br />
                    <div style={{ textAlign: 'right' }}>
                      <Button onClick={() => this.handleLeft()}>
                        <Icon type="left" />
                      </Button>
                      &nbsp;&nbsp;&nbsp;
                      <Button onClick={() => this.handleRight()}>
                        <Icon type="right" />
                      </Button>
                    </div>
                    <br />
                  </div>
                </Card>
              </Col>
              {span === 8 ? (
                <Col span={span} style={Box}>
                  <div>empty</div>
                </Col>
              ) : null}
              <Col span={1}>
                <br />
                <Title
                  style={{
                    float: 'left',
                    width: '100%',
                    height: '40px',
                    marginTop: '34px',
                    backgroundColor: '#f2f4f8',
                    color: '#1d90fa',
                  }}
                  onClick={() => {
                    this.handleArow()
                  }}
                >
                  {' '}
                  <Icon type="thunderbolt" />
                </Title>
              </Col>
              <Col span={7} style={{ padding: '20px' }}>
                <SessionClock />
                <Title type="secondary" level={4} style={{ textAlign: 'left' }}>
                  Upcoming target <Icon type="align-right" style={{ float: 'right' }} />
                </Title>
                <div className="targeVideo">
                  <Target />
                </div>
              </Col>
            </Row>
          </Content>
        </Layout>
      </Authorize>
    )
  }
}

export default VideoSession
