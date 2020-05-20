import React from 'react'
import { Helmet } from 'react-helmet'
// import {  DownOutlined  } from 'icons';
import { Tree } from 'antd'

const { TreeNode } = Tree
// import AddForm from './AddForm'
// import styles from './style.module.scss'

class BlogAddPost extends React.Component {
  render() {
    return (
      <div>
        <Helmet title="Add Blog Post" />
        <div className="row">
          <div className="col-lg-4">
            <section className="card">
              <div className="card-header mb-2">
                <div className="utils__title">
                  <strong>Post Add/Edit</strong>
                </div>
              </div>
              <div className="card-body" style={{ position: 'relative' }}>
                <Tree showLine defaultExpandedKeys={['0-0-0']} onSelect={this.onSelect}>
                  <TreeNode
                    title="18.10060 - Sits in a small group for 10 minutes, attends to the teacher/material for 50% of the period"
                    key="0-0"
                  >
                    <TreeNode title="parent 1-0" key="0-0-0">
                      <TreeNode title="leaf" key="0-0-0-0" />
                      <TreeNode title="leaf" key="0-0-0-1" />
                      <TreeNode title="leaf" key="0-0-0-2" />
                    </TreeNode>
                    <TreeNode title="parent 1-1" key="0-0-1">
                      <TreeNode title="leaf" key="0-0-1-0" />
                    </TreeNode>
                    <TreeNode title="parent 1-2" key="0-0-2">
                      <TreeNode title="leaf" key="0-0-2-0" />
                      <TreeNode title="leaf" key="0-0-2-1" />
                    </TreeNode>
                  </TreeNode>
                </Tree>
              </div>
            </section>
          </div>
          <div className="col-lg-8">
            <section className="card">
              <div className="card-header mb-2">
                <div className="utils__title">
                  <strong>Post Add/Edit</strong>
                </div>
              </div>
              <div className="card-body">
                <h5 className="mb-3 text-black">
                  <strong>Information</strong>
                  {/* <Button style={{ width: 70, float:'right' }} type="primary" htmlType="submit" className="mr-2">
                    Submit
                  </Button> */}
                </h5>
                <dl className="row">
                  <dt className="col-xl-3">Courses End:</dt>
                  <dd className="col-xl-9">Digital Ocean, Nokia</dd>
                  <dt className="col-xl-3">Address:</dt>
                  <dd className="col-xl-9">New York, US</dd>
                  <dt className="col-xl-3">Skills:</dt>
                  <dd className="col-xl-9">
                    <span className="badge badge-default mr-1">HTML</span>
                  </dd>
                  <dt className="col-xl-3">Last companies:</dt>
                  <dd className="col-xl-9">Microsoft, Soft Mailstorm</dd>
                  <dt className="col-xl-3">Personal Information:</dt>
                  <dd className="col-xl-9">
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                  </dd>
                </dl>
              </div>
            </section>
          </div>
        </div>
      </div>
    )
  }
}

export default BlogAddPost
