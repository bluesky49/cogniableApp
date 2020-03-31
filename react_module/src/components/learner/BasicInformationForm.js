import React from 'react';
import { Form, Input, Button, Select,DatePicker } from 'antd';

const { TextArea } = Input;
const { Option } = Select;
const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 14,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 6,
    span: 14,
  },
};

const API_URL = process.env.REACT_APP_API_URL;
const token = localStorage.getItem('token').slice(1,-1)
const database = localStorage.getItem('database').slice(1,-1)

class BasicInformationForm extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      staffs : [],
      diagnoses: [],
      isLoaded: false,
      isDiagnosisLoaded:false,
      clientId: 'COG',
      email: '',
      firstName:'',
      middleName:'',
      lastName:'',
      authStaff:null,
      address:'',
      dob:'',
      gender:'',
      diagnosis: null,
      diagnosisDate:'',
      clinicLocation:null,
      parentFirstName: '',
      parentLastName: '',
      ssnCard:'',
      category:null,
      categoryList: [],
      isCategoryLoaded: false,
      clinicLocationList:[],
      isClinicLocationLoaded:false,
    };

  }

  componentDidMount(){
    console.log(token)

    // Get Staff list
    fetch(`${API_URL}/school/staff/`, {
      method: "GET",
      headers: {
        "Accept": "application/json", 
        "Content-Type": "application/json", 
        "Access-Control-Allow-Origin": '*', 
        "Authorization": token,
        'database': database
        }, 
    }
    ).then(res => res.json()).then(data =>  {
      
      this.setState({
        staffs: data.data,
        isLoaded:true
      })
    })

    // Get Diagnosis list
    fetch(`${API_URL}/target_allocate/diagnoses`, {
      method: "GET",
      headers: {
        "Accept": "application/json", 
        "Content-Type": "application/json", 
        "Access-Control-Allow-Origin": '*', 
        "Authorization": token,
        'database': database
        }, 
    }
    ).then(res => res.json()).then(data =>  {
      
      this.setState({
        diagnoses: data.data,
        isDiagnosisLoaded:true
      })
    })

    // Get Category List
    fetch(`${API_URL}/school/category_list`, {
      method: "GET",
      headers: {
        "Accept": "application/json", 
        "Content-Type": "application/json", 
        "Access-Control-Allow-Origin": '*', 
        "Authorization": token,
        'database': database
        }, 
    }
    ).then(res => res.json()).then(data =>  {
      
      this.setState({
        categoryList: data.data,
        isCategoryLoaded:true
      })
    })

    // Get Clinic Location List
    fetch(`${API_URL}/school/school_locations_list`, {
      method: "GET",
      headers: {
        "Accept": "application/json", 
        "Content-Type": "application/json", 
        "Access-Control-Allow-Origin": '*', 
        "Authorization": token,
        'database': database
        }, 
    }
    ).then(res => res.json()).then(data =>  {
      
      this.setState({
        clinicLocationList: data.data,
        isClinicLocationLoaded:true
      })
    })
    


  }

  handleChange = (e) => {this.setState({[e.target.name]: e.target.value})};

  setDob = (value) => {this.setState({dob : new Date(value)})}

  selectTherapist = (value) => {this.setState({authStaff:value})}

  selectGender = (value) => {this.setState({gender:value})}

  selectDiagnosis = (value) => {this.setState({diagnosis:value})}

  setDiagnosisDate = (value) => {this.setState({diagnosisDate : new Date(value)})}

  selectClinicLocation = (value) => {this.setState({clinicLocation:value})}

  selectCategory = (value) => {this.setState({category:value})}

  

  onFinish = (e, This) => {
    e.preventDefault();
    const data = {
      clientId: This.state.clientId,
      email: This.state.email,
      firstName: This.state.firstName,
      middleName: This.state.middleName,
      lastName: This.state.lastName,
      authStaff: This.state.authStaff,
      category: This.state.category,
      address: This.state.address,
      dob: This.state.dob,
      gender: This.state.gender,
      diagnosis: This.state.diagnosis,
      clinicLocation: This.state.clinicLocation,
      parentFirstName: This.state.parentFirstName,
      parentLastName: This.state.parentLastName,
      ssnCard: This.state.ssnCard,

    }

    // Get Clinic Location List
    fetch(`${API_URL}/school/create_learner`, {
      method: "POST",
      headers: {
        "Accept": "application/json", 
        "Content-Type": "multipart/form-data", 
        "Access-Control-Allow-Origin": '*', 
        "Authorization": token,
        'database': database
        },
      body: JSON.stringify(data)
    }
    ).then(res => res.json()).then(result =>  {
      
      console.log(result)
      
    })


  };

 

  render() {
    const {staffs, isLoaded, isDiagnosisLoaded, diagnoses, clientId, email, firstName, middleName, lastName, authStaff, 
      address, dob, gender, diagnosis, diagnosisDate, clinicLocation, parentFirstName, parentLastName, ssnCard, location,
      categoryList, category, isCategoryLoaded, clinicLocationList, isClinicLocationLoaded} = this.state;
    console.log(authStaff, dob, gender, diagnosis, diagnosisDate, clinicLocation, location, category)
    if (!isLoaded || !isDiagnosisLoaded || !isCategoryLoaded || !isClinicLocationLoaded){
      return <div>Loding...</div>;
    }
    return (
      <Form {...layout} name="control-ref" onSubmit={(e) => this.onFinish(e, this)}>
        <Form.Item label="Client Id">
          <Input name="clientId" onChange={this.handleChange} value={clientId} />
        </Form.Item>
        <Form.Item 
          label="Email"
          rules={[
            {
              required: true,
              type: "email"
            },
          ]}
        >
          <Input name="email" onChange={this.handleChange} value={email} />
        </Form.Item>
        <Form.Item
          label="First Name"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input name="firstName" onChange={this.handleChange} value={firstName} />
        </Form.Item>
        <Form.Item label="Middel Name">
          <Input name="middleName" onChange={this.handleChange} value={middleName} />
        </Form.Item>
        <Form.Item label="Last Name">
          <Input name="lastName" onChange={this.handleChange} value={lastName} />
        </Form.Item>
        <Form.Item
          label="Authorized Staff"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select
            mode="multiple"
            placeholder="Select Therapist"
            name="authStaff"
            onChange={this.selectTherapist}
            allowClear
          >
            {staffs.map((item) => <Option value={item.id}>{item.name}</Option>)} 
          </Select>
        </Form.Item>
        <Form.Item label="Address">
          <TextArea
            placeholder="Address"
            name="address"
            onChange={this.handleChange}
            autoSize={{ minRows: 2, maxRows: 5 }}
          >
            {address}
          </TextArea>
        </Form.Item>
        <Form.Item 
          label="DOB"
          rules={[
            {
              required: true,
            }
          ]} 
        >
          <DatePicker onChange={this.setDob} /> 
        </Form.Item>


        <Form.Item label="Gender">
          <Select
            name="gender"
            placeholder="Who you are"
            onSelect={this.selectGender}            
            allowClear
          >
            <Option value="male">male</Option>
            <Option value="female">female</Option>
            <Option value="other">other</Option>
          </Select>
        </Form.Item>


        <Form.Item
          name="diagnosis"
          label="Diagnosis"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select
            mode="multiple"
            placeholder="Select Diagnosis"
            onChange={this.selectDiagnosis}
            allowClear
          >
            {diagnoses.map((item) => <Option value={item.id}>{item.name}</Option>)}
            
          </Select>
        </Form.Item>
        <Form.Item label="Date of Diagnosis">
          <DatePicker onChange={this.setDiagnosisDate} />
        </Form.Item>
        <Form.Item label="Clinic Location">
          <Select
            placeholder="Select a Clinic location"
            name="clinicLocation"
            onSelect={this.selectClinicLocation}
            allowClear
          >
            {clinicLocationList.map((item) => <Option value={item.id}>{item.location}</Option>)}
          </Select>
        </Form.Item>
        <Form.Item 
          label="Parent/Guardian First Name"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input name="parentFirstName" onChange={this.handleChange} value={parentFirstName} />
        </Form.Item>
        <Form.Item label="Parent/Guardian Last Name">
          <Input name="parentLastName" onChange={this.handleChange} value={parentLastName} />
        </Form.Item>
        <Form.Item label="SSN/Adhaar card">
          <Input name="ssnCard" onChange={this.handleChange} value={ssnCard} />
        </Form.Item>
        <Form.Item label="Location Category">
          <Select
            name="category"
            placeholder="Select category"
            onSelect={this.selectCategory}
            allowClear
          >
            {categoryList.map((item) => <Option value={item.id}>{item.category}</Option>)}
          </Select>
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="submit" htmlType="submit"> 
            Submit
          </Button>

          <Button htmlType="primary" onClick={this.onReset} className="ml-4">
            cancel
          </Button>
          
        </Form.Item>


      </Form>
    );
  }
}

export default BasicInformationForm