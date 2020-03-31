import React from 'react'
import { Helmet } from 'react-helmet'
import ChartistGraph from 'react-chartist'
import ChartistTooltip from 'chartist-plugin-tooltips-updated'
import { Row, Col, Select, Form, Collapse, Card,Button, Tooltip, Radio, Tree, Icon, Input, InputNumber } from 'antd';
// import Stopwatch from 'components/StopWatch'
import Authorize from 'components/LayoutComponents/Authorize'

import { LeftOutlined,RightOutlined,CheckOutlined,CloseOutlined } from '@ant-design/icons';
// import style from './dataRecording.scss'


const { Panel } = Collapse;
// const data = [
//     '18.10060 - Sits in a small group for 10 minutes, attends to the teacher/material for 50% of the period',
//     '18.10060 - Sits in a small group for 10 minutes, attends to the teacher/material for 50% of the period',
//     '18.10060 - Sits in a small group for 10 minutes, attends to the teacher/material for 50% of the period',
//     '18.10060 - Sits in a small group for 10 minutes, attends to the teacher/material for 50% of the period',
//     'Los Angeles battles huge wildfires.',
//   ];

const { TreeNode } = Tree;

const smilData = {
    labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
    series: [
      [12, 9, 7, 8, 5, 4, 6, 2, 3, 3, 4, 6],
      [4, 5, 3, 7, 3, 5, 5, 3, 4, 4, 5, 5],
      [5, 3, 4, 5, 6, 3, 3, 4, 5, 6, 3, 4],
      [3, 4, 5, 6, 7, 6, 4, 5, 6, 7, 6, 3],
    ],
  }
  
  const smilOptions = {
    low: 0,
    plugins: [ChartistTooltip({ anchorToPoint: false, appendToBody: true, seriesName: false })],
    seq: 0,
  }
  
  const smilListener = {
    created() {
      smilOptions.seq = 0
    },
    draw(data) {
      const delays = 80
      const durations = 500
  
      if (data.type === 'line') {
        smilOptions.seq += 1
        data.element.animate({
          opacity: {
            begin: smilOptions.seq * delays + 1e3,
            dur: durations,
            from: 0,
            to: 1,
          },
        })
      } else if (data.type === 'label' && data.axis === 'x')
        data.element.animate({
          y: {
            begin: smilOptions.seq * delays,
            dur: durations,
            from: data.y + 100,
            to: data.y,
            easing: 'easeOutQuart',
          },
        })
      else if (data.type === 'label' && data.axis === 'y')
        data.element.animate({
          x: {
            begin: smilOptions.seq * delays,
            dur: durations,
            from: data.x - 100,
            to: data.x,
            easing: 'easeOutQuart',
          },
        })
      else if (data.type === 'point')
        data.element.animate({
          x1: {
            begin: smilOptions.seq * delays,
            dur: durations,
            from: data.x - 10,
            to: data.x,
            easing: 'easeOutQuart',
          },
          x2: {
            begin: smilOptions.seq * delays,
            dur: durations,
            from: data.x - 10,
            to: data.x,
            easing: 'easeOutQuart',
          },
          opacity: {
            begin: smilOptions.seq * delays,
            dur: durations,
            from: 0,
            to: 1,
            easing: 'easeOutQuart',
          },
        })
      else if (data.type === 'grid') {
        const pos1Animation = {
          begin: smilOptions.seq * delays,
          dur: durations,
          from: data[`${data.axis.units.pos}1`] - 30,
          to: data[`${data.axis.units.pos}1`],
          easing: 'easeOutQuart',
        }
        const pos2Animation = {
          begin: smilOptions.seq * delays,
          dur: durations,
          from: data[`${data.axis.units.pos}2`] - 100,
          to: data[`${data.axis.units.pos}2`],
          easing: 'easeOutQuart',
        }
        const ctAnimations = {}
        ctAnimations[`${data.axis.units.pos}1`] = pos1Animation
        ctAnimations[`${data.axis.units.pos}2`] = pos2Animation
        ctAnimations.opacity = {
          begin: smilOptions.seq * delays,
          dur: durations,
          from: 0,
          to: 1,
          easing: 'easeOutQuart',
        }
        data.element.animate(ctAnimations)
      }
    },
  }


class DataRecording extends React.Component {

    state = {
        count : 1,
        percentage :0.0,
        correct:0,
        collapseCount:1,
        totalSteps:3,
        stepTrails:5,
        stepCount:1,
        sdName: ['stimulus one','stimulus two', 'stimulus three', 'stimulus four', 'stimulus five'],
        sdTrailCount:1,
        totalSd:5,
        sdCount:1,
        sdRequiredTrails:5,

        

        
    }

    

    onSelect = (selectedKeys, info) => {
        console.log('selected', selectedKeys, info);
    };

    addCount(This, val){
        this.setState({
            count: val+1 ,
            percentage: ((This.state.correct+1)*100/This.state.count),
            correct: This.state.correct +1,
        })
        console.log(This.state.count, This.state.correct+1)
    }

    removeCount(This, val){
       
        this.setState({
            count:val+1,
            percentage: ((This.state.correct)*100/This.state.count),            
        })
      
    }

    addStepCount(This, val){
        if (This.state.stepTrails > val){
            this.setState({
                stepCount: val+1,
            })        
        }
        else{
            this.setState({
                stepCount: 1,
                collapseCount: This.state.collapseCount+1,
            })

        }
        // console.log(This.state.count, This.state.correct+1)
    }

    addSdCount(This, val){
        if (This.state.sdRequiredTrails > val){
            this.setState({
                sdTrailCount: val+1,
            })        
        }
        else{
            this.setState({
                sdTrailCount: 1,
                sdCount: This.state.sdCount+1,
                // sdName: This.state.sdName + This.state.sdCount
            })

        }
        // console.log(This.state.count, This.state.correct+1)
    }

    nextSd(This, sdCount){
        if (This.state.totalSd > sdCount){
            this.setState({
                sdCount: sdCount+1,
                sdTrailCount: 1,
            })
        }
    }

    previousSd(This, sdCount){
        if (This.state.sdCount > 1){
            this.setState({
                sdCount: sdCount-1,
                sdTrailCount: 1,
            })
        }
    }

    changeCollapse(count){
        this.setState({
            collapseCount: count
        })
        console.log(count)
    }
      
    
  render() {
    const style1 = { border:'1px solid #f6f7fb', Height:'700px', backgroundColor:'white', padding:'5px'};
    const style2 = { border:'1px solid #f6f7fb', height:'700px', overflow:'auto'};
    const style3 = { border:'1px solid #f6f7fb', Height:'700px', backgroundColor:'white' };
    const {count,correct, percentage, collapseCount, totalSteps, stepTrails, stepCount,
           sdName, sdCount, sdTrailCount, totalSd, sdRequiredTrails } = this.state;
    // const cardStyle = {borderRadius:'0'}
    return (
      <Authorize roles={[1]} redirect to="/dashboard/beta">
        <Helmet title="Partner" />
        {/* <div className="utils__title utils__title--flat mb-3">
          <strong className="text-uppercase font-size-16">Target Type Mapping</strong>
        </div> */}
        {/* <div className="row justify-content-md-center"> */}
        <Row style={{padding:'0', marginRight:'-30px', marginLeft:'-30px', marginTop:'-30px', display:'flex' }}>
          <Col xs={0} sm={6} md={6} lg={5} xl={5} style={style1}>
            <Collapse bordered={false}>
              <Panel header="Filters" key="1">
                <Form
                
                  labelCol={{
                    span: 8,
                  }}
                  wrapperCol={{
                    span: 14,
                  }}
                  layout="horizontal"
                  labelAlign='left'
                  initialValues={{
                    size: 'middle'
                  }}
                
                  size='middle'
                
                
                >
                  <Form.Item label="Domain">
                    <Select>
                      <Select.Option value="demo">Demo</Select.Option>
                    </Select>
                  </Form.Item>
                  <Form.Item label="Assessment" style={{marginTop:'-25px'}}>
                    <Select>
                      <Select.Option value="demo">Demo</Select.Option>
                    </Select>
                  </Form.Item>
                  <Form.Item label="Status" style={{marginTop:'-25px'}}>
                    <Select>
                      <Select.Option value="demo">Demo</Select.Option>
                    </Select>
                  </Form.Item>
                </Form>

              </Panel>
              
            </Collapse>
            
            <Tree
              showLine
              blockNode
              autoExpandParent
              switcherIcon={<Icon type="down" />}
              defaultExpandedKeys={[]}
              onSelect={this.onSelect}
              
            >
              <TreeNode title={<span>18.10060 - Sits in a small group for 10 minutes, attends to the teacher/material for 50% of the period</span>} key="0-0">
                <TreeNode title="Stimulus" key="0-0-0">
                  <TreeNode title="18.10060 - Sits in a small group for 10 minutes, attends to the teacher/material for 50% of the period" key="0-0-0-0" />
                  <TreeNode title="18.10060 - Sits in a small group for 10 minutes, attends to the teacher/material for 50% of the period" key="0-0-0-1" />
                  <TreeNode title="add stimulus" key="0-0-0-2" />
                </TreeNode>
                <TreeNode title="Steps" key="0-0-1">
                  <TreeNode title="18.10060 - Sits in a small group for 10 minutes, attends to the teacher/material for 50% of the period" key="0-0-1-0" />
                  <TreeNode title="add step" key="0-0-1-1" />
                </TreeNode>
              </TreeNode>
            </Tree>
            <hr style={{margin:'0'}} />
            <Tree
              showLine
              switcherIcon={<Icon type="down" />}
              defaultExpandedKeys={[]}
              onSelect={this.onSelect}
            >
              <TreeNode title="18.10060 - Sits in a small group for 10 minutes, attends to the teacher/material for 50% of the period" key="0-0">
                <TreeNode title="Stimulus" key="0-0-0">
                  <TreeNode title="leaf" key="0-0-0-0" />
                  <TreeNode title="leaf" key="0-0-0-1" />
                  <TreeNode title="add stimulus" key="0-0-0-2" />
                </TreeNode>
                <TreeNode title="Steps" key="0-0-1">
                  <TreeNode title="leaf" key="0-0-1-0" />
                  <TreeNode title="add step" key="0-0-1-1" />
                </TreeNode>
              </TreeNode>
            </Tree>
            <hr style={{margin:'0'}} />
            
            
            
            
          </Col>
          <Col xs={24} sm={6} md={6} lg={10} xl={10} style={style2}>
            <Card style={{ width: '100%', backgroundColor:'#fbfbfb'}}>
              <Card style={{ width: '96%', backgroundColor: 'white', margin:'10px auto', height:'530px'}}>
                <h5 style={{textAlign:'center'}}>18.10060 - Sits in a small group for 10 minutes, attends to the teacher/material for 50% of the period</h5>
                <br />
                <span>{percentage} % Correct</span> <span style={{float:'right'}}>In-Therapy</span>
                <br />
                <br />
                
                <p style={{textAlign:'center'}}>Trail {count}/No max</p>
                {/* <br /> */}
                <p style={{textAlign:'center', marginTop:'4px'}}>
                  <Button style={{padding:'0 70px'}} onClick={()=> this.removeCount(this,count)}><CloseOutlined /></Button> &nbsp;
                  <Button style={{padding:'0 70px'}} onClick={()=> this.addCount(this, count,correct)}><CheckOutlined /></Button>
                </p>
                <p style={{textAlign:'center', marginTop:'4px'}}>
                  <Button style={{padding:'0 20px'}}>Prompt 1</Button>
                  <Button style={{padding:'0 20px', marginLeft:'2px'}}>Prompt 2</Button>
                  <Button style={{padding:'0 20px', marginLeft:'2px'}}>Prompt 3</Button>
                  <Button style={{padding:'0 20px', marginLeft:'2px'}}>Prompt 4</Button>
                </p>
                
              </Card>
              {/* </Card>
            <Card style={{ width: '100%', backgroundColor:'#fbfbfb'}}> */}
              <Card style={{ width: '96%', backgroundColor: 'white', margin:'10px auto', height:'530px'}}>
                <h5 style={{textAlign:'center'}}>18.10060 - Sits in a small group for 10 minutes, attends to the teacher/material for 50% of the period</h5>
                <br />
                <span>{percentage} % Correct</span> <span style={{float:'right'}}>In-Therapy</span>
                <br />
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
                
                <p style={{textAlign:'center'}}>Trail {sdTrailCount}/{sdRequiredTrails}</p>
                {/* <br /> */}
                <p style={{textAlign:'center', marginTop:'4px'}}>
                  <Button style={{padding:'0 70px'}} onClick={()=> this.addSdCount(this, sdTrailCount)}><CloseOutlined /></Button> &nbsp;
                  <Button style={{padding:'0 70px'}} onClick={()=> this.addSdCount(this, sdTrailCount)}><CheckOutlined /></Button>
                </p>
                <p style={{textAlign:'center', marginTop:'4px'}}>
                  <Button style={{padding:'0 20px'}}>Prompt 1</Button>
                  <Button style={{padding:'0 20px', marginLeft:'2px'}}>Prompt 2</Button>
                  <Button style={{padding:'0 20px', marginLeft:'2px'}}>Prompt 3</Button>
                  <Button style={{padding:'0 20px', marginLeft:'2px'}}>Prompt 4</Button>
                </p>
                
              </Card>
              <Card style={{ width: '96%', backgroundColor: 'white', margin:'10px auto', height:'530px'}}>
                <h5 style={{textAlign:'center'}}>18.10060 - Sits in a small group for 10 minutes, attends to the teacher/material for 50% of the period</h5>
                <br />
                <span>{percentage} % Correct</span> <span style={{float:'right'}}>In-Therapy</span>
                <br />
                <br />
                
                
                {/* <br /> */}
                <Collapse accordion activeKey={collapseCount}>
                  <Panel header="Step 1 : Instruction 1" key="1">
                    
                    <p style={{textAlign:'center'}}>Trail {stepCount}/{stepTrails}</p>
                    <p style={{textAlign:'center', marginTop:'4px'}}>
                      <Button style={{padding:'0 70px'}} onClick={()=> this.removeCount(this,count)}><CloseOutlined /></Button> &nbsp;
                      <Button style={{padding:'0 70px'}} onClick={()=> this.addStepCount(this, stepCount,collapseCount,totalSteps)}><CheckOutlined /></Button>
                    </p>
                    <p style={{textAlign:'center', marginTop:'4px'}}>
                      <Button style={{padding:'0 20px'}}>Prompt 1</Button>
                      <Button style={{padding:'0 20px', marginLeft:'2px'}}>Prompt 2</Button>
                      <Button style={{padding:'0 20px', marginLeft:'2px'}}>Prompt 3</Button>
                      <Button style={{padding:'0 20px', marginLeft:'2px'}}>Prompt 4</Button>
                    </p>
                  </Panel>
                  <Panel header="Step 2 : Instruction 2" key="2">
                    <p style={{textAlign:'center'}}>Trail {stepCount}/{stepTrails}</p>
                    <p style={{textAlign:'center', marginTop:'4px'}}>
                      <Button style={{padding:'0 70px'}} onClick={()=> this.removeCount(this,count)}><CloseOutlined /></Button> &nbsp;
                      <Button style={{padding:'0 70px'}} onClick={()=> this.addStepCount(this, stepCount,correct)}><CheckOutlined /></Button>
                    </p>
                    <p style={{textAlign:'center', marginTop:'4px'}}>
                      <Button style={{padding:'0 20px'}}>Prompt 1</Button>
                      <Button style={{padding:'0 20px', marginLeft:'2px'}}>Prompt 2</Button>
                      <Button style={{padding:'0 20px', marginLeft:'2px'}}>Prompt 3</Button>
                      <Button style={{padding:'0 20px', marginLeft:'2px'}}>Prompt 4</Button>
                    </p>
                  </Panel>
                  <Panel header="Step 3 : Instruction 3" key="3">
                    <p style={{textAlign:'center'}}>Trail {stepCount}/{stepTrails}</p>
                    <p style={{textAlign:'center', marginTop:'4px'}}>
                      <Button style={{padding:'0 70px'}} onClick={()=> this.removeCount(this,count)}><CloseOutlined /></Button> &nbsp;
                      <Button style={{padding:'0 70px'}} onClick={()=> this.addStepCount(this, stepCount,correct)}><CheckOutlined /></Button>
                    </p>
                    <p style={{textAlign:'center', marginTop:'4px'}}>
                      <Button style={{padding:'0 20px'}}>Prompt 1</Button>
                      <Button style={{padding:'0 20px', marginLeft:'2px'}}>Prompt 2</Button>
                      <Button style={{padding:'0 20px', marginLeft:'2px'}}>Prompt 3</Button>
                      <Button style={{padding:'0 20px', marginLeft:'2px'}}>Prompt 4</Button>
                    </p>
                  </Panel>
                </Collapse>
                
              </Card>
              {/* </Card>
            <Card style={{ width: '100%', backgroundColor:'#f6f7fb'}}> */}
              <Card style={{ width: '96%', backgroundColor: 'white', margin:'10px auto'}}>
                <h5 style={{textAlign:'center'}}>18.10060 - Sits in a small group for 10 minutes, attends to the teacher/material for 50% of the period</h5>
                <br />
                <span>% Correct</span> <span style={{float:'right'}}>In-Therapy</span>
                <br />
                <br />
            
                <p style={{textAlign:'center', marginTop:'4px'}}>Trail 1/No max</p>
                <p style={{textAlign:'center', marginTop:'14px'}}>
                  <Radio.Group>
                    <Radio.Button value="correct">Correct</Radio.Button>
                    <Radio.Button value="error">Error</Radio.Button>
                    <Radio.Button value="no-response">No Response</Radio.Button>
                    <Radio.Button value="delayed">Prompt</Radio.Button>
                  </Radio.Group>
                </p>
                <p style={{textAlign:'center', marginTop:'4px'}}>
                  <Button style={{padding:'0 20px'}}>Prompt 1</Button>
                  <Button style={{padding:'0 20px', marginLeft:'2px'}}>Prompt 2</Button>
                  <Button style={{padding:'0 20px', marginLeft:'2px'}}>Prompt 3</Button>
                  <Button style={{padding:'0 20px', marginLeft:'2px'}}>Prompt 4</Button>
                </p>
              </Card>
              <Card style={{ width: '96%', backgroundColor: 'white', margin:'10px auto'}}>
                <h5 style={{textAlign:'center'}}>18.10060 - Sits in a small group for 10 minutes, attends to the teacher/material for 50% of the period</h5>
                <br />
                <span>% Correct</span> <span style={{float:'right'}}>In-Therapy</span>
                <br />
                <br />
                <Tooltip title="previous trail">
                  <Button style={{float:'left', marginLeft:'40px'}}><LeftOutlined /></Button>
                </Tooltip>
                
                <Tooltip title="next trail">
                  <Button style={{float:'right', marginRight:'40px'}}><RightOutlined /></Button>
                </Tooltip>
                <p style={{textAlign:'center', marginTop:'4px'}}>Stimulus 1/5</p>
                <br />
                <p style={{textAlign:'center', marginTop:'4px'}}>Trail 1/No max</p>
                <p style={{textAlign:'center', marginTop:'14px'}}>
                  <Radio.Group>
                    <Radio.Button value="correct">Correct</Radio.Button>
                    <Radio.Button value="error">Error</Radio.Button>
                    <Radio.Button value="no-response">No Response</Radio.Button>
                    <Radio.Button value="delayed">Prompt</Radio.Button>
                  </Radio.Group>
                </p>
                <p style={{textAlign:'center', marginTop:'4px'}}>
                  <Button style={{padding:'0 20px'}}>Prompt 1</Button>
                  <Button style={{padding:'0 20px', marginLeft:'2px'}}>Prompt 2</Button>
                  <Button style={{padding:'0 20px', marginLeft:'2px'}}>Prompt 3</Button>
                  <Button style={{padding:'0 20px', marginLeft:'2px'}}>Prompt 4</Button>
                </p>
              </Card>
              <Card style={{ width: '96%', backgroundColor: 'white', margin:'10px auto'}}>
                <h5 style={{textAlign:'center'}}>18.10060 - Sits in a small group for 10 minutes, attends to the teacher/material for 50% of the period</h5>
                <br />
                <span>% Correct</span> <span style={{float:'right'}}>In-Therapy</span>
                <br />
                <br />
                <Collapse accordion defaultActiveKey='1'>
                  <Panel header="Step 1 : Instruction 1" key="1">
                    <p style={{textAlign:'center', marginTop:'4px'}}>Trail 1/No max</p>
                    <p style={{textAlign:'center', marginTop:'14px'}}>
                      <Radio.Group>
                        <Radio.Button value="correct">Correct</Radio.Button>
                        <Radio.Button value="error">Error</Radio.Button>
                        <Radio.Button value="no-response">No Response</Radio.Button>
                        <Radio.Button value="delayed">Prompt</Radio.Button>
                      </Radio.Group>
                    </p>
                    <p style={{textAlign:'center', marginTop:'4px'}}>
                      <Button style={{padding:'0 20px'}}>Prompt 1</Button>
                      <Button style={{padding:'0 20px', marginLeft:'2px'}}>Prompt 2</Button>
                      <Button style={{padding:'0 20px', marginLeft:'2px'}}>Prompt 3</Button>
                      <Button style={{padding:'0 20px', marginLeft:'2px'}}>Prompt 4</Button>
                    </p>
                  </Panel>
                  <Panel header="Step 2 : Instruction 2" key="2">
                    <p style={{textAlign:'center', marginTop:'4px'}}>Trail 1/No max</p>
                    <p style={{textAlign:'center', marginTop:'14px'}}>
                      <Radio.Group>
                        <Radio.Button value="correct">Correct</Radio.Button>
                        <Radio.Button value="error">Error</Radio.Button>
                        <Radio.Button value="no-response">No Response</Radio.Button>
                        <Radio.Button value="delayed">Prompt</Radio.Button>
                      </Radio.Group>
                    </p>
                    <p style={{textAlign:'center', marginTop:'4px'}}>
                      <Button style={{padding:'0 20px'}}>Prompt 1</Button>
                      <Button style={{padding:'0 20px', marginLeft:'2px'}}>Prompt 2</Button>
                      <Button style={{padding:'0 20px', marginLeft:'2px'}}>Prompt 3</Button>
                      <Button style={{padding:'0 20px', marginLeft:'2px'}}>Prompt 4</Button>
                    </p>
                  </Panel>
                  <Panel header="Step 3 : Instruction 3" key="3">
                    <p style={{textAlign:'center', marginTop:'4px'}}>Trail 1/No max</p>
                    <p style={{textAlign:'center', marginTop:'14px'}}>
                      <Radio.Group>
                        <Radio.Button value="correct">Correct</Radio.Button>
                        <Radio.Button value="error">Error</Radio.Button>
                        <Radio.Button value="no-response">No Response</Radio.Button>
                        <Radio.Button value="delayed">Prompt</Radio.Button>
                      </Radio.Group>
                    </p>
                    <p style={{textAlign:'center', marginTop:'4px'}}>
                      <Button style={{padding:'0 20px'}}>Prompt 1</Button>
                      <Button style={{padding:'0 20px', marginLeft:'2px'}}>Prompt 2</Button>
                      <Button style={{padding:'0 20px', marginLeft:'2px'}}>Prompt 3</Button>
                      <Button style={{padding:'0 20px', marginLeft:'2px'}}>Prompt 4</Button>
                    </p>
                  </Panel>
                </Collapse>
                
              </Card>
              <Card style={{ width: '96%', backgroundColor: 'white', margin:'10px auto', height:'540px', marginBottom:'200px'}}>
                <h5 style={{textAlign:'center'}}>18.10060 - Sits in a small group for 10 minutes, attends to the teacher/material for 50% of the period</h5>
                <br />
                <span>% Correct</span> <span style={{float:'right'}}>In-Therapy</span>
                <br />
                <br />
            
                <div>
                  <Form 
                    style={{padding:'0 80px'}} 
                    layout={{
                      labelCol: {span: 4 },
                      wrapperCol: { span: 14 },
                    }}
                  >
                    <Form.Item label="IRT" style={{marginBottom:'0'}}>
                      <Radio.Group>
                        <Radio.Button value="horizontal" style={{padding:'0 35px'}}>-</Radio.Button>
                        <Radio.Button value="vertical" style={{padding:'0', border:'none'}}><InputNumber style={{borderRadius:'0'}} /></Radio.Button>
                        <Radio.Button value="inline" style={{padding:'0 35px'}}>+</Radio.Button>
                      </Radio.Group>
                    </Form.Item>
                    <Form.Item label="Frequency" style={{marginBottom:'0'}}>
                      <Radio.Group>
                        <Radio.Button value="horizontal" style={{padding:'0 35px'}}>-</Radio.Button>
                        <Radio.Button value="vertical" style={{padding:'0', border:'none'}}><InputNumber style={{borderRadius:'0'}} /></Radio.Button>
                        <Radio.Button value="inline" style={{padding:'0 35px'}}>+</Radio.Button>
                      </Radio.Group>
                    </Form.Item>
                    <Form.Item label="Duration" style={{marginBottom:'0'}}>
                      <Input placeholder="input placeholder" />
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary">Submit</Button>
                    </Form.Item>
                  </Form>
                </div>
                
              </Card>
            </Card>
          </Col>
          <Col xs={0} sm={6} md={6} lg={9} xl={9} style={style3}>
            <Collapse bordered={false} defaultActiveKey={['1']}>
              <Panel header="Target Response Graph" key="1">
                <ChartistGraph
                  className="height-300 chart-smil-animations"
                  data={smilData}
                  options={smilOptions}
                  type="Line"
                  listener={smilListener}
                />

              </Panel>
              <Panel header="Teaching Procedure" key="2">
                Target Instructions 

              </Panel>
              <Panel header="Target Objective" key="3">
                Target Instructions 

              </Panel>
              <Panel header="Generalization Criteria" key="4">
                Target Instructions 

              </Panel>
              <Panel header="Best Practices" key="5">
                Target Instructions 

              </Panel>
              
              
            </Collapse>
          </Col>
          
        </Row>
        {/* </div> */}
      </Authorize>
    )
  }
}

export default DataRecording
