'use client'
import React from 'react';
import ImageCarousel from './components/Layout';
import GrowingCircle from './components/Layout';
import ExpandingCircle from './components/Layout';

function App() {
  return (
    <div className="App">
      <h1>Interactive P5 Canvas</h1>
      <ExpandingCircle />
    </div>
  );
}

export default App;