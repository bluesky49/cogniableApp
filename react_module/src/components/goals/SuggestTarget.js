/* eslint-disable react/no-unused-state */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-indent */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-indent-props */

import React from 'react'
import { Table, Button, Form, Select, Icon, Input, Tabs, notification, Drawer} from 'antd';
import { gql } from "apollo-boost";
import { connect } from 'react-redux'
import client from '../../apollo/config'
import TargetAllocate from '../CleanUIComponents/Targets'
import ManualTargetForm from './ManuallyTarget'


const FormItem = Form.Item
const { TabPane } = Tabs;

const column1 = [
    {
        title: 'Domain',
        dataIndex: 'node.domain.domain',
    },
    {
        title: 'Target Name',
        dataIndex: 'node.targetMain.targetName',
    },
];
const column2 = [
    {
        title: 'Domain',
        dataIndex: 'node.targetId.domain.domain',
        render: text => <a>{text}</a>,
    },
    {
        title: 'Target Name',
        dataIndex: 'node.targetAllcatedDetails.targetName',
    },
    {
        title: 'Status',
        dataIndex: 'node.targetStatus.statusName',
        render: text => <span style={{ color: "green" }}>{text}</span>
    },
    {
        title: 'Copy',
        dataIndex: 'copy',
        render: text => <a>{text}</a>,
    },
];
 
const rowSelection1 ={
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    } ,
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

@connect(({ goals }) => ({ goals }))
class SuggesTarget extends React.Component {
    constructor(props){
        super(props);

        this.state = {    
            targettype: [],
            mcriteria: [],
            codes: [],
            status: [],
            // LearnerList: [],
            DomainList: [],
            targetArea: [],
            SuggestedTarget: [],
            AllocatedTarget: [],
            programArea: [],

            allocateDrawer: false,
            selectedRowForAllocate: []
            
        }
        this.DomainChange = this.DomainChange.bind(this);
    }

    componentDidMount() {

        client.query({
            query: gql`{
                targetStatus {
                    id,
                    statusName
                }
                types {
                    id,
                    typeTar
                }
                promptCodes {
                    id,
                    promptName 
                }
                masteryCriteria {
                    id,
                    responsePercentage,
                    consecutiveDays,
                    minTrial
                }
                domain {
                    edges {
                        node {
                            domain,
                            id
                        }
                    }
                }
                goalsProgramArea{
                    id,
                    name
                }
            }`
        })
        .then(result => {
            this.setState({
                targettype: result.data.types,
                status: result.data.targetStatus,
                codes: result.data.promptCodes,
                mcriteria: result.data.masteryCriteria,
                // LearnerList: result.data.students.edges,
                DomainList: result.data.domain.edges,
                programArea: result.data.goalsProgramArea
            })
        })
        .catch(error => { 
            error.graphQLErrors.map((item) => { 
                return notification.error({
                    message: 'Somthing want wrong',
                    description: item.message,
                }); 
            })
        });

    }

    handleSubmit = e => {
        e.preventDefault();
        const { form, goals:{ LearnerId} } = this.props;
    
        form.validateFields((error, values) => {
            if (!error) {

                client.query({
                    query: gql`{
                        target(
                            domain:"${values.domain}",
                            targetArea:"${values.target_area}", 
                            targetMain_TargetName_Icontains:"${values.search}"
                        )
                        {
                            edges {
                                node {
                                    id,
                                    domain {
                                        id,
                                        domain
                                    },
                                    targetMain {
                                        id,
                                        targetName
                                    }
                                }
                            }
                        }
                    
                        targetAllocates(
                            studentId:"${LearnerId}", 
                            targetId_Domain:"${values.domain}",
                            targetId_TargetArea:"${values.target_area}", 
                            targetAllcatedDetails_TargetName_Icontains:"${values.search}"
                        ) 
                        {
                            edges {
                                node {
                                    id,
                                    targetStatus {
                                        id,
                                        statusName
                                    },
                                    targetId {
                                        domain {
                                            id,
                                            domain
                                        }
                                    }
                                    targetAllcatedDetails {
                                        id,
                                        targetName
                                    }
                                }
                            }
                        }
                    }`
                })
                .then(result => {
                    this.setState({
                        SuggestedTarget: result.data.target.edges,
                        AllocatedTarget: result.data.targetAllocates.edges,
                    })
                })
                .catch(err => { 
                    err.graphQLErrors.map((item) => { 
                        return notification.error({
                            message: 'Somthing want wrong getting target area',
                            description: item.message,
                        }); 
                    })
                });
            }
        })
    }

    showDrawer = () => {
        this.setState({
            allocateDrawer: true,
        });
    };
    
    onClose = () => {
        this.setState({
            allocateDrawer: false,
        });
    };

    handleChange = (pagination, filters, sorter, selectedRows) => {
        console.log('Various parameters', pagination, filters, sorter, selectedRows);
        // this.setState({
        //     filteredInfo: filters,
        //     sortedInfo: sorter,
    
        // });
    };

    DomainChange(domainid) {

        client.query({
            query: gql`{
                domainGet(id:"${domainid}"){
                    id,
                    targetArea {
                        edges {
                            node {
                                id,
                                Area
                            }
                        }
                    }
                }
            }`
        })
        .then(result => {
            this.setState({
                targetArea: result.data.domainGet.targetArea.edges
            })
        })
        .catch(error => { 
            error.graphQLErrors.map((item) => { 
                return notification.error({
                    message: 'Somthing want wrong getting target area',
                    description: item.message,
                }); 
            })
        });
      
    }

    
    render() {
        const { form, goal, learnerId, goals:{LearnerId, ShortTermObject}} = this.props;
        const { DomainList, targetArea, SuggestedTarget, AllocatedTarget, programArea, allocateDrawer, selectedRowForAllocate, targettype, mcriteria, status, codes} = this.state;

         

    return (
        <>
            <Tabs defaultActiveKey="1">
                <TabPane
                    tab={
                        <span>
                            {/* <HourglassOutlined /> */}
                            <i className="icmn-folder-open" /> Libary
                        </span>
                    }
                    key="1"
                >
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <div className="row">
                            <div className="col-lg-3">
                                <FormItem label="Program Area">
                                    {form.getFieldDecorator('programArea', {
                                        rules: [{ required: true, message: 'Please provide your Program Area!' }],
                                    })(
                                        <Select
                                            id="product-edit-colors"
                                            showSearch
                                            style={{ width: '100%' }}
                                            placeholder="Select a Program Area"
                                            optionFilterProp="children"
                                            
                                        >
                                            {programArea.map(c => <option value={c.id}>{c.name}</option>)}
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
                                        >
                                            {DomainList.map(c => <option value={c.node.id}>{c.node.domain}</option>)}
                                        </Select>
                                    )}
                                </FormItem>
                            </div>
                            <div className="col-lg-3">
                                <FormItem label="Target Area">
                                    {form.getFieldDecorator('target_area', { rules: [{ required: true, message: 'Please provide your Target Area!' }],})
                                    (
                                        <Select
                                            id="product-edit-colors"
                                            showSearch
                                            style={{ width: '100%' }}
                                            placeholder="Select a Target Area"
                                            optionFilterProp="children"
                                        >
                                            {targetArea.map(c => <option value={c.node.id}>{c.node.Area}</option>)}
                                        </Select>
                                    )}
                                </FormItem>
                            </div>
                            <div className="col-lg-3">
                                <FormItem label="Search">
                                    {form.getFieldDecorator('search', { initialValue: "" })(
                                        <Input 
                                            suffix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                            type="text"
                                            placeholder="Keyword Search"
                                        />,
                                    )}
                                </FormItem>
                            </div>
                            <div className="col-lg-12">
                                <div className="form-actions">
                                    <Button type="primary" htmlType="submit" className="mr-2">Suggest Target</Button>
                                </div>
                            </div>
                        </div>
                    </Form>

                    <div className="card">
                        <div className="card-body">
                            <Button
                                style={{ float: "right", marginBottom:"8px"}}
                                // onClick={(e) => this.consoleValue(e)}
                                onClick={this.showDrawer}
                                // onClick={console.log(selectedRowForAllocate)}
                            >
                                Allocate Targets
                            </Button>
                            <h4 style={{ backgroundColor: "inherit" }}>Suggested Targets</h4>
                            <Table
                                columns={column1}
                                dataSource={SuggestedTarget}
                                bordered
                                rowKey={(record) => record.node.id}
                                onChange={this.handleChange}
                                rowSelection={{onChange: (selectedRowKeys, selectedRows) => this.setState({selectedRowForAllocate:selectedRows})}}
                            />
                            <br />
                            <h4>Allready allocated targets</h4>
                            <Table
                                columns={column2}
                                dataSource={AllocatedTarget}
                                bordered
                                rowKey={(record) => record.node.id}
                                onChange={this.handleChange}
                                rowSelection={rowSelection2}
                            />
                        </div>
                    </div>
                </TabPane>
                <TabPane
                    tab={
                        <span>
                            <i className="icmn-folder" /> Manually
                        </span>
                    }
                    key="2"
                >
                    <ManualTargetForm programArea={programArea} DomainList={DomainList} targettype={targettype} mcriteria={mcriteria} codes={codes} status={status} /> 
                </TabPane>
            </Tabs>

            
            
            <Drawer
                title={ShortTermObject.goalName}
                width="40%"
                closable={false}
                onClose={this.onClose}
                visible={this.state.allocateDrawer}
            >
                <TargetAllocate targets={selectedRowForAllocate} DomainList={DomainList} targettype={targettype} mcriteria={mcriteria} codes={codes} status={status} /> 
            </Drawer>

        </>
    )}
}

const SuggesTargetForm = Form.create()(SuggesTarget)
export default SuggesTargetForm
