import React from 'react'
import { Helmet } from 'react-helmet'
import { Tree } from 'antd';
import {  DownOutlined  }  from 'icons';

const { TreeNode } = Tree;
// import AddForm from './AddForm'
// import styles from './style.module.scss'

class BlogAddPost extends React.Component {

  onSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  };
  
  render() {
    return (
      <div>
        <Helmet title="Add Blog Post" />
        <section className="card">
          <div className="card-header mb-2">
            <div className="utils__title">
              <strong>Post Add/Edit</strong>
            </div>
          </div>
          <div className="card-body">           
              <Tree
        showLine
        switcherIcon={<DownOutlined />}
        defaultExpandedKeys={['0-0-0']}
        onSelect={this.onSelect}
      >
        <TreeNode title="parent 1" key="0-0">
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
    )
  }
}

export default BlogAddPost