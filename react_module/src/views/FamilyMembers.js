import React from 'react'
import { Helmet } from 'react-helmet'
import {Row,Col, Card,Button,Input,Form,Select,InputNumber} from 'antd';
import {PictureOutlined,ArrowRightOutlined,PlusOutlined,MinusOutlined} from "@ant-design/icons"
import Authorize from 'components/LayoutComponents/Authorize'
// import style from '../learnerform.scss'





class FamilyMembers extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };

  }

  render() {
      const {Option}= Select
      // const ButtonGroup = Button.Group;
    
      
    


    return (
      <Authorize roles={['school_admin']} redirect to="/dashboard/beta">
        <Helmet title="Partner" />
        
        
          
        <Row gutter={24}>
          <Col span={8}>
            <Card bordered={false} style={{ marginTop: 16}}>
              <Button style={{width:"100%",minHeight:"60px",fontSize: "20px"}}>
                <PictureOutlined style={{float:"left",width:"auto"}} />Father <ArrowRightOutlined style={{float:"right"}} />
              </Button>
              <Button style={{width:"100%",minHeight:"60px",fontSize: "20px",marginTop: 16}}>
                <PictureOutlined style={{float:"left",width:"auto"}} />Mother <ArrowRightOutlined style={{float:"right"}} />
              </Button>
              <Button style={{width:"100%",minHeight:"60px",fontSize: "20px",marginTop: 16}}>
                <PictureOutlined style={{float:"left",width:"auto"}} />Sibling <ArrowRightOutlined style={{float:"right"}} />
              </Button>
              <Button style={{width:"100%",minHeight:"60px",fontSize: "20px",marginTop: 16}}>
                <PictureOutlined style={{float:"left",width:"auto"}} />GrandFather <ArrowRightOutlined style={{float:"right"}} />
              </Button>
              <Button style={{width:"100%",minHeight:"60px",fontSize: "20px",marginTop: 16}}>
                <PictureOutlined style={{float:"left",width:"auto"}} />Add Member <ArrowRightOutlined style={{float:"right"}} />
              </Button>  
            </Card> 
          </Col>
          <Col span={16}>
            <Card style={{backgroundColor:"inherit",marginTop:16}}>
              <Button type="link" style={{float:"right"}}>Skip</Button>
              <h4 style={{marginTop:50}}>Add family members details and time spent with kunal to allocate targets accordingly</h4>
              <Card bordered={false} style={{ marginTop: 50 ,backgroundColor:"inherent",padding:"10px"}}>
                <Form layout="inline">
                  <Form.Item label="" style={{marginRight:70}}>
                    <PictureOutlined style={{fontSize:"50px",border:"1px dotted" ,padding:"5px",borderRadius:"4px"}} />
                  </Form.Item>
                  <Form.Item label="" style={{marginRight:50}}>
                    <Input style={{width:'300px'}} name="Name" placeholder="Name" />
                  </Form.Item>
                  <Form.Item label="" style={{marginRight:50}}>
                    <Select style={{width:'300px'}} name="relationship" placeholder="Relationship to child">
                      <Option value="relationship">mom</Option>
                      <Option value="relationship">father</Option>
                    </Select>
                  </Form.Item>
                </Form>
              </Card>
              <Card bordered={false} style={{ marginTop: 16}}>
                <h3>Average time spent with Kunal</h3>
                <h5>how much time do you spend with kunal daily?</h5>
                <br />
                <div style={{left:"100px",width:"80%"}}>
                  <ul style={{listStyleType:"none"}}>
                    <li>
                      <span style={{ width:"430px",fontSize:"20px"}}>Morning</span>
                      <span style={{fontSize:"20px",float:"right"}}><PlusOutlined /><InputNumber /><MinusOutlined /> &nbsp;hr</span>                    
                    </li>
                    <hr />
                    <li>
                      <span style={{ width:"430px",fontSize:"20px"}}>Afternoon</span>
                      <span style={{fontSize:"20px",float:"right"}}><PlusOutlined /><InputNumber /><MinusOutlined /> &nbsp;hr</span>                    
                    </li>
                    <hr />
                    <li>
                      <span style={{ width:"430px",fontSize:"20px"}}>Evening</span>
                      <span style={{fontSize:"20px",float:"right"}}><PlusOutlined /><InputNumber /><MinusOutlined /> &nbsp;hr</span>                    
                    </li>
                    <hr />
                  </ul>
                  <h4 style={{textAlign:"center"}}>Total Duration : 2Hours </h4>
                </div>
              </Card>
              <Button type="primary" block>Save Date</Button>
            </Card>
          </Col>
        </Row>
        
    

      </Authorize>
    )
  }
}

export default FamilyMembers

