import React, { useState, useEffect } from 'react'
import { Button, Select } from 'antd'
import Drawer from 'rc-drawer'
import TargetAreaContent from './TargetAreaContent'

const { Option } = Select

const DomainContent = ({ targetAreas }) => {
  const [open, setOpen] = useState(false)
  const [selectTargetArea, setSelectTargetArea] = useState(
    targetAreas[0] ? targetAreas[0].node : null,
  )
  const [selectValue, setSelectValue] = useState(selectTargetArea ? selectTargetArea.Area : null)

  const handelAddTargetAreaDrawer = () => {
    setOpen(state => !state)
  }

  const handleSelectChange = value => {
    const newSelectTargetArea = targetAreas.find(target => target.node.id === value).node
    setSelectTargetArea(newSelectTargetArea)
  }

  useEffect(() => {
    setSelectTargetArea(targetAreas[0] ? targetAreas[0].node : null)
  }, [targetAreas])

  useEffect(() => {
    setSelectValue(selectTargetArea ? selectTargetArea.Area : null)
  }, [selectTargetArea])

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Select
          placeholder="Target Area"
          style={{
            width: 200,
            borderRadius: 4,
            marginRight: 38,
          }}
          value={selectValue}
          onChange={handleSelectChange}
          size="large"
        >
          {targetAreas.map(({ node }) => {
            return (
              <Option key={node.id} value={node.id}>
                {node.Area}
              </Option>
            )
          })}
        </Select>
        <Button
          type="primary"
          style={{
            height: 40,
            width: 200,
            marginRight: 38,
            background: ' #0B35B3',
            fontSize: 16,
            lineHeight: '22px',
          }}
        >
          Search
        </Button>
        <Button
          type="link"
          style={{
            fontSize: 14,
            lineHeight: '19px',
          }}
          onClick={handelAddTargetAreaDrawer}
        >
          Add Target Area
        </Button>
      </div>
      <div style={{ marginTop: 20 }}>
        {selectTargetArea && <TargetAreaContent targetArea={selectTargetArea} />}
      </div>
      <Drawer
        handler={false}
        className="drawer2"
        levelMove={100}
        width="500px"
        open={open}
        placement="right"
        onMaskClick={handelAddTargetAreaDrawer}
        onClose={handelAddTargetAreaDrawer}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            background: '#fff',
          }}
        >
          hello
        </div>
      </Drawer>
    </>
  )
}

export default DomainContent
