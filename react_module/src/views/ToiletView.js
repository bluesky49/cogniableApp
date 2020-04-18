import React from 'react'
import { Helmet } from 'react-helmet'
import Authorize from 'components/LayoutComponents/Authorize'
import { Row,Col,Card,Calendar,Button} from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons'
import Iframe from 'react-iframe';
import { gql } from "apollo-boost";
import client from '../apollo/config';
import ToiletForm from '../components/meal_and_medical/toiletform'


class ToiletView extends React.Component {
    state = {
      divShow: false,
      loading:true,
      data:[]
    };

    componentDidMount() {
      client.query({
        query: gql`query{
            getToiletData(student:"U3R1ZGVudFR5cGU6MTYz"){
                edges{
                    node{
                        id,
                        date,
                        time,
                        lastWater,
                        lastWaterTime,
                        success,
                        urination,
                        bowel,
                        prompted
                    }
                }
            }
        }`
      })
      .then(result => {
        console.log(result);
        this.setState({
          loading:false,
          data: result.data.getToiletData.edges
        });
      }
      ); 
    };
   
    onPanelChange = (value) => {
      const date = new Date(value).toISOString().slice(0,10);
      client.query({
        query: gql`query{
          getToiletData(student:"U3R1ZGVudFR5cGU6MTYz", date:"${date}"){
              edges{
                  node{
                      id,
                      date,
                      time,
                      lastWater,
                      lastWaterTime,
                      success,
                      urination,
                      bowel,
                      prompted
                  }
              }
          }
      }`
      })
      .then(result => {
        this.setState({
          loading:false,
          data: result.data.getToiletData.edges
        });
      }
      );
    }


    consoleValue = (e,) => {
      e.preventDefault();
      this.setState({
          divShow: true
      });
    }
  
  render(){
      const {divShow, data, loading} = this.state; 

    return (
      <Authorize roles={['school_admin']} redirect to="/dashboard/beta">
        <Helmet title="Dashboard Alpha" />
        <Row gutter={24}>
          <Col span={6}>
            <Card>
              <div className="site-calendar-demo-card">
                <Calendar fullscreen={false} onChange={this.onPanelChange} />
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
                <Col span={20}>
                
                  <Button type="primary" style={{float:"right",marginBottom:"10px"}} onClick={(e) => this.consoleValue(e)}>Add New</Button>
                  <div style={{marginLeft:"30px"}}>
                    <h5> Kunal names the presented complex action appopriately</h5>
                    <h6> 6 min </h6>
                    <Button type="link" style={{padding:0}}> Read Instructions <ArrowRightOutlined /></Button>
                  </div>
                </Col>
              </Row>
            </Card>
         
            {!data.length && !loading ? <Card style={{marginTop:"20px"}}> <Row> <div className="text-center"> No Records! </div> </Row> </Card> : ''}
            {data.map(row => (

              <Card style={{marginTop:"20px"}}>
                <Row>
                  <div className="text-center">
                    <Col span={8}>
                      <h5>{row.node.urination ? 'Urination, ' : ''} {row.node.bowel ? 'Bowel Movement ' : ''}</h5>
                      <h5>Last Water : {row.node.lastWater ? row.node.lastWater : ''}</h5>
                      <h5>Last Water Time : {row.node.lastWaterTime ? row.node.lastWaterTime : ''}</h5>
                    </Col>
                    <Col span={8}>
                      <h5> {row.node.date} </h5>
                      <h5> {row.node.time} </h5>
                    </Col>
                    <Col span={8}>
                      <h5>{row.node.prompted ? 'Prompted to request' : 'Independent Request'}</h5>
                      <h5 style={{color:"#f5222d"}}>Success : {row.node.success ? 'Yes' : 'No'}</h5>
                    </Col>
                  </div>
                </Row>
              </Card>
            ))}

          </Col>    
          
          {divShow && 
          <Col span={8}>
            <Card>
              <Button style={{marginRight: '-12px', float:'right', border:'none', padding:'none'}} onClick={() => this.setState({divShow:false})}> X </Button>
              <ToiletForm />
            </Card>
          </Col>}
          
        </Row>
        
      </Authorize>
    )
  }
}

export default ToiletView;
