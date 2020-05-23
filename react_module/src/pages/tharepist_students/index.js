import React, { PureComponent } from 'react'
import {
  Menu,
  Dropdown,
  Button,
  message,
  Tooltip,
  Progress,
  Drawer,
  Switch,
  Modal,
  Card,
  Icon,
} from 'antd'
import { DownOutlined, ArrowRightOutlined } from '@ant-design/icons'
import { gql } from 'apollo-boost'
import { connect } from 'react-redux'
import apolloClient from '../../apollo/config'
import styles from './style.module.scss'
import studentImg from '../../images/student.jpg'
import StudentDrawer from './StudentDrawer'
import StudentProgramLinks from './studentProgramLinks'
import DataRecording from './DataRecordingTh'

@connect(({ student }) => ({ student }))
class TharepistStudents extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      // isClicked: false,
      isDrawer: false,
      students: [],
      selectedNode: {},
      visible: true,
      programArea: [],
      programAreaStatus: [],
      show: false,
      selectedArea: '',
      isPresent: false,
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
            const storage = localStorage.getItem('studentId')
            if (storage !== null) {
              apolloClient
                .query({
                  query: gql`
                    query {
                      student(id: ${storage}) {
                        programArea {
                          edges {
                            node {
                              id
                              name
                            }
                          }
                        }
                      }
                    }
                  `,
                })
                .then(iniResult => {
                  const result = storage.substring(1, storage.length - 1)
                  // pass result below
                  const refinedArray = this.move(qresult.data.students.edges, result)
                  this.setState({
                    programAreaStatus: iniResult.data.student.programArea.edges,
                    students: refinedArray,
                    programArea: presult.data.programArea.edges,
                    isPresent: true,
                    selectedNode: refinedArray[0].node,
                  })
                })
                .catch(error => {
                  console.log(error)
                })
            } else {
              this.setState({
                students: qresult.data.students.edges,
                programArea: presult.data.programArea.edges,
              })
            }
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
          <img src={studentImg} alt="not_found" />
          <p>Elliot Alderson</p>
        </div>,
      )
    }
    return students
  }

  setClickHandler = node => {
    console.log('===> cliked', node.id)
    // setting student id to local storage for further operations
    localStorage.setItem('studentId', JSON.stringify(node.id))
    // getting student program area
    apolloClient
      .query({
        query: gql`{
        student(id:"${node.id}"){programArea{
          edges{
            node{
              id,
              name
            }
          }
        }
      }
    }`,
      })
      .then(presult => {
        this.setState({
          programAreaStatus: presult.data.student.programArea.edges,
          isDrawer: false,
          selectedNode: node,
          isPresent: false,
        })
      })
      .catch(error => {
        console.log(error)
      })
  }

  move = (data, storageData) => {
    data.forEach(function(item, i) {
      if (item.node.id.toUpperCase() === storageData.toUpperCase()) {
        data.splice(i, 1)
        data.unshift(item)
      }
    })
    return data
  }

  renderStudentCards = () => {
    const stateData = this.state
    const cards = []
    console.log(stateData)
    if (stateData.students !== undefined) {
      for (let i = 0; i < stateData.students.length; i += 1) {
        cards.push(
          <>
            <div
              className={
                stateData.isPresent && i === 0 ? styles.studentItemSelected : styles.studentItem
              }
              role="presentation"
              tabIndex={`-${i}`}
              onClick={() => {
                this.setClickHandler(stateData.students[i].node)
              }}
            >
              <div className={styles.studentDesc}>
                <div className={styles.studentProfile}>
                  <img src={studentImg} alt="not_found" />
                </div>
                <div className={styles.studentName}>
                  <p className={styles.name}>{stateData.students[i].node.firstname}</p>
                  <div className={styles.category}>
                    <p className={styles.categoryName}>Student</p>
                    {/* <p className={styles.request}>Pending leave request</p> */}
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
    } else {
      const index = finalArrayone.indexOf(`"${selectedArea.id}"`)
      if (index > -1) {
        finalArrayone.splice(index, 1)
      }
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
        if (checked) {
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
            // isClicked: true,
            isDrawer: false,
            isPresent: false,
          })
        } else {
          this.setState({
            // isClicked: true,
            isDrawer: false,
            isPresent: false,
          })
        }
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
        console.log('====> checked', checked)
        program.push(
          <div
            role="presentation"
            className={styles.detailCardItem}
            onClick={
              checked
                ? () => {
                    this.showDrawr(stateData.programArea[i].node)
                  }
                : () => {
                    this.showModal()
                  }
            }
          >
            <div className={styles.detailcardHeading}>
              <p>{stateData.programArea[i].node.name}</p>
              <div className={styles.toggle}>
                {checked ? (
                  <Switch
                    checkedChildren={<Icon type="check" />}
                    unCheckedChildren={<Icon type="close" />}
                    defaultChecked
                    onClick={(checkedUser, event) => {
                      this.handleToggle(checkedUser, event, stateData.programArea[i].node)
                    }}
                  />
                ) : (
                  <Switch
                    checkedChildren={<Icon type="check" />}
                    unCheckedChildren={<Icon type="close" />}
                    onClick={(checkedUser, event) => {
                      this.handleToggle(checkedUser, event, stateData.programArea[i].node)
                    }}
                  />
                )}
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
    return program
  }

  renderDetail = () => {
    const data = this.state
    // const storageData = localStorage.getItem('studentId')
    // const refinedArray = this.move(data.students, storageData)

    if (data.isPresent) {
      return (
        <>
          <div className={styles.detailHeader}>
            <div className={styles.detailImg}>
              <img src={studentImg} alt="not_found" />
            </div>
            <div className={styles.NameAdd}>
              <p className={styles.detName}>{data.students[0].node.firstname}</p>
              <p className={styles.Add}>Newyork, USA</p>
            </div>
            <div className={styles.actionone}>
              <Button size="large" style={{ color: 'black' }}>
                Contact Student
              </Button>
            </div>
            <div className={styles.actiontwo}>
              <a href="/#/appointmentData/">
                <Button
                  type="primary"
                  style={{ backgroundColor: 'darkblue', fontSize: '20px', height: '40%' }}
                >
                  Book Apointment
                </Button>
              </a>
            </div>
          </div>
          <div className={styles.detCardone}>{this.renderProgramArea()}</div>
          <div className={styles.mealCards}>
            <div className={styles.dataRecording}>
              <p>Data Recording</p>
              <div className={styles.detailCardtwo}>
                <DataRecording />
              </div>
            </div>
            <div className={styles.detailMealCard}>
              <StudentProgramLinks />
            </div>
          </div>
        </>
      )
    }

    if (!data.isDrawer) {
      return (
        <>
          <div className={styles.detailHeader}>
            <div className={styles.detailImg}>
              <img src={studentImg} alt="not_found" />
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
              <div className={styles.detailCardtwo}>
                <DataRecording />
              </div>
            </div>
            <div className={styles.detailMealCard}>
              <StudentProgramLinks />
            </div>
          </div>
        </>
      )
    }
    if (data.isDrawer) {
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

  // when user select program area card
  showDrawr = node => {
    // console.log('===> selected program area : ', node )
    // setting student selected program area to store
    const { dispatch } = this.props
    dispatch({
      type: 'student/SET_STATE',
      payload: {
        ProgramAreaId: node.id,
      },
    })

    this.setState({
      isDrawer: true,
      visible: true,
      isPresent: false,
      selectedArea: node.name,
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
