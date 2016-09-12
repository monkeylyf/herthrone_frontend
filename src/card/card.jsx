import React from 'react';
import { render } from 'react-dom';

import Dashboard from '../dashboard/dashboard.jsx';

import { CARDS, CARD_ENTRY, DECK_STATUS_BAR } from '../literals/class_name.jsx';
import { MAX_DUPLICATE_CARD_COUNT, MAX_CARD_IN_A_DECK } from '../literals/constant.jsx';
import { EMPTY_HASH, SELECTED_CARDS, SELECTED_HERO } from '../literals/local_storage.jsx';
import { SELECT_HERO_MESSAGE } from '../literals/message.jsx';

export function sumTotalSelectedCardsCount(selectedCards) {
  var sum = 0;
  for (const cardName in selectedCards) {
    sum += selectedCards[cardName];
  }
  return sum;
};

class DeckStatusBar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const selectedCardsCount = sumTotalSelectedCardsCount(this.props.selectedCards);
    return (selectedCardsCount == 0) ? false : (
      <div className={DECK_STATUS_BAR}>Total {selectedCardsCount} cards selected</div>
    )
  }
};

class Deck extends React.Component {
  constructor(props) {
    super(props);
    this.selectOnCardInDeck = this.selectOnCardInDeck.bind(this);
  }

  selectOnCardInDeck(selectedCard) {
    this.props.removeCardFromSelected(selectedCard);
  }

  /**
   * Renders deck which displays the selected cards. The caveat here is, this.props.cards
   * and this.props.selectedCards are ouf of sync. The former one is initilized as empty
   * hash and mounted after ajax call. The latter one is initialized from localStorage.
   * That being said, the view will be render twice, first time as initialization and second
   * time re-render because this.state.cards is updated.
   * For the first time rendering, data are out of sync and deck cannot be displayed so use
   * cards as necessary condition to display the view.
   * @return {[type]} [description]
   */
  render() {
    var that = this;
    const cardNames = Object.keys(this.props.selectedCards);
    if (Object.keys(this.props.cards).length !== 0) {
      const content = cardNames.map(function(cardName, index) {
        return (
          <li onClick={() => that.selectOnCardInDeck(cardName)} key={index}>
            {that.props.cards[cardName].displayName + " x" + that.props.selectedCards[cardName]}
          </li>
        );
      });
      return (
        <div>
          <ul>{content}</ul>
          <DeckStatusBar selectedCards={this.props.selectedCards} />
        </div>
      );
    } else {
      return false;
    }
  }
};

class CardContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedHeroJson: JSON.parse(localStorage.getItem(SELECTED_HERO) || EMPTY_HASH),
      selectedCards: JSON.parse(localStorage.getItem(SELECTED_CARDS) || EMPTY_HASH),
      cards: {}
    };

    this.listenOnSelectCard = this.listenOnSelectCard.bind(this);

    console.log("selected hero " + this.state.selectedHeroJson.name);
    console.log(this.state.selectedCards);
  }

  componentDidMount() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: JSON.stringify({class_type: this.state.selectedHeroJson.class_type}),
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

  listenOnSelectCard(cardName) {
    const selectedCards = this.state.selectedCards;
    const selectedCardsCount = sumTotalSelectedCardsCount(selectedCards);
    if (selectedCardsCount < MAX_CARD_IN_A_DECK) {
      const cardCount = selectedCards[cardName] || 0;
      if (cardCount < MAX_DUPLICATE_CARD_COUNT) {
        selectedCards[cardName] = cardCount + 1;
        console.log(JSON.stringify(selectedCards));
        this.setState({selectedCards: selectedCards}, function() {
          localStorage.setItem(SELECTED_CARDS, JSON.stringify(selectedCards));
        });
      } else {
        console.log(cardName + " already have " + MAX_DUPLICATE_CARD_COUNT + " copies in deck");
      }
    } else {
      console.log("Cannot select more than " + MAX_CARD_IN_A_DECK + " cards");
    }
  }

  render() {
    if (Object.keys(this.state.selectedHeroJson).length !== 0) {
      var that = this;
      var boundRemoveCardFromSelected = this.removeCardFromSelected.bind(this); 
      const content = Object.keys(this.state.cards).map(function(cardName, index) {
        return (
          <li onClick={() => that.listenOnSelectCard(cardName)} key={index}>
            {that.state.cards[cardName].displayName}
          </li>
        );
      });
      return (
        <div className={CARDS}>
          <ul className={CARD_ENTRY}>{content}</ul>
          <Deck selectedCards={this.state.selectedCards} removeCardFromSelected={boundRemoveCardFromSelected} cards={this.state.cards} />
        </div>
      );
    } else {
      return <div className={CARDS}>{SELECT_HERO_MESSAGE}</div>;
    }
  }
};

export default class Card extends React.Component {
  render() {
    return (
      <div>
        <Dashboard />
        <CardContainer url="api/cards" />
      </div>
    );
  };
};
