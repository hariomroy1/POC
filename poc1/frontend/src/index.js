import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import RoutesConfig from './routes/route'; // Adjust the path as needed

const token = localStorage.getItem('userToken');
const user = token ? JSON.parse(atob(token.split('.')[1])) : null;
const rolename = user?.RoleName;
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Router>
      <RoutesConfig userRole={rolename} />
    </Router>
  </React.StrictMode>
);

