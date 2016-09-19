import React from 'react';
import { render } from 'react-dom';

import { OWN, FOE, MAX_MINION_ON_BOARD, MAX_CARD_IN_DECK, MAX_CARD_IN_HAND } from '../literals/constant.jsx';


class HeroStatus extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const heroJson = this.props.hero;
    if (heroJson) {
      return <div>{heroJson.name} {heroJson.health}/{heroJson.attack}/{heroJson.armor} </div>
    } else {
      return false;
    }
  }
};

class DeckStatus extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div>Deck: {this.props.deck}/{MAX_CARD_IN_DECK}</div>
  }
};


class MinionOnBoard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const divStyle = {
      display: 'inline-block',
      margin: '10px'
    };
    const minionJson = this.props.minionJson;
    if (this.props.minionJson) {
      return (
        <div style={divStyle}>
          {minionJson.display_name}
          {minionJson.health}/{minionJson.attack}/{minionJson.crystal}
        </div>);
    } else {
      return <div style={divStyle}>...</div>;
    }
  }
};

class BoardStatus extends React.Component {
  constructor(props) {
    super(props);

    this.centerBoard = this.centerBoard.bind(this);
  }

  centerBoard(minions) {
    const leftPadding = Math.floor((MAX_MINION_ON_BOARD - minions.length) / 2);
    const rightPadding = MAX_MINION_ON_BOARD - minions.length - leftPadding;
    const centeredMinions = [];
    for (var i = 0; i < MAX_MINION_ON_BOARD; ++i) {
      if (i < leftPadding || i >= leftPadding + minions.length) {
        centeredMinions.push(null);
      } else {
        centeredMinions.push(minions[i - leftPadding]);
      }
    }
    return centeredMinions;
  }

  render() {
    const centeredMinions = this.centerBoard(this.props.board || []);
    const content = centeredMinions.map(function(minionJson, index) {
      return <MinionOnBoard key={index} minionJson={minionJson} />
    });

    return (
      <div>{content}</div>
    );
  }
};

class CardInHand extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const divStyle = {
      display: 'inline-block',
      margin: '10px'
    };
    const content = (this.props.side === FOE) ?
      '[]' : this.props.cardJson.display_name;
    return (
      <div style={divStyle}>{content}</div>
    );
  }
};

class HandStatus extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var that = this;
    const hand = this.props.hand || [];
    const content = hand.map(function(cardJson, index) {
      return <CardInHand {...that.props} key={index} cardJson={cardJson} />
    });
    return <div>{content}</div>
  }
};

export default class Battlefield extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      own: {},
      foe: {}
    };
  }

  componentDidMount() {
    const data = {
      'gameId': this.props.gameId,
      // TODO:
      'userId': 'foo'
    };
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: JSON.stringify(data),
      cache: true,
      success: function(data) {
        this.setState({own: data.own, foe: data.foe}, function() {
          //localStorage.setItem(GAME_ID, data.game_id);
        });
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  };

  render() {
    return (
      <div>
        <HeroStatus  side={FOE} hero={this.state.foe.hero} />
        <HandStatus  side={FOE} hand={this.state.foe.hand} />
        <DeckStatus  side={FOE} deck={this.state.foe.deck} />
        <BoardStatus side={FOE} board={this.state.foe.board} />
        <BoardStatus side={OWN} board={this.state.own.board} />
        <DeckStatus  side={OWN} deck={this.state.own.deck} />
        <HandStatus  side={OWN} hand={this.state.own.hand} />
        <HeroStatus  side={OWN} hero={this.state.own.hero} />
      </div>
    );
  }
};
