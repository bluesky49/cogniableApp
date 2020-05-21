import React, { Component } from 'react'
import { Button, Progress, Drawer } from 'antd'
import { HeartOutlined, CloseOutlined } from '@ant-design/icons'
import { gql } from 'apollo-boost'
import apolloClient from '../../apollo/config'
import styles from './style.module.scss'
import student from '../../images/student.jpg'
import childMother from '../../images/childMother.jpg'
import SessionInstruction from './SessionInstructions'

class StudentDrawer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sessions: [],
      visible: false,
      // isSubdrawerOper: false,
      sessionName: '',
      programAreaStatus: [],
    }
    this.onClose = this.onClose.bind(this)
  }

  componentDidMount() {
    const propData = this.props

    apolloClient
      .query({
        query: gql`
      query{
        student(id:"${propData.student.id}"){programArea{
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
        apolloClient
          .query({
            query: gql`
              query {
                GetStudentSession(studentId: "U3R1ZGVudFR5cGU6MjYw") {
                  edges {
                    node {
                      id
                      itemRequired
                      duration
                      sessionName {
                        id
                        name
                      }
                      instruction {
                        edges {
                          node {
                            id
                            instruction
                          }
                        }
                      }
                      sessionHost {
                        edges {
                          node {
                            id
                            memberName
                            timeSpent {
                              edges {
                                node {
                                  id
                                  sessionName {
                                    id
                                    name
                                  }
                                  duration
                                }
                              }
                            }
                            relationship {
                              id
                              name
                            }
                          }
                        }
                      }
                      targets {
                        edges {
                          node {
                            id
                            time
                            targetInstr
                            date
                            targetAllcatedDetails {
                              id
                              targetName
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
          .then(qresult => {
            this.setState({
              sessions: qresult.data.GetStudentSession.edges,
              programAreaStatus: presult.data.student.programArea.edges,
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

  close = () => {
    const propData = this.props
    propData.closeDrawer(true)
  }

  renderProgramArea = () => {
    const stateData = this.state
    const propData = this.props
    const array = []
    if (stateData.programAreaStatus !== undefined) {
      for (let i = 0; i < stateData.programAreaStatus.length; i += 1) {
        array.push(
          <div
            role="presentation"
            className={
              propData.selectedArea.toUpperCase() ===
              stateData.programAreaStatus[i].node.name.toUpperCase()
                ? styles.drawerCardItemSelected
                : styles.drawerCardItem
            }
            key={i}
          >
            <div className={styles.drawercardHeading}>
              <p>{stateData.programAreaStatus[i].node.name}</p>
            </div>
            <div className={styles.drawercardDesc}>
              <p>
                Fine Motor skills is a coordination of small muscles, in Movements -Usually
                involving the synchronisation of hands and fingers with eyes.
              </p>
            </div>
            <div className={styles.drawerProgress}>
              <Progress percent={40} showInfo={false} strokeColor="orange" strokeWidth={10} />
            </div>
          </div>,
        )
      }
    }
    return array
  }

  renderSessionCards = () => {
    const stateData = this.state
    const array = []
    if (stateData.sessions !== undefined) {
      for (let i = 0; i < stateData.sessions.length; i += 1) {
        array.push(
          <div className={styles.sesCards} key={i}>
            <div className={styles.sesImage}>
              <img src={childMother} alt="not_found" />
              <div className={styles.imageDesc}>
                <div className={styles.seslike}>
                  <div className={styles.sesText}>
                    <p>{stateData.sessions[i].node.sessionName.name}</p>
                  </div>
                  <div className={styles.likeHeart}>
                    <HeartOutlined style={{ color: '#D4237A' }} size="large" />
                  </div>
                </div>
                <p>{stateData.sessions[i].node.itemRequired}</p>
              </div>
            </div>
            <div className={styles.sesbtn}>
              <Button
                type="primary"
                size="large"
                className={styles.sesbutton}
                onClick={() => {
                  this.openSubDrawer(stateData.sessions[i].node.sessionName.name)
                }}
              >
                Start New Session
              </Button>
            </div>
          </div>,
        )
      }
    }
    return array
  }

  openSubDrawer = name => {
    this.setState({
      // isSubdrawerOper: true,
      sessionName: name,
      visible: true,
    })
  }

  onClose = () => {
    this.setState({
      visible: false,
      // isSubdrawerOper: false,
    })
  }

  getFilteredArray = () => {
    const stateData = this.state
    for (let i = 0; i < stateData.sessions.length; i += 1) {
      if (stateData.sessions[i].node.sessionName.name === stateData.sessionName) {
        return stateData.sessions[i].node
      }
    }
    return {}
  }

  render() {
    const propData = this.props
    const stateData = this.state
    const filteredArray = this.getFilteredArray()
    return (
      <>
        <Drawer
          placement="right"
          closable={false}
          maskStyle={{ display: 'flex' }}
          visible={stateData.visible}
          width={500}
        >
          <SessionInstruction
            session={filteredArray}
            closeModal={() => {
              this.onClose()
            }}
          />
        </Drawer>
        <div className={styles.drawerBody}>
          <div className={styles.overlayBody}>
            <div
              className={styles.cancel}
              role="presentation"
              onClick={() => {
                this.close()
              }}
            >
              <CloseOutlined style={{ fontSize: '30px', color: 'black', cursor: 'pointer' }} />
            </div>
            <div className={styles.studentAct}>
              <div className={styles.studentthCard}>
                <div className={styles.studet}>
                  <div className={styles.imgcrd}>
                    <img src={student} alt="not_found" />
                  </div>
                  <div className={styles.det}>
                    <p className={styles.stName}>{propData.student.firstname}</p>
                    <p className={styles.stAdd}>Newyork, USA</p>
                  </div>
                </div>
                <div className={styles.actbtn}>
                  <div className={styles.actCon}>
                    <Button type="primary" ghost style={{ marginTop: '3%', width: '120%' }}>
                      Contact Student
                    </Button>
                  </div>
                  <div className={styles.actBk}>
                    <Button
                      type="primary"
                      className={styles.actbkcls}
                      style={{ marginTop: '3%', width: '120%', marginLeft: '24%' }}
                    >
                      Book Apointment
                    </Button>
                  </div>
                </div>

                <div className={styles.drawerShell}>
                  <div className={styles.drawerCard}>{this.renderProgramArea()}</div>
                </div>
              </div>
            </div>
            {/* change here */}

            <div className={styles.terms}>
              <div className={styles.termCards}>
                <div className={styles.termcardHeading}>
                  <p className={styles.goal}>Short Term Goal</p>
                  <p className={styles.goalPerc}>61%</p>
                </div>
                <div className={styles.termcardDesc}>
                  <p>Jan 5- to March 4</p>
                </div>
                <div className={styles.termProgress}>
                  <Progress percent={40} showInfo={false} strokeColor="orange" strokeWidth={10} />
                </div>
              </div>
              <div className={styles.termCards}>
                <div className={styles.termcardHeading}>
                  <p className={styles.goal}>Long Term Goal</p>
                  <p className={styles.goalPerc}>75%</p>
                </div>
                <div className={styles.termcardDesc}>
                  <p>Jan 5- to March 4</p>
                </div>
                <div className={styles.termProgress}>
                  <Progress percent={40} showInfo={false} strokeColor="orange" strokeWidth={10} />
                </div>
              </div>
              <div className={styles.behaviourAction}>
                <p className={styles.behHeader}>Behaviour Assessment</p>
                <div className={styles.behaviourActionbtn}>
                  <div className={styles.btnActionone}>
                    <Button type="primary" size="large" className={styles.behActone}>
                      PEAK
                    </Button>
                  </div>
                  <div className={styles.btnActiontwo}>
                    <Button type="primary" size="large" className={styles.behActtwo}>
                      VB-MAPP
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.sessions}>
              <div className={styles.sessHeader}>
                <p>Sessions</p>
              </div>
              <div className={styles.sesSHell}>
                <div className={styles.sessubshell}>{this.renderSessionCards()}</div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }
}
export default StudentDrawer
