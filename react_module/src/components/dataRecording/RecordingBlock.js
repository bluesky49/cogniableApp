/* eslint-disable react/jsx-indent */
import React from 'react'
import { Form, Collapse, Card, Button, Tooltip, Radio, Input, InputNumber } from 'antd'
import { LeftOutlined, RightOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons'

const { Panel } = Collapse

class RecordingBlock extends React.Component {
  state = {
    count: 1,
    percentage: 0.0,
    correct: 0,
    collapseCount: 1,
    totalSteps: 3,
    stepTrails: 5,
    stepCount: 1,
    sdName: ['stimulus one', 'stimulus two', 'stimulus three', 'stimulus four', 'stimulus five'],
    sdTrailCount: 1,
    totalSd: 5,
    sdCount: 1,
    sdRequiredTrails: 5,
  }

  onSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info)
  }

  addCount(This, val) {
    this.setState({
      count: val + 1,
      percentage: ((This.state.correct + 1) * 100) / This.state.count,
      correct: This.state.correct + 1,
    })
    console.log(This.state.count, This.state.correct + 1)
  }

  removeCount(This, val) {
    this.setState({
      count: val + 1,
      percentage: (This.state.correct * 100) / This.state.count,
    })
  }

  addStepCount(This, val) {
    if (This.state.stepTrails > val) {
      this.setState({
        stepCount: val + 1,
      })
    } else {
      this.setState({
        stepCount: 1,
        collapseCount: This.state.collapseCount + 1,
      })
    }
    // console.log(This.state.count, This.state.correct+1)
  }

  addSdCount(This, val) {
    if (This.state.sdRequiredTrails > val) {
      this.setState({
        sdTrailCount: val + 1,
      })
    } else {
      this.setState({
        sdTrailCount: 1,
        sdCount: This.state.sdCount + 1,
        // sdName: This.state.sdName + This.state.sdCount
      })
    }
    // console.log(This.state.count, This.state.correct+1)
  }

  nextSd(This, sdCount) {
    if (This.state.totalSd > sdCount) {
      this.setState({
        sdCount: sdCount + 1,
        sdTrailCount: 1,
      })
    }
  }

  previousSd(This, sdCount) {
    if (This.state.sdCount > 1) {
      this.setState({
        sdCount: sdCount - 1,
        sdTrailCount: 1,
      })
    }
  }

  changeCollapse(count) {
    this.setState({
      collapseCount: count,
    })
    console.log(count)
  }

  render() {
    const {
      count,
      correct,
      percentage,
      collapseCount,
      totalSteps,
      stepTrails,
      stepCount,
      sdName,
      sdCount,
      sdTrailCount,
      totalSd,
      sdRequiredTrails,
    } = this.state
    return (
      <>
        <Card style={{ width: '100%', backgroundColor: '#fbfbfb' }}>
          <Card
            style={{ width: '96%', backgroundColor: 'white', margin: '10px auto', height: '530px' }}
          >
            <h5 style={{ textAlign: 'center' }}>
              18.10060 - Sits in a small group for 10 minutes, attends to the teacher/material for
              50% of the period
            </h5>
            <br />
            <span>{percentage} % Correct</span> <span style={{ float: 'right' }}>In-Therapy</span>
            <br />
            <br />
            <p style={{ textAlign: 'center' }}>Trail {count}/No max</p>
            {/* <br /> */}
            <p style={{ textAlign: 'center', marginTop: '4px' }}>
              <Button style={{ padding: '0 70px' }} onClick={() => this.removeCount(this, count)}>
                <CloseOutlined />
              </Button>{' '}
              &nbsp;
              <Button
                style={{ padding: '0 70px' }}
                onClick={() => this.addCount(this, count, correct)}
              >
                <CheckOutlined />
              </Button>
            </p>
            <p style={{ textAlign: 'center', marginTop: '4px' }}>
              <Button style={{ padding: '0 20px' }}>Prompt 1</Button>
              <Button style={{ padding: '0 20px', marginLeft: '2px' }}>Prompt 2</Button>
              <Button style={{ padding: '0 20px', marginLeft: '2px' }}>Prompt 3</Button>
              <Button style={{ padding: '0 20px', marginLeft: '2px' }}>Prompt 4</Button>
            </p>
          </Card>
          {/* </Card>
            <Card style={{ width: '100%', backgroundColor:'#fbfbfb'}}> */}
          <Card
            style={{ width: '96%', backgroundColor: 'white', margin: '10px auto', height: '530px' }}
          >
            <h5 style={{ textAlign: 'center' }}>
              18.10060 - Sits in a small group for 10 minutes, attends to the teacher/material for
              50% of the period
            </h5>
            <br />
            <span>{percentage} % Correct</span> <span style={{ float: 'right' }}>In-Therapy</span>
            <br />
            <br />
            <p style={{ textAlign: 'center', marginTop: '-4px' }}>{sdName[sdCount - 1]}</p>
            <Tooltip title="previous trail">
              <Button
                style={{ float: 'left', marginLeft: '40px' }}
                onClick={() => this.previousSd(this, sdCount)}
              >
                <LeftOutlined />
              </Button>
            </Tooltip>
            <Tooltip title="next trail">
              <Button
                style={{ float: 'right', marginRight: '40px' }}
                onClick={() => this.nextSd(this, sdCount)}
              >
                <RightOutlined />
              </Button>
            </Tooltip>
            <p style={{ textAlign: 'center', marginTop: '4px' }}>
              Stimulus {sdCount}/{totalSd}
            </p>
            <br />
            <p style={{ textAlign: 'center' }}>
              Trail {sdTrailCount}/{sdRequiredTrails}
            </p>
            {/* <br /> */}
            <p style={{ textAlign: 'center', marginTop: '4px' }}>
              <Button
                style={{ padding: '0 70px' }}
                onClick={() => this.addSdCount(this, sdTrailCount)}
              >
                <CloseOutlined />
              </Button>{' '}
              &nbsp;
              <Button
                style={{ padding: '0 70px' }}
                onClick={() => this.addSdCount(this, sdTrailCount)}
              >
                <CheckOutlined />
              </Button>
            </p>
            <p style={{ textAlign: 'center', marginTop: '4px' }}>
              <Button style={{ padding: '0 20px' }}>Prompt 1</Button>
              <Button style={{ padding: '0 20px', marginLeft: '2px' }}>Prompt 2</Button>
              <Button style={{ padding: '0 20px', marginLeft: '2px' }}>Prompt 3</Button>
              <Button style={{ padding: '0 20px', marginLeft: '2px' }}>Prompt 4</Button>
            </p>
          </Card>
          <Card
            style={{ width: '96%', backgroundColor: 'white', margin: '10px auto', height: '530px' }}
          >
            <h5 style={{ textAlign: 'center' }}>
              18.10060 - Sits in a small group for 10 minutes, attends to the teacher/material for
              50% of the period
            </h5>
            <br />
            <span>{percentage} % Correct</span> <span style={{ float: 'right' }}>In-Therapy</span>
            <br />
            <br />
            {/* <br /> */}
            <Collapse accordion activeKey={collapseCount}>
              <Panel header="Step 1 : Instruction 1" key="1">
                <p style={{ textAlign: 'center' }}>
                  Trail {stepCount}/{stepTrails}
                </p>
                <p style={{ textAlign: 'center', marginTop: '4px' }}>
                  <Button
                    style={{ padding: '0 70px' }}
                    onClick={() => this.removeCount(this, count)}
                  >
                    <CloseOutlined />
                  </Button>{' '}
                  &nbsp;
                  <Button
                    style={{ padding: '0 70px' }}
                    onClick={() => this.addStepCount(this, stepCount, collapseCount, totalSteps)}
                  >
                    <CheckOutlined />
                  </Button>
                </p>
                <p style={{ textAlign: 'center', marginTop: '4px' }}>
                  <Button style={{ padding: '0 20px' }}>Prompt 1</Button>
                  <Button style={{ padding: '0 20px', marginLeft: '2px' }}>Prompt 2</Button>
                  <Button style={{ padding: '0 20px', marginLeft: '2px' }}>Prompt 3</Button>
                  <Button style={{ padding: '0 20px', marginLeft: '2px' }}>Prompt 4</Button>
                </p>
              </Panel>
              <Panel header="Step 2 : Instruction 2" key="2">
                <p style={{ textAlign: 'center' }}>
                  Trail {stepCount}/{stepTrails}
                </p>
                <p style={{ textAlign: 'center', marginTop: '4px' }}>
                  <Button
                    style={{ padding: '0 70px' }}
                    onClick={() => this.removeCount(this, count)}
                  >
                    <CloseOutlined />
                  </Button>{' '}
                  &nbsp;
                  <Button
                    style={{ padding: '0 70px' }}
                    onClick={() => this.addStepCount(this, stepCount, correct)}
                  >
                    <CheckOutlined />
                  </Button>
                </p>
                <p style={{ textAlign: 'center', marginTop: '4px' }}>
                  <Button style={{ padding: '0 20px' }}>Prompt 1</Button>
                  <Button style={{ padding: '0 20px', marginLeft: '2px' }}>Prompt 2</Button>
                  <Button style={{ padding: '0 20px', marginLeft: '2px' }}>Prompt 3</Button>
                  <Button style={{ padding: '0 20px', marginLeft: '2px' }}>Prompt 4</Button>
                </p>
              </Panel>
              <Panel header="Step 3 : Instruction 3" key="3">
                <p style={{ textAlign: 'center' }}>
                  Trail {stepCount}/{stepTrails}
                </p>
                <p style={{ textAlign: 'center', marginTop: '4px' }}>
                  <Button
                    style={{ padding: '0 70px' }}
                    onClick={() => this.removeCount(this, count)}
                  >
                    <CloseOutlined />
                  </Button>{' '}
                  &nbsp;
                  <Button
                    style={{ padding: '0 70px' }}
                    onClick={() => this.addStepCount(this, stepCount, correct)}
                  >
                    <CheckOutlined />
                  </Button>
                </p>
                <p style={{ textAlign: 'center', marginTop: '4px' }}>
                  <Button style={{ padding: '0 20px' }}>Prompt 1</Button>
                  <Button style={{ padding: '0 20px', marginLeft: '2px' }}>Prompt 2</Button>
                  <Button style={{ padding: '0 20px', marginLeft: '2px' }}>Prompt 3</Button>
                  <Button style={{ padding: '0 20px', marginLeft: '2px' }}>Prompt 4</Button>
                </p>
              </Panel>
            </Collapse>
          </Card>
          {/* </Card>
            <Card style={{ width: '100%', backgroundColor:'#f6f7fb'}}> */}
          <Card style={{ width: '96%', backgroundColor: 'white', margin: '10px auto' }}>
            <h5 style={{ textAlign: 'center' }}>
              18.10060 - Sits in a small group for 10 minutes, attends to the teacher/material for
              50% of the period
            </h5>
            <br />
            <span>% Correct</span> <span style={{ float: 'right' }}>In-Therapy</span>
            <br />
            <br />
            <p style={{ textAlign: 'center', marginTop: '4px' }}>Trail 1/No max</p>
            <p style={{ textAlign: 'center', marginTop: '14px' }}>
              <Radio.Group>
                <Radio.Button value="correct">Correct</Radio.Button>
                <Radio.Button value="error">Error</Radio.Button>
                <Radio.Button value="no-response">No Response</Radio.Button>
                <Radio.Button value="delayed">Prompt</Radio.Button>
              </Radio.Group>
            </p>
            <p style={{ textAlign: 'center', marginTop: '4px' }}>
              <Button style={{ padding: '0 20px' }}>Prompt 1</Button>
              <Button style={{ padding: '0 20px', marginLeft: '2px' }}>Prompt 2</Button>
              <Button style={{ padding: '0 20px', marginLeft: '2px' }}>Prompt 3</Button>
              <Button style={{ padding: '0 20px', marginLeft: '2px' }}>Prompt 4</Button>
            </p>
          </Card>
          <Card style={{ width: '96%', backgroundColor: 'white', margin: '10px auto' }}>
            <h5 style={{ textAlign: 'center' }}>
              18.10060 - Sits in a small group for 10 minutes, attends to the teacher/material for
              50% of the period
            </h5>
            <br />
            <span>% Correct</span> <span style={{ float: 'right' }}>In-Therapy</span>
            <br />
            <br />
            <Tooltip title="previous trail">
              <Button style={{ float: 'left', marginLeft: '40px' }}>
                <LeftOutlined />
              </Button>
            </Tooltip>
            <Tooltip title="next trail">
              <Button style={{ float: 'right', marginRight: '40px' }}>
                <RightOutlined />
              </Button>
            </Tooltip>
            <p style={{ textAlign: 'center', marginTop: '4px' }}>Stimulus 1/5</p>
            <br />
            <p style={{ textAlign: 'center', marginTop: '4px' }}>Trail 1/No max</p>
            <p style={{ textAlign: 'center', marginTop: '14px' }}>
              <Radio.Group>
                <Radio.Button value="correct">Correct</Radio.Button>
                <Radio.Button value="error">Error</Radio.Button>
                <Radio.Button value="no-response">No Response</Radio.Button>
                <Radio.Button value="delayed">Prompt</Radio.Button>
              </Radio.Group>
            </p>
            <p style={{ textAlign: 'center', marginTop: '4px' }}>
              <Button style={{ padding: '0 20px' }}>Prompt 1</Button>
              <Button style={{ padding: '0 20px', marginLeft: '2px' }}>Prompt 2</Button>
              <Button style={{ padding: '0 20px', marginLeft: '2px' }}>Prompt 3</Button>
              <Button style={{ padding: '0 20px', marginLeft: '2px' }}>Prompt 4</Button>
            </p>
          </Card>
          <Card style={{ width: '96%', backgroundColor: 'white', margin: '10px auto' }}>
            <h5 style={{ textAlign: 'center' }}>
              18.10060 - Sits in a small group for 10 minutes, attends to the teacher/material for
              50% of the period
            </h5>
            <br />
            <span>% Correct</span> <span style={{ float: 'right' }}>In-Therapy</span>
            <br />
            <br />
            <Collapse accordion defaultActiveKey="1">
              <Panel header="Step 1 : Instruction 1" key="1">
                <p style={{ textAlign: 'center', marginTop: '4px' }}>Trail 1/No max</p>
                <p style={{ textAlign: 'center', marginTop: '14px' }}>
                  <Radio.Group>
                    <Radio.Button value="correct">Correct</Radio.Button>
                    <Radio.Button value="error">Error</Radio.Button>
                    <Radio.Button value="no-response">No Response</Radio.Button>
                    <Radio.Button value="delayed">Prompt</Radio.Button>
                  </Radio.Group>
                </p>
                <p style={{ textAlign: 'center', marginTop: '4px' }}>
                  <Button style={{ padding: '0 20px' }}>Prompt 1</Button>
                  <Button style={{ padding: '0 20px', marginLeft: '2px' }}>Prompt 2</Button>
                  <Button style={{ padding: '0 20px', marginLeft: '2px' }}>Prompt 3</Button>
                  <Button style={{ padding: '0 20px', marginLeft: '2px' }}>Prompt 4</Button>
                </p>
              </Panel>
              <Panel header="Step 2 : Instruction 2" key="2">
                <p style={{ textAlign: 'center', marginTop: '4px' }}>Trail 1/No max</p>
                <p style={{ textAlign: 'center', marginTop: '14px' }}>
                  <Radio.Group>
                    <Radio.Button value="correct">Correct</Radio.Button>
                    <Radio.Button value="error">Error</Radio.Button>
                    <Radio.Button value="no-response">No Response</Radio.Button>
                    <Radio.Button value="delayed">Prompt</Radio.Button>
                  </Radio.Group>
                </p>
                <p style={{ textAlign: 'center', marginTop: '4px' }}>
                  <Button style={{ padding: '0 20px' }}>Prompt 1</Button>
                  <Button style={{ padding: '0 20px', marginLeft: '2px' }}>Prompt 2</Button>
                  <Button style={{ padding: '0 20px', marginLeft: '2px' }}>Prompt 3</Button>
                  <Button style={{ padding: '0 20px', marginLeft: '2px' }}>Prompt 4</Button>
                </p>
              </Panel>
              <Panel header="Step 3 : Instruction 3" key="3">
                <p style={{ textAlign: 'center', marginTop: '4px' }}>Trail 1/No max</p>
                <p style={{ textAlign: 'center', marginTop: '14px' }}>
                  <Radio.Group>
                    <Radio.Button value="correct">Correct</Radio.Button>
                    <Radio.Button value="error">Error</Radio.Button>
                    <Radio.Button value="no-response">No Response</Radio.Button>
                    <Radio.Button value="delayed">Prompt</Radio.Button>
                  </Radio.Group>
                </p>
                <p style={{ textAlign: 'center', marginTop: '4px' }}>
                  <Button style={{ padding: '0 20px' }}>Prompt 1</Button>
                  <Button style={{ padding: '0 20px', marginLeft: '2px' }}>Prompt 2</Button>
                  <Button style={{ padding: '0 20px', marginLeft: '2px' }}>Prompt 3</Button>
                  <Button style={{ padding: '0 20px', marginLeft: '2px' }}>Prompt 4</Button>
                </p>
              </Panel>
            </Collapse>
          </Card>
          <Card
            style={{
              width: '96%',
              backgroundColor: 'white',
              margin: '10px auto',
              height: '540px',
              marginBottom: '200px',
            }}
          >
            <h5 style={{ textAlign: 'center' }}>
              18.10060 - Sits in a small group for 10 minutes, attends to the teacher/material for
              50% of the period
            </h5>
            <br />
            <span>% Correct</span> <span style={{ float: 'right' }}>In-Therapy</span>
            <br />
            <br />
            <div>
              <Form
                style={{ padding: '0 80px' }}
                layout={{
                  labelCol: { span: 4 },
                  wrapperCol: { span: 14 },
                }}
              >
                <Form.Item label="IRT" style={{ marginBottom: '0' }}>
                  <Radio.Group>
                    <Radio.Button value="horizontal" style={{ padding: '0 35px' }}>
                      -
                    </Radio.Button>
                    <Radio.Button value="vertical" style={{ padding: '0', border: 'none' }}>
                      <InputNumber style={{ borderRadius: '0' }} />
                    </Radio.Button>
                    <Radio.Button value="inline" style={{ padding: '0 35px' }}>
                      +
                    </Radio.Button>
                  </Radio.Group>
                </Form.Item>
                <Form.Item label="Frequency" style={{ marginBottom: '0' }}>
                  <Radio.Group>
                    <Radio.Button value="horizontal" style={{ padding: '0 35px' }}>
                      -
                    </Radio.Button>
                    <Radio.Button value="vertical" style={{ padding: '0', border: 'none' }}>
                      <InputNumber style={{ borderRadius: '0' }} />
                    </Radio.Button>
                    <Radio.Button value="inline" style={{ padding: '0 35px' }}>
                      +
                    </Radio.Button>
                  </Radio.Group>
                </Form.Item>
                <Form.Item label="Duration" style={{ marginBottom: '0' }}>
                  <Input placeholder="input placeholder" />
                </Form.Item>
                <Form.Item>
                  <Button type="primary">Submit</Button>
                </Form.Item>
              </Form>
            </div>
          </Card>
        </Card>
      </>
    )
  }
}

export default RecordingBlock
