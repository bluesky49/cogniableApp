import React from 'react'
import { Helmet } from 'react-helmet'
import { Table, Button, Collapse,Card, Avatar, Form, Select, DatePicker} from 'antd';

import Authorize from 'components/LayoutComponents/Authorize'
// import style from '../learnerform.scss'
import EditBasicInformationForm from 'components/learner/EditBasicInformationForm'
import EditInsuranceForm from 'components/learner/EditInsuranceForm'
import EditHealthForm from 'components/learner/EditHealthForm'
import EditIntakeForm from 'components/learner/EditIntakeForm'
import { ContactsOutlined, FileDoneOutlined, AuditOutlined, UserOutlined, FilterOutlined, PlusOutlined, FileExcelOutlined, FilePdfOutlined, PrinterOutlined } from '@ant-design/icons';

const { Panel } = Collapse;
const { Meta } = Card;

const {RangePicker } = DatePicker;
const data = [
    {
      key: '1',
      name: 'John Brown',
      email: 'admin@gmail.com',
      therapist: 'TLSAG3047',
      assessment: 'admin@gmail.com',
      category: 'Remote',
    },
    {
        key: '2',
        name: 'John Brown2',
        email: 'admin@gmail.com',
        therapist: 'TLSAG3047',
        assessment: 'admin@gmail.com',
        category: 'Remote',
      },
      {
        key: '3',
        name: 'John Brown3',
        email: 'admin@gmail.com',
        therapist: 'TLSAG3047',
        assessment: 'admin@gmail.com',
        category: 'Remote',
      },
      {
        key: '4',
        name: 'John Brown4',
        email: 'admin@gmail.com',
        therapist: 'TLSAG3047',
        assessment: 'admin@gmail.com',
        category: 'Remote',
      }
  ];



class LearnerTable extends React.Component {
    state = {
        // filteredInfo: null,
        // sortedInfo: null,
        divShow: false,
        selectedName: '',
        filterShow: false
    };

    handleChange = (pagination, filters, sorter) => {
        console.log('Various parameters', pagination, filters, sorter);
        // this.setState({
        //     filteredInfo: filters,
        //     sortedInfo: sorter,

        // });
    };


    // logic for div show or hide
    divShowHide = () => {
        this.setState({divShow: true})
    }

    consoleValue = (e, text) => {
        e.preventDefault();
        this.setState({
            selectedName: text,
            divShow: true
        })

    }

    onFinish = values => {
        console.log('Received values of form: ', values);
    }

    filterToggle(toggle){
        if (toggle){
            this.setState({
                filterShow: false
            })
        }
        else{
            this.setState({
                filterShow: true
            })
        }
    }



  render() {
    // let { sortedInfo, filteredInfo } = this.state;
    // sortedInfo = sortedInfo || {};
    // filteredInfo = filteredInfo || {};
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: name => <a onClick={(e) => this.consoleValue(e, name)} onKeyPress={(e) => this.consoleValue(e, name)} role="button" tabIndex="0">{name}</a>,
        ellipsis: true,
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        ellipsis: true,
      },
      {
        title: 'Therapist',
        dataIndex: 'therapist',
        key: 'therapist',
        ellipsis: true,
      },
      {
        title: 'Assessment',
        dataIndex: 'assessment',
        key: 'assessment',
        ellipsis: true,
      },
      {
        title: 'Category',
        dataIndex: 'category',
        key: 'category',
        ellipsis: true,
      },

    ];
    const {divShow, filterShow} = this.state;
    const divClass = divShow ? "col-sm-8" : "col-sm-12";
    const detailsDiv = divShow ? {display:'block', paddingLeft:'0'} : {display:'none'}
    const filterDiv = filterShow ? {display:'block', padding:'0', marginBottom:'0', backgroundColor:'inherit'} : {display:'none'}
    // const {Column} = Table;
    const {selectedName} = this.state;
    const filterOptionStyle = {display:'inline-block', marginRight:'10px'}
    return (
      <Authorize roles={["school_admin"]} redirect to="/dashboard/beta">
        <Helmet title="Partner" />
        {/* <div className="utils__title utils__title--flat mb-3">
          <strong className="text-uppercase font-size-16">Responsive Tables</strong>
        </div> */}
        <div className="row">
          <div className={divClass}>
            <div className="card" style={{backgroundColor:'inherit', marginBottom:'0'}}>
              <div className="card-body" style={{padding:'0', marginBottom:'0'}}>
                <Button onClick={() => this.filterToggle(filterShow)}>Filter <FilterOutlined /></Button>
                <p style={{float:'right'}}>
                  <Button><a href="#/partners/learner">Add Learner <PlusOutlined /></a></Button>
                  <Button>Excel <FileExcelOutlined /></Button>
                  <Button>PDF <FilePdfOutlined /></Button>
                  <Button>Print <PrinterOutlined /></Button>
                </p>
              </div>
            </div>
            <div className="card" style={filterDiv}>
              <div className="card-body" style={{padding:'0', marginBottom:'0'}}>
                <Form.Item label="" style={filterOptionStyle}>
                  <Select style={{width:'120px'}} value='select'>
                    <Select.Option value="select">status</Select.Option>
                    <Select.Option value="active">Active</Select.Option>
                    <Select.Option value="in-active">In-active</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item label="" style={filterOptionStyle}>
                  <Select style={{width:'120px'}} value='select'>
                    <Select.Option value="select">category</Select.Option>
                    <Select.Option value="home">Home</Select.Option>
                    <Select.Option value="center">center</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item label="" style={filterOptionStyle}>
                  <Select style={{width:'140px'}} value='select'>
                    <Select.Option value="select">intake form status</Select.Option>
                    <Select.Option value="active">Active</Select.Option>
                    <Select.Option value="in-active">In-active</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item label="" style={filterOptionStyle}>
                  <Select style={{width:'130px'}} value='select'>
                    <Select.Option value="select">authorization</Select.Option>
                    <Select.Option value="active">Active</Select.Option>
                    <Select.Option value="in-active">In-active</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item label="" style={filterOptionStyle}>
                  <Select style={{width:'120px'}} value='select'>
                    <Select.Option value="select">show hide field</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item label="" style={filterOptionStyle}>
                  <RangePicker style={{marginTop:'3px'}} />
                </Form.Item>
              </div>
            </div>
            <div className="card">
              <div className="card-body" style={{padding:'0'}}>

                <Table columns={columns} dataSource={data} bordered onChange={this.handleChange} />
              </div>
            </div>
          </div>
          <div className="col-sm-4" style={detailsDiv}>
            <div className="card" style={{minHeight:'600px'}}>
              <div className="card-body">
                <div className="table-operations" style={{marginBottom: '16px'}}>
                  <Button style={{marginRight: '-12px', float:'right', border:'none', padding:'none'}} onClick={() => this.setState({divShow:false})}>X</Button>
                </div>
                <div>
                  <p style={{textAlign:'center'}}><span style={{padding:'5px'}}><ContactsOutlined /> Appointment</span><span style={{padding:'5px'}}><FileDoneOutlined /> Task</span><span style={{padding:'5px'}}><AuditOutlined /> Attendence</span><span style={{padding:'5px'}}><UserOutlined /> Program</span></p>
                  <Card style={{marginTop: '26px', border:'none' }}>
                    <Meta
                      avatar={
                        <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" style={{width:'100px', height:'100px', border:'1px solid #f6f7fb'}} />
                      }
                      title={
                        <h5 style={{marginTop:'20px'}}>
                          {selectedName}
                          <span style={{float:'right', fontSize:'12px', padding:'5px'}}>delete</span>
                          <span style={{float:'right', fontSize:'12px', padding:'5px'}}>edit</span>
                        </h5>

                      }
                      description={
                        <div>
                          <p style={{fontSize:'13px', marginBottom:'4px'}}>Authorization Status <span style={{backgroundColor:'#52c41a', color:'white', borderRadius:'3px', padding:'1px 5px'}}>Active</span></p>
                          <p style={{fontSize:'13px', marginBottom:'4px'}}>Intake Form Status <span style={{backgroundColor:'#52c41a', color:'white', borderRadius:'3px', padding:'1px 5px'}}>Active</span></p>
                          <p style={{fontSize:'13px', marginBottom:'0'}}>Date of Start 01/01/2020</p>
                        </div>
                      }
                    />
                  </Card>
                  <Collapse accordion bordered={false}>
                    <Panel header="Basic Details" key="1">
                      <EditBasicInformationForm />
                    </Panel>
                    <Panel header="Insurance Details" key="2">
                      <EditInsuranceForm />
                    </Panel>
                    <Panel header="Health Details" key="3">
                      <EditHealthForm />
                    </Panel>
                    <Panel header="Intake Form" key="4">
                      <EditIntakeForm />
                    </Panel>
                  </Collapse>

                </div>
              </div>
            </div>
          </div>
        </div>
      </Authorize>
    )
  }
}

export default LearnerTable
