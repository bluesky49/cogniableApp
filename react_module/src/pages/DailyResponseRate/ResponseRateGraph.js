/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-shadow */
/* eslint-disable array-callback-return */
import React, { useState, useEffect } from 'react'
import { Table, Button, Drawer, Form, Select, DatePicker, notification } from 'antd'
import { useQuery } from 'react-apollo'
import filterIcon from 'icons/filter.png'
import { ResponsiveLine } from '@nivo/line'
import groupObj from '@hunters/group-object'
import { LineChartOutlined } from '@ant-design/icons'
import moment from 'moment'
import { RESPONSE_RATE, RESPONSE_RATE_FILTER_OPT } from './query'
import './form.scss'

const { Option } = Select
const { RangePicker } = DatePicker

export default Form.create()(() => {
  const [selectTarget, setSelectTarget] = useState()
  const studentId = localStorage.getItem('studentId')
  const [mydata, setMydata] = useState()
  const [dateRange, setDateRange] = useState([moment().startOf('week'), moment().endOf('week')])
  const [filterDrawer, setFilterDrawer] = useState(false)
  const [columns, setColumns] = useState([])
  const [status, setStatus] = useState()
  const [type, setType] = useState('VGFyZ2V0RGV0YWlsVHlwZTox')
  const [graphData, setGraphData] = useState([
    {
      color: 'hsl(335, 70%, 50%)',
      data: [],
    },
  ])

  const { data, error, loading } = useQuery(RESPONSE_RATE, {
    variables: {
      studentId,
      startDate: moment(dateRange[0]).format('YYYY-MM-DD'),
      endDate: moment(dateRange[1]).format('YYYY-MM-DD'),
      status,
      type,
    },
  })

  const start = dateRange[0]
  const end = dateRange[1]

  const days = []
  let day = start

  while (day <= end) {
    days.push(day.toDate())
    day = day.clone().add(1, 'd')
  }

  useEffect(() => {
    if (data) {
      if (data.responseRate.length > 0) {
        const value = groupObj.group(data.responseRate, 'targetName')
        setMydata(value)
      } else {
        setMydata({})
        setSelectTarget(null)
      }
    }
    if (error) {
      notification.error({
        message: 'Opps their are something wrong to load the data',
      })
    }
  }, [data, error])

  const { data: filterOptions, error: filterOptErr, loading: filterOptLoading } = useQuery(
    RESPONSE_RATE_FILTER_OPT,
  )

  useEffect(() => {
    if (dateRange && mydata) {
      const myColumns = [
        {
          key: 'targetName',
          title: 'Target name',
          fixed: 'left',
          width: '400px',
          render(obj) {
            return (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              >
                {obj.targetName}
                <Button type="link" onClick={() => handleSelectTarget(obj)}>
                  <LineChartOutlined style={{ fontSize: 30, color: 'rgb(229, 132, 37)' }} />
                </Button>
              </div>
            )
          },
        },
      ]
      days.map(dateStr => {
        myColumns.push({
          key: dateStr,
          title: moment(dateStr).format('DD-MM-YYYY'),
          width: '120px',
          render(obj) {
            let viewValue
            if (mydata[obj.targetName]) {
              mydata[obj.targetName].forEach(data => {
                if (data.sessionDate === moment(dateStr).format('DD MMMM')) {
                  viewValue = obj.perTar ? obj.perTar : 0
                } else {
                  viewValue = 0
                }
              })
            }

            return <div>{viewValue}</div>
          },
        })
      })
      setColumns(myColumns)
      if (selectTarget && mydata.length > 0) {
        getGraphData(selectTarget)
      }
    }
  }, [dateRange, mydata])

  const getGraphData = targetName => {
    const targetData = mydata[targetName]
    const graphAxixData = []
    days.map(date => {
      let yData
      targetData.map(data => {
        if (data.sessionDate === moment(date).format('YYYY-MM-DD')) {
          yData = data.perTar ? data.perTar : 0
        } else {
          yData = 0
        }
      })
      graphAxixData.push({
        x: moment(date).format('DD MMMM'),
        y: yData,
      })
    })
    setGraphData(state => {
      state[0].data = graphAxixData
      return state
    })
  }

  const handleSelectTarget = ({ targetName }) => {
    setSelectTarget(targetName)
    getGraphData(targetName)
  }

  return (
    <div style={{ height: 400 }}>
      {selectTarget && (
        <ResponsiveLine
          data={graphData}
          itemWidth={80}
          itemHeight={20}
          margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
          xScale={{ type: 'point' }}
          yScale={{
            type: 'linear',
            min: 'auto',
            max: 'auto',
            stacked: true,
            reverse: false,
          }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            orient: 'bottom',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: `Graph For Target: ${selectTarget}`,
            legendOffset: 36,
            legendPosition: 'left',
          }}
          axisLeft={{
            orient: 'left',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Target Completion (%)',
            legendOffset: -40,
            legendPosition: 'middle',
          }}
          colors={{ scheme: 'nivo' }}
          pointSize={10}
          pointColor={{ theme: 'background' }}
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }}
          pointLabel="y"
          pointLabelYOffset={-12}
          useMesh
        />
      )}

      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          margin: '20px 0',
        }}
      >
        <div>
          <RangePicker size="large" value={dateRange} onChange={v => setDateRange(v)} />
        </div>
        <Button type="link" onClick={() => setFilterDrawer(true)}>
          <img style={{ width: 30, height: 30 }} src={filterIcon} alt="filter icon" />
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={data?.responseRate}
        bordered
        loading={loading}
        scroll={{
          x: 'max-content',
        }}
      />

      <Drawer
        visible={filterDrawer}
        onClose={() => setFilterDrawer(false)}
        width={440}
        title="Filter Result"
      >
        <div style={{ padding: '0px 30px' }}>
          {filterOptLoading && <h5>Loading...</h5>}
          {filterOptErr && <p>Failed to load filter options</p>}
          {filterOptions && (
            <Form>
              <Form.Item label="Type">
                <Select
                  size="large"
                  value={type}
                  onChange={v => {
                    setType(v)
                  }}
                  placeholder="Filter by target type"
                >
                  {filterOptions.types.map(({ id, typeTar }) => (
                    <Option key={id} value={id}>
                      {typeTar}
                    </Option>
                  ))}
                </Select>
                ,
              </Form.Item>
              <Form.Item label="Target Status">
                <Select
                  size="large"
                  value={status}
                  onChange={v => setStatus(v)}
                  mode="multiple"
                  placeholder="Filter by target status"
                >
                  {filterOptions.targetStatus.map(({ id, statusName }) => (
                    <Option key={id} value={id}>
                      {statusName}
                    </Option>
                  ))}
                </Select>
                ,
              </Form.Item>
            </Form>
          )}
        </div>
      </Drawer>
    </div>
  )
})
