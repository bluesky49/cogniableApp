/* eslint-disable no-unused-vars */
import React, { Fragment } from 'react'
import { Row, Col, Card, Button, Input, Form, Select, Icon, Typography, Avatar } from 'antd'
import { connect } from 'react-redux'
import fatherAndSon from '../../images/fatherAndSon.jpg'
import dawn from '../../icons/dawn.png'
import afternoonsun from '../../icons/afternoon.svg'
import moon from '../../icons/moon.png'

@connect(({ user, family }) => ({ user, family }))
class FamilyBasicForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoaded: true,
      relationId: '',
      relationName: '',
      memberId: '',
      memberName: '',
      morning: 0,
      afternoon: 0,
      evening: 0,
      newMember: false,
      siblingsCount: 0,
      grandParentsCount: 0,
    }
  }

  componentDidMount() {
    this.setState({
      isLoaded: false,
    })
  }

  componentDidUpdate(prevProps) {
    const { processData, family, form } = this.props
    if (
      prevProps.processData.relationId !== processData.relationId &&
      prevProps.processData.relationName !== processData.relationName
    ) {
      let obj = {}
      if (!processData.newMember) {
        const i = family.familyMembers.findIndex(
          val => val.node.relationship.name === processData.relationName,
        )
        if (i > -1) {
          let [m, a, e] = [0, 0, 0]
          const timeData = family.familyMembers[i].node.timeSpent.edges.map(val => {
            if (val.node.sessionName.name === 'Morning') {
              m = parseInt(val.node.duration.slice(0, 1), 10)
            } else if (val.node.sessionName.name === 'Afternoon') {
              a = parseInt(val.node.duration.slice(0, 1), 10)
            } else {
              e = parseInt(val.node.duration.slice(0, 1), 10)
            }
            return null
          })
          const siblingsCount = family.familyMembers.reverse().filter(val => {
            return val.node.relationship.name === 'Sibling'
          }).length
          const grandParentsCount = family.familyMembers
            .reverse()
            .filter(val => val.node.relationship.name === 'Grand Parents').length
          obj = {
            relationId: processData.relationId,
            relationName: processData.relationName,
            memberId: family.familyMembers[i].node.id,
            memberName: family.familyMembers[i].node.memberName,
            morning: m,
            afternoon: a,
            evening: e,
            newMember: false,
            currentIndex: 0,
            siblingsCount,
            grandParentsCount,
          }
        } else {
          const siblingsCount = family.familyMembers
            .reverse()
            .filter(val => val.node.relationship.name === 'Sibling').length
          const grandParentsCount = family.familyMembers
            .reverse()
            .filter(val => val.node.relationship.name === 'Grand Parents').length
          obj = {
            relationId: processData.relationId,
            relationName: processData.relationName,
            memberId: '',
            memberName: '',
            morning: 0,
            afternoon: 0,
            evening: 0,
            newMember: false,
            currentIndex: 0,
            siblingsCount,
            grandParentsCount,
          }
        }
      } else {
        const siblingsCount = family.familyMembers
          .reverse()
          .filter(val => val.node.relationship.name === 'Sibling').length
        const grandParentsCount = family.familyMembers
          .reverse()
          .filter(val => val.node.relationship.name === 'Grand Parents').length
        obj = {
          relationId: '',
          relationName: '',
          memberId: '',
          memberName: '',
          morning: 0,
          afternoon: 0,
          evening: 0,
          newMember: false,
          currentIndex: 0,
          siblingsCount,
          grandParentsCount,
        }
      }
      form.setFieldsValue({ name: obj.memberName })
      this.updateState(obj)
    }
  }

  handleTime = (i, val) => {
    const { morning, afternoon, evening } = this.state
    // eslint-disable-next-line no-nested-ternary
    const key = i === 'm' ? 'morning' : i === 'a' ? 'afternoon' : 'evening'
    this.setState(state => {
      if (state[key] >= 0) {
        if (state[key] === 0 && val < 0) {
          return state
        }
        return { [key]: state[key] + val }
      }
      return state
    })
  }

  handleNextMember = index => {
    const { relationName, siblingsCount } = this.state
    const { family, form } = this.props
    const indexLength = family.familyMembers
      .reverse()
      .filter(val => relationName === val.node.relationship.name).length
    if (index === indexLength) {
      index = 0
    }
    const memberDataUpdate = family.familyMembers
      .reverse()
      .filter(val => relationName === val.node.relationship.name)[index]
    let [m, a, e] = [0, 0, 0]

    if (memberDataUpdate) {
      const timeData = memberDataUpdate.node.timeSpent.edges.map(val => {
        if (val.node.sessionName.name === 'Morning') {
          m = parseInt(val.node.duration.slice(0, 1), 10)
        } else if (val.node.sessionName.name === 'Afternoon') {
          a = parseInt(val.node.duration.slice(0, 1), 10)
        } else {
          e = parseInt(val.node.duration.slice(0, 1), 10)
        }
        return null
      })
      form.setFieldsValue({ name: memberDataUpdate.node.memberName })
      const obj = {
        memberId: memberDataUpdate.node.id,
        memberName: memberDataUpdate.node.memberName,
        morning: m,
        afternoon: a,
        evening: e,
        newMember: false,
        currentIndex: index,
      }
      this.updateState(obj)
    }
  }

  handleMemberSubmit = e => {
    e.preventDefault()

    const { memberId, morning, evening, afternoon, relationId } = this.state
    const { dispatch, user, form } = this.props
    console.log(form.getFieldValue('name'))
    if (memberId) {
      dispatch({
        type: 'family/EDIT_MEMBER',
        payload: {
          memberId,
          memberName: form.getFieldValue('name'),
          relationId,
          morning,
          evening,
          afternoon,
        },
      })
    } else {
      dispatch({
        type: 'family/CREATE_NEW',
        payload: {
          studentId: user.studentId,
          memberName: form.getFieldValue('name'),
          relationId,
          morning,
          evening,
          afternoon,
        },
      })
    }
  }

  handleSelect = id => {
    this.setState(state => ({
      ...state,
      relationId: id,
    }))
  }

  updateTimer = (m, a, e) => {
    this.setState(state => ({
      ...state,
      morning: m,
      afternoon: a,
      evening: e,
    }))
  }

  handleChange = e => {
    const { form } = this.props
    const { value } = e.target
    this.setState(state => ({
      ...state,
      memberData: {
        ...state.memberData,
        memberName: value,
      },
    }))
    form.setFieldsValue({ name: value })
  }

  updateState = obj => {
    this.setState(state => ({
      ...state,
      ...obj,
    }))
  }

  render() {
    const { processData, family, form } = this.props
    const { isLoaded, morning, evening, afternoon, relationName, currentIndex } = this.state
    const { Text, Paragraph } = Typography
    if (isLoaded) {
      return <div>Loding...</div>
    }
    return (
      <Form onSubmit={e => this.handleMemberSubmit(e)}>
        <Card>
          <Row
            type="flex"
            style={{
              backgroundColor: '#fff',
              height: '200px',
              boxShadow: '0 0px 0px rgba(0,0,0,0.1)',
            }}
          >
            <Col sm={6}>
              <img src={fatherAndSon} alt="" style={{ width: '100%', height: '100%' }} />
            </Col>
            <Col sm={16}>
              <Row
                type="flex"
                justify="center"
                align="middle"
                style={{ padding: '0 10px', flexDirection: 'column', height: '100%' }}
              >
                <Form.Item
                  label=""
                  style={{
                    width: '100%',
                    boxShadow: '0 1px 5px rgba(0,0,0,0.1)',
                    borderRadius: '4px',
                  }}
                >
                  {form.getFieldDecorator('name', {
                    rules: [{ required: true, message: 'Please Select Name!' }],
                  })(
                    <Input
                      name="Name"
                      placeholder="Name"
                      onChange={this.handleChange}
                      style={{ width: '100%', height: '40px' }}
                    />,
                  )}
                </Form.Item>
                <Form.Item
                  label=""
                  style={{
                    width: '100%',
                    boxShadow: '0 1px 5px rgba(0,0,0,0.1)',
                    borderRadius: '4px',
                  }}
                >
                  {form.getFieldDecorator('relation', {
                    rules: [{ required: true, message: 'Please Select Name!' }],
                  })(
                    <Fragment>
                      {processData.newMember ? (
                        <Select
                          placeholder="Select relation with student"
                          onChange={e => this.handleSelect(e)}
                        >
                          <Select.Option value={family && family.relations[2].id}>
                            {family && family.relations[2].name}
                          </Select.Option>
                          <Select.Option value={family && family.relations[3].id}>
                            {family && family.relations[3].name}
                          </Select.Option>
                          <Select.Option value={family && family.relations[4].id}>
                            {family && family.relations[4].name}
                          </Select.Option>
                        </Select>
                      ) : (
                        <Input
                          name="Relation"
                          placeholder="Relationship"
                          value={relationName}
                          style={{ width: '100%', height: '40px' }}
                        />
                      )}
                    </Fragment>,
                  )}
                </Form.Item>
                {relationName === 'Sibling' || relationName === 'Grand Parents' ? (
                  <Button
                    onClick={() => {
                      this.handleNextMember(currentIndex + 1)
                    }}
                  >
                    Next
                  </Button>
                ) : null}
              </Row>
            </Col>
          </Row>
        </Card>
        <Row
          style={{
            margin: '20px 0',
            padding: '14px 10px',
            boxShadow: '0 0px 0px rgba(0,0,0,0.1)',
            backgroundColor: '#fff',
          }}
        >
          <Col>
            <Text style={{ fontSize: '14px', fontWeight: '600' }}>Time spent with kunal</Text>
            <Paragraph type="secondary" style={{ fontSize: '10px' }}>
              How much time do you spent with kunal
            </Paragraph>
          </Col>
          <Col
            style={{
              margin: '5px 0',
              padding: '14px',
              borderRadius: '4px',
              backgroundColor: '#F2F4F8',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Text style={{ fontSize: '16px' }}>
              <Avatar shape="square" src={dawn} style={{ opacity: '0.5' }} />
              &nbsp;Morning
            </Text>
            <div>
              <Icon
                type="minus"
                style={{ color: 'blue' }}
                onClick={() => this.handleTime('m', -1)}
              />
              <Text style={{ fontSize: '16px' }}>&nbsp;&nbsp;{morning}hr&nbsp;&nbsp;</Text>
              <Icon type="plus" style={{ color: 'blue' }} onClick={() => this.handleTime('m', 1)} />
            </div>
          </Col>
          <Col
            style={{
              margin: '5px 0',
              padding: '14px',
              borderRadius: '4px',
              backgroundColor: '#F2F4F8',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Text style={{ fontSize: '16px' }}>
              <Avatar shape="square" src={afternoonsun} style={{ opacity: '0.5' }} />
              &nbsp;Afternoon
            </Text>
            <div>
              <Icon
                type="minus"
                style={{ color: 'blue' }}
                onClick={() => this.handleTime('a', -1)}
              />
              <Text style={{ fontSize: '16px' }}>&nbsp;&nbsp;{afternoon}hr&nbsp;&nbsp;</Text>
              <Icon type="plus" style={{ color: 'blue' }} onClick={() => this.handleTime('a', 1)} />
            </div>
          </Col>
          <Col
            style={{
              margin: '5px 0',
              padding: '14px',
              borderRadius: '4px',
              backgroundColor: '#F2F4F8',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Text style={{ fontSize: '16px' }}>
              <Avatar shape="square" src={moon} style={{ opacity: '0.5' }} />
              &nbsp; Evening
            </Text>
            <div>
              <Icon
                type="minus"
                style={{ color: 'blue' }}
                onClick={() => this.handleTime('e', -1)}
              />
              <Text style={{ fontSize: '16px' }}>&nbsp;&nbsp;{evening}hr&nbsp;&nbsp;</Text>
              <Icon type="plus" style={{ color: 'blue' }} onClick={() => this.handleTime('e', 1)} />
            </div>
          </Col>
        </Row>
        <Button
          type="primary"
          htmlType="submit"
          style={{ float: 'right', padding: '10px 20px', height: 'auto' }}
        >
          <Icon type="save" />
          <Text style={{ color: 'lightblue', fontSize: '10px' }}>SAVE DETAILS</Text>
        </Button>
      </Form>
    )
  }
}
const FamilyForm = Form.create()(FamilyBasicForm)
export default FamilyForm
