import React from 'react';
import styled from 'styled-components'

// Sorting components
import IsortCompPlot from './components/IsortCompPlot';

const AppContainer = styled.div`
  width: 100vw;
  padding: 0px 20px;
`

function App() {
  return (
    <AppContainer>
      <h1>Sorting Algorithms Representation</h1>
      <h3>Insertion Sort</h3>
      <IsortCompPlot/>
    </AppContainer>
  );
}

export default App;
