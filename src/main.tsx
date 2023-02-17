/* eslint-disable linebreak-style */
/* eslint-disable comma-dangle */
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Provider } from 'react-redux';
import Redirect from './Redirect';
import store from './app/store';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Redirect />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
