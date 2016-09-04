import React from 'react';
import { render } from 'react-dom';

import Dashboard from '../dashboard/dashboard.jsx';

import { MAX_DUPLICATE_CARD_COUNT } from '../literals/constant.jsx';
import { EMPTY_HASH, SELECTED_CARDS, SELECTED_HERO } from '../literals/local_storage.jsx';


class Deck extends React.Component {
  constructor(props) {
    super(props);

    this.selectOnCardInDeck = this.selectOnCardInDeck.bind(this);
  }

  selectOnCardInDeck(selectedCard) {
    this.props.removeCardFromSelected(selectedCard);
  }

  render() {
    var that = this;
    const content = Object.keys(this.props.selectedCards).map(function(cardName, index) {
      return (
        <li onClick={() => that.selectOnCardInDeck(cardName)} key={index}>
          {cardName + " x" + that.props.selectedCards[cardName]}
        </li>
      );
    });
    return (
      <div>
        <ul>{content}</ul>
      </div>
    );
  }
};

class CardList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedHero: localStorage.getItem(SELECTED_HERO),
      selectedCards: JSON.parse(localStorage.getItem(SELECTED_CARDS) || EMPTY_HASH),
      cards: []
    };

    this.listenOnSelectCard = this.listenOnSelectCard.bind(this);

    console.log("selected hero " + this.state.selectedHero);
    console.log(this.state.selectedCards);
  }

  componentDidMount() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: JSON.stringify({hero: this.state.selectedHero}),
      cache: true,
      success: function(data) {
        this.setState({cards: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  }

  removeCardFromSelected(cardName) {
    console.log("removing card " + cardName + " from selected");
    const selectedCards = this.state.selectedCards;
    const cardCount = selectedCards[cardName] || 0;
    if (cardCount == 1) {
      delete selectedCards[cardName];
    } else {
      selectedCards[cardName] = cardCount - 1;
    }
    this.setState({selectedCards: selectedCards}, function() {
      localStorage.setItem(SELECTED_CARDS, JSON.stringify(selectedCards));
    });
  }

  listenOnSelectCard(index) {
    const selectedCard = this.state.cards[index];
    const selectedCards = this.state.selectedCards;
    const cardCount = selectedCards[selectedCard] || 0;
    if (cardCount < MAX_DUPLICATE_CARD_COUNT) {
      selectedCards[selectedCard] = cardCount + 1;
      console.log(JSON.stringify(selectedCards));
      this.setState({selectedCards: selectedCards}, function() {
        localStorage.setItem(SELECTED_CARDS, JSON.stringify(selectedCards));
      });
    } else {
      console.log(selectedCard + " already have " + MAX_DUPLICATE_CARD_COUNT + " copies in deck");
    }
  }

  render() {
    var that = this;
    var boundRemoveCardFromSelected = this.removeCardFromSelected.bind(this); 
    const content = this.state.cards.map(function(item, index) {
      return (
        <li onClick={() => that.listenOnSelectCard(index)} key={index}>
          {item}
        </li>
      );
    });
    return (
      <div className="cards">
        <ul className="cardItem">
          {content}
        </ul>
        <Deck selectedCards={this.state.selectedCards} removeCardFromSelected={boundRemoveCardFromSelected}/>
      </div>
    )
  }
};

export default class Card extends React.Component {
  render() {
    return (
      <div>
        <Dashboard />
        <CardList url="api/cards" />
      </div>
    );
  };
}
