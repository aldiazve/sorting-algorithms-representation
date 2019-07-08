import React from 'react';
import styled from 'styled-components'

// Sorting components
import IsortCompPlot from './components/IsortCompPlot';
import IsortTimePlot from './components/IsortTimePlot';
import IsortWhileQuestionPlot from './components/IsortWhileQuestionPlot';


const AppContainer = styled.div`
  width: 100vw;
  padding: 0px 20px;
  box-sizing: border-box;

  * {
    box-sizing: border-box;
  }
`

function App() {
  return (
    <AppContainer>
      <h1>Sorting Algorithms Representation</h1>
      <h3>Insertion Sort</h3>
      <IsortCompPlot/>
      <IsortTimePlot/>
      <IsortWhileQuestionPlot/>
    </AppContainer>
  );
}

export default App;
