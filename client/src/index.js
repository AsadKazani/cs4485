import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import NavBarTop from './NavBarTop';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <NavBarTop />
    <br></br>
    <App />
  </React.StrictMode>
);

reportWebVitals();
