import React from 'react';
import { render } from 'react-dom';

import Dashboard from '../dashboard/dashboard.jsx';

const cards = [
  'match',
];

export default class Match extends React.Component {
  map_func_(item, index) {
    return (
      <div key={index}>
        {item}
      </div>
    );
  }

  render() {
    return (
      <div>
        <Dashboard />
        {cards.map(this.map_func_)}
      </div>
    );
  };
}
