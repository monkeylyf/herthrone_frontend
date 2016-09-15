import React from 'react';
import { render } from 'react-dom';

import { MAX_MINION_ON_BOARD, MAX_CARD_IN_HAND } from '../literals/constant.jsx';


class HeroStatus extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div>Name 30/0/0</div>
  }
};

class DeckStatus extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div>Deck: 30/30</div>
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
    return <div style={divStyle}>{this.props.minionJson.displayName}</div>
  }
};

class BoardStatus extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const minions = []; 
    for (var i = 0; i < MAX_MINION_ON_BOARD; ++i) {
      minions.push({displayName: 'foo' + i});
    }
    const content = minions.map(function(minionJson, index) {
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
    const content = (this.props.side == 'opponent') ?
      'hidden' : this.props.cardJson.displayName;
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
    const hand = []; 
    for (var i = 0; i < MAX_CARD_IN_HAND; ++i) {
      hand.push({displayName: 'bar' + i});
    }
    const content = hand.map(function(cardJson, index) {
      return <CardInHand {...that.props} key={index} cardJson={cardJson} />
    });
    return <div>{content}</div>
  }
};

export default class Battlefield extends React.Component { 
  constructor(props) {
    super(props);
  }

  render() {
    const opponent = 'opponent';
    const own = 'own';
    return (
      <div>
        <HeroStatus side={opponent} />
        <HandStatus side={opponent} />
        <DeckStatus side={opponent} />
        <BoardStatus side={opponent} />
        <BoardStatus side={own} />
        <DeckStatus side={own} />
        <HandStatus side={own} />
        <HeroStatus side={own} />
      </div>
    );
  }

};