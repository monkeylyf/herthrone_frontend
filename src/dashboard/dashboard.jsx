import React from 'react';
import { render } from 'react-dom';

import { EMPTY_HASH, DECK, SELECTED_HERO } from '../literals/local_storage.jsx';

export function sumTotalSelectedCardsCount(deck) {
  var sum = 0;
  for (const cardName in deck) {
    sum += deck[cardName];
  }
  return sum;
};

class DashboardListItem extends React.Component {
  constructor(props) {
    super(props);

    this.itemToRoute = this.itemToRoute.bind(this);
  }

  itemToRoute(item) {
    return '#/' + item.toLowerCase();
  }

  render() {
    //if (this.props.display) {
    if (true) {
      return (
        <li>
          <a href={this.itemToRoute(this.props.item)}>{this.props.item}</a>
        </li>
      );
    } else {
      return false;
    }
  }
};

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isHeroSelected: Boolean(localStorage.getItem(SELECTED_HERO)),
      isDeckComplete: sumTotalSelectedCardsCount(
          JSON.parse(localStorage.getItem(DECK) || EMPTY_HASH)),
    };
  }

  render() {
    const displayHeroRoute = true;
    const displayCardRoute = this.state.isHeroSelected;
    const displayMatchRoute = this.state.isHeroSelected && this.isDeckComplete;
    return (
      <div className="dashboard">
        <DashboardListItem item='Hero'  display={displayHeroRoute}  />
        <DashboardListItem item='Card'  display={displayCardRoute}  />
        <DashboardListItem item='Match' display={displayMatchRoute} />
      </div>
    );
  }
};
