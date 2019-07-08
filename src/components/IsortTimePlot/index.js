import React from 'react';
import styled from 'styled-components';
import BarChart from '../../utilities/d3BarChart';

const Section = styled.div`
  width: 100%;
  margin-top: 20px;

  form {
    input {
      height: 20px;
      margin: 0px 5px;
      padding: 0px 5px;
      border: solid 1px black;
      border-radius: 5px;
    }

    button {
      cursor: pointer;
      padding: 5px 10px;
      border: none;
      border-radius: 4px;

      &:hover {
        background-color: darkgray;
      }
    }
  }

  table {
    margin-top: 30px;
    width: 90%;
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
      &:hover {
        background-color: #f5f5f5;
      }
    }
  }
`;

export default class IsortTimePlot extends React.Component {
  
  constructor(props){
    super(props);
    // Initializating the premutation module:
    
    this.state = {
      average: 0,
      n: 5,
      steps: [],
      permutations: 0,
      loading: true,
    }

  }

  componentDidMount() {
    this.runSimulation();
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
          steps+=3;
          
      }
      steps++;

      v[j+1] = x;
      steps+=4;

    }

    steps ++;
    return steps; 
  }

  runSimulation = (e) => {
    if (e) e.preventDefault();
    this.setState((props, prevState) => ({loading: true}));
    const perms = this.findPerms();
    const { average, steps } = this.countSteps(perms);
    let permutations = 0
    steps.forEach((item) => permutations += item.concurrency)
    this.setState((props, prevState) => ({
      average,
      steps,
      permutations,
      loading: false
    }));
  }
  
  findPerms = () => {
    const base = [];
    let cases = [];
    for (let i = 1; i <= this.state.n; i++) {
      base.push(i);
    }
    const permutations = this.perm(base, cases);
    return permutations;
  }

  countSteps = (permutations) => {
    let totalSteps = 0;
    let steps = [];
    let min = 10001;
    let max = 0;
    for (let i = 0; i < 1001; i++) {
      steps.push({concurrency: 0, probability: 0, value: i})
    }

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

    steps.forEach((item) => {
      if(item.concurrency && min > parseInt(item.value)) min = item.value
      if(item.concurrency && max < parseInt(item.value)) max = item.value 
    })

    steps = steps.filter(step => {
      return (parseInt(step.value) >= min && parseInt(step.value) <= max)
    })
    const average = totalSteps / permutations.length;
    return {average: average, steps: steps};
  }

  perm = (base, cases) => {
    let ret = [];

    for (let i = 0; i < base.length; i++) {
      let rest = this.perm(base.slice(0, i).concat(base.slice(i + 1)), cases);

      if(!rest.length) {
        ret.push([base[i]])
      } else {
        cases[rest.length] ? cases[rest.length] = cases[rest.length] + 1 : cases[rest.length] = 1;
        for(let j = 0; j < rest.length; j++) {
          ret.push([base[i]].concat(rest[j]))
        }
      }
    }
    return ret;
  }
  
  handleChange = (event) => {
    this.setState({n: event.target.value});
  }

  render() {
    return(
      <Section>
        <h2>Swaps</h2>
        <p>Número de swaps hechos en todas las permutaciones de un arreglo de tamaño n.</p>
        <form>
          <label>
            Enter n: 
            <input
              type='number'
              name='n'
              value={this.state.n}
              onChange={this.handleChange}/>
          </label>
          <button type='submit' onClick={this.runSimulation}>Run</button>
        </form>
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
        <h4>Promedio de pasos hechos: {this.state.average}</h4>
        {!this.state.loading ? 
          <BarChart 
            data={this.state.steps}
            legend={{ n: this.state.n, average: this.state.average, permutations: this.state.permutations}}
            config={this.state.barChartConfig}
          /> : null}
      </Section>
    )
  }
};