import React from 'react';
import { render } from 'react-dom';
import { Router, Route, hashHistory } from 'react-router';

import Dashboard from './dashboard/dashboard.jsx';
import Card from './card/card.jsx';
import Hero from './hero/hero.jsx';
import Match from './match/match.jsx';


class App extends React.Component {
  render() {
    return (
      <div>
        <Dashboard />
      </div>
    );
  }
}

let routes = (
<Router history={hashHistory}>
    <Route path='/' component={App}/>
    <Route path='/card' component={Card}/>
    <Route path='/hero' component={Hero}/>
    <Route path='/match' component={Match}/>
  </Router>
);

render(routes, document.getElementById('herthrone'));
