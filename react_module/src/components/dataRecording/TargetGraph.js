/* eslint-disable react/no-unused-state */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-unused-vars */
/* eslint-disable no-lone-blocks */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/jsx-indent */
/* eslint-disable array-callback-return */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-unknown-property */
import React from 'react'
import ChartistGraph from 'react-chartist'
import ChartistTooltip from 'chartist-plugin-tooltips-updated'
import { Collapse } from 'antd'
import { connect } from 'react-redux'

const { Panel } = Collapse

const smilOptions = {
  low: 0,
  plugins: [ChartistTooltip({ anchorToPoint: false, appendToBody: true, seriesName: false })],
  seq: 1,
}

const smilListener = {
  created() {
    smilOptions.seq = 0
  },
  draw(data) {
    const delays = 5
    const durations = 50

    if (data.type === 'line') {
      smilOptions.seq += 1
      data.element.animate({
        opacity: {
          begin: smilOptions.seq * delays + 1e3,
          dur: durations,
          from: 0,
          to: 1,
        },
      })
    } else if (data.type === 'label' && data.axis === 'x')
      data.element.animate({
        y: {
          begin: smilOptions.seq * delays,
          dur: durations,
          from: data.y + 100,
          to: data.y,
          easing: 'easeOutQuart',
        },
      })
    else if (data.type === 'label' && data.axis === 'y')
      data.element.animate({
        x: {
          begin: smilOptions.seq * delays,
          dur: durations,
          from: data.x - 100,
          to: data.x,
          easing: 'easeOutQuart',
        },
      })
    else if (data.type === 'point')
      data.element.animate({
        x1: {
          begin: smilOptions.seq * delays,
          dur: durations,
          from: data.x - 10,
          to: data.x,
          easing: 'easeOutQuart',
        },
        x2: {
          begin: smilOptions.seq * delays,
          dur: durations,
          from: data.x - 10,
          to: data.x,
          easing: 'easeOutQuart',
        },
        opacity: {
          begin: smilOptions.seq * delays,
          dur: durations,
          from: 0,
          to: 1,
          easing: 'easeOutQuart',
        },
      })
    else if (data.type === 'grid') {
      const pos1Animation = {
        begin: smilOptions.seq * delays,
        dur: durations,
        from: data[`${data.axis.units.pos}1`] - 30,
        to: data[`${data.axis.units.pos}1`],
        easing: 'easeOutQuart',
      }
      const pos2Animation = {
        begin: smilOptions.seq * delays,
        dur: durations,
        from: data[`${data.axis.units.pos}2`] - 100,
        to: data[`${data.axis.units.pos}2`],
        easing: 'easeOutQuart',
      }
      const ctAnimations = {}
      ctAnimations[`${data.axis.units.pos}1`] = pos1Animation
      ctAnimations[`${data.axis.units.pos}2`] = pos2Animation
      ctAnimations.opacity = {
        begin: smilOptions.seq * delays,
        dur: durations,
        from: 0,
        to: 1,
        easing: 'easeOutQuart',
      }
      data.element.animate(ctAnimations)
    }
  },
}

@connect(({ datarecording }) => ({ datarecording }))
class TargetGraph extends React.Component {
  state = {}

  render() {
    const {
      datarecording: {
        TargetList,
        TargetInitialValue,
        TargetListLength,
        TargetActiveKey,
        Correct,
        Incorrect,
      },
    } = this.props

    const smilData = {
      labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      series: [Correct, Incorrect],
    }

    if (TargetList.length < 1) {
      return <p>Loading...</p>
    }

    return (
      <>
        <Collapse bordered={false} defaultActiveKey={['1', '3']}>
          <Panel header="Target Video" key="1">
            {/* {TargetList.length > 0 ?

                  TargetList[TargetInitialValue-1].node.videos.edges.length > 0 ?

          
                    TargetList[TargetInitialValue-1].node.videos.edges.map((item) => {
                      <iframe width="100%" height="200" title="0" src={item.url} />
                    })
                  :
                  <p>No video linked to this target</p>
                :
                  <p>No video linked to this target</p>
                } */}

            <iframe
              width="100%"
              height="200"
              title="0"
              src="https://player.vimeo.com/video/401778268/3de9225a70"
              webkitallowfullscreen
              mozallowfullscreen
              allowfullscreen
            />
          </Panel>
          <Panel header="Target Instruction" key="2">
            <div
              dangerouslySetInnerHTML={{
                __html: TargetList[TargetInitialValue - 1].node.targetInstr,
              }}
            />
          </Panel>
          <Panel header="Target Response Graph" key="3">
            <ChartistGraph
              className="height-300 chart-smil-animations"
              data={smilData}
              options={smilOptions}
              type="Line"
              listener={smilListener}
            />
          </Panel>
        </Collapse>
      </>
    )
  }
}

export default TargetGraph
