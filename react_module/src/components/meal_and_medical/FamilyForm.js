import React from 'react';
import {Row,Col, Card,Button,Input,Form,Select, Icon, notification} from 'antd';
// import {upload} from 'antd';
import { gql } from "apollo-boost";
import client from '../../apollo/config'


class FamilyBasicForm extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      isLoaded:true,
      morning: 0,
      afternoon: 0,
      evening: 0,
      relations:[]
    };
  }

  componentDidMount() {
    client.query({
      query: gql`query {relationships {id,name}}`
    }).then(result => {
      console.log(result);
      this.setState({
        isLoaded:false,
        relations: result.data.relationships
      });
    }
    ); 
  };

  handleSubmit = (e, This) => {
    console.log(This);
    e.preventDefault();
    const { form } = this.props;
    const { morning, afternoon, evening } = this.state;

    form.validateFields((error, values) => {
      console.log(values);
      if (!error) {
        console.log(notification);
        console.log(values.Name);
        console.log(values.relation);

        client.mutate({
          mutation: gql`mutation {
              familyMember(
                input:{
                  student:"U3R1ZGVudFR5cGU6OTI=",
                  memberName:"${values.Name}",
                  relationship:"${values.relation}",
                  timeSpent:[ 
                      {session:"U2Vzc2lvbk5hbWVUeXBlOjE=", duration:"${morning} hours"},
                      {session:"U2Vzc2lvbk5hbWVUeXBlOjI=", duration:"${afternoon} hours"},
                      {session:"U2Vzc2lvbk5hbWVUeXBlOjM=", duration:"${evening} hours"} 
                  ],
                }
              )
              { 
                familyMember{
                  id,
                }
              }
            }`
          })
          .then(result => {
            console.log(result)
            notification.success({
              message: 'Member Added',
              description:'Family member added Successfully.',              
            });
            form.resetFields(); 
          })
          .catch(err => { 
            err.graphQLErrors.map((item) => {
              return notification.error({
                message: 'Somthing want wrong',
                description: item.message,
            }); 
          })
        });

      }
    })
  };

  onReset = () => {
    const {form} = this.props;
    form.resetFields();
  };


  addMorning = (val) => {
    this.setState({
      morning: val+1
    })
  }

  removeMorning = (val) => {
      if (val > 0){
          this.setState({
            morning: val-1
          })
      }
  }

  addAfternoon = (val) => {
    this.setState({
      afternoon: val+1
    })
  }

  removeAfternoon = (val) => {
      if (val > 0){
          this.setState({
            afternoon: val-1
          })
      }
  }

  addEvening = (val) => {
    this.setState({
      evening: val+1
    })
  }

  removeEvening = (val) => {
      if (val > 0){
          this.setState({
            evening: val-1
          })
      }
  }

   render() {
    const {form} = this.props;
    const {isLoaded, morning, evening, afternoon, relations } = this.state;
    if (isLoaded){
      return <div>Loding...</div>;
    }

    return (
      <Form onSubmit={(e) => this.handleSubmit(e, this)}>
        <Card bordered={false} style={{backgroundColor:"inherent",padding:"10px", width:"80%",margin:"auto"}}>
          <Button type="link" style={{float:"right"}}>Skip</Button>
          <h5>Family members</h5>
          <br />
          <Row>
            {/* <Col sm={6}>
              <Form.Item label="" style={{marginRight:70}}>
                <Upload.Dragger name="files" action="/upload.do">
                  <p className="ant-upload-drag-icon">
                    <Icon type="inbox" />
                  </p>
                  <p className="ant-upload-text">Upload Picture</p>
                </Upload.Dragger>
              </Form.Item>
            </Col> */}
            <Col sm={18}>
              <Form.Item label="">
                {form.getFieldDecorator('Name', {rules: [{ required: true, message: 'Please Select Name!' }],})(
                  <Input style={{width:'300px'}} name="Name" placeholder="Name" />
                )}
              </Form.Item>
              <Form.Item label="">
                {form.getFieldDecorator('relation', {rules: [{ required: true, message: 'Please Select Relation!' }],})(
                  <Select style={{width:'300px'}} name="relation" placeholder="Relationship to child">
                    {relations.map((item) => <Select.Option value={item.id}>{item.name}</Select.Option>)}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
        </Card>
        <br />
        <Card bordered={false} style={{ marginTop: 16,padding:"10px", width:"80%",margin:"auto"}}>
          {/* <h5>Average time spent with Kunal</h5> */}
          <h5>Time spent with Kunal</h5>
          <br />
          <div style={{left:"100px",width:"50%"}}>
            <ul style={{listStyleType:"none"}}>
              <li>
                <h6><span style={{fontSize:"18px"}}>Morning : {morning} hr </span> <span style={{float:'right'}}><Button style={{width:"80px"}} onClick={() => this.removeMorning(morning)}><Icon type="minus" /></Button>&nbsp; <Button onClick={() => this.addMorning(morning)} style={{width:"80px"}}><Icon type="plus" /></Button></span></h6> <br />                    
              </li>
              <li>
                <h6><span style={{fontSize:"18px"}}>Afternoon : {afternoon} hr </span> <span style={{float:'right'}}><Button style={{width:"80px"}} onClick={() => this.removeAfternoon(afternoon)}><Icon type="minus" /></Button>&nbsp; <Button onClick={() => this.addAfternoon(afternoon)} style={{width:"80px"}}><Icon type="plus" /></Button></span></h6> <br />                    
              </li>
              <li>
                <h6><span style={{fontSize:"18px"}}>Evening : {evening} hr </span> <span style={{float:'right'}}><Button style={{width:"80px"}} onClick={() => this.removeEvening(evening)}><Icon type="minus" /></Button>&nbsp; <Button onClick={() => this.addEvening(evening)} style={{width:"80px"}}><Icon type="plus" /></Button></span></h6> <br />                    
              </li>
            </ul>
            <h6>Total Duration : {morning+afternoon+evening} Hours </h6>
          </div>
          <Button type="primary" htmlType="submit" style={{marginLeft:'200px'}}>Save Data</Button>
        </Card>
      </Form>
    )
  }
}

const FamilyForm = Form.create()(FamilyBasicForm)
export default FamilyForm;
