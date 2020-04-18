import React from 'react';
import { Table,Icon,Row,Col,Form,Select,Input,Button} from 'antd';



class TargetTable extends React.Component {
    render() {
        // form
        const { Option } = Select;
        const { Search } = Input;
        const layout = {
            labelCol: {
              span: 6,
            },
            wrapperCol: {
              span: 24,
            },
          };
        // table
        const column1 = [
            {
              title: 'Domain',
              dataIndex: 'domain',
            },
            {
              title: 'Target Name',
              dataIndex: 'targetname',
            },
          ];
          const data1 = [
            {
              key: '1',
              domain: 'MAND',
              targetname: 'requests for activities using appropriate adjectives',
              
            },
            {
              key:'2',
              domain: 'MAND',
              targetname: 'requests for activities using appropriate adjectives',
            
            },
          ];
          
          const column2 = [
            {
              title: 'Domain',
              dataIndex: 'domain',
              render: text => <a>{text}</a>,
            },
            {
              title: 'Target Name',
              dataIndex: 'targetname',
            },
            {
              title: 'Status',
              dataIndex: 'status',
              render: text=> <span style={{color:"green"}}>{text}</span>
            },
            {
              title: 'Copy',
              dataIndex: 'copy',
              render: text => <a>{text}</a>,
            },  
          ];
          const data2 = [
            {
              key: '3',
              domain: 'MAND',
              targetname: 'requests for activities using appropriate adjectives',
              status:'baseline',
              copy:<Icon type="copy" />
              
            },
            {
              key:'4',
              domain: 'MAND',
              targetname: 'requests for activities using appropriate adjectives',
              status:'in-therapy',
              copy:<Icon type="copy" />
            
            },
            {
                key:'5',
                domain: 'MAND',
                targetname: 'requests for activities using appropriate adjectives',
                status:'in-therapy',
                copy:<Icon type="copy" />
              
            },
            {
                key: '6',
                domain: 'MAND',
                targetname: 'requests for activities using appropriate adjectives',
                status:'baseline',
                copy:<Icon type="copy" />
                
            },
            {
                key: '7',
                domain: 'MAND',
                targetname: 'requests for activities using appropriate adjectives',
                status:'in-therapy',
                copy:<Icon type="copy" />
                
            },
            {
                key: '8',
                domain: 'MAND',
                targetname: 'requests for activities using appropriate adjectives',
                status:'baseline',
                copy:<Icon type="copy" />
                
            },
            {
                key: '9',
                domain: 'MAND',
                targetname: 'requests for activities using appropriate adjectives',
                status:'mastered',
                copy:<Icon type="copy" />
                
            },
            {
                key: '10',
                domain: 'MAND',
                targetname: 'requests for activities using appropriate adjectives',
                status:'in-therapy',
                copy:<Icon type="copy" />
                
            },
            {
                key: '11',
                domain: 'MAND',
                targetname: 'requests for activities using appropriate adjectives',
                status:'baseline',
                copy:<Icon type="copy" />
                
            },
            {
                key: '12',
                domain: 'MAND',
                targetname: 'requests for activities using appropriate adjectives',
                status:'in-therapy',
                copy:<Icon type="copy" />
                
            },
            {
                key: '13',
                domain: 'MAND',
                targetname: 'requests for activities using appropriate adjectives',
                status:'in-therapy',
                copy:<Icon type="copy" />
                
            },
            {
                key: '14',
                domain: 'MAND',
                targetname: 'requests for activities using appropriate adjectives',
                status:'in-therapy',
                copy:<Icon type="copy" />
                
            },
            {
                key: '15',
                domain: 'MAND',
                targetname: 'requests for activities using appropriate adjectives',
                status:'baseline',
                copy:<Icon type="copy" />
                
            },
            {
                key: '16',
                domain: 'MAND',
                targetname: 'requests for activities using appropriate adjectives',
                status:'in-therapy',
                copy:<Icon type="copy" />
 
                
            },


            
          ];
          // rowSelection object indicates the need for row selection
          const rowSelection1 = {
            onChange: (selectedRowKeys, selectedRows) => {
              console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
            getCheckboxProps: record => ({
                disabled: record.name === 'Disabled User', // Column configuration not to be checked
                name: record.name,
              }),
          };
          
          
          // rowSelection object indicates the need for row selection
          const rowSelection2 = {
            onChange: (selectedRowKeys, selectedRows) => {
              console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
            getCheckboxProps: record => ({
                disabled: record.name === 'Disabled User', // Column configuration not to be checked
                name: record.name,
              }),
          };
          
        return (

          <div className="row justify-content-md-center">
            <div className="col-sm-7">
              <div className="card">
                <div className="card-body">
                  <div>
                    <Row>
                      
                      <Col xs={{ span: 4 }} lg={{ span: 4 }}>
                        <Form {...layout}>
                          <Select
                            placeholder="search learner"
                            onSelect={this.handleChange}
                            allowClear
                          >
                            <Option value="">1</Option>
                            <Option value="">2</Option>
                            <Option value="">3</Option>
                          </Select>
                        </Form>
                      </Col>
                      <Col xs={{ span: 4 }} lg={{ span: 4 }}>
                        <Form {...layout}>
                          <Select
                  
                            placeholder="Domain"
                            onSelect={this.handleChange}
                            allowClear
                          >
                            <Option value="">Milestones</Option>
                            <Option value="">Barriers</Option>
                            <Option value="">Transition Assessment</Option>
                    
                          </Select>
                        </Form>
                      </Col>

                      <Col xs={{ span: 4 }} lg={{ span: 4 }}>
                        <Form {...layout}>
                          <Select
                  
                            placeholder="Target Area"
                            onSelect={this.handleChange}
                            allowClear
                          >
                            <Option value="">1</Option>
                            <Option value="">2</Option>
                            <Option value="">3</Option>
                          </Select>
                        </Form>
                      </Col>
                      <Col xs={{ span: 4 }} lg={{ span: 4 }}>
                        <Search
                          placeholder="search keyword "
                          onSearch={value => console.log(value)}                        
                        />
                      </Col>
                      <Col xs={{ span: 4 }} lg={{ span: 4 }}>
                        <Form {...layout}>
                          <Button type="primary">Suggest Targets</Button>
                        </Form>
                      </Col>
                    </Row>           
                    <br />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-7">
              <div className="card">
                <div className="card-body">
                  <Button type="primary" style={{float:"right"}}>Allocated Targets</Button>
                  <h4>Suggested Targets</h4>
                  <Table   
                    rowSelection={rowSelection1} 
                    columns={column1} 
                    dataSource={data1} 
                  />,
                </div>
              </div>
            </div>
            <div className="col-sm-7">
              <div className="card">
                <div className="card-body">
                  <h4>Allready allocated targets</h4> 
                  <Table  
                    rowSelection={rowSelection2} 
                    columns={column2} 
                    dataSource={data2} 
                  />,
                </div>
              </div>
            </div>
          </div>
        )
      }
    }
export default TargetTable
