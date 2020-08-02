import React from 'react';
import { Switch, Route } from 'react-router-dom';
import NotFound from './views/404';
import Home from './views/Home';

const Routes = () => (
  <Switch>
    <Route path="/" exact component={Home} />
    <Route component={NotFound} />
  </Switch>
);

export default Routes;
