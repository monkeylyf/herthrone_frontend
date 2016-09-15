import React from 'react';
import { render } from 'react-dom';

import Dashboard from '../dashboard/dashboard.jsx';
import { EMPTY_HASH, DECK, SELECTED_HERO } from '../literals/local_storage.jsx';


class HeroList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      heroes: [],
      selectedHeroJson: JSON.parse(localStorage.getItem(SELECTED_HERO) || EMPTY_HASH),
    };

    console.log("Init selected hero: " + this.state.selectedHeroJson.name);
    console.log(this.state.selectedHeroJson);

    this.listenOnSelect = this.listenOnSelect.bind(this);
  }

  componentDidMount() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'GET',
      success: function(data) {
        this.setState({heroes: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  }

  listenOnSelect(index) {
    const previousSelectedHeroName = this.state.selectedHeroJson.name;
    const currentSelectedHero = this.state.heroes[index];
    const currentSelectedHeroName = currentSelectedHero.name;
    console.log("previous selected hero " + previousSelectedHeroName);
    console.log("current selected hero " + currentSelectedHeroName);
    if (previousSelectedHeroName != currentSelectedHeroName) {
      this.setState({selectedHeroJson: currentSelectedHero}, function() {
        localStorage.setItem(SELECTED_HERO, JSON.stringify(currentSelectedHero));
        if (previousSelectedHeroName) {
          // Clear selected cards.
          console.log("Selected cards for " + previousSelectedHeroName + " cleared");
          localStorage.setItem(DECK, '{}');
        }
      });
    } else {
      console.log(currentSelectedHeroName + " selected again. No changes.");
    }
  }

  render() {
    var that = this;
    return (
      <ul className="heroList">
        {this.state.heroes.map(function(heroJson, index) {
          return (
            <li key={index} onClick={() => that.listenOnSelect(index)}>
              {heroJson.display_name}
            </li>
          );
        })}
      </ul>
    )
  }
};

export default class Hero extends React.Component {
  render() {
    return (
      <div>
        <Dashboard />
        <HeroList url="/api/heroes"/>
      </div>
    );
  };
}
