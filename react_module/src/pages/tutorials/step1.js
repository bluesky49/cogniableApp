import React from 'react'
import ReactPlayer from 'react-player'
import { Card, Typography } from 'antd'
import Authorize from 'components/LayoutComponents/Authorize'
import { Link } from 'react-router-dom'
import { gql } from 'apollo-boost'
import client from '../../apollo/config'
import cardImg1 from '../../images/cardImg1.jpg'

const { Title, Text } = Typography

class TutorialStep1 extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      projects: [],
      projectVideos: [],
      selectedProjectId: '',
      selectedProjectName: '',
      continueURL: '',
    }
  }

  componentDidMount() {
    let spid = ''
    client
      .query({
        query: gql`
          query {
            VimeoProject {
              edges {
                node {
                  id
                  name
                  url
                  projectId
                  description
                }
              }
            }
          }
        `,
      })
      .then(result => {
        console.log(result.data)
        spid = result.data.VimeoProject.edges[0].node.id
        this.setState({
          isLoading: false,
          projects: result.data.VimeoProject.edges,
          selectedProjectId: result.data.VimeoProject.edges[0].node.id,
          selectedProjectName: result.data.VimeoProject.edges[0].node.name,
        })
      })
    this.getSelectedProjectContinueURL(spid)
    this.getSelectedProjectVideos(spid)
  }

  getSelectedProjectContinueURL = projectId => {
    client
      .query({
        query: gql`query {VimeoVideos(project:"${projectId}")
      {
        edgeCount
        edges {
            node {
                id
                status
                url
            }
        }
    }
}`,
      })
      .then(result => {
        let already = false
        result.data.VimeoVideos.edges.forEach(video => {
          if (already === false) {
            switch (video.node.status) {
              case '1':
                break

              case '2':
                this.setState({
                  continueURL: video.node.url,
                })
                already = true
                break

              case '3':
                this.setState({
                  continueURL: video.node.url,
                })
                already = true
                break

              default:
                console.log('Default')
                break
            }
          }
        })
        if (already === false) {
          this.setState({
            continueURL: result.data.VimeoVideos.edges[0].node.url,
          })
        }
      })
  }

  getSelectedProjectVideos = projectId => {
    client
      .query({
        query: gql`query {VimeoVideos(project:"${projectId}", first:6)
      {
        edgeCount
        edges {
            node {
                id
                status
                name
                url
                duration
                thubUrl
                description
                videoLike
                {
                    edgeCount
                }
                comment
                {
                    edgeCount
                     edges {
                        node {
                            user
                            {
                                id
                                username
                            }
                            comment
                            date
                        }
                    }
                }
            }
        }
    }
}`,
      })
      .then(result => {
        console.log(result.data)
        this.setState({
          projectVideos: result.data.VimeoVideos.edges,
        })
      })
  }

  handleKeyDown = () => {}

  render() {
    const {
      isLoading,
      projects,
      selectedProjectId,
      selectedProjectName,
      projectVideos,
      continueURL,
    } = this.state
    if (isLoading) {
      return <div>Loding...</div>
    }
    return (
      <Authorize roles={['parents', 'therapist', 'school_admin']} redirect to="/dashboard/beta">
        <div style={{ height: '100%', width: '100%' }}>
          <div className="row">
            <div className="col-sm-6 col-md-5">
              <div style={{ background: '#f9f9f9', padding: '30px', borderRadius: '10px' }}>
                {projects.map(project => {
                  return selectedProjectId === project.node.id ? (
                    <Card
                      key={project.node.id}
                      hoverable
                      style={{
                        background: '#E58425',
                        color: '#FFFFFF',
                        boxShadow: '0px 2px 10px -5px #111',
                        border: '1px solid #FFFFFF',
                        borderRadius: '10px',
                        marginBottom: '20px',
                      }}
                    >
                      <p className="mb-0" style={{ fontSize: '24px', fontWeight: '700' }}>
                        {project.node.name}
                      </p>
                      <p className="" style={{ fontSize: '16px', lineHeight: '1.2' }}>
                        {project.node.description}
                      </p>
                    </Card>
                  ) : (
                    <div
                      key={project.node.id}
                      role="button"
                      tabIndex="0"
                      onClick={() => {
                        this.setState({
                          selectedProjectId: project.node.id,
                          selectedProjectName: project.node.name,
                        })
                        this.getSelectedProjectVideos(project.node.id)
                      }}
                      onKeyDown={this.handleKeyDown}
                    >
                      <Card
                        hoverable
                        style={{
                          background: '#FFFFFF',
                          color: '#000000',
                          boxShadow: '0px 1px 10px -5px #111',
                          border: '1px solid #FFFFFF',
                          borderRadius: '10px',
                          marginBottom: '20px',
                        }}
                      >
                        <p className="mb-0" style={{ fontSize: '24px', fontWeight: '700' }}>
                          {project.node.name}
                        </p>
                        <p className="" style={{ fontSize: '16px', lineHeight: '1.2' }}>
                          {project.node.description}
                        </p>
                      </Card>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="col-sm-12 col-md-7">
              <div className="row mb-5">
                <div className="col-sm-12 col-md-12">
                  <p style={{ fontSize: '32px', fontWeight: '700' }}>Continue Watching</p>
                  <ReactPlayer url={continueURL} controls width="100%" />
                </div>
              </div>
              <div className="row">
                <div className="col-sm-12 col-md-12">
                  <div className="">
                    <span style={{ fontSize: '24px', fontWeight: '700' }}>
                      More Videos in {selectedProjectName}
                    </span>
                  </div>
                  <div className="d-flex flex-row flex-nowrap overflow-auto">
                    {projectVideos &&
                      projectVideos.length > 0 &&
                      projectVideos.map(video => (
                        <div key={video.node.id} className="col-md-4 col-sm-6">
                          <Link
                            to={{
                              pathname: '/tutorials/step2',
                              videoId: video.node.id,
                              projectId: selectedProjectId,
                            }}
                          >
                            <Card
                              hoverable
                              style={{ margin: '5px 5px 5px 0', borderRadius: '10px' }}
                              cover={
                                <img
                                  alt="video"
                                  src={video.node.thubUrl}
                                  style={{ height: '150px' }}
                                />
                              }
                            >
                              <Title
                                level={4}
                                style={{
                                  marginBottom: '0',
                                  color: '#777777',
                                  fontWeight: '700',
                                  marginRight: '5px',
                                }}
                              >
                                {video.node.description}
                              </Title>
                              <Text type="secondary" style={{ fontSize: '10px' }}>
                                5 times per day
                              </Text>
                            </Card>
                          </Link>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Authorize>
    )
  }
}

export default TutorialStep1
