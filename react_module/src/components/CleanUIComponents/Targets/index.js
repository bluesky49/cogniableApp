import React from 'react'
import { Form, Icon, Input, Button, Select } from 'antd'
import { GraphQLClient } from 'graphql-request'

const FormItem = Form.Item
// const { Option } = Select
const graphQLClient = new GraphQLClient('http://development.cogniable.us/apis/school/graphql', {
  headers: {
    database: 'india',
  },
})

// const column1 = [
//   {
//     title: 'Domain',
//     dataIndex: 'domain',
//   },
//   {
//     title: 'Target Name',
//     dataIndex: 'targetname',
//   },
// ];


// const data1 = [
//   {
//     key: '1',
//     domain: 'MAND',
//     targetname: 'requests for activities using appropriate adjectives',

//   },
//   {
//     key: '2',
//     domain: 'MAND',
//     targetname: 'requests for activities using appropriate adjectives',

//   },
// ];

class SearchTarget extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      LearnerList: [],
      // SuggestedTarget:[],
      DomainList: [],
      targetArea: []
    }
    this.DomainChange = this.DomainChange.bind(this);
  }


  componentDidMount() {
    const query = `query {students {
      edges {
          node {
          id,
          firstname,
          internalNo
          }
      }
    }}`

    graphQLClient.request(query).then(data => {
      this.setState({
        LearnerList: data.students.edges
      })
    })

    const query2 = `query {domain {
      domain,
      id
  }}`

    graphQLClient.request(query2).then(data => {
      this.setState({
        DomainList: data.domain
      })
    })
  }

  handleSubmit = e => {
    e.preventDefault();
    const { form } = this.props;

    form.validateFields((error, values) => {
      if (!error) {
        console.log(values)

        const query = `query Target($domain:ID!, $target_area: ID!, $search: String!){
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
      }`

        const variables = {
          domain: values.domain,
          target_area: values.target_area,
          search: values.search,
        }

        graphQLClient.request(query, variables).then(data => {
          return data
          // this.setState({
          //   SuggestedTarget: data.target.edges
          // })
        })

      }
    })

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


  render() {
    const { form } = this.props;
    const { LearnerList, DomainList, targetArea } = this.state;

    return (
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
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
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
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
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
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
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
              {form.getFieldDecorator('search')(
                <Input
                  suffix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type="text"
                  placeholder="Search"
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
      // <div className="card">
      //   <div className="card-body">
      //     <Button
      //       type="primary"
      //       style={{ float: "right" }}
      //     >
      //       Allocated Targets
      //     </Button>
      //     <h4 style={{ backgroundColor: "inherit" }}>Suggested Targets</h4>
      //     <Table
      //       columns={column1}
      //       dataSource={data1}
      //       bordered
      //     // onChange={this.handleChange}
      //     // rowSelection={rowSelection1}
      //     />
      //   </div>
      // </div>

    )
  }
}

const LoginForm = Form.create()(SearchTarget)
export default LoginForm
