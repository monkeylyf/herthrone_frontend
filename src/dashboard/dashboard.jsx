import React from 'react';
import { render } from 'react-dom';

class DashboardListItem extends React.Component {
  render() {
    return (
      <li>
        <a href={"#/" + this.props.item.toLowerCase()}>
          {this.props.item}
        </a>
      </li>
    );
  }
};

export default class Dashboard extends React.Component {
  render() {
    return (
      <div className="dashboard">
        <ul>
          <DashboardListItem item="Hero" />
          <DashboardListItem item="Card" />
          <DashboardListItem item="Match" />
        </ul>
      </div>
    );
  }
};
