import '@babel/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import './assets/scss/styles.scss';
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from './Routes';

ReactDOM.render(
  <Router>
    <Routes />
  </Router>,
  document.getElementById('app')
);
