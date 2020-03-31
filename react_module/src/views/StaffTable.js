import React from 'react'
import { Helmet } from 'react-helmet'
import { Table, Button, Collapse,Card, Avatar, Form, Select, DatePicker} from 'antd';

import Authorize from 'components/LayoutComponents/Authorize'

import EditStaffBasicInfo from 'components/staff/EditStaffBasicInfo'
// import EditHrDetails from 'components/staff/EditHrDetails'
// import EditCertificationDetails from 'components/staff/EditCertificationDetails'
// import EditHealthForm from 'components/learner/EditHealthForm'

import { ContactsOutlined, FileDoneOutlined, AuditOutlined, UserOutlined, FilterOutlined, PlusOutlined, FileExcelOutlined, FilePdfOutlined, PrinterOutlined } from '@ant-design/icons';

const API_URL = process.env.REACT_APP_API_URL;
const { Panel } = Collapse;
const { Meta } = Card;

const {RangePicker } = DatePicker;
// const data = [
//     {
//       key: '1',
//       name: 'Arushi Chathly',
//       email: 'admin@gmail.com',
//       role: 'TLSAG3047',
//       workExperience: 'admin@gmail.com',
//       shift: 'Remote',
//     },
//     {
//       key: '2',
//       name: 'Arushi Chathly2',
//       email: 'admin@gmail.com',
//       role: 'TLSAG3047',
//       workExperience: 'admin@gmail.com',
//       shift: 'Remote',
//     },
//     {
//       key: '3',
//       name: 'Arushi Chathly3',
//       email: 'admin@gmail.com',
//       role: 'TLSAG3047',
//       workExperience: 'admin@gmail.com',
//       shift: 'Remote',
//     },
//     {
//       key: '4',
//       name: 'Arushi Chathly4',
//       email: 'admin@gmail.com',
//       role: 'TLSAG3047',
//       workExperience: 'admin@gmail.com',
//       shift: 'Remote',
//     },
//     {
//       key: '5',
//       name: 'Arushi Chathly5',
//       email: 'admin@gmail.com',
//       role: 'TLSAG3047',
//       workExperience: 'admin@gmail.com',
//       shift: 'Remote',
//     },
//     {
//       key: '6',
//       name: 'Arushi Chathly3',
//       email: 'admin@gmail.com',
//       role: 'TLSAG3047',
//       workExperience: 'admin@gmail.com',
//       shift: 'Remote',
//     },
//     {
//       key: '7',
//       name: 'Arushi Chathly4',
//       email: 'admin@gmail.com',
//       role: 'TLSAG3047',
//       workExperience: 'admin@gmail.com',
//       shift: 'Remote',
//     },
//     {
//       key: '8',
//       name: 'Arushi Chathly5',
//       email: 'admin@gmail.com',
//       role: 'TLSAG3047',
//       workExperience: 'admin@gmail.com',
//       shift: 'Remote',
//     },
//   ];

class StaffTable extends React.Component {
    state = {
      divShow: false,
      selectedName: '',
      filterShow: false,
      staffdata:[],
      UserProfile:null,
      isLoaded:false
    };

    componentDidMount() {
      fetch(`${API_URL}/school/staff/`, {
        method: "GET",
        headers: {
          'Authorization': JSON.parse(localStorage.getItem('token')),
          'database': JSON.parse(localStorage.getItem('database')),
        }
      })
        .then(res => res.json())
        .then(
          (result) => {
            this.setState({
              isLoaded:true,
              staffdata: result.data
            });
          }
        )
    };

    info = (e) => {
      fetch(`${API_URL}/school/staff/${e.id}/`, {
        method: "GET",
        headers: {
          'Authorization': JSON.parse(localStorage.getItem('token')),
          'database': JSON.parse(localStorage.getItem('database')),
        }
      })
        .then(res => res.json())
        .then(
          (result) => {
            this.setState({
              UserProfile: result.data
            });

          }
        )
      this.setState({
        divShow: true
      })
    };

    handleChange = (pagination, filters, sorter) => {
      console.log('Various parameters', pagination, filters, sorter);
    };
    
    divShowHide = () => {
      this.setState({divShow: true})
    }

    consoleValue = (e, text) => {
      e.preventDefault();
      this.setState({
          selectedName: text,
          divShow: true
      });
    }
    
    onFinish = values => {
        alert()
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
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        // render: name => <a onClick={(e) => this.consoleValue(e, name)} onKeyPress={(e) => this.consoleValue(e, name)} role="button" tabIndex="0">{name}</a>,
        ellipsis: true,
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        ellipsis: true,
      },
      {
        title: 'Role',
        dataIndex: 'designation',
        key: 'designation',
        ellipsis: true,
      },
      {
        title: 'Gender',
        dataIndex: 'gender',
        key: 'gender',
        ellipsis: true,
      },
      {
        title: 'Address',
        dataIndex: 'local_address',
        key: 'local_address',
        ellipsis: true,
      }, 
    ];
    const {divShow, filterShow, staffdata, UserProfile, isLoaded} = this.state; 
    if (!isLoaded) {
      return <div>Loading...</div>;
    }
    const divClass = divShow ? "col-sm-8" : "col-sm-12";
    const detailsDiv = divShow ? {display:'block', paddingLeft:'0'} : {display:'none'} 
    const filterDiv = filterShow ? {display:'block', padding:'0', marginBottom:'0', backgroundColor:'inherit'} : {display:'none'}
    // const {Column} = Table;
    const {selectedName} = this.state;
    const filterOptionStyle = {display:'inline-block', marginRight:'10px'}
    return (
      <Authorize roles={[1]} redirect to="/dashboard/beta">
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
                  <Button><a href="/#/partners/staff">Add Staff <PlusOutlined /></a></Button>
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
                    <Select.Option value="inactive">In-active</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item label="" style={filterOptionStyle}>
                  <Select style={{width:'120px'}} value='select'>
                    <Select.Option value="select">category</Select.Option>
                    <Select.Option value="therapist">Therapist</Select.Option>
                    <Select.Option value="center">Technician</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item label="" style={filterOptionStyle}>
                  <Select style={{width:'140px'}} value='select'>
                    <Select.Option value="select">role</Select.Option>
                    <Select.Option value="active">Active</Select.Option>
                    <Select.Option value="in-active">In-active</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item label="" style={filterOptionStyle}>
                  <Select style={{width:'130px'}} value='select'>
                    <Select.Option value="select">designation</Select.Option>
                    <Select.Option value="active">Active</Select.Option>
                    <Select.Option value="in-active">In-active</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item label="" style={filterOptionStyle}>
                  <Select style={{width:'150px'}} value='select'>
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
                <Table columns={columns} onRowClick={(e) => this.info(e)} dataSource={staffdata} bordered onChange={this.handleChange} />
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
                  <p style={{textAlign:'center'}}><span style={{padding:'5px'}}><ContactsOutlined /> Appointment</span><span style={{padding:'5px'}}><FileDoneOutlined /> Task</span><span style={{padding:'5px'}}><AuditOutlined /> Attendence</span><span style={{padding:'5px'}}><UserOutlined /> Timesheet</span></p>
                  <Card style={{marginTop: '26px', border:'none' }}>
                    <Meta
                      avatar={
                        <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" style={{width:'100px', height:'100px', border:'1px solid #f6f7fb'}} />
                      }
                      title={
                        <h5 style={{marginTop:'20px'}}>
                          {selectedName}
                          {/* <span style={{float:'right', fontSize:'12px', padding:'5px'}}>delete</span>
                          <span style={{float:'right', fontSize:'12px', padding:'5px'}}>edit</span> */}
                        </h5>
                      }
                      description={
                        <div>
                          <p style={{fontSize:'13px', marginBottom:'4px'}}>Therapist <span style={{backgroundColor:'#52c41a', color:'white', borderRadius:'3px', padding:'1px 5px'}}>Active</span></p>
                          
                        </div>
                      }
                    />
                  </Card>
                  {UserProfile ?
                    <Collapse defaultActiveKey="1" accordion bordered={false}>
                      <Panel header="Basic Details" key="1">
                        <EditStaffBasicInfo userinfo={UserProfile} />
                      </Panel>
                      {/* <Panel header="HR Details" key="2">
                        <EditHrDetails />
                      </Panel>
                      <Panel header="Health Details" key="3">
                        <EditCertificationDetails />
                      </Panel>
                      <Panel header="Intake Form" key="4">
                        <EditHealthForm />
                      </Panel> */}
                    </Collapse> : ""}
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </Authorize>
    )
  }
}

export default StaffTable
