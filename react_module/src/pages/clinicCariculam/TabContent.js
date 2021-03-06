/* eslint-disable object-shorthand */
import React, { useState, useEffect } from 'react'
import { Row, Col } from 'antd'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo'
import DomainBox from './DomainBox'
import DomainContent from './DomainContent'

const DOMAIN = gql`
query domain($programArea: ID!) {
  programDetails(id: $programArea) {
      domain
      {
        edges {
            node {
             id
             domain
             targetArea {
                edges {
                  node {
                        id
                        Area
                      }
                    }
                  }
            }
      }
      }
  }
}
`

const TabContent = ({ programArea }) => {
  const { data, error, loading } = useQuery(DOMAIN, { variables: { programArea: programArea } })

  const [selectDomain, setSelectDomain] = useState()

  useEffect(() => {
    if (data && !selectDomain) {
      setSelectDomain(data.programDetails.domain.edges[0] ? data.programDetails.domain.edges[0].node : null)
    }
  }, [data, selectDomain])

  const handleSelectDomain = domain => () => {
    setSelectDomain(domain)
  }

  if (loading) {
    return 'Loading...'
  }

  if (error) {
    return 'Opps their is something wrong'
  }

  return (
    <Row gutter={[52, 0]}>
      <Col style={{ maxWidth: 460 }} span={8}>
        {data && (
          <DomainBox
            domains={data.programDetails.domain.edges}
            selectDomain={selectDomain}
            handleSelectDomain={handleSelectDomain}
            programArea={programArea}
          />
        )}
      </Col>
      {selectDomain && (
        <Col span={16}>
          <DomainContent targetAreas={selectDomain.targetArea.edges} domainId={selectDomain.id} />
        </Col>
      )}
    </Row>
  )
}

export default TabContent
