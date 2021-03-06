import React, { Component } from 'react'
import { typography } from 'antd'

class Staps extends Component {
  render() {
    const { Text } = typography
    let progress = ['#FF9C52', '#4BAEA0', '#FF8080', '0', '0', '0']
    progress = progress.map(data => {
      if (data) {
        return (
          <span
            style={{
              height: '15px',
              display: 'inline-block',
              lineHeight: '12px',
              border: '1px solid #F5F5F5',
              backgroundColor: data,
              paddingLeft: '25px',
              borderRadius: '2px',
              marginRight: '5px',
            }}
          >
            &nbsp;
          </span>
        )
      }
      return null
    }, {})
    let staps = [1, 2, 3, 4, 5]
    staps = staps.map(data => {
      if (data) {
        return (
          <div style={{ marginTop: '5px' }}>
            <Text>
              Step {data} &nbsp;{progress}
            </Text>
          </div>
        )
      }
      return null
    })
    return staps
  }
}
export default Staps
