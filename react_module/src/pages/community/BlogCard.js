/* eslint-disable react/jsx-closing-tag-location */
import React, { useEffect, useState } from 'react'
import { Typography, Button, notification } from 'antd'
import { useMutation } from 'react-apollo'
import moment from 'moment'
import { HeartFilled, CommentOutlined, HeartOutlined, DeleteOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import gp from '../../images/girl.jpg'
import BlogCommentBox from './BlogCommentBox'
import { IS_LIKED, SEND_LIKE, DELETE_BLOG, GET_BLOGS } from './query'
// eslint-disable-next-line import/no-cycle
import { LSAG_USER_ID } from '.'

const { Title, Text } = Typography

export default ({ node, group }) => {
  const [openCommentBox, setOpenCommentBox] = useState(false)
  const userId = useSelector(state => state.user.id)

  const [
    isLiked,
    { data: isLikedData, error: isLikedError, loading: isLikedLoading },
  ] = useMutation(IS_LIKED, {
    variables: {
      blogId: node.id,
      userId,
    },
  })

  const [
    deleteBlog,
    { data: deleteBlogData, loading: deleteBlogLoading, error: deleteBlogError },
  ] = useMutation(DELETE_BLOG, {
    update(cache) {
      const cahceData = cache.readQuery({
        query: GET_BLOGS,
        variables: {
          group,
        },
      })
      cache.writeQuery({
        query: GET_BLOGS,
        variables: { group },
        data: {
          communityBlogs: {
            edges: cahceData.communityBlogs.edges.filter(blog => blog.node.id !== node.id),
          },
        },
      })
    },
  })

  const [
    toggleLike,
    { data: toggleLikeData, error: toggleLikeError, loading: toggleLikeLoading },
  ] = useMutation(SEND_LIKE, {
    variables: {
      blogId: node.id,
      userId,
    },
    update(cache) {
      const data = cache.readQuery({
        query: IS_LIKED,
        variables: {
          blogId: node.id,
          userId,
        },
      })
      data.isUserLikedBlog.status = !isLikedData.isUserLikedBlog.status
      cache.writeQuery({
        query: IS_LIKED,
        variables: {
          blogId: node.id,
          userId,
        },
        data,
      })
    },
  })

  const handelToggleLike = () => {
    toggleLike()
  }

  useEffect(() => {
    if (!isLikedData && !isLikedLoading && !isLikedError) {
      isLiked()
    }
  })

  useEffect(() => {
    if (deleteBlogData) {
      notification.success({
        message: 'Delete blog sucessfully',
      })
    }

    if (deleteBlogError) {
      notification.error({
        message: 'Failed to delete the blog',
      })
    }
  }, [deleteBlogData, deleteBlogError])

  return (
    <>
      <div
        key={node.id}
        style={{
          marginTop: 30,
          position: 'relative',
          border: '1px solid #E4E9F0',
          boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
          borderRadius: 10,
          padding: '24px 22px 16px 30px',
        }}
      >
        <div style={{ display: 'flex' }}>
          <div
            style={{
              width: 80,
              minWidth: 80,
              height: 80,
              borderRadius: 6,
              overflow: 'hidden',
            }}
          >
            <img src={gp} alt="not_found" style={{ width: '100%', height: '100%' }} />
          </div>
          <div style={{ marginLeft: 18 }}>
            <Title style={{ fontSize: '1.4rem', fontWeight: 600 }}>{node.title}</Title>
            <Text
              style={{
                fontSize: '1.1rem',
                fontWeight: 300,
                color: '#000',
              }}
            >
              {moment(node.time).format('YYYY-MM-DD')}
            </Text>
            <Text
              style={{
                fontSize: '1.1rem',
                fontWeight: 300,
                color: '#000',
                marginLeft: 15,
              }}
            >
              {node.category.name}
            </Text>
          </div>
        </div>
        <Text
          style={{
            marginTop: 22,
            fontSize: '1.2rem',
            color: '#000',
            display: 'block',
          }}
        >
          {node.description}
        </Text>
        <div style={{ marginTop: 19 }}>
          <Button type="link" onClick={handelToggleLike}>
            {isLikedData?.isUserLikedBlog.status ? (
              <HeartFilled
                style={{
                  fontSize: 25,
                  marginRight: 9,
                  color: 'rgb(231, 131, 38)',
                }}
              />
            ) : (
              <HeartOutlined
                style={{
                  fontSize: 25,
                  marginRight: 9,
                  color: 'rgb(231, 131, 38)',
                }}
              />
            )}
            <Text
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: 'rgb(231, 131, 38)',
              }}
            >
              {node.likes.count}
            </Text>
          </Button>
          <Button type="link" onClick={() => setOpenCommentBox(state => !state)}>
            <CommentOutlined style={{ fontSize: 25, marginRight: 9, color: '#000' }} />
            <Text style={{ fontSize: 18, fontWeight: 600, color: '#000' }}>
              {node.comments.count}
            </Text>
          </Button>
        </div>
        {userId === LSAG_USER_ID && (
          <Button
            type="link"
            style={{ position: 'absolute', right: 18, top: 24 }}
            onClick={() => {
              deleteBlog({
                variables: {
                  id: node.id,
                },
              })
            }}
            loading={deleteBlogLoading}
          >
            <DeleteOutlined style={{ fontSize: 24, color: 'red' }} />
          </Button>
        )}
      </div>
      {openCommentBox && <BlogCommentBox blogId={node.id} />}
    </>
  )
}
