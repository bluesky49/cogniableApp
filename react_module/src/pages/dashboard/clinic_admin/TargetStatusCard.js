/* eslint-disable camelcase */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/sort-comp */
/* eslint-disable import/order */
/* eslint-disable class-methods-use-this */
/* eslint-disable prefer-const */
/* eslint-disable spaced-comment */
/* eslint-disable react/self-closing-comp */

import React from 'react'
import { DatePicker, Typography, Select } from 'antd'
import gql from 'graphql-tag'
import client from '../../../apollo/config'
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import Moment from 'moment';

const { Title } = Typography
const { Option } = Select
const { RangePicker } = DatePicker;
/* Chart code */
// Themes begin
am4core.useTheme(am4themes_animated);

class TargetStatusCard extends React.Component {
  constructor(props) {
    super(props)
    this.CreateChart = this.CreateChart.bind(this);
    this.DateChange = this.DateChange.bind(this);

    this.state = {
      graphdata:[],
      graphstartdate: Moment(Date.now()).subtract(14, 'days').format('YYYY-MM-DD').toString(),
      graphenddate:Moment(Date.now()).format('YYYY-MM-DD').toString(),
      loading:false
    }

  }

CreateChart(studentId, start_date, end_date) {

  client.query({
      query: gql`query {
        target_allocated:targetAllocates(date_Gte:"${start_date}", date_Lte:"${end_date}") {
        totalCount
        }
        mastered_targets:dashboardGraph(targetStatusId:"U3RhdHVzVHlwZTox", dateGte:"${start_date}", dateLte:"${end_date}") {
         tarCount
        }
        inmaintenance_targets:dashboardGraph(targetStatusId:"U3RhdHVzVHlwZTo1", dateGte:"${start_date}", dateLte:"${end_date}") {
         tarCount
        }
    }`
    })
    .then(result => {
      let chartdata = [];
      chartdata.push({
        'status':'Target Allocated',
        'value':result.data.target_allocated.totalCount
      })
      chartdata.push({
        'status':'Mastered Targets',
        'value':result.data.mastered_targets.tarCount
      })
      chartdata.push({
        'status':'Inmaintenance Targets',
        'value':result.data.inmaintenance_targets.tarCount
      })

      console.log(chartdata)
 try {
    let chart = am4core.create("chartdiv", am4charts.XYChart);
    chart.data = chartdata;

    chart.padding(40, 40, 40, 40);

    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.dataFields.category = "status";
    categoryAxis.renderer.minGridDistance = 60;
    categoryAxis.renderer.inversed = true;
    categoryAxis.renderer.grid.template.disabled = true;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.extraMax = 0.1;

    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.categoryX = "status";
    series.dataFields.valueY = "value";
    series.tooltipText = "{valueY.value}"
    series.columns.template.strokeOpacity = 0;
    series.columns.template.column.cornerRadiusTopRight = 10;
    series.columns.template.column.cornerRadiusTopLeft = 10;
    //series.interpolationDuration = 1500;
    //series.interpolationEasing = am4core.ease.linear;
    let labelBullet = series.bullets.push(new am4charts.LabelBullet());
    labelBullet.label.verticalCenter = "bottom";
    labelBullet.label.dy = -10;
    labelBullet.label.text = "{values.valueY.workingValue.formatNumber('#.')}";

    chart.zoomOutButton.disabled = true;

    // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
    series.columns.template.adapter.add("fill", function (fill, target) {
     return chart.colors.getIndex(target.dataItem.index);
    });

categoryAxis.sortBySeries = series;
}
catch(err) {
  console.log(err)
}
  })

}


 DateChange(date)
 {
   this.setState({
     graphstartdate:Moment(date[0]).format('YYYY-MM-DD').toString(),
     graphenddate:Moment(date[1]).format('YYYY-MM-DD').toString()
   })
   this.CreateChart("U3R1ZGVudFR5cGU6MTYz", Moment(date[0]).format('YYYY-MM-DD').toString(), Moment(date[1]).format('YYYY-MM-DD').toString())
 }


  componentDidMount() {
      this.state = {
        graphstartdate: Moment(Date.now()).format('YYYY-MM-DD').toString(),
        graphenddate:Moment(Date.now()).subtract(14, 'days').format('YYYY-MM-DD').toString()
      }
    this.CreateChart("U3R1ZGVudFR5cGU6MTYz", Moment(Date.now()).subtract(14, 'days').format('YYYY-MM-DD').toString(), Moment(Date.now()).format('YYYY-MM-DD').toString())

}

render() {
  const { graphstartdate, graphenddate } = this.state;

  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1px solid #E4E9F0',
        borderRadius: 10,
        padding: '15px 23px',
      }}
    >
      <div
        style={{
          display: 'flex',
        }}
      >
        <Title
          style={{
            fontWeight: 600,
            fontSize: 20,
            lineHeight: '27px',
          }}
        >
          Target Status
        </Title>

        <RangePicker
          style={{
            marginLeft: 'auto',
            width: 300,
            marginRight: 31
          }}
          defaultValue={[Moment(graphstartdate, 'YYYY-MM-DD'), Moment(graphenddate, 'YYYY-MM-DD')]}
          format='YYYY-MM-DD'
          onChange={this.DateChange}

        />
      </div>
      <div id="chartdiv" style={{height: 400}}></div>
    </div>
  )
}
}

export default TargetStatusCard;
