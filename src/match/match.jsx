import React from 'react';
import { render } from 'react-dom';

import Dashboard from '../dashboard/dashboard.jsx';
import { EMPTY_HASH, SELECTED_CARDS, SELECTED_HERO } from '../literals/local_storage.jsx';
import { MAX_CARD_IN_A_DECK } from '../literals/constant.jsx';
import { sumTotalSelectedCardsCount } from '../card/card.jsx';
import { COMPLETE_DECK_MESSAGE, SELECT_HERO_MESSAGE } from '../literals/message.jsx';


class MatchStatusBar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log(this.props.selectedCards);
    console.log(sumTotalSelectedCardsCount(this.props.selectedCards));
    var content;
    if (!this.props.selectedHero) {
      content = SELECT_HERO_MESSAGE;
    } else if (sumTotalSelectedCardsCount(this.props.selectedCards) < MAX_CARD_IN_A_DECK) {
      content = COMPLETE_DECK_MESSAGE;
    } else {
      content = <button type="button">Find a worthy foe</button>;
    }
    return (
      <div>{content}</div>
    ); 
  }
};

export default class Match extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedHero: localStorage.getItem(SELECTED_HERO),
      selectedCards: JSON.parse(localStorage.getItem(SELECTED_CARDS) || EMPTY_HASH),
    };
  }

  render() {
    return (
      <div>
        <Dashboard />
        <MatchStatusBar selectedHero={this.state.selectedHero} selectedCards={this.state.selectedCards}/>
      </div>
    );
  };
};
