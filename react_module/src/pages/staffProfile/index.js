import React, { useState, useEffect } from 'react'
import { Layout, Typography, Row, Col } from 'antd'
import { createUseStyles } from 'react-jss'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo'
import clinicPicture from './img/profile.jpg'
import NotiSett from './NotiSett'
import SupportTicketSett from './SupportTicketSett'
import MasterCriteria from './MasteryCriteria'
import LocationSett from './LocationSett'
import ContactDetails from './ContactDetails'

const { Content } = Layout
const { Title, Text } = Typography

const CLINIC_QUERY = gql`
  query {
    schooldetail: schoolDetail {
      id
      schoolName
      address
    }
  }
`

const useSideBarStyles = createUseStyles(() => ({
  sideBarButtom: {
    display: 'block',
    width: '100%',
    border: 'none',
    boxShadow: 'none',
    textAlign: 'left',
    background: '#F9F9F9',
    '&:hover, &:focus': {
      outline: 'none',
    },
  },
}))

// key is mandatory and mast me uniq
const settingOptionViewList = [
  {
    key: 1,
    title: 'Notificaiton',
    component: <NotiSett />,
  },
  {
    key: 2,
    title: 'Support Ticket',
    component: <SupportTicketSett />,
  },
  {
    key: 3,
    title: 'Personal Info',
    component: <ContactDetails />,
  },
  {
    key: 4,
    title: 'Master Criteria',
    component: <MasterCriteria />,
  },
  {
    key: 5,
    title: 'Location',
    component: <LocationSett />,
  },
]

const ClinicInfoCard = ({ style }) => {
  const { data: clinicInfo } = useQuery(CLINIC_QUERY)
  return (
    <div style={{ display: 'flex', ...style }}>
      <img
        src={clinicPicture}
        alt="clinic Name"
        style={{ width: 80, height: 60, marginRight: 15 }}
      />
      <div>
        <Title style={{ marginBottom: 8, fontSize: 22 }}>
          {clinicInfo?.schooldetail.schoolName}
        </Title>
        <Text style={{ fontSize: 16, color: '#000' }}>{clinicInfo?.schooldetail.address}</Text>
      </div>
    </div>
  )
}

const SideBar = ({ style, selected, setSelect }) => {
  const classes = useSideBarStyles()

  return (
    <div
      style={{
        padding: 20,
        background: '#F9F9F9',
        ...style,
      }}
    >
      {settingOptionViewList.map(({ key, title }, index) => {
        return (
          <button
            key={key}
            type="button"
            onClick={() => setSelect(key)}
            className={classes.sideBarButtom}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: selected === key ? '#E58425' : '#000',
                margin: '30px 0px',
                display: 'block',
              }}
            >
              {title}
            </Text>
            {/* Render <hr /> for all item without last one */}
            {index !== settingOptionViewList.length - 1 && <hr style={{ margin: 0 }} />}
          </button>
        )
      })}
    </div>
  )
}

export default () => {
  const [selectSett, setSelectSett] = useState(3)
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
        <ClinicInfoCard />

        <Row gutter={[46, 0]}>
          <Col span={6}>
            <SideBar selected={selectSett} setSelect={setSelectSett} style={{ marginTop: 40 }} />
          </Col>
          <Col span={18}>{selectComponent}</Col>
        </Row>
      </Content>
    </Layout>
  )
}
