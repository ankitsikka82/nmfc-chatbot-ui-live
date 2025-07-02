import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log('🚀 React app starting...');

const root = document.getElementById('root');
if (root) {
  console.log('✅ Root element found');
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error('❌ Root element NOT found!');
}
