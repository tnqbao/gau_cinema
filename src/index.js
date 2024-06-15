import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { initGA, logPageView } from "./utils/analytics";
import { BrowserRouter as Router } from 'react-router-dom';

initGA();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <div className="bg-[#121111] min-h-screen">
        <App />
      </div>
    </Router>
  </React.StrictMode>
);

const logPageViewOnRouteChange = () => {
  logPageView();
};

window.addEventListener("popstate", logPageViewOnRouteChange);

reportWebVitals();
