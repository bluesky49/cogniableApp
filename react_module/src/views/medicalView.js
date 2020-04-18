import React from 'react'
import { Helmet } from 'react-helmet'
import Authorize from 'components/LayoutComponents/Authorize'
import { Row,Col,Card,Button,Collapse, Form,Select,Input,Calendar} from 'antd';
import { ArrowRightOutlined ,PlusOutlined} from '@ant-design/icons'
import Iframe from 'react-iframe'
import { connect } from 'react-redux'
import { gql } from "apollo-boost";
import client from '../apollo/config';
import MedicalForm from '../components/meal_and_medical/medicalform'; 

const { Panel } = Collapse;
const { Search } = Input;


const layout = {
    labelCol: {
      span: 6,
    },
  };

@connect(({ user }) => ({ user }))
class medicalView extends React.Component {
    state = {
        divShow: false,
        loading:true,
        medicalist: []
    };

    componentDidMount() {
      const {user:{studentId}} = this.props;
      client.query({
        query: gql`query{
            getMedication(student:"${studentId}", date:"2020-04-11"){
                edges{
                    node{
                       id,
                       date,
                       condition,
                       medicineDetails,
                       dosage,
                       howOftenTaken,
                       startDate,
                       endDate,
                       note,
                       severity{
                           id,
                           name
                       }
                    }
                }
            }
        }`
      })
      .then(result => {
        console.log(result);
        this.setState({
          loading:false,
          medicalist: result.data.getMedication.edges
        });
      }
      ); 
    };


    divShowHide = () => {
      this.setState({divShow: true})
    }

    consoleValue = (e) => {
      e.preventDefault();
      this.setState({
        divShow: true
      })
    }

    filterMedicalType = (value) => {
      const {user:{studentId}} = this.props;
      if(value !== 'all'){
        client.query({
          query: gql`query{
              getMedication(student:"${studentId}", severity:"${value}"){
                  edges{
                      node{
                         id,
                         date,
                         condition,
                         medicineDetails,
                         dosage,
                         howOftenTaken,
                         startDate,
                         endDate,
                         note,
                         severity{
                             id,
                             name
                         }
                      }
                  }
              }
          }`
        })
        .then(result => {
          this.setState({
            loading:false,
            medicalist: result.data.getMedication.edges
          });
        }
        );
      } else{
        client.query({
          query: gql`query{
              getMedication(student:"${studentId}"){
                  edges{
                      node{
                         id,
                         date,
                         condition,
                         medicineDetails,
                         dosage,
                         howOftenTaken,
                         startDate,
                         endDate,
                         note,
                         severity{
                             id,
                             name
                         }
                      }
                  }
              }
          }`
        })
        .then(result => {
          this.setState({
            medicalist: result.data.getMedication.edges
          });
        }
        );

      }
    }

    onPanelChange = (value) => {
      const date = new Date(value).toISOString().slice(0,10);
      const {user:{studentId}} = this.props;
      client.query({
        query: gql`query {getMedication(student:"${studentId}", date_Gte:"${date}", date_Lte:"${date}"){
            edges{
                node{
                   id,
                   date,
                   condition,
                   medicineDetails,
                   dosage,
                   howOftenTaken,
                   startDate,
                   endDate,
                   note,
                   severity{
                       id,
                       name
                   }
                }
            }
        }
      }`
      })
      .then(result => {
        this.setState({
          medicalist: result.data.getMedication.edges
        });
      }
      );
    }

    handleSearch = (value) => {
      console.log(value);
      const {user:{studentId}} = this.props;
      client.query({
        query: gql`query {getMedication(student:"${studentId}", condition_Icontains:"${value}"){
            edges{
                node{
                   id,
                   date,
                   condition,
                   medicineDetails,
                   dosage,
                   howOftenTaken,
                   startDate,
                   endDate,
                   note,
                   severity{
                       id,
                       name
                   }
                }
            }
        }
      }`
      })
      .then(result => {
        this.setState({
          medicalist: result.data.getMedication.edges
        });
      }
      );
    }

    onFinish = values => {
      console.log(values);
    };
    

  
  render(){
    const {divShow, medicalist, loading} = this.state;    
    return (
      <Authorize roles={['school_admin', 'parents', 'therapist']} redirect to="/dashboard/beta">
        <Helmet title="Dashboard Alpha" />
        <Row gutter={24}>
          <Col span={6}>
            <Card style={{height:"550px"}}>
              <div>
                <Collapse accordion>
                  <Panel header="Filter" key="1">
                    <Form.Item {...layout} label="Type">
                      <Select style={{width:'190px'}} defaultValue="all" onSelect={this.filterMedicalType}>
                        <Select.Option value="all">All</Select.Option>
                        <Select.Option value="U2V2ZXJpdHlDb25kaXRpb25UeXBlOjE=">Mild</Select.Option>
                        <Select.Option value="U2V2ZXJpdHlDb25kaXRpb25UeXBlOjI=">Moderate</Select.Option>
                        <Select.Option value="U2V2ZXJpdHlDb25kaXRpb25UeXBlOjM=">Severe</Select.Option>
                      </Select>
                    </Form.Item>
                  
                    <Form.Item {...layout} label="Search">
                      <Search
                        placeholder="Search Condition Name..."
                        onSearch={this.handleSearch}
                        style={{ width: "190px" }}
                      />
                    </Form.Item>
                  </Panel>
                  <Panel header="Filter by date" key="2">
                    <div className="site-calendar-demo-card">
                      <Calendar fullscreen={false} onChange={this.onPanelChange} />
                    </div>,

                  </Panel>
               
                </Collapse>,
                
              </div>
            </Card>
          </Col>
        
          <Col span={divShow ? 10 :18}>
            <Card>
              <Row>
                <Col span={4}>
                  <div className="embed-responsive embed-responsive-16by9" style={{ borderRadius:"8px", width:"100%"}}>
                    <Iframe 
                      url="https://www.youtube.com/embed/3w1c4sF4ZTg"
                    />
                  </div>
                  
                </Col>
                <Col span={14}>
                  <div style={{marginLeft:"30px"}}>
                    <h4>Text about Medical Data</h4>
                    <p> 6 min </p>
                    <Button type="link" style={{padding:0}}> Read Instructions <ArrowRightOutlined /></Button>
                  </div>
                  
                </Col>
                <Col span={6}>
                  <p style={{float:'right'}}>
                    <Button onClick={(e) => this.consoleValue(e)}>ADD MEDICAL DATA <PlusOutlined /></Button> 
                  </p>
                </Col>
              </Row>
            </Card>

            {!medicalist.length && !loading ? <Card style={{marginTop:"20px"}}> <Row> <div className="text-center"> No Records! </div> </Row> </Card> : ''}
            {medicalist.map(medical => (
              <Card style={{marginTop:"5px"}}>
                <Row>
                  <div className="text-left">
                    <Col span={8}>
                      <h4>{medical.node.condition}</h4>
                      <p>{medical.node.note}</p>
                      <p>{medical.node.howOftenTaken}</p>
                    </Col>
                    <Col span={8} className="text-center">
                      <p style={{fontSize:"16px"}}>{medical.node.date}</p>
                    </Col>
                    <Col span={8} className="text-right">
                      <a><p> <strong>{medical.node.severity ? medical.node.severity.name : "" }</strong></p></a>
                    </Col>
                  </div>
                </Row>
              </Card>
            ))}
          </Col>
          
          {divShow  &&
          <Col span={8}>
            <div>
              <Card>
                <Button style={{marginRight: '-12px', float:'right', border:'none', padding:'none'}} onClick={() => this.setState({divShow:false})}> <b>X</b> </Button>
                <br />
                <MedicalForm />
              </Card>
            </div>
          </Col>
          }
        </Row>
    
      </Authorize>
    )
  }
}

export default medicalView;