/* eslint-disable react/jsx-indent */
import React, { Fragment } from 'react'
import { Helmet } from 'react-helmet'
import { Button, Layout, Menu, Typography, Avatar } from 'antd'
import { ArrowRightOutlined } from '@ant-design/icons'
import Authorize from 'components/LayoutComponents/Authorize'
import { connect } from 'react-redux'
import Father from '../../icons/father.png'
import Mother from '../../icons/mother.jpeg'
import Sibling from '../../icons/siblings.jpeg'
import GrandParents from '../../icons/grandFather.jpeg'
import './family.scss'
import FamilyForm from './FamilyForm'

@connect(({ user, family }) => ({ user, family }))
class FamilyMembers extends React.Component {
  constructor() {
    super()
    this.state = {
      relationId: '',
      relationName: '',
      newMember: false,
    }
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch({
      type: 'family/SESSION_RELATIONS',
    })
    dispatch({
      type: 'family/FAMILY_DETAILS',
    })
  }

  memberClickHandler = (relationIdentifier, member, newMember) => {
    this.setState(state => ({
      ...state,
      relationId: relationIdentifier,
      relationName: member,
      newMember,
    }))
  }

  getIcons = type => {
    switch (type) {
      case 'Father':
        return Father
      case 'Mother':
        return Mother
      case 'Sibling':
        return Sibling
      case 'Grand Parents':
        return GrandParents
      default:
        return null
    }
  }

  render() {
    const buttonStyle = {
      display: 'flex',
      alignItems: 'center',
      boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
      width: '100%',
      margin: '12px 0',
      paddingBottom: '70px',
      paddingTop: '10px',
    }

    const { family } = this.props
    const rightIconStyle = { float: 'right' }
    const { Content, Sider } = Layout
    const { Title, Text } = Typography
    return (
      <Authorize roles={['school_admin', 'parents']} redirect to="/dashboard/beta">
        <Helmet title="Partner" />
        <Layout>
          <Layout style={{ padding: '0' }}>
            <Sider
              width={400}
              style={{
                padding: '15px',
                background: 'transparent',
                boxShadow: 'none',
                borderRight: '1px solid #8080803b',
              }}
            >
              <Menu
                mode="inline"
                defaultSelectedKeys={['1']}
                defaultOpenKeys={['sub1']}
                style={{ height: '100%', borderRight: 0, backgroundColor: '#f2f4f8' }}
              >
                <Title type="secondary" level={3} style={{ fontWeight: '500', fontSize: '22px' }}>
                  FAMILY MEMBERS
                </Title>
                {family.relations.map(relation => (
                  <Fragment>
                    {relation.name !== 'Other Members' ? (
                      <Button
                        style={buttonStyle}
                        className="btnActive"
                        onClick={() => this.memberClickHandler(relation.id, relation.name, false)}
                      >
                        <Avatar
                          shape="square"
                          src={this.getIcons(relation.name)}
                          style={{ margin: '10px', width: '50px', height: '50px', opacity: '0.3' }}
                        />
                        <div style={{ textAlign: 'left' }}>
                          <Text style={{ fontWeight: '300', fontSize: '14px', display: 'block' }}>
                            {relation.name}
                          </Text>
                          <Text type="secondary" style={{ fontSize: '10px' }}>
                            Personal Details & time spen with kunal
                          </Text>
                        </div>
                      </Button>
                    ) : (
                      <Button
                        type="link"
                        style={{ border: '1px solid lightblue', padding: '10px', height: 'auto' }}
                        onClick={() => this.memberClickHandler(relation.id, relation.name, true)}
                      >
                        New Family Member <ArrowRightOutlined style={rightIconStyle} />
                      </Button>
                    )}
                  </Fragment>
                ))}
              </Menu>
            </Sider>
            <Layout>
              <Content style={{ padding: '0 30px' }}>
                <FamilyForm processData={{ ...this.state }} />
              </Content>
            </Layout>
          </Layout>
        </Layout>
      </Authorize>
    )
  }
}

export default FamilyMembers
