import React from 'react';
import styled from 'styled-components';
import BarChart from '../../utilities/d3BarChart';

const Section = styled.div`
  width: 100%;
  margin-top: 20px;
`;

const TableContainer = styled.div`
  width: 100%;
  height: 300px;
  overflow-y: auto;

  table {
    margin-top: 30px;
    width: 100%;
    height: auto;
    text-align: center;
    border-collapse: collapse;
    padding: 5px;
    border-spacing: 0px;

    border: 1px solid black;
    
    th {
      background-color: #C2D076;
    }

    th, td {
      padding: 5px;
      border: 1px solid #435058;
    }

    tr {
      height: 30px;

      &:hover {
        background-color: #f5f5f5;
      }
    }
  }
`

export default class IsortCompPlot extends React.Component {
  
  constructor(props){
    super(props);
    // Initializating the premutation module:
    const { permutations, n } = props
    this.state = {
      permutations,
      n,
      average: 0,
      steps: [],
    }
  }

  componentDidMount() {
    const { average, steps } = this.countSteps(this.state.permutations);
     this.setState((props, prevState) => ({
      average,
      steps,
    }));
  }
  // Translation of the origial java function to javascript.
  isortSteps = (aux) => {
    let steps = 0;
    let i,j,x;
    
    //Making a shallow clone
    let v = aux.slice();

    for(i = 1; i < v.length; i++) {
      x = v[i];
      j = i-1;
      
      while( (j > -1)&& (v[j] > x)  ){
          v[j+1] = v[j];
          j--;  
          steps+=1;
          
      }
      if (j !== -1) steps++;
      v[j+1] = x;
    }
    return steps; 
  }

  countSteps = (permutations) => {
    let totalSteps = 0;
    let steps = {}
    for (let i = 0; i < permutations.length; i++) {
      let singleCaseSteps = this.isortSteps(permutations[i]);
      totalSteps += singleCaseSteps;
      steps[singleCaseSteps] ? steps[singleCaseSteps].concurrency = steps[singleCaseSteps].concurrency + 1 : steps[singleCaseSteps] = {concurrency : 1};
    }
    steps = Object.keys(steps).map((key, index) => {
      steps[key].probability = steps[key].concurrency / permutations.length;
      steps[key].value = key;
      return steps[key]
    })
    const average = totalSteps / permutations.length;
    return {average: average, steps: steps};
  }

  render() {
    return(
      <Section>
        <h2>Comparations</h2>
        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>P()</th>
                <th>Probability</th>
                <th>Concurrency</th>
              </tr>
            </thead>
            <tbody>
              {this.state.steps.map((item) => {
                return <tr key={item.value}>
                  <td>P({item.value})</td>
                  <td>{item.probability}</td>
                  <td>{item.concurrency}</td>
                </tr>
              })}
            </tbody>
          </table>
        </TableContainer>
        <h4>Promedio de pasos hechos: {this.state.average}</h4>
        <BarChart 
          data={this.state.steps}
          legend={{ n: this.state.n, average: this.state.average, permutations: this.state.permutations.length}}
          config={this.state.barChartConfig}
        />
      </Section>
    )
  }
};