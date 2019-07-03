import React from 'react';
import styled from 'styled-components'
import * as data from './data.tsv'
const d3 = window.d3;

const BarChartContainer = styled('div')`

  svg {
    width: 960px;
    heigth: 500px;

    .axis path,
    .axis line {
      fill: none;
      stroke: #000;
      shape-rendering: crispEdges;
    }

    .bar {
      fill: orange;
    }

    .bar:hover {
      fill: orangered ;
    }

    .x.axis path {
      display: none;
    }

    .d3-tip {
      line-height: 1;
      font-weight: bold;
      padding: 12px;
      background: rgba(0, 0, 0, 0.8);
      color: #fff;
      border-radius: 2px;
    }

    .d3-tip:after {
      box-sizing: border-box;
      display: inline;
      font-size: 10px;
      width: 100%;
      line-height: 1;
      color: rgba(0, 0, 0, 0.8);
      position: absolute;
      text-align: center;
    }

    .d3-tip.n:after {
      margin: -1px 0 0 0;
      top: 100%;
      left: 0;
    }
  }
`;
const margin = {top: 40, right: 20, bottom: 30, left: 40};
const width = 960 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

const formatPercent = d3.format(".0%");

const x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

const y = d3.scale.linear()
    .range([height, 0]);

const xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

const yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(formatPercent);

const tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<strong>Frequency:</strong> <span style='color:red'>" + d.frequency + "</span>";
  })

export default class BarChart extends React.Component {
  
  constructor(props) {
    super(props)

    this.state = {
      id : 'd3' + Math.random().toString().substr(2),
    }
  }

  componentDidMount() {
    const svg = d3.select('.' + this.state.id).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.call(tip);

    d3.tsv(data, this.type, function(error, data) {
      x.domain(data.map(function(d) { return d.letter; }));
      y.domain([0, d3.max(data, function(d) { return d.frequency; })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Frequency");

    svg.selectAll(".bar")
        .data(data)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.letter); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d.frequency); })
        .attr("height", function(d) { return height - y(d.frequency); })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)
    });
  }

  type = (d) => {
    d.frequency = +d.frequency;
    return d;
  }

  render() {
    return(
      <BarChartContainer>
        <div className={this.state.id}/>
      </BarChartContainer>
    )
  }
};