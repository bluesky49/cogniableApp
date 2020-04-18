import React from 'react'
import { Helmet } from 'react-helmet'
import Authorize from 'components/LayoutComponents/Authorize'
import { Row,Col,Card,Calendar,Button} from 'antd';
import { PieChartOutlined,CheckCircleFilled} from '@ant-design/icons';
import { gql } from "apollo-boost";
import client from '../apollo/config';

function onPanelChange(value, mode) {
  console.log(value, mode);
}

class BehaviourDecel extends React.Component {
    state = {
      loading:true,
      data:[]
    };
   
  componentDidMount() {
    client.query({
      query: gql`query{
          getDecelData(template_Student:"U3R1ZGVudFR5cGU6MTYz"){
              edges{
                  node{
                      id,
                      irt,
                      intensity,
                      note,
                      date,
                      frequency,
                      duration,
                      template{
                          id,
                          behavior{
                              id,
                              behaviorName
                          }
                          behaviorDef,
                          behaviorDescription
                      },
                      environment{
                          id,
                          name
                      },
                      status{
                          id,
                          statusName
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
        data: result.data.getDecelData.edges
      });
    }
    ); 

  };
  

      onPanelChange = (value) => {
      const date = new Date(value).toISOString().slice(0,10);
      client.query({
        query: gql`query{
          getDecelData(template_Student:"U3R1ZGVudFR5cGU6MTYz", date_Gte:"${date}", date_Lte:"${date}"
          ){
              edges{
                  node{
                      
                      id,
                      irt,
                      intensity,
                      note,
                      date,
                      frequency,
                      duration,
                      template{
                          id,
                          behavior{
                              id,
                              behaviorName
                          }
                          behaviorDef,
                          behaviorDescription
                      },
                      environment{
                          id,
                          name
                      },
                      status{
                          id,
                          statusName
                      }
                      
                  }
              }
          }
      }`
      })
      .then(result => {
        this.setState({
          data: result.data.getDecelData.edges
        });
      }
      );
    }


  render(){
    const {data, loading} = this.state;
    console.log(loading);
    console.log(data);

    return (
      <Authorize roles={['school_admin', 'parents']} redirect to="/dashboard/beta">
        <Helmet title="Dashboard Alpha" />
        <Row gutter={24}>
          <Col span={6}>
            <Card>
              <div className="site-calendar-demo-card">
                <Calendar fullscreen={false} onPanelChange={onPanelChange} onChange={this.onPanelChange} />
              </div>             
            </Card>
          </Col>
          <Col span={18}>
            
            <Card>
              <h1 style={{textAlign:"center",marginBottom:"30px"}}>Behaviour Details</h1>
              <Row>
                {!data.length && !loading ? <Card style={{marginTop:"20px"}}> <Row> <div className="text-center"> No Records! </div> </Row> </Card> : ''}
                {data.map(row => (
                  <Col span={16} offset={4} style={{marginTop:"20px"}}>
                    <Card style={{borderRadius:"8px"}}>
                      <h4>{row.node.template.behavior.behaviorName}</h4> 
                      <strong>{row.node.note}</strong>
                      <h6>{row.node.status.statusName}  &emsp; {row.node.environment ? row.node.environment.name : ''}</h6>
                      <br />
                      <h6 style={{display:"inline"}}><PieChartOutlined /> Behaviour Graph</h6>
                      <Button type="link" style={{display:"inline" ,float:"right",color:"red"}}><CheckCircleFilled />&nbsp;<b>Press To Record</b></Button>
                    </Card>
                  </Col> 
                ))}
              </Row>
              
               
            </Card>
            

            
          </Col>    
          
        </Row>
        
      </Authorize>
    )
  }
}

export default BehaviourDecel;
