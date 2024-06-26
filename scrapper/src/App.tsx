import React from 'react';
import './App.css';
import SearchForm from './components/SearchForm';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>ChatGPT Search App</h1>
      </header>
      <main>
        <SearchForm />
      </main>
    </div>
  );
};

export default App;
