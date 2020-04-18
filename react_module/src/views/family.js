/* eslint-disable react/jsx-indent */
import React from 'react'
import { Helmet } from 'react-helmet'
import {Row,Col, Card,Button} from 'antd';
import {PictureOutlined,ArrowRightOutlined} from "@ant-design/icons"
import Authorize from 'components/LayoutComponents/Authorize';
import FamilyForm from '../components/meal_and_medical/FamilyForm';

class FamilyMembers extends React.Component {

  render() {
    const buttonStyle = {width:"100%",minHeight:"45px",fontSize: "16px", marginBottom: 16}
    const iconStyle = {float:"left",width:"auto"}
    const rightIconStyle = {float:"right"}
    return (
      <Authorize roles={['school_admin', 'parents']} redirect to="/dashboard/beta">
        <Helmet title="Partner" />
        <Row gutter={24}>
          <Col span={6}>
            <Card bordered={false}>
              <Button style={buttonStyle}>
                <PictureOutlined style={iconStyle} />Father <ArrowRightOutlined style={rightIconStyle} />
              </Button>
              <Button style={buttonStyle}>
                <PictureOutlined style={iconStyle} />Mother <ArrowRightOutlined style={rightIconStyle} />
              </Button>
              <Button style={buttonStyle}>
                <PictureOutlined style={iconStyle} />Sibling <ArrowRightOutlined style={rightIconStyle} />
              </Button>
              <Button style={buttonStyle}>
                <PictureOutlined style={iconStyle} />GrandFather <ArrowRightOutlined style={rightIconStyle} />
              </Button>
              <Button style={buttonStyle}>
                <PictureOutlined style={iconStyle} />Add Member <ArrowRightOutlined style={rightIconStyle} />
              </Button>
            </Card>
          </Col>
          <Col span={18}>
            <FamilyForm />
          </Col>
        </Row>
      </Authorize>
    )
  }
}

export default FamilyMembers

