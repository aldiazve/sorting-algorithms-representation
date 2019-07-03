import React from 'react';
import styled from 'styled-components';
import BarChart from '../../utilities/d3BarChart';
const d3 = window.d3; 

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
      background-color: lightslategrey;
    }

    th, td {
      padding: 5px;
      border: 1px solid black;
    }

    tr {
      &:hover {
        background-color: #f5f5f5;
      }
    }
  }
`;

export default class IsortCompPlot extends React.Component {
  
  constructor(props){
    super(props);
    // Initializating the premutation module:
    this.state = {
      average: 0,
      npermut: 0,
      n: 4,
      steps: [],
    }
  }

  componentDidMount() {
    const perms = this.findPerms();
    const { average, steps } = this.countSteps(perms);
    this.setState({average, steps})
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

  onRunClick = (e) => {
    e.preventDefault();
    const perms = this.findPerms();
    const { average, steps } = this.countSteps(perms);
    this.setState({average, steps})
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
          <button type='submit' onClick={this.onRunClick}>Run</button>
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
        <svg/>
        <h4>Promedio de swaps hechos: {this.state.average}</h4>
        <BarChart></BarChart>
      </Section>
    )
  }
};