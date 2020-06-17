import React from 'react';
import { Row, Col, Card , Input, Form, Select, Calendar, Collapse, Spin, Table } from 'antd'
import {Helmet} from 'react-helmet';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { gql } from 'apollo-boost'
var groupBy = require('json-groupby')
import * as WebDataRocks from "webdatarocks";
import "webdatarocks/webdatarocks.min.css";
const { Panel } = Collapse;
const { Search } = Input;
import client from '../../../apollo/config'
import reqwest from 'reqwest';

const layout = {
    labelCol: {
      span: 6,
    },
  };

  const columns = [
  {
    title: 'Name',
    dataIndex: 'node.targetAllcatedDetails.targetName',
    sorter: true,
    width: '20%',
  },
  {
    title: 'Target Status',
    dataIndex: 'node.targetStatus.statusName',
    width: '20%',
  }
];


const getRandomuserParams = params => {
  return {
    results: params.pagination.pageSize,
    page: params.pagination.current,
    ...params,
  };
};

class Orders extends React.Component {

  state = {
    data: [],
    gq_pagination: {},
    pagination: {
      total:null,
      pageSize: 5,
    },
    loading: false,
  };

    componentDidMount() {
      const { pagination, pageAfter } = this.state;

      this.fetch(pagination, pageAfter);
    }

    handleTableChange = (pag, filters, sorter) => {
      console.log(pag)
      const { pagination, pageAfter } = this.state;
      this.fetch(pagination, pageAfter);
    };

    fetch = (params, pageAfter) => {
      this.setState({ loading: true });

      client
          .query({
            query: gql`{
                  targetAllocates(first: ${params.pageSize}, studentId:"U3R1ZGVudFR5cGU6MTYz", after: "${pageAfter}")
                      {
                         totalCount
                          pageInfo {
                              startCursor
                              endCursor
                              hasNextPage
                              hasPreviousPage
                              }
                          edges {
                      node {
                              id
                              time
                              targetStatus
                              {
                                  id
                                  statusName
                              }
                          targetAllcatedDetails
                          {
                              targetName
                          }
                          targetStatusDateSet
                          {
                              edges {
                                  node {
                                      time
                                      targetStatusId
                                      {
                                      id
                                      statusName
                                      }
                                  }
                              }
                          }
                          }
                          }
                      }
              }
              `,
          })
          .then(result => {
            var result_data = result.data.targetAllocates;
            const { pagination } = this.state;

            this.setState({
              loading: false,
              data: result_data.edges,
              pageAfter:result_data.pageInfo.endCursor,
              pagination: {
                total:result_data.totalCount,
                pageSize: pagination.pageSize,
              },
            });
          })
    };

  render() {
    const { data, pagination, loading } = this.state;
    return (
      <div>
        <Row gutter={24}>

        <Col span={24}>
          <Helmet title="Orders" />
          <div className="card">
            <div className="card-header">
              <div className="utils__title">
                <strong>Orders</strong>
              </div>
            </div>
              <div className="card-body">
                <Table
                  columns={columns}
                  rowKey={record => record.node.id}
                  dataSource={data}
                  pagination={pagination}
                  loading={loading}
                  onChange={this.handleTableChange}
                />
              </div>
          </div>
        </Col>
      </Row>
    </div>
    );
  }
}

export default Orders;
