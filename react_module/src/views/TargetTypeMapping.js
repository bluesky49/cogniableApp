import React from 'react'
import { Helmet } from 'react-helmet'

import { Transfer,Form,Select } from 'antd';
import Authorize from 'components/LayoutComponents/Authorize'
// import style from '../learnerform.scss'

class TargetTypeMapping extends React.Component {
    state = {
        mockData: [],
        targetKeys: [],
      };
    
      componentDidMount() {
        this.getMock();
      }
    
      getMock = () => {
        const targetKeys = [];
        const mockData = [];
        for (let i = 0; i < 20; i+=1) {
          const data = {
            key: i.toString(),
            title: `Recording parameter${i + 1}`,
            description: `description of content${i + 1}`,
            chosen: Math.random() * 2 > 1,
          };
          if (data.chosen) {
            targetKeys.push(data.key);
          }
          mockData.push(data);
        }
        this.setState({ mockData, targetKeys });
      };
    
      filterOption = (inputValue, option) => option.description.indexOf(inputValue) > -1;
    
      handleChange = targetKeys => {
        this.setState({ targetKeys });
      };
    
      handleSearch = (dir, value) => {
        console.log('search:', dir, value);
      };

  render() {
      const {mockData, targetKeys} = this.state;
      console.log(mockData, targetKeys)
    
    return (
      <Authorize roles={[1]} redirect to="/dashboard/beta">
        <Helmet title="Partner" />
        {/* <div className="utils__title utils__title--flat mb-3">
          <strong className="text-uppercase font-size-16">Target Type Mapping</strong>
        </div> */}
        <div className="row justify-content-md-center">
          <div className="col-sm-7">
            <div className="card">
              <div className="card-body" style={{textAlign:'center'}}>
                <Form
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 14 }}
                  layout="horizontal"
                  initialValues={{ size: 'small' }}
                  
                  size='small'
                >
                  <Form.Item label="Select Target Type">
                    <Select>
                      <Select.Option value="PEAK">PEAK</Select.Option>
                      <Select.Option value="DDT">DDT</Select.Option>
                      <Select.Option value="NET">NET</Select.Option>
                      <Select.Option value="DDT/NET">DDT/NET</Select.Option>
                      <Select.Option value="Group">Group</Select.Option>
                      <Select.Option value="Behavior Reduction">Behavior Reduction</Select.Option>
                      <Select.Option value="Precision">Precision</Select.Option>
                    </Select>
                  </Form.Item>
                </Form>
                
                <h5>Customize Target Type Recording Parameters</h5>
                <br />
                
                <Transfer
                  titles={['Available', 'Selected']}
                  dataSource={mockData}
                  showSearch
                  listStyle={{
                    width: 254,
                    height: 300,
                  }}
                  operations={['Add', 'Remove']}
                  filterOption={this.filterOption}
                  targetKeys={targetKeys}
                  onChange={this.handleChange}
                  onSearch={this.handleSearch}
                  render={item => item.title}
                />
                
              </div>
            </div>
          </div>
        </div>
      </Authorize>
    )
  }
}

export default TargetTypeMapping
