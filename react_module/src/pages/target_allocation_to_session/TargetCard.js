import React from 'react'
import { CloseCircleOutlined, CloseOutlined } from '@ant-design/icons'
import style from './style.module.scss'

const TargetCard = ({ id = '', text = '', showDelete = false, onDelete, srNo, node }) => {
  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '10px',
    // boxShadow: '0 3px 5px rgba(22, 22, 53, 0.16)',
    marginBottom: 15,
    padding: 5,
    minHeight: 40,
    cursor: 'move',
    border: '1px solid #E4E9F0',
    position: 'relative',
  }

  const closeBtnStyle = {
    position: 'absolute',
    right: '10px',
    top: '5px',
    cursor: 'pointer',
    zIndex: '999',
  }

  console.log(node)

  return (
    <div className={id} id={id} style={cardStyle} key={id}>
      {showDelete ? (
        <div style={closeBtnStyle}>
          {/* <CloseOutlined /> */}
          {/* <CloseCircleOutlined onClick={onDelete} /> */}
          {srNo}
        </div>
      ) : (
        <></>
      )}

      <div className={style.content}>
        {/* <div className={`${style.flag} bg-primary`} /> */}
        <div className="d-flex flex-wrap align-items-center">
          <h5 className="text-dark font-size-18 mt-2 mr-auto">{text}</h5>
          <i className="fe fe-arrow-right-circle text-danger font-size-30 flex-shrink-0" />
          <br />
          <span
            style={{
              color: '#0B35B3',
              marginRight: 38,
            }}
          >
            Status: {node.targetStatus.statusName}
          </span>
          
        </div>
      </div>
    </div>
  )
}

export default TargetCard
