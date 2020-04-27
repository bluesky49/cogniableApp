/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import { Layout, Row, Col, Typography, Badge, Icon, Button, Card, Progress } from 'antd'
import Sidebar1 from 'components/sections/Sidebar1'
import { CrownFilled } from '@ant-design/icons'
import cardImg1 from '../../images/cardImg1.jpg'
import bgImg1 from '../../images/bgImg1.jpg'

const { Header, Sider, Content } = Layout
const { Title, Text, Paragraph } = Typography
const { Meta } = Card

class ParentDashboard extends Component {
  render() {
    return (
      <Layout style={{ backgroundColor: '#F2F4F8' }}>
        <Layout>
          <Sider
            width={300}
            style={{
              background: 'transparent',
              boxShadow: 'none',
              borderRight: '1px solid #8080803b',
            }}
          >
            <Sidebar1
              header="Data Recording"
              data={[
                'Meal Data',
                'Medical Data',
                'Mand Data',
                'Toilet Data',
                'ABC Data',
                'Behaviour Decel',
              ]}
            />
          </Sider>
          <Content style={{ padding: '30px 20px' }}>
            <Typography>
              <Title
                ellipsis
                level={3}
                type="secondary"
                style={{ fontWeight: '100', textTransform: 'uppercase' }}
              >
                Welcome Kunal
              </Title>
            </Typography>
            <Row gutter={[8, 8]}>
              <Col style={{ backgroundColor: 'transparent' }} xs={24} lg={17}>
                <div style={{ backgroundColor: '#fff', padding: '8px 14px', height: '200px' }}>
                  <Text strong>Summary Of This Week</Text>
                  <Row gutter={[16, 16]}>
                    <Col xs={24} lg={8}>
                      <Card>
                        <div
                          style={{
                            boxShadow: '0 0 0px rgba(0,0,0,0.4)',
                            margin: '10px 0',
                            display: 'flex',
                          }}
                        >
                          <CrownFilled style={{ fontSize: '60px', color: 'yellow' }} />
                          <div>
                            <Title
                              level={4}
                              style={{
                                margin: '0 10px',
                                lineHeight: 'normal',
                                fontSize: '15px',
                                fontWeight: 'normal',
                              }}
                            >
                              Total Targets
                            </Title>
                            <Title
                              level={3}
                              style={{ margin: '0 10px', lineHeight: 'normal', fontWeight: 'bold' }}
                            >
                              100
                            </Title>
                            <Text style={{ fontSize: '10px', margin: '0 10px' }}>Reached</Text>
                          </div>
                        </div>
                      </Card>
                    </Col>
                    {/* end of Column for Total Targets */}

                    {/* Column for Targets */}
                    <Col xs={24} lg={8}>
                      <Card>
                        <div
                          style={{
                            boxShadow: '0 0 0px rgba(0,0,0,0.4',
                            margin: '10px 0',
                            display: 'flex',
                          }}
                        >
                          <CrownFilled style={{ fontSize: '60px', color: 'yellow' }} />
                          <div>
                            <Title
                              level={4}
                              style={{
                                margin: '0 10px',
                                lineHeight: 'normal',
                                fontSize: '15px',
                                fontWeight: 'normal',
                              }}
                            >
                              Targets
                            </Title>
                            <Title
                              level={3}
                              style={{ margin: '0 10px', lineHeight: 'normal', fontWeight: 'bold' }}
                            >
                              10
                            </Title>
                            <Text style={{ fontSize: '10px', margin: '0 10px' }}>Reached</Text>
                          </div>
                        </div>
                      </Card>
                    </Col>
                    {/* end of Column for Total Targets */}

                    {/* Column for Total Targets */}
                    <Col xs={24} lg={8}>
                      <Card>
                        <div
                          style={{
                            boxShadow: '0 0 0px rgba(0,0,0,0.4',
                            margin: '10px 0',
                            display: 'flex',
                          }}
                        >
                          <CrownFilled style={{ fontSize: '60px', color: 'yellow' }} />
                          <div>
                            <Title
                              level={4}
                              style={{
                                margin: '0 10px',
                                lineHeight: 'normal',
                                fontSize: '15px',
                                fontWeight: 'normal',
                              }}
                            >
                              Targets
                            </Title>
                            <Title
                              level={3}
                              style={{ margin: '0 10px', lineHeight: 'normal', fontWeight: 'bold' }}
                            >
                              10
                            </Title>
                            <Text style={{ fontSize: '10px', margin: '0 10px' }}>Reached</Text>
                          </div>
                        </div>
                      </Card>
                    </Col>
                  </Row>
                </div>
              </Col>
              {/* end of Column for Total Targets */}
              {/* End Of Target Section */}
              {/* Details Section */}
              <Col style={{ backgroundColor: 'transparent' }} xs={24} lg={7}>
                <Card>
                  <div style={{ backgroundColor: '#fff', padding: '8px 14px', height: '150px' }}>
                    <Text style={{ fontSize: '14px', display: 'block', fontWeight: '600' }}>
                      Consultation Appointment
                    </Text>
                    <Text
                      type="secondary"
                      style={{ fontWeight: '300', fontSize: '10px', display: 'block' }}
                    >
                      dr. Ridhi Kapur
                    </Text>
                    <Text
                      type="secondary"
                      style={{ fontWeight: '300', fontSize: '10px', display: 'block' }}
                    >
                      Aihealth, Karnataka
                    </Text>
                    <Text
                      type="secondary"
                      style={{
                        fontWeight: '300',
                        fontSize: '10px',
                        display: 'block',
                        marginBottom: '12px',
                      }}
                    >
                      13th April 2020,9 A.M.-12 A.M.
                    </Text>
                    <Badge color="blue" text="10:00 A.M." />
                    <Badge color="blue" text="12:00 A.M." style={{ display: 'block' }} />
                    <Button type="primary" style={{ marginTop: '10px' }}>
                      Load All
                      <Icon type="arrow-right" />
                    </Button>
                  </div>
                </Card>
              </Col>
              {/* End of Details Section */}
            </Row>
            <br />
            <br />
            {/* Second Row */}
            <hr />
            <Row>
              <Text
                style={{
                  fontSize: '18px',
                  color: '#8c8c8c',
                  fontWeight: '700',
                  marginTop: '20px',
                  display: 'block',
                }}
              >
                Morning Sessions
              </Text>
              <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>
                35-40 Min- Targets-Mother
              </Text>
              <Col xs={24} lg={8}>
                {/* Card1 */}
                <Card
                  hoverable
                  style={{ margin: '10px 10px 10px 0' }}
                  cover={<img alt="example" src={cardImg1} style={{ height: '200px' }} />}
                >
                  <Text type="danger" style={{ margin: '0', fontSize: '8px', float: 'left' }}>
                    Receptive Language
                  </Text>
                  <Text type="danger" style={{ margin: '0', fontSize: '8px', float: 'right' }}>
                    <Icon type="history" style={{ margin: 'right' }} />
                    3:25
                  </Text>
                  <Title
                    level={4}
                    style={{ marginBottom: '0', fontWeight: '200', marginRight: '50px' }}
                  >
                    Kunal names the music category by Listening
                  </Title>
                  <Text type="secondary" style={{ fontSize: '10px' }}>
                    5 times per day
                  </Text>
                  <Progress percent={30} showInfo={false} style={{ margin: '16px 10px 14px 0' }} />
                </Card>
                {/* End of Card1 */}
              </Col>
              <Col xs={24} lg={8}>
                {/* Card2 */}
                <Card
                  hoverable
                  style={{ margin: '10px 10px 10px 0' }}
                  cover={<img alt="example" src={cardImg1} style={{ height: '200px' }} />}
                >
                  <Text type="danger" style={{ margin: '0', fontSize: '8px', float: 'left' }}>
                    Receptive Language
                  </Text>
                  <Text type="danger" style={{ margin: '0', fontSize: '8px', float: 'right' }}>
                    <Icon type="history" style={{ margin: 'right' }} />
                    3:25
                  </Text>
                  <Title
                    level={4}
                    style={{ marginBottom: '0', fontWeight: '200', marginRight: '50px' }}
                  >
                    Kunal names the music category by Listening
                  </Title>
                  <Text type="secondary" style={{ fontSize: '10px' }}>
                    5 times per day
                  </Text>
                  <Progress percent={30} showInfo={false} style={{ margin: '16px 10px 14px 0' }} />
                </Card>
                {/* End of Card2 */}
              </Col>
              <Col xs={24} lg={8}>
                {/* Card3 */}
                <Card
                  hoverable
                  style={{ margin: '10px 0 10px 0' }}
                  cover={<img alt="example" src={cardImg1} style={{ height: '200px' }} />}
                >
                  <Text type="danger" style={{ margin: '0', fontSize: '8px', float: 'left' }}>
                    Receptive Language
                  </Text>
                  <Text type="danger" style={{ margin: '0', fontSize: '8px', float: 'right' }}>
                    <Icon type="history" style={{ margin: 'right' }} />
                    3:25
                  </Text>
                  <Title
                    level={4}
                    style={{ marginBottom: '0', fontWeight: '200', marginRight: '50px' }}
                  >
                    Kunal names the music category by Listening
                  </Title>
                  <Text type="secondary" style={{ fontSize: '10px' }}>
                    5 times per day
                  </Text>
                  <Progress percent={30} showInfo={false} style={{ margin: '16px 10px 14px 0' }} />
                </Card>
                {/* End of Card 3 */}
              </Col>

              {/* Column For Button */}
              <Col xs={24} lg={{ span: 8, offset: 16 }}>
                <Button type="primary" block style={{ margin: '10px 10px 10px 0' }}>
                  START SESSION
                  <Icon type="arrow-right" />
                </Button>
              </Col>
            </Row>
            {/* End of Second Row */}

            {/* Third Row */}
            <Row>
              <Col xs={24} lg={8}>
                <div
                  style={{
                    margin: '10px 10px 10px 0',
                    backgroundImage: `url(${bgImg1})`,
                    backgroundSize: 'cover',
                    height: '200px',
                  }}
                >
                  <Row
                    type="flex"
                    justify="center"
                    style={{ flexDirection: 'column', color: '#fff', height: '100%' }}
                  >
                    <Col span={24} style={{ paddingLeft: '10px' }}>
                      <Text style={{ fontSize: '18px', color: '#fff' }}>
                        Acceptance & Commitance
                      </Text>
                    </Col>
                    <Col span={24} style={{ paddingLeft: '10px' }}>
                      -
                    </Col>
                    <Col span={24} style={{ paddingLeft: '10px' }}>
                      <Paragraph style={{ fontSize: '14px', color: '#fff' }}>
                        Lorem ipsum dolor sit amet consectetur.
                      </Paragraph>
                    </Col>
                  </Row>
                </div>
              </Col>
              <Col xs={24} lg={8}>
                <div
                  style={{
                    margin: '10px 10px 10px 0',
                    backgroundImage: `url(${bgImg1})`,
                    backgroundSize: 'cover',
                    height: '200px',
                  }}
                >
                  <Row
                    type="flex"
                    justify="center"
                    style={{ flexDirection: 'column', color: '#fff', height: '100%' }}
                  >
                    <Col span={24} style={{ paddingLeft: '10px' }}>
                      <Text style={{ fontSize: '18px', color: '#fff' }}>
                        Acceptance & Commitance
                      </Text>
                    </Col>
                    <Col span={24} style={{ paddingLeft: '10px' }}>
                      -
                    </Col>
                    <Col span={24} style={{ paddingLeft: '10px' }}>
                      <Paragraph style={{ fontSize: '14px', color: '#fff' }}>
                        Lorem ipsum dolor sit amet consectetur.
                      </Paragraph>
                    </Col>
                  </Row>
                </div>
              </Col>
              <Col xs={24} lg={8}>
                <div
                  style={{
                    margin: '10px 10px 10px 0',
                    backgroundImage: `url(${bgImg1})`,
                    backgroundSize: 'cover',
                    height: '200px',
                  }}
                >
                  <Row
                    type="flex"
                    justify="center"
                    style={{ flexDirection: 'column', color: '#fff', height: '100%' }}
                  >
                    <Col span={24} style={{ paddingLeft: '10px' }}>
                      <Text style={{ fontSize: '18px', color: '#fff' }}>
                        Acceptance & Commitance
                      </Text>
                    </Col>
                    <Col span={24} style={{ paddingLeft: '10px' }}>
                      -
                    </Col>
                    <Col span={24} style={{ paddingLeft: '10px' }}>
                      <Paragraph style={{ fontSize: '14px', color: '#fff' }}>
                        Lorem ipsum dolor sit amet consectetur.
                      </Paragraph>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
            {/* End of Third Row */}
          </Content>
        </Layout>
      </Layout>
    )
  }
}

export default ParentDashboard
