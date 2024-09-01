import React from 'react';
import ReactDOM from 'react-dom/client';
import ItemOverlay from './components/ItemOverlay';

const root = ReactDOM.createRoot(document.getElementById('root'));

const App = () => {
  return (
    <div>
      <ItemOverlay />
    </div>
  );
};

root.render(<App />);