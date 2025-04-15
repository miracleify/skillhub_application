import React from 'react'
import Header from './pages/header';
import ErrorBoundary from './ErrorBoundary';
import './App.css';
import { TradesProvider } from './TradesContext';

function App() {
  return (
   <div className="container">
  
      <ErrorBoundary>
        <TradesProvider>
          <Header/>
        </TradesProvider>
      </ErrorBoundary>
     

      
</div>
  
  );
}

export default App;
