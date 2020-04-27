import React, { Component } from 'react'
import { typography, Progress } from 'antd'

class Stimulus extends Component {
  render() {
    const { Text } = typography
    let progress = ['#FF9C52', '#4BAEA0', '#f42733', '0', '0', '0']
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
    let stimulus = [1, 2, 3, 4, 5]
    stimulus = stimulus.map(data => {
      if (data) {
        return (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Text>
              stimulus {data} &nbsp;{progress}
            </Text>
          </div>
        )
      }
      return null
    })
    return stimulus
  }
}
export default Stimulus
