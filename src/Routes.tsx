/* eslint-disable linebreak-style */
import React from 'react';
import { Switch, Redirect } from 'react-router-dom';

import { RouteWithLayout } from './app/components';
import { Main as MainLayout, Minimal as MinimalLayout } from './app/layouts';

import Dashboard from './app/views/Dashboard';
import Login from './app/views/Login';
import Profile from './app/views/Profile/Profile';

const Routes = () => (
  <Switch>
    <RouteWithLayout component={Login} exact layout={MinimalLayout} path="/" />

    <RouteWithLayout
      component={Dashboard}
      exact
      layout={MainLayout}
      path="/dashboard"
    />
    <RouteWithLayout
      component={Profile}
      exact
      layout={MainLayout}
      path="/profile"
    />

    <Redirect to="/not-found" />
  </Switch>
);

export default Routes;
