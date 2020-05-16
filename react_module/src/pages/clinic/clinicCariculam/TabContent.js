import React, { useState } from 'react'
import { Row, Col } from 'antd'
import DomainBox from './DomainBox'
import DomainContent from './DomainContent'

const TabContent = ({ domains }) => {
  const [selectDomain, setSelectDomain] = useState(domains[0] ? domains[0].node : null)

  const handleSelectDomain = domain => () => {
    setSelectDomain(domain)
  }

  return (
    <Row gutter={[52, 0]}>
      <Col style={{ maxWidth: 460 }} span={8}>
        <DomainBox
          domains={domains}
          selectDomain={selectDomain}
          handleSelectDomain={handleSelectDomain}
        />
      </Col>
      {selectDomain && (
        <Col span={16}>
          <DomainContent targetAreas={selectDomain.targetArea.edges} />
        </Col>
      )}
    </Row>
  )
}

export default TabContent
