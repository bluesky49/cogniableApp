import React from 'react'
import { Helmet } from 'react-helmet'
import Authorize from 'components/LayoutComponents/Authorize'
import { Row,Col,Card,Button,Collapse, Form,Select,Input,Calendar} from 'antd';
import { ArrowRightOutlined ,PlusOutlined} from '@ant-design/icons'
import Iframe from 'react-iframe';
import { connect } from 'react-redux'
import { gql } from "apollo-boost";
import client from '../apollo/config';
import MealForm from '../components/meal_and_medical/mealform'; 

const { Panel } = Collapse;

const { Search } = Input;


const layout = {
    labelCol: {
      span: 6,
    },
  };

@connect(({ user }) => ({ user }))
class meal extends React.Component {
    state = {
        divShow: false,
        loading:true,
        // foodtypes: [],
        foodlist: []
    };

  componentDidMount() {
    const {user:{studentId}} = this.props;
    client.query({
      query: gql`query {getFood(student:"${studentId}"){
          edges{
              node{
                 id,
                 mealType,
                 mealName,
                 waterIntake,
                 date,
                 mealTime,
                 note,
                 foodType{
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
        foodlist: result.data.getFood.edges
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

    filterMealType = (value) => {
      const {user:{studentId}} = this.props;
      if(value !== 'all'){
        client.query({
          query: gql`query {getFood(student:"${studentId}", mealType:"${value}"){
              edges{
                  node{
                     id,
                     mealType,
                     mealName,
                     waterIntake,
                     date,
                     mealTime,
                     note,
                     foodType{
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
            foodlist: result.data.getFood.edges
          });
        }
        );
      } else{
        client.query({
          query: gql`query {getFood(student:"${studentId}"){
              edges{
                  node{
                     id,
                     mealType,
                     mealName,
                     waterIntake,
                     date,
                     mealTime,
                     note,
                     foodType{
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
            foodlist: result.data.getFood.edges
          });
        }
        );

      }
    }

    onPanelChange = (value) => {
      const {user:{studentId}} = this.props;
      const date = new Date(value).toISOString().slice(0,10);
      client.query({
        query: gql`query {getFood(student:"${studentId}", date_Gte:"${date}", date_Lte:"${date}"){
            edges{
                node{
                   id,
                   mealType,
                   mealName,
                   waterIntake,
                   date,
                   mealTime,
                   note,
                   foodType{
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
          foodlist: result.data.getFood.edges
        });
      }
      );
    }

    handleSearch = (value) => {
      console.log(value);
      const {user:{studentId}} = this.props;
      client.query({
        query: gql`query {getFood(student:"${studentId}", mealName_Icontains:"${value}"){
            edges{
                node{
                   id,
                   mealType,
                   mealName,
                   waterIntake,
                   date,
                   mealTime,
                   note,
                   foodType{
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
          foodlist: result.data.getFood.edges
        });
      }
      );
    }


  onFinish = values => {
    alert()
    console.log(values);
  };
    

  
  render(){
    const {divShow, foodlist, loading} = this.state;    
    return (
      <Authorize roles={['school_admin', 'parents']} redirect to="/dashboard/beta">
        <Helmet title="Dashboard Alpha" />
        <Row gutter={24}>
          <Col span={6}>
            <Card style={{height:"550px"}}>
              <div>
                <Collapse accordion>
                  <Panel header="Filter" key="1">
                    <Form.Item {...layout} label="Type">
                      <Select style={{width:'190px'}} defaultValue="all" onSelect={this.filterMealType}>
                        <Select.Option value="all">All</Select.Option>
                        <Select.Option value="Breakfast">Breakfast</Select.Option>
                        <Select.Option value="Lunch">Lunch</Select.Option>
                        <Select.Option value="Snacks">Snacks</Select.Option>
                        <Select.Option value="Dinner">Dinner</Select.Option>
                      </Select>
                    </Form.Item>
                  
                    <Form.Item {...layout} label="Search">
                      <Search
                        placeholder="Search Food Name..."
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
                    <h4>Text about Meal Data</h4>
                    <p> 6 min </p>
                    <Button type="link" style={{padding:0}}> Read Instructions <ArrowRightOutlined /></Button>
                  </div>
                  
                </Col>
                <Col span={6}>
                  <p style={{float:'right'}}>
                    <Button onClick={(e) => this.consoleValue(e)}>ADD MEAL DATA <PlusOutlined /></Button> 
                  </p>
                </Col>
              </Row>
            </Card>
          
            {!foodlist.length && !loading ? <Card style={{marginTop:"20px"}}> <Row> <div className="text-center"> No Records! </div> </Row> </Card> : ''}
            {foodlist.map(food => (
              <Card style={{marginTop:"5px"}}>
                <Row>
                  <div className="text-left">
                    <Col span={8}>
                      <h4>{food.node.mealType}</h4>
                      <p>{food.node.mealName}</p>
                      <p>{food.node.waterIntake}</p>
                    </Col>
                    <Col span={8} className="text-center">
                      <p style={{fontSize:"16px"}}>{food.node.mealTime}</p>
                    </Col>
                    <Col span={8} className="text-right">
                      <a><p> <strong>{food.node.foodType ? food.node.foodType.name : "" }</strong></p></a>
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
                <MealForm />
              </Card>
            </div>
          </Col>
          }
        </Row>
    
      </Authorize>
    )
  }
}

export default meal;