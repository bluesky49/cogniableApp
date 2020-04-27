import React, { Component } from 'react'
import { Card, Progress, Typography } from 'antd'

class Target extends Component {
  render() {
    const { Text } = Typography
    const { Meta } = Card
    let progress = ['#FF9C52', '#4BAEA0', '#f42733', '0', '0', '0', '0', '0']
    progress = progress.map(data => {
      if (data) {
        return (
          <Text>
            &nbsp;
            <Progress
              showInfo={false}
              status="active"
              strokeColor={data}
              percent={100}
              style={{ width: '10%' }}
            />
            &nbsp;
          </Text>
        )
      }
      return null
    }, {})
    let cardBox = [1, 2, 3, 4, 5, 6, 7, 8, 8, 9, 0, 0, 12, 34, 5, 5]
    cardBox = cardBox.map(data => {
      if (data) {
        return (
          <Card
            hoverable
            style={{ width: '100%', maxHeight: '350px', marginBottom: '20px' }}
            cover={
              <img
                alt="example"
                src="https://www.familyeducation.com/sites/default/files/2019-03/traits-babies-inherit-from-their-father_feature.jpg"
                style={{ maxHeight: '300px' }}
              />
            }
          >
            <Meta
              title="Kunal names the music  category by listing "
              description="visual perfaction - 5 traol per day"
            />
            <div>{progress}</div>
          </Card>
        )
      }
      return null
    })
    return cardBox
  }
}
export default Target
