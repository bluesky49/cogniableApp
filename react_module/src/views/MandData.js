import React from 'react'
import { Helmet } from 'react-helmet'
import Authorize from 'components/LayoutComponents/Authorize'
import { Row, Col, Card, Calendar, Button, InputNumber } from 'antd'
import { ArrowRightOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons'
import Iframe from 'react-iframe'
import { Bar } from 'react-chartjs-2'
import { gql } from 'apollo-boost'
import client from '../apollo/config'

function onPanelChange(value, mode) {
  console.log(value, mode)
}

class ToiletData extends React.Component {
  state = {
    data: [],
  }

  componentDidMount() {
    client
      .query({
        query: gql`
          query {
            getClickData(student: "U3R1ZGVudFR5cGU6MTYz") {
              edges {
                node {
                  id
                  measurments
                }
              }
            }
          }
        `,
      })
      .then(result => {
        console.log(result)
        this.setState({
          data: result.data.getClickData.edges,
        })
      })
  }

  render() {
    const { data } = this.state
    console.log(data)
    const attendanceBarData = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'My First dataset',
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1,
          data: [65, 59, 80, 81, 56, 55, 40],
        },
      ],
    }
    const attendanceBarOptions = {
      scales: {
        xAxes: [{ stacked: true }],
        yAxes: [{ stacked: true }],
      },
    }

    return (
      <Authorize roles={['school_admin', 'parents']} redirect to="/dashboard/beta">
        <Helmet title="Dashboard Alpha" />
        <Row gutter={24}>
          <Col span={6}>
            <Card>
              <div className="site-calendar-demo-card">
                <Calendar fullscreen={false} onPanelChange={onPanelChange} />
              </div>
            </Card>
          </Col>
          <Col span={18}>
            <Card>
              <Row>
                <Col span={4}>
                  <div
                    className="embed-responsive embed-responsive-16by9"
                    style={{ borderRadius: '8px', width: '100%' }}
                  >
                    <Iframe url="https://www.youtube.com/embed/3w1c4sF4ZTg" />
                  </div>
                </Col>
                <Col span={20}>
                  <div style={{ marginLeft: '30px' }}>
                    <h5> Kunal names the presented complex action appopriately</h5>
                    <h6> 6 min </h6>
                    <Button type="link" style={{ padding: 0 }}>
                      {' '}
                      Read Instructions <ArrowRightOutlined />
                    </Button>
                  </div>
                </Col>
              </Row>
            </Card>

            <Card style={{ marginTop: '20px' }}>
              <div style={{ left: '100px', width: '80%' }}>
                <ul style={{ listStyleType: 'none' }}>
                  {data.map(row => (
                    <li style={{ marginTop: 10 }}>
                      <span style={{ width: '430px', fontSize: '20px' }}>
                        {row.node.measurments}
                      </span>
                      <span style={{ fontSize: '20px', float: 'right' }}>
                        <Button>
                          {' '}
                          <PlusOutlined />{' '}
                        </Button>{' '}
                        &nbsp;
                        <InputNumber defaultValue={0} /> &nbsp;
                        <Button>
                          {' '}
                          <MinusOutlined />{' '}
                        </Button>
                        &nbsp;
                      </span>
                      <hr style={{ marginBottom: 0 }} />
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
            <Card style={{ marginTop: '20px' }}>
              <Bar
                data={attendanceBarData}
                options={attendanceBarOptions}
                width={400}
                height={100}
              />
            </Card>
          </Col>
        </Row>
      </Authorize>
    )
  }
}

export default ToiletData
