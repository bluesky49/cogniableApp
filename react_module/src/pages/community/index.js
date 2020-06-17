import React, { Component } from 'react'
import { Input, Menu, Dropdown, Modal, message } from 'antd'
import { HeartFilled, MessageOutlined, PlusOutlined } from '@ant-design/icons'
import TextArea from 'antd/lib/input/TextArea'
import moment from 'moment'
import { connect } from 'react-redux'
import { gql } from 'apollo-boost'
import apolloClient from '../../apollo/config'
import gp from '../../images/girl.jpg'
import styles from './style.module.scss'
import CommentLike from './CommentLike'
import AddPost from './AddPost'
import notFound from '../../icons/notFound.svg'

const { Search } = Input

class Community extends Component {
  constructor(props) {
    super(props)
    const propData = this.props
    this.state = {
      store: propData.store,
      blogs: [],
      communityGroups: [],
      visible: false,
      comment: '',
      openGroupModal: false,
      groupDescription: '',
      groupName: '',
      blogModal: false,
      selectedNode: {},
      categoryID: '',
      notFound: false,
    }
    this.handleBlogOk = this.handleBlogOk.bind(this)
    this.showModal = this.showModal.bind(this)
  }

  componentDidMount() {
    apolloClient
      .query({
        query: gql`
          query {
            communityBlogs(category: "Q29tbXVuaXR5R3JvdXBzVHlwZTox") {
              edges {
                node {
                  id
                  title
                  time
                  description
                  category {
                    id
                    name
                  }
                  likes {
                    count
                    edges {
                      node {
                        id
                        time
                        user {
                          id
                          username
                        }
                      }
                    }
                  }
                  comments {
                    count
                    edges {
                      node {
                        id
                        time
                        comment
                        user {
                          id
                          username
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
        apolloClient
          .query({
            query: gql`
              query {
                communityGroups {
                  id
                  name
                  description
                }
              }
            `,
          })
          .then(presult => {
            this.setState({
              blogs: qresult.data.communityBlogs.edges,
              communityGroups: presult.data.communityGroups,
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

  fetchBlogssByGroup = data => {
    const stateData = this.state
    apolloClient
      .query({
        query: gql`
          query {
            communityBlogs(category: "${data.id}") {
              edges {
                node {
                  id
                  title
                  time
                  description
                  category {
                    id
                    name
                  }
                  likes {
                    count
                    edges {
                      node {
                        id
                        time
                        user {
                          id
                          username
                        }
                      }
                    }
                  }
                  comments {
                    count
                    edges {
                      node {
                        id
                        time
                        comment
                        user {
                          id
                          username
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
        if (qresult.data.communityBlogs.edges.length > 0) {
          this.setState({
            blogs: qresult.data.communityBlogs.edges,
            categoryID: data.id,
            notFound: false,
          })
        } else {
          this.setState({
            notFound: true,
            categoryID: data.id,
          })
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  renderCommunityActions = () => {
    return (
      <Menu>
        <Menu.Item
          onClick={() => {
            this.showBlogModal()
          }}
        >
          <p>Post a Blog</p>
        </Menu.Item>
        <Menu.Item
          onClick={() => {
            this.addGroup()
          }}
        >
          <p>Add Group</p>
        </Menu.Item>
      </Menu>
    )
  }

  showModal = data => {
    this.setState({
      visible: data.visible,
      selectedNode: data.node,
    })
  }

  showBlogModal = () => {
    this.setState({
      blogModal: true,
    })
  }

  renderCommBlogs = () => {
    const stateData = this.state
    const docArray = []
    if (stateData.blogs !== undefined && stateData.blogs.length > 0) {
      for (let i = 0; i < stateData.blogs.length; i += 1) {
        docArray.push(
          <div className={styles.commentItem} key={i}>
            <div className={styles.itemHeader}>
              <div className={styles.cardImg}>
                <img src={gp} alt="not_found" />
              </div>
              <div className={styles.ItemName}>
                <h2>{stateData.blogs[i].node.title}</h2>
                <p>
                  {moment(stateData.blogs[i].node.time).format('h:mm:ss a')} .
                  {stateData.blogs[i].node.category.name}
                </p>
              </div>
            </div>
            <div className={styles.cardDes}>
              <p>{stateData.blogs[i].node.description}</p>
            </div>
            <div className={styles.actions} id={`cmt${i}`}>
              <HeartFilled
                className={styles.msgIcon}
                style={{ fontSize: 20, color: 'darkorange', cursor: 'pointer' }}
                onClick={() => {
                  this.sendLike(stateData.blogs[i])
                }}
              />
              <p className={styles.likes}>{stateData.blogs[i].node.likes.count}</p>
              <CommentLike
                blogs={stateData.blogs[i].node.comments}
                node={stateData.blogs[i]}
                showCmModal={data => {
                  this.showModal(data)
                }}
              >
                <MessageOutlined
                  className={styles.msgIcon}
                  style={{ fontSize: 20, color: 'black', marginLeft: '7%', cursor: 'pointer' }}
                />
              </CommentLike>
              <p className={styles.comments}>{stateData.blogs[i].node.comments.count}</p>
            </div>
          </div>,
        )
      }
    }
    if (stateData.notFound) {
      return (
        <>
          <div className={styles.notFound}>
            <div className={styles.notFoundImg}>
              <img src={notFound} alt="notFound" />
            </div>
          </div>
          <p style={{ fontWeight: 'bold', fontSize: '20px', marginTop: '44%', marginLeft: '42%' }}>
            No Blogs Found
          </p>
        </>
      )
    }
    return docArray
  }

  addGroup = () => {
    this.setState({
      openGroupModal: true,
    })
  }

  clickPlusGp = e => {
    e.stopPropagation()
  }

  renderGroups = () => {
    const stateData = this.state
    const groupArray = []
    if (stateData.communityGroups !== undefined) {
      for (let i = 0; i < stateData.communityGroups.length; i += 1) {
        groupArray.push(
          <div
            className={styles.gpItem}
            key={i}
            role="presentation"
            onClick={() => {
              this.fetchBlogssByGroup(stateData.communityGroups[i])
            }}
          >
            <div className={styles.gpHeading}>
              <p>{stateData.communityGroups[i].name}</p>
              <div className={styles.gpIcon}>
                <PlusOutlined
                  style={{ fontSize: 30, color: 'darkblue', cursor: 'pointer' }}
                  onClick={e => {
                    this.clickPlusGp(e)
                  }}
                />
              </div>
            </div>
            <div className={styles.gpLabel}>
              <p>14,594 Parents</p>
            </div>
            <div className={styles.gpDesc}>
              <p>{stateData.communityGroups[i].description}</p>
            </div>
          </div>,
        )
      }
    }
    return groupArray
  }

  sendLike = data => {
    const stateData = this.state
    apolloClient
      .mutate({
        mutation: gql`
          mutation {
            communityLikesComments(
              input: { pk: "${data.node.id}", likes: ["${stateData.store.user.id}"] }
            ) {
              status
              message
              details {
                id
                time
                title
                description
                category {
                  id
                  name
                }
                likes {
                  edges {
                    node {
                      id
                      time
                      user {
                        id
                        username
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
        message.success(qresult.data.communityLikesComments.message, 6)
        this.setState({
          visible: false,
        })
      })
      .catch(error => {
        console.log(error)
      })
  }

  handleOk = () => {
    const stateData = this.state

    apolloClient
      .mutate({
        mutation: gql`
          mutation {
            communityLikesComments(
              input: {
                pk: "${stateData.selectedNode.node.id}"
                comments: [{ user: "${stateData.store.user.id}", comment: "${stateData.comment}" }]
              }
            ) {
              status
              message
              details {
                id
                time
                title
                description
                category {
                  id
                  name
                }
                comments {
                  edges {
                    node {
                      id
                      time
                      comment
                      user {
                        id
                        username
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
        message.success(qresult.data.communityLikesComments.message, 6)
        this.setState({
          visible: false,
        })
      })
      .catch(error => {
        console.log(error)
      })
  }

  handleCancel = e => {
    this.setState({
      visible: false,
    })
  }

  handleGrpCancel = e => {
    this.setState({
      openGroupModal: false,
    })
  }

  handleBlogCancel = e => {
    this.setState({
      blogModal: false,
    })
  }

  handleBlogOk = data => {
    const stateData = this.state
    const descArray = []
    for (let i = 0; i < data.desc.blocks.length; i += 1) {
      descArray.push(data.desc.blocks[i].text)
    }

    apolloClient
      .mutate({
        mutation: gql`
          mutation {
            addCommunityBlogs(
              input: {
                title: "${data.title}"
                category: "${stateData.categoryID}"
                description: "${descArray.join(' ')}"
              }
            ) {
              details {
                id
                title
                description
                category {
                  id
                  name
                }
              }
            }
          }
        `,
      })
      .then(qresult => {
        message.success('Blog posted Successfully', 6)
        this.setState({
          blogModal: false,
        })
      })
      .catch(error => {
        console.log(error)
      })
  }

  handleGrpOk = () => {
    const stateData = this.state
    apolloClient
      .mutate({
        mutation: gql`
          mutation {
            addCommunityGroup(
              input: {
                name: "${stateData.groupName}"
                description: "${stateData.groupDescription}"
              }
            ) {
              details {
                id
                name
                description
              }
            }
          }
        `,
      })
      .then(qresult => {
        message.success('Group Added Successfully', 6)
        this.setState({
          openGroupModal: false,
        })
      })
      .catch(error => {
        console.log(error)
      })
  }

  setComment = e => {
    this.setState({
      comment: e.target.value,
    })
  }

  setGrpName = e => {
    this.setState({
      groupName: e.target.value,
    })
  }

  setGrpDesc = e => {
    this.setState({
      groupDescription: e.target.value,
    })
  }

  render() {
    const stateData = this.state
    return (
      <div className={styles.communityBody}>
        <div className={styles.mainBody}>
          <Modal
            title="Leave a comment"
            visible={stateData.visible}
            onOk={() => {
              this.handleOk()
            }}
            onCancel={() => {
              this.handleCancel()
            }}
            maskClosable={false}
            centered
          >
            <TextArea
              placeholder="Enter your comment"
              rows={4}
              onChange={e => {
                this.setComment(e)
              }}
            />
          </Modal>
          <Modal
            title="Create a Group"
            visible={stateData.openGroupModal}
            onOk={() => {
              this.handleGrpOk()
            }}
            onCancel={() => {
              this.handleGrpCancel()
            }}
            maskClosable={false}
            centered
          >
            <Input
              size="large"
              placeholder="Enter group Name"
              onChange={e => {
                this.setGrpName(e)
              }}
            />
            <br />
            <br />
            <TextArea
              placeholder="Enter group description"
              rows={4}
              onChange={e => {
                this.setGrpDesc(e)
              }}
            />
          </Modal>

          <Modal
            width="70%"
            title="Post a Blog"
            visible={stateData.blogModal}
            footer={null}
            maskClosable={false}
            centered
            onCancel={() => {
              this.handleBlogCancel()
            }}
          >
            <AddPost
              addpost={data => {
                this.handleBlogOk(data)
              }}
            />
          </Modal>

          <div className={styles.itemImg}>
            <img src={gp} alt="not_found" />
          </div>
          <div className={styles.blogs}>
            <Search
              placeholder="Write something"
              enterButton="Send"
              size="large"
              className={styles.input_search}
              //   onSearch={value => console.log(value)}
            />
          </div>
          <div className={styles.groups}>
            <div className={styles.groupHeading}>
              <p>Popular Groups</p>
              <div className={styles.communityActions}>
                <Dropdown overlay={this.renderCommunityActions()} placement="bottomRight">
                  <a>Actions</a>
                </Dropdown>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.subMainBody}>
          <div className={styles.commentCards}>{this.renderCommBlogs()}</div>
          <div className={styles.gpCards}>{this.renderGroups()}</div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  store: state,
})

export default connect(mapStateToProps)(Community)
