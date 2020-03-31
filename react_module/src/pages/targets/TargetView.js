import React from 'react'
import { Helmet } from 'react-helmet'
import { Table, Button, Form, Select, Icon, Input, Row, Col, Upload, Collapse, DatePicker, Tabs } from 'antd';
import Chat from 'components/CleanUIComponents/Chat'
import Authorize from 'components/LayoutComponents/Authorize'
import { GraphQLClient } from 'graphql-request'
// import LoginForm from 'components/CleanUIComponents/Targets'
const FormItem = Form.Item
const { TabPane } = Tabs;
const { Panel } = Collapse;
const { TextArea } = Input;
// const temp = [];

const graphQLClient = new GraphQLClient('http://development.cogniable.us/apis/school/graphql', {
  headers: {
    database: 'india',
  },
})
const { Search } = Input;
const column1 = [
  {
    title: 'Domain',
    dataIndex: 'node.domain.domain',
  },
  {
    title: 'Target Name',
    dataIndex: 'node.targetMain.targetName',
  },
];
// const data1 = [
//   {
//     key:{'key':'1'},
//     target:{
//     domain: 'MAND',
//     targetname: 'requests for activities using appropriate adjectives'
//   }

//   },
//   {
//     key:{'key':'2'},
//     target:{
//     domain: 'MAND',
//     targetname: 'requests for activities using appropriate adjectives'
//     }
//   },
// ];

const column2 = [
  {
    title: 'Domain',
    dataIndex: 'node.targetId.domain.domain',
    render: text => <a>{text}</a>,
  },
  {
    title: 'Target Name',
    dataIndex: 'node.targetAllcatedDetails.targetName',
  },
  {
    title: 'Status',
    dataIndex: 'node.targetStatus.statusName',
    render: text => <span style={{ color: "green" }}>{text}</span>
  },
  {
    title: 'Copy',
    dataIndex: 'copy',
    render: text => <a>{text}</a>,
  },
];
// const data2 = [
//   {
//     key: '3',
//     domain: 'MAND',
//     targetname: 'requests for activities using appropriate adjectives',
//     status: 'baseline',
//     copy: <Icon type="copy" />

//   },
//   {
//     key: '4',
//     domain: 'MAND',
//     targetname: 'requests for activities using appropriate adjectives',
//     status: 'in-therapy',
//     copy: <Icon type="copy" />

//   }
// ];
const rowSelection1 = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  getCheckboxProps: record => ({
    disabled: record.name === 'Disabled User', // Column configuration not to be checked
    name: record.name,
  }),
};


// rowSelection object indicates the need for row selection
const rowSelection2 = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  getCheckboxProps: record => ({
    disabled: record.name === 'Disabled User', // Column configuration not to be checked
    name: record.name,
  }),
};

class TargetView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchlearner: "",
      domain1: "",
      domain2: "",
      targetarea: "",
      search: "",
      targetname: "",
      targettype: [],
      mcriteria: [],
      date: "",
      codes: [],
      status: [],
      consdays: "",
      trials: "",
      steps: "",
      objectives: "",

      divShow: false,
      filterShow: false,
      LearnerList: [],
      SuggestedTarget: [],
      AllocatedTarget:[],
      DomainList: [],
      targetArea: []

    };
    this.DomainChange = this.DomainChange.bind(this);

  }

  componentDidMount() {
    const query3 = `query {
              targetStatus  {
                  id,
                  statusName
              }
              types  {
                    id,
                    typeTar
              }
              promptCodes  {
                id,
                promptName 
              }
              masteryCriteria  {
                id,
                responsePercentage,
                consecutiveDays,
                minTrial
              }
              students {
                edges {
                    node {
                    id,
                    firstname,
                    internalNo
                    }
                }
              }
              domain {
                domain,
                id
              }
          }`

    graphQLClient.request(query3).then(data => {
      this.setState({
        targettype: data.types,
        status: data.targetStatus,
        codes: data.promptCodes,
        mcriteria: data.masteryCriteria,
        LearnerList: data.students.edges,
        DomainList: data.domain
      })
    })
  }

  handleSubmit = e => {
    e.preventDefault();
    const { form } = this.props;

    form.validateFields((error, values) => {
      if (!error) {
        const query = `query Target($student:ID!, $domain:ID!, $target_area: ID!, $search: String!){
          target(domain:$domain,targetArea:$target_area, targetMain_TargetName_Icontains:$search) {
          edges {
              node {
                  id,
                  domain
                  {
                      id,
                      domain
                  },
                  targetMain
                  {
                      id,
                      targetName
                  }
                  }
              }
          }
      
          targetAllocates(studentId:$student, targetId_Domain:$domain,targetId_TargetArea:$target_area, targetAllcatedDetails_TargetName_Icontains:$search) {
            edges {
                node {
                    id,
                    targetStatus {
                        id,
                        statusName
                    },
                    targetId
                    {
                      domain{
                        id,
                        domain
                    }
                    }
                    targetAllcatedDetails
                    {
                        id,
                        targetName
                    }
                    }
                }
            }
  }`

        const variables = {
          domain: values.domain,
          search: values.search,
          target_area: values.target_area,
          student: values.learner,
        }

        graphQLClient.request(query, variables).then(data => {

          this.setState({
            SuggestedTarget: data.target.edges,
            AllocatedTarget:data.targetAllocates.edges,
          })
        })

      }
    })

  }

  onhandleChange = (e) => { this.setState({ [e.target.name]: e.target.value }) };

  // setDate = (value) => { this.setState({ date: (new Date(value)).toISOString().slice(0, 10) }) }

  selectDomain = (value) => { this.setState({ domain2: value }) }

  selectTargetName = (value) => { this.setState({ targetname: value }) }

  // selectTargetType = (value) => { this.setState({ targettype: value }) }

  // selectCriteria = (value) => { this.setState({ mcriteria: value }) }

  // selectCustomCodes = (value) => { this.setState({ codes: value }) }

  // selectStatus = (value) => { this.setState({ status: value }) }

  selectDays = (value) => { this.setState({ consdays: value }) }

  selectDailytrials = (value) => { this.setState({ trials: value }) }

  selectDays = (value) => { this.setState({ consdays: value }) }

  selectsteps = (value) => { this.setState({ steps: value }) }



  handleChange = (pagination, filters, sorter) => {
    console.log('Various parameters', pagination, filters, sorter);
    // this.setState({
    //     filteredInfo: filters,
    //     sortedInfo: sorter,

    // });
  };


  // logic for div show or hide
  divShowHide = () => {
    this.setState({ divShow: true })
  }

  consoleValue = (e, ) => {
    e.preventDefault();
    this.setState({
      divShow: true
    })

  }

  onFinish = values => {
    console.log('Received values of form: ', values);
  }

  DomainChange(domainid) {
    const query3 = `query domainGet ($id: ID!) {
      domainGet(id:$id){
          id,
          targetArea
          {
              edges {
                  node {
                      id,
                      Area
                      }
                  }
          }
      }
  }`
    const variables = {
      id: domainid,
    }

    graphQLClient.request(query3, variables).then(data => {
      this.setState({
        targetArea: data.domainGet.targetArea.edges
      })
    })
  }

  filterToggle(toggle) {
    if (toggle) {
      this.setState({
        filterShow: false
      })
    }
    else {
      this.setState({
        filterShow: true
      })
    }
  }



  render() {
    // let { sortedInfo, filteredInfo } = this.state;
    // sortedInfo = sortedInfo || {};
    // filteredInfo = filteredInfo || {};
    const { form } = this.props;
    const { LearnerList, DomainList, targetArea, SuggestedTarget, AllocatedTarget } = this.state;

    const { divShow, filterShow } = this.state;
    const divClass = divShow ? "col-sm-8" : "col-sm-12";
    const detailsDiv = divShow ? { display: 'block', paddingLeft: '0' } : { display: 'none' }
    const filterDiv = filterShow ? { display: 'block', padding: '0', marginBottom: '0', backgroundColor: 'inherit' } : { display: 'none' }
    // const {Column} = Table;
    const filterOptionStyle = { display: 'inline-block', marginRight: '10px' }
    const { searchlearner, domain1, domain2, targetarea, search, targetname, targettype, mcriteria, date, codes, status, consdays, trials, steps, objectives } = this.state
    console.log(searchlearner, domain1, domain2, targetarea, search, targetname, date, codes, status, consdays, trials, steps)
    return (
      <Authorize roles={['school_admin']} redirect to="/dashboard/beta">
        <Helmet title="Partner" />
        {/* <div className="utils__title utils__title--flat mb-3">
          <strong className="text-uppercase font-size-16">Responsive Tables</strong>
        </div> */}
        <div className="row">
          <div className={divClass}>
            <div className="card" style={{ backgroundColor: 'inherit', marginBottom: '0' }}>
              <div className="card-body" style={{ padding: '0', marginBottom: '0' }}>
                {/* <Button onClick={() => this.filterToggle(filterShow)}>Filter </Button> */}
                {/* <p style={{float:'right'}}>
                  <Button>Print</Button>
                </p> */}
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <Tabs defaultActiveKey="1">
                  <TabPane
                    tab={
                      <span>
                        {/* <HourglassOutlined /> */}
                        <i className="icmn-folder-open" /> Libary
                      </span>
                    }
                    key="1"
                  >
                    <Form onSubmit={this.handleSubmit} className="login-form">
                      <div className="row">
                        <div className="col-lg-3">
                          <FormItem label="Learner">
                            {form.getFieldDecorator('learner', {
                              rules: [{ required: true, message: 'Please provide your learner!' }],
                            })(
                              <Select
                                id="product-edit-colors"
                                showSearch
                                style={{ width: '100%' }}
                                placeholder="Select a Learner"
                                optionFilterProp="children"                             
                              >
                                {LearnerList.map(c =>
                                  <option value={c.node.id}>{c.node.firstname}</option>
                                )}

                              </Select>
                            )}
                          </FormItem>

                        </div>
                        <div className="col-lg-3">
                          <FormItem label="Domain">
                            {form.getFieldDecorator('domain', {
                              rules: [{ required: true, message: 'Please provide your domain!' }],
                            })(
                              <Select
                                id="product-edit-colors"
                                showSearch
                                style={{ width: '100%' }}
                                placeholder="Select a domain"
                                optionFilterProp="children"
                                onChange={this.DomainChange}                               
                              >
                                {DomainList.map(c =>
                                  <option value={c.id}>{c.domain}</option>
                                )}
                              </Select>
                            )}
                          </FormItem>
                        </div>
                        <div className="col-lg-3">
                          <FormItem label="Target Area">
                            {form.getFieldDecorator('target_area', {
                              rules: [{ required: true, message: 'Please provide your Target Area!' }],
                            })(
                              <Select
                                id="product-edit-colors"
                                showSearch
                                style={{ width: '100%' }}
                                placeholder="Select a Target Area"
                                optionFilterProp="children"                               
                              >
                                {targetArea.map(c =>
                                  <option value={c.node.id}>{c.node.Area}</option>
                                )}
                              </Select>
                            )}
                          </FormItem>
                        </div>
                        <div className="col-lg-3">
                          <FormItem label="Search">
                            {form.getFieldDecorator('search', { initialValue: "" })(
                              <Input
                                suffix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="text"
                                placeholder="Keyword Search"
                              />,
                            )}
                          </FormItem>
                        </div>
                        <div className="col-lg-12">
                          <div className="form-actions">
                            <Button type="primary" htmlType="submit" className="mr-2">
                              Suggest Target
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Form>
                  </TabPane>
                  <TabPane
                    tab={
                      <span>
                        <i className="icmn-folder" /> Manually
                      </span>
                    }
                    key="2"
                  >
                    <Chat />
                  </TabPane>
                </Tabs>
              </div>
            </div>

            <div className="card" style={filterDiv}>
              <div className="card-body" style={{ padding: '0', marginBottom: '0' }}>
                <Form.Item label="" style={filterOptionStyle}>
                  <Select style={{ width: '120px' }} placeholder="search learner" name="searchlearner">
                    <Select.Option value="select">status</Select.Option>
                    <Select.Option value="active">Active</Select.Option>
                    <Select.Option value="in-active">In-active</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item label="" style={filterOptionStyle}>
                  <Select style={{ width: '120px' }} placeholder="Domain" name="domain1">
                    <Select.Option value="select">category</Select.Option>
                    <Select.Option value="home">Home</Select.Option>
                    <Select.Option value="center">center</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item label="" style={filterOptionStyle}>
                  <Select style={{ width: '140px' }} placeholder="target area" name="targetarea">
                    <Select.Option value="select">intake form status</Select.Option>
                    <Select.Option value="active">Active</Select.Option>
                    <Select.Option value="in-active">In-active</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item label="" style={filterOptionStyle}>
                  <Search
                    name="search"
                    placeholder="search keyword "
                    onSearch={value => console.log(value)}
                  />
                </Form.Item>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <Button
                  type="primary"
                  style={{ float: "right" }}
                  onClick={(e) => this.consoleValue(e)}
                >
                  Allocated Targets
                </Button>
                <h4 style={{ backgroundColor: "inherit" }}>Suggested Targets</h4>
                <Table
                  columns={column1}
                  dataSource={SuggestedTarget}
                  bordered
                  rowKey={(record) => record.node.id}
                  onChange={this.handleChange}
                  rowSelection={rowSelection1}
                />
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <h4>Allready allocated targets</h4>
                <Table
                  columns={column2}
                  dataSource={AllocatedTarget}
                  bordered
                  rowKey={(record) => record.node.id}
                  onChange={this.handleChange}
                  rowSelection={rowSelection2}
                />
              </div>
            </div>
          </div>
          <div className="col-sm-4" style={detailsDiv}>
            <div className="card" style={{ minHeight: '600px' }}>
              <div className="card-body">
                <div className="table-operations" style={{ marginBottom: '16px' }}>
                  <Button style={{ marginRight: '-12px', float: 'right', border: 'none', padding: 'none' }} onClick={() => this.setState({ divShow: false })}>X</Button>
                </div>
                <Form>
                  <Form.Item label="Domain">
                    <Select name="domain2" onSelect={this.selectDomain}>
                      <Select.Option value="demo">Mand</Select.Option>
                      <Select.Option value="demo">2</Select.Option>
                    </Select>
                  </Form.Item>
                  <Form.Item label="Target Name">
                    <Input name="targetname" />
                  </Form.Item>
                  <Form.Item label="Target Type">
                    <Select name="targettype">
                      {targettype.map(c =>
                        <option value={c.id}>{c.typeTar}</option>
                      )}
                    </Select>
                  </Form.Item>
                  <Form.Item label="Mastery Criteria">
                    <Select name="mcriteria">
                      {mcriteria.map(c =>
                        <option value={c.id}>Response Percentage:{c.responsePercentage}%,Consecutive Days:{c.consecutiveDays}, Min Trial:{c.minTrial}</option>
                      )}
                    </Select>
                  </Form.Item>
                  <Form.Item label="Date Baseline">
                    <DatePicker name="date" />
                  </Form.Item>
                  <Form.Item label="Custom Prompt Codes">
                    <Select name="codes">
                      {codes.map(c =>
                        <option value={c.id}>{c.promptName}</option>
                      )}
                    </Select>
                  </Form.Item>
                  <Form.Item label="Status">
                    <Select name="status">
                      {status.map(c =>
                        <option value={c.id}>{c.statusName}</option>
                      )}
                    </Select>
                  </Form.Item>
                  <Form.Item label="Consecutive days">
                    <Input name="consdays" onChange={this.onhandleChange} />
                  </Form.Item>
                  <Form.Item label="Desired Daily Trials">
                    <Select name="trials" onSelect={this.selectDailytrials}>
                      <Select.Option value="demo">1</Select.Option>
                      <Select.Option value="demo">2</Select.Option>
                    </Select>
                  </Form.Item>
                  <Form.Item label="Steps">
                    <Select name="steps" onSelect={this.selectsteps}>
                      <Select.Option value="demo">1</Select.Option>
                      <Select.Option value="demo">2</Select.Option>
                    </Select>
                  </Form.Item>
                  <Row>
                    <Col sm={24}>
                      <Collapse
                        bordered={false}
                        defaultActiveKey={['1']}
                        className="site-collapse-custom-collapse"
                      >
                        <Panel header="Teaching objectives and session objectives" key="1" className="site-collapse-custom-panel">
                          <TextArea name="objectives" autoSize={{ minRows: 2, maxRows: 5 }}>
                            {objectives}
                          </TextArea>
                        </Panel>
                      </Collapse>
                    </Col>
                  </Row>
                  <Form.Item label="&nbsp;">
                    <Button>Video</Button> &emsp;&emsp;&emsp;
                    <Button type="primary">Document</Button>&emsp;&emsp;&emsp;
                    <Button type="primary">Link</Button>
                  </Form.Item>
                  <Form.Item label="Upload">
                    <Upload name="logo" action="/upload.do" listType="picture">
                      <Button>
                        Choose file
                      </Button>
                    </Upload>,
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary">Submit</Button>
                  </Form.Item>

                </Form>
              </div>
            </div>
          </div>
        </div>
      </Authorize>
    )
  }
}


const TargetSearch = Form.create()(TargetView)
export default TargetSearch
