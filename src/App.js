import React from 'react';
import styled from 'styled-components'

// Sorting components
import IsortCompPlot from './components/IsortCompPlot';
import IsortTimePlot from './components/IsortTimePlot';
import IsortWhileQuestionPlot from './components/IsortWhileQuestionPlot';


const AppContainer = styled.div`
  width: 100vw;
  padding: 0px 10%;
  box-sizing: border-box;
  text-align: center;
`

const Control = styled.div`
  width: 80%;
  text-align: left;

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
      border: 1px solid gray;
      border-radius: 4px;

      &:hover {
        background-color: darkgray;
      }
    }
  }
`

const SortingComponents = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  align-items: center;
  box-sizing: border-box;

`

export default class App extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      n: 4,
      permutations: null,
      loading: true,
    }
  }

  handleChange = (event) => {
    this.setState({n: event.target.value});
  }

  runSimulation = (e) => {
    if (e) e.preventDefault();
    this.setState({loading: true}, () => {
      const permutations = this.findPerms();
      this.setState({permutations, loading: false})
    });
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

  render() {
    return (
      <AppContainer>
        <h1>Sorting Algorithms Representation</h1>
        <h3>Insertion Sort</h3>
        <Control>
          <p>Ingrese el tamaño del array sobre el cual permutará:</p>
          <form>
            <label>
              N: 
              <input
                type='number'
                name='n'
                value={this.state.n}
                onChange={this.handleChange}/>
            </label>
            <button type='submit' onClick={this.runSimulation}>Run</button>
          </form>
        </Control>
        {this.state.permutations && !this.state.loading &&
        <SortingComponents>
          <IsortCompPlot permutations={this.state.permutations} n={this.state.n}/>
          <IsortTimePlot permutations={this.state.permutations} n={this.state.n}/>
          <IsortWhileQuestionPlot permutations={this.state.permutations} n={this.state.n}/>
        </SortingComponents>
      }
      </AppContainer>
    );
  }
}

