import React from 'react';
import { render } from 'react-dom';

import Dashboard from '../dashboard/dashboard.jsx';
import Battlefield from './battlefield.jsx';
import { EMPTY_HASH, DECK, SELECTED_HERO } from '../literals/local_storage.jsx';
import { MAX_CARD_IN_DECK } from '../literals/constant.jsx';
import { sumTotalSelectedCardsCount } from '../card/card.jsx';
import { COMPLETE_DECK_MESSAGE, SELECT_HERO_MESSAGE } from '../literals/message.jsx';


class MatchStatusBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gameId: null
    };

    this.startGame = this.startGame.bind(this);
  }

  startGame() {
    const data = {
      'hero': this.props.selectedHero.name,
      'deck': this.props.deck
    };

    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: JSON.stringify(data),
      cache: true,
      success: function(data) {
        console.log("test " + data);
        this.setState({gameId: data.id});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  }

  render() {
    console.log(this.props.deck);
    console.log(sumTotalSelectedCardsCount(this.props.deck));
    var content;
    if (!this.props.selectedHero) {
      content = SELECT_HERO_MESSAGE;
    } else if (sumTotalSelectedCardsCount(this.props.deck) < MAX_CARD_IN_DECK) {
      content = COMPLETE_DECK_MESSAGE;
    } else {
      content = <button type="button" onClick={this.startGame}>Find a worthy foe</button>;
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
      selectedHero: JSON.parse(localStorage.getItem(SELECTED_HERO) || EMPTY_HASH),
      deck: JSON.parse(localStorage.getItem(DECK) || EMPTY_HASH),
    };
  }

  render() {
    return (
      <div>
        <Dashboard />
        <MatchStatusBar selectedHero={this.state.selectedHero} deck={this.state.deck} url='api/game/start'/>
        <Battlefield />
      </div>
    );
  };
};
