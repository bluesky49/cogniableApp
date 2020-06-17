/* eslint-disable camelcase */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/sort-comp */
/* eslint-disable prefer-const */
/* eslint-disable no-var */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react/jsx-no-undef */



import React from 'react'
import ChartistGraph from 'react-chartist'
import gql from 'graphql-tag'
import { useQuery, useMutation } from 'react-apollo'
/* Imports */
import { Select, Empty } from 'antd'

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import Moment from 'moment';
import './performenceGap.scss'
import client from '../../../apollo/config'

am4core.useTheme(am4themes_animated);



const biPolarBarChartData = {
  labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10'],
  series: [[1, 2, 4, 8, 6, -2, -1, -4, -6, -2]],
}

const biPolarBarChartOptions = {
  height: 260
}

class PerformenceGrap extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      mastertarget: [],
      loading: false
    }
    this.MasterGraph = this.MasterGraph.bind(this);
  }

  MasterGraph(dateGte) {
    var gtedate = Moment(Date.now()).subtract(dateGte, 'days').format('YYYY-MM-DD').toString();
    const studentId = localStorage.getItem('studentId')

    client.query({
      query: gql`query {
          masterTargetGraph(studentId:${studentId}, targetStatus:"U3RhdHVzVHlwZTox", dateGte:"${gtedate}") {
              date
              tarCount
          }
      }`
    })
      .then(result => {
        let res_list = []

        let tar_count = 0;

        for (let i in result.data.masterTargetGraph) {
          tar_count += result.data.masterTargetGraph[i].tarCount;
          res_list.push({
            "date": result.data.masterTargetGraph[i].date,
            "value": tar_count
          })
        }
        this.setState({
          mastertarget: res_list,
          loading: false,
        })

        if (res_list.length > 0) {
          let chart = am4core.create("chartdiv", am4charts.XYChart);

          chart.data = res_list;

          // Set input format for the dates
          chart.dateFormatter.inputDateFormat = "yyyy-MM-dd";

          // Create axes
          let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
          let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

          // Create series
          let series = chart.series.push(new am4charts.LineSeries());
          series.dataFields.valueY = "value";
          series.dataFields.dateX = "date";
          series.tooltipText = "{value}"
          series.strokeWidth = 2;
          series.minBulletDistance = 15;

          // Drop-shaped tooltips
          series.tooltip.background.cornerRadius = 20;
          series.tooltip.background.strokeOpacity = 0;
          series.tooltip.pointerOrientation = "vertical";
          series.tooltip.label.minWidth = 40;
          series.tooltip.label.minHeight = 40;
          series.tooltip.label.textAlign = "middle";
          series.tooltip.label.textValign = "middle";

          // Make bullets grow on hover
          let bullet = series.bullets.push(new am4charts.CircleBullet());
          bullet.circle.strokeWidth = 2;
          bullet.circle.radius = 4;
          bullet.circle.fill = am4core.color("#fff");

          let bullethover = bullet.states.create("hover");
          bullethover.properties.scale = 1.3;

          // Make a panning cursor
          chart.cursor = new am4charts.XYCursor();
          chart.cursor.behavior = "panXY";
          chart.cursor.xAxis = dateAxis;
          chart.cursor.snapToSeries = series;

          dateAxis.keepSelection = true;
        }
      })
  }

  componentDidMount() {
    this.state = {
      loading: true
    }

    this.MasterGraph("7")
  }

  render() {
    const { mastertarget } = this.state;
    console.log(mastertarget)
    return (
      <div className="root">
        <div>
          <Select style={{ width: 110 }} defaultValue="7" onChange={this.MasterGraph}>
            <Option value="7">Week</Option>
            <Option value="30">Month</Option>
            <Option value="365">Year</Option>
          </Select>
        </div>
        <div id="chartdiv" style={{ height: 300 }}>
          <Empty />
        </div>
      </div>
    )
  }
}

export default PerformenceGrap;
