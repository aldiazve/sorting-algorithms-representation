import React from 'react';
import styled from 'styled-components';
const d3 = window.d3;

const BarChartContainer = styled('svg')`
  width: 100%;
  height: auto;

  font-size: 14px;

  .axis path,
  .axis line {
    fill: none;
    stroke: #000;
    shape-rendering: crispEdges;
  }

  .bar {
    fill: #435058;
  }

  .bar:hover {
    fill: #BCB8B1 ;
  }

  .x.axis path {
    display: none;
  }
`;

const margin = {top: 40, right: 20, bottom: 30, left: 25};
const width = 960 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

const x = d3.scaleBand()
          .range([0, width])
          .padding(0.1);

const y = d3.scaleLinear()
          .range([height, 0]);


export default class BarChart extends React.Component {
  
  constructor(props) {
    super(props)
      const { data } = props
      this.state = {
        data,
        id : 'd3' + Math.random().toString().substr(2),
      }
  }

  componentDidMount() {
    this.drawChart();
  }



  componentDidUpdate(prevProps){
    if(prevProps.data !== this.props.data){
      this.setState({          
          data: this.props.data
      });
      this.drawChart();
    }
  }


  drawChart = () => {
    // Clearing the previous chart
    d3.selectAll('.' + this.state.id + " > *").remove();

    const svg = d3.select('.' + this.state.id)
    .attr("viewBox", "0 0 1005 550")
    .attr("preserveAspectRatio", "xMidYMid meet")

    const g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const data = this.props.data

    data.forEach(function(d) {
      d.value = +d.value;
    });

    x.domain(data.map(function(d) { return d.value; }));
    y.domain([0, 1]);

    g.append("g")
        .attr("class", "x axis")
        .style("font-size", 14)
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    g.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y))

    g.append("g")
      .append("text")
        .attr("y", 6)
        .attr("dy", "20px")
        .attr("transform", "rotate(-90)")
        .style("font-size", 20)
        .style("text-anchor", "end")
        .attr("font-weight", "bold")
        .text("Probability");

    g.append("g")
      .append("text")
        .attr("x", width - 24)
        .attr("y", height + 40)
        .attr("dx", "20px")
        .style("font-size", 20)
        .style("text-anchor", "end")
        .attr("font-weight", "bold")
        .text("Steps");

    g.selectAll(".bar")
        .data(data)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.value); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(d.probability); })
        .attr("height", function(d) { return height - y(d.probability); })


    const legend = g.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 20)
      .attr("text-anchor", "end")
    .selectAll("g")
    .data(Object.keys(this.props.legend))
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .attr("text-align", "right")
      .attr("font-weight", "bold")
      .text((item) => (item + ': ' + this.props.legend[item]));
  }

  render() {
    return(
      <BarChartContainer className={this.state.id}/>
    )
  }
};