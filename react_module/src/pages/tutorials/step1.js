import React from 'react'
import ReactPlayer from 'react-player'
import { Card, Typography } from 'antd'
import Authorize from 'components/LayoutComponents/Authorize'
import { Link } from 'react-router-dom'
import { gql } from 'apollo-boost'
import client from '../../apollo/config'

const { Title, Text } = Typography

class TutorialStep1 extends React.Component {
  constructor(props) {
    super(props)
    console.log(JSON.stringify(props))
    this.state = {
      isLoading: true,
      loadingMoreVideos: true,
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
        spid = result.data.VimeoProject.edges[0].node.projectId
        this.setState({
          isLoading: false,
          projects: result.data.VimeoProject.edges,
          selectedProjectId: result.data.VimeoProject.edges[0].node.projectId,
          selectedProjectName: result.data.VimeoProject.edges[0].node.name,
        })
        this.getSelectedProjectContinueURL(spid)
        this.getSelectedProjectVideos(spid)
      })
  }

  secondsToHms = d => {
    d = Number(d)
    const h = Math.floor(d / 3600)
    const m = Math.floor((d % 3600) / 60)
    const s = Math.floor((d % 3600) % 60)

    const hDisplay = h > 0 ? h + (h === 1 ? ' hour, ' : ' hours, ') : ''
    const mDisplay = m > 0 ? m + (m === 1 ? ' minute, ' : ' minutes, ') : ''
    const sDisplay = s > 0 ? s + (s === 1 ? ' second' : ' seconds') : ''
    return hDisplay + mDisplay + sDisplay
  }

  getSelectedProjectContinueURL = projectId => {
    client
      .query({
        query: gql`query {getVideoStatus(user:"", project:"${projectId}", first:1)
      {
        edges {
            node {
                id
                video
                status
                user{
                  id
                  username
                }
                project{
                  id
                  name
                }
            }
        }
    }
}`,
      })
      .then(result => {
        console.log(JSON.stringify(result))
        /* let already = false
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
        } */
      })
  }

  getSelectedProjectVideos = projectId => {
    fetch(`https://api.vimeo.com/users/100800066/projects/${projectId}/videos`, {
      method: 'GET',
      page: 1,
      headers: new Headers({
        'Content-Type': 'application/vnd.vimeo.*+json',
        Authorization: 'Bearer 57fe5b03eac21264d45df680fb335a42',
      }),
    })
      .then(res => res.json())
      .then(res => {
        console.log(res)
        this.setState({
          projectVideos: res.data,
          loadingMoreVideos: false,
        })
      })
      .catch(err => console.log(err))
  }

  handleKeyDown = () => {}

  getVideoIdFromUrl = url => {
    const res = url.substring(8)
    const id = res.substring(0, res.indexOf('/'))
    return id
  }

  render() {
    const {
      isLoading,
      projects,
      selectedProjectId,
      selectedProjectName,
      projectVideos,
      continueURL,
      loadingMoreVideos,
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
                  return selectedProjectId === project.node.projectId ? (
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
                          selectedProjectId: project.node.projectId,
                          selectedProjectName: project.node.name,
                          loadingMoreVideos: true,
                        })
                        this.getSelectedProjectVideos(project.node.projectId)
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
                    {loadingMoreVideos === true && <p>Loading videos. Please wait...</p>}
                    {loadingMoreVideos === false && projectVideos && projectVideos.length === 0 && (
                      <p>There are no more videos in this category.</p>
                    )}
                    {loadingMoreVideos === false &&
                      projectVideos &&
                      projectVideos.length > 0 &&
                      projectVideos.map(video => (
                        <div className="col-md-4 col-sm-6">
                          <Link
                            to={{
                              pathname: '/tutorials/step2',
                              videoUrl: video.link,
                              videoTitle: video.name,
                              videoDuration: this.secondsToHms(video.duration),
                              projectId: selectedProjectId,
                              description: video.description,
                            }}
                          >
                            <Card
                              hoverable
                              style={{ margin: '5px 5px 5px 0', borderRadius: '10px' }}
                              cover={
                                <img
                                  alt="video"
                                  src={video.pictures.sizes[1].link}
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
                                {video.name}
                              </Title>
                              <Text type="secondary" style={{ fontSize: '10px' }}>
                                {this.secondsToHms(video.duration)}
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
