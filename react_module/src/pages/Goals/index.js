import React, { useState, useEffect } from 'react'
import { Layout, Typography, Row, Col } from 'antd'
import { createUseStyles } from 'react-jss'
import Goals from './Goals'

const { Content } = Layout
const { Text } = Typography

const useSideBarStyles = createUseStyles(() => ({
  sideBarButtom: {
    display: 'flex',
    width: '100%',
    height: 66,
    textAlign: 'left',
    '&:hover, &:focus': {
      outline: 'none',
    },
    border: '1px solid rgb(228, 233, 240)',
    boxShadow: 'rgba(53, 53, 53, 0.1) 0px 0px 4px',
    borderRadius: 10,
    padding: '16px 12px',
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
}))

// key is mandatory and mast me uniq
const settingOptionViewList = [
  {
    key: 1,
    title: 'Goals',
    component: <Goals />,
  },
]

const SideBar = ({ style, selected, setSelect }) => {
  const classes = useSideBarStyles()

  return (
    <div
      style={{
        padding: '28px 27px 20px',
        background: '#F9F9F9',
        borderRadius: 10,
        minHeight: 'calc(100vh - 100px)',
        ...style,
      }}
    >
      {settingOptionViewList.map(({ key, title }) => {
        return (
          <button
            key={key}
            type="button"
            onClick={() => setSelect(key)}
            className={classes.sideBarButtom}
            style={{
              background: selected === key ? '#E58425' : '#FFF',
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: selected === key ? '#FFF' : '#E58425',
                display: 'block',
              }}
            >
              {title}
            </Text>
          </button>
        )
      })}
    </div>
  )
}

export default () => {
  const [selectSett, setSelectSett] = useState(1)
  const [selectComponent, setSelectComponent] = useState()

  useEffect(() => {
    const selectSettObj = settingOptionViewList.find(item => item.key === selectSett)
    setSelectComponent(selectSettObj.component)
  }, [selectSett])

  return (
    <Layout style={{ backgroundColor: '#fff', padding: '0px' }}>
      <Content
        style={{
          padding: '0px',
          maxWidth: 1300,
          width: '100%',
          margin: '0px auto',
        }}
      >
        <Row gutter={[46, 0]}>
          <Col span={6}>
            <SideBar selected={selectSett} setSelect={setSelectSett} />
          </Col>
          <Col span={18}>{selectComponent}</Col>
        </Row>
      </Content>
    </Layout>
  )
}
