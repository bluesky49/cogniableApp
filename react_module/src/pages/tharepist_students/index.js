import React, { Component } from 'react'
import { Menu, Dropdown, Button, message, Tooltip, Progress, Drawer, Switch, Modal } from 'antd'
import { DownOutlined, ArrowRightOutlined } from '@ant-design/icons'
import { gql } from 'apollo-boost'
import apolloClient from '../../apollo/config'
import styles from './style.module.scss'
import student from '../../images/student.jpg'
import StudentDrawer from './StudentDrawer'

const menu = (
  <Menu>
    <Menu.Item key="1">1st menu item</Menu.Item>
    <Menu.Item key="2">2nd menu item</Menu.Item>
    <Menu.Item key="3">3rd item</Menu.Item>
  </Menu>
)

class TharepistStudents extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isClicked: false,
      isDrawer: false,
      students: [],
      selectedNode: {},
      visible: true,
      programArea: [],
      programAreaStatus: [],
      show: false,
      selectedArea: '',
      // popvisible: false,
    }
    this.closeDrawer = this.closeDrawer.bind(this)
  }

  componentDidMount() {
    apolloClient
      .query({
        query: gql`
          query {
            students(authStaff_Id: "U3RhZmZUeXBlOjIxOQ==") {
              edges {
                node {
                  id
                  firstname
                  internalNo
                  parent {
                    id
                    username
                  }
                  school {
                    id
                  }
                }
              }
            }
          }
        `,
      })
      .then(qresult => {
        apolloClient
          .query({
            query: gql`
              query {
                programArea(school: "U2Nob29sVHlwZTo4") {
                  edges {
                    node {
                      id
                      name
                    }
                  }
                }
              }
            `,
          })
          .then(presult => {
            this.setState({
              students: qresult.data.students.edges,
              programArea: presult.data.programArea.edges,
            })
          })
          .catch(error => {
            console.log(error)
          })
      })
      .catch(error => {
        console.log(error)
      })
  }

  renderStudents = () => {
    const students = []
    for (let i = 0; i < 6; i += 1) {
      students.push(
        <div className={styles.stuImg} key={i}>
          <img src={student} alt="not_found" />
          <p>Elliot Alderson</p>
        </div>,
      )
    }
    return students
  }

  setClickHandler = node => {
    apolloClient
      .query({
        query: gql`
        query{
          student(id:"${node.id}"){programArea{
                  edges{
                      node{
                          id,
                          name
                      }
                  }
              }
          }
      }
            `,
      })
      .then(presult => {
        this.setState({
          programAreaStatus: presult.data.student.programArea.edges,
          isClicked: true,
          isDrawer: false,
          selectedNode: node,
        })
      })
      .catch(error => {
        console.log(error)
      })
  }

  renderSecondCard = () => {
    const cardArray = []
    for (let i = 0; i < 5; i += 1) {
      cardArray.push(
        <div className={styles.detailcardTwoItem} key={i}>
          <div className={styles.cardtwoheader}>
            <p className={styles.dataName}>Meal Data</p>
            <p className={styles.dataDesc}>Breakfast, Lunch & Dinner</p>
          </div>
          <div className={styles.cardTwoicon}>
            <ArrowRightOutlined style={{ color: 'darkblue', fontSize: '25px' }} />
          </div>
        </div>,
      )
    }
    return cardArray
  }

  renderSecondMealCard = () => {
    const cardArray = []
    for (let i = 0; i < 3; i += 1) {
      cardArray.push(
        <div className={styles.mealcardTwoItem} key={i}>
          <div className={styles.mealcardtwoheader}>
            <p className={styles.mealdataName}>Meal Data</p>
          </div>
          <div className={styles.mealcardTwoicon}>
            <ArrowRightOutlined style={{ color: 'darkblue', fontSize: '25px' }} />
          </div>
        </div>,
      )
    }
    return cardArray
  }

  renderStudentCards = () => {
    const stateData = this.state
    const cards = []
    if (stateData.students !== undefined) {
      for (let i = 0; i < stateData.students.length; i += 1) {
        cards.push(
          <>
            <div
              className={styles.studentItem}
              role="presentation"
              tabIndex={`-${i}`}
              onClick={() => {
                this.setClickHandler(stateData.students[i].node)
              }}
            >
              <div className={styles.studentDesc}>
                <div className={styles.studentProfile}>
                  <img src={student} alt="not_found" />
                </div>
                <div className={styles.studentName}>
                  <p className={styles.name}>{stateData.students[i].node.firstname}</p>
                  <div className={styles.category}>
                    <p className={styles.categoryName}>Student</p>
                    <p className={styles.request}>Pending leave request</p>
                  </div>
                </div>
              </div>
            </div>
          </>,
        )
      }
    }
    return cards
  }

  handleToggle = (checked, e, selectedArea) => {
    e.stopPropagation()
    const stateData = this.state
    const finalArrayone = []
    if (stateData.programAreaStatus.length > 0) {
      for (let i = 0; i < stateData.programAreaStatus.length; i += 1) {
        finalArrayone.push(`"${stateData.programAreaStatus[i].node.id}"`)
      }
    }
    if (checked) {
      finalArrayone.push(`"${selectedArea.id}"`)
    }
    apolloClient
      .mutate({
        mutation: gql`
          mutation {
            updateStudent(
              input: {
                studentData: {
                  id: "${stateData.selectedNode.id}"
                  programArea: [${finalArrayone}]
                }
              }
            ) {
              student {
                firstname
                id
              }
            }
          }
        `,
      })
      .then(presult => {
        const obj = {
          node: {
            id: `${selectedArea.id}`,
            name: `${selectedArea.name}`,
          },
        }
        const newNode = stateData.programAreaStatus
        const newProgramList = newNode.push(obj)
        this.setState({
          programAreaStatus: newNode,
          isClicked: true,
          isDrawer: false,
        })
      })
      .catch(error => {
        console.log(error)
      })
  }

  renderSwitch = programName => {
    const stateData = this.state
    if (stateData.programAreaStatus.length > 0 && stateData.programAreaStatus !== undefined) {
      for (let i = 0; i < stateData.programAreaStatus.length; i += 1) {
        if (stateData.programAreaStatus[i].node.name.toUpperCase() === programName.toUpperCase()) {
          return true
        }
      }
      return false
    }
    return false
  }

  handleOk = e => {
    console.log(e)
    this.setState({
      show: false,
    })
  }

  showModal = () => {
    this.setState({
      show: true,
    })
  }

  handleCancel = e => {
    this.setState({
      show: false,
    })
  }

  renderProgramArea = () => {
    const stateData = this.state
    const program = []
    if (stateData.programArea !== undefined) {
      for (let i = 0; i < stateData.programArea.length; i += 1) {
        const checked = this.renderSwitch(stateData.programArea[i].node.name)
        if (checked) {
          program.push(
            <div
              role="presentation"
              className={styles.detailCardItem}
              onClick={() => {
                this.showDrawr(stateData.programArea[i].node.name)
              }}
            >
              <div className={styles.detailcardHeading}>
                <p>{stateData.programArea[i].node.name}</p>
                <div className={styles.toggle}>
                  <Switch
                    defaultChecked={checked}
                    onClick={(checkedUser, event) => {
                      this.handleToggle(checkedUser, event, stateData.programArea[i].node)
                    }}
                  />
                </div>
              </div>
              <div className={styles.detcardDesc}>
                <p>
                  Fine Motor skills is a coordination of small muscles, in Movements -Usually
                  involving the synchronisation of hands and fingers with eyes.
                </p>
              </div>
              <div className={styles.detProgress}>
                <Progress percent={40} showInfo={false} strokeColor="orange" strokeWidth={10} />
              </div>
            </div>,
          )
        } else {
          program.push(
            <div
              role="presentation"
              className={styles.detailCardItem}
              onClick={() => {
                this.showModal()
              }}
            >
              <div className={styles.detailcardHeading}>
                <p>{stateData.programArea[i].node.name}</p>
                <div className={styles.toggle}>
                  <Switch
                    defaultChecked={checked}
                    onClick={(checkedUser, event) => {
                      this.handleToggle(checkedUser, event, stateData.programArea[i].node)
                    }}
                  />
                </div>
              </div>
              <div className={styles.detcardDesc}>
                <p>
                  Fine Motor skills is a coordination of small muscles, in Movements -Usually
                  involving the synchronisation of hands and fingers with eyes.
                </p>
              </div>
              <div className={styles.detProgress}>
                <Progress percent={40} showInfo={false} strokeColor="orange" strokeWidth={10} />
              </div>
            </div>,
          )
        }
      }
    }
    return program
  }

  renderDetail = () => {
    const data = this.state
    if (data.isClicked && !data.isDrawer) {
      return (
        <>
          <div className={styles.detailHeader}>
            <div className={styles.detailImg}>
              <img src={student} alt="not_found" />
            </div>
            <div className={styles.NameAdd}>
              <p className={styles.detName}>{data.selectedNode.firstname}</p>
              <p className={styles.Add}>Newyork, USA</p>
            </div>
            <div className={styles.actionone}>
              <Button size="large" style={{ color: 'black' }}>
                Contact Student
              </Button>
            </div>
            <div className={styles.actiontwo}>
              <Button
                type="primary"
                style={{ backgroundColor: 'darkblue', fontSize: '20px', height: '40%' }}
              >
                Book Apointment
              </Button>
            </div>
          </div>
          <div className={styles.detCardone}>{this.renderProgramArea()}</div>
          <div className={styles.mealCards}>
            <div className={styles.dataRecording}>
              <p>Data Recording</p>
              <div className={styles.detailCardtwo}>{this.renderSecondCard()}</div>
            </div>
            <div className={styles.detailMealCard}>{this.renderSecondMealCard()}</div>
          </div>
        </>
      )
    }
    if (data.isDrawer) {
      const fullWidth = global.window.innerWidth
      return (
        <Drawer
          placement="right"
          closable={false}
          // onClose={this.onClose}
          visible={data.visible}
          width="100%"
        >
          <StudentDrawer
            programs={data.programArea}
            closeDrawer={() => {
              this.closeDrawer()
            }}
            student={data.selectedNode}
            selectedArea={data.selectedArea}
          />
        </Drawer>
      )
    }
    return null
  }

  showDrawer = () => {
    this.setState({
      visible: true,
    })
  }

  closeDrawer = val => {
    this.setState({
      isDrawer: false,
      visible: false,
    })
  }

  showDrawr = selectedPArea => {
    this.setState({
      isDrawer: true,
      visible: true,
      selectedArea: selectedPArea,
    })
  }

  render() {
    const stateData = this.state
    return (
      <>
        <Modal
          title="Program Modal"
          visible={stateData.show}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p>Please activate the Program Area</p>
        </Modal>
        <div className={styles.mainBody}>
          <div className={styles.studentList}>
            <div className={styles.studentType}>
              <p>Recent Students</p>
              <div className={styles.studentImages}>{this.renderStudents()}</div>
            </div>
            <div className={styles.students}>
              <div className={styles.stuHeader}>
                <p>Students</p>
                <div className={styles.drpStudent}>
                  <Dropdown overlay={menu}>
                    <Button
                      style={{
                        fontSize: '15px',
                        fontWeight: 'bold',
                        color: 'black',
                        border: '1px solid #D9D9D9',
                        borderRadius: '5px',
                      }}
                    >
                      Select Students <DownOutlined />
                    </Button>
                  </Dropdown>
                </div>
              </div>
            </div>
            <div className={styles.studentCards}>{this.renderStudentCards()}</div>
            <div className={styles.addStudent}>
              <Button
                type="primary"
                ghost
                style={{ marginTop: '3%', fontSize: '20px', height: '40%', width: '140%' }}
              >
                Add New Student
              </Button>
            </div>
          </div>
          <div className={styles.studentDetail}>{this.renderDetail()}</div>
        </div>
      </>
    )
  }
}
export default TharepistStudents
