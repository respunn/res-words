import React from 'react';
import Game from './components/Game';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          new-res-project
        </h1>
        <Game />
      </div>
    </div>
  );
}

export default App;