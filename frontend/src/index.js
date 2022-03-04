import React from 'react';
import ReactDOM from 'react-dom';
import RootCmp from './RootCmp.jsx';
import { BrowserRouter } from 'react-router-dom';
import './assets/styles/style.scss';

ReactDOM.render(
  <BrowserRouter>
    <RootCmp />
  </BrowserRouter>,
  document.getElementById('root')
);