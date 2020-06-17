/* eslint-disable no-restricted-globals */
import React from 'react'
import { Icon, Typography, InputNumber, Input, Button } from 'antd'
import { PlusOutlined, MinusOutlined } from '@ant-design/icons'
// import styles from './style.module.scss'

const { Text } = Typography
const NumberCard = ({ title, unit = '', number, setNumber, maxValue = 100 }) => {
  const onChange = type => {
    if (type === 'i' && (number+1) < maxValue) setNumber(number + 1)
    else if (type === 'd' && (number-1) > -1) setNumber(number - 1)
  }

  const setNumberValue = (num) => {
    if(num === ''){
      setNumber(0)
    }
    else if(isNaN(num)){setNumber(0)}
    else if (num < maxValue){
      setNumber(num)
    }
  }

  return (
    <div style={{margin:0, display: 'flex', justifyContent: 'space-between', fontSize: '16px'}}>
      <div>
        <Text style={{fontSize: '16px'}}>{title}</Text>
      </div>

      <div>
        {/* <Text style={{height: '30px !important'}}>
          <Icon type="minus" onClick={() => onChange('d')} />
          <InputNumber size="large" min={0} max={25} value={number} onChange={setNumberValue} style={{width:'100px', height: '30px !important'}} />
          <Icon type="plus" onClick={() => onChange('i')} />
        </Text> */}

        <Button
          style={{ marginLeft: 'auto', marginRight: 10 }}
          onClick={() => onChange('d')}
        >
          <MinusOutlined />
        </Button>
        <Input
          type="number"
          value={number}
          min={0} 
          max={maxValue}
          style={{ width: 70, marginRight: 10 }}
          onChange={e => setNumberValue(parseInt(e.target.value, 10))}
        />
        <Button onClick={() => onChange('i')}>
          <PlusOutlined />
        </Button>

      </div>
    </div>
  )
}

export default NumberCard
