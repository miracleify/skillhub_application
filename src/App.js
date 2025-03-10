import React from 'react'
import Header from './pages/header';
import ErrorBoundary from './ErrorBoundary';
import './App.css';



function App() {
  return (
   <div className="container">
  
      <ErrorBoundary>
        <Header />
      </ErrorBoundary>
     

      
</div>
  
  );
}

export default App;
