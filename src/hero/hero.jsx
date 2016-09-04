import React from 'react';
import { render } from 'react-dom';

import Dashboard from '../dashboard/dashboard.jsx';
import { SELECTED_CARDS, SELECTED_HERO } from '../literals/local_storage.jsx';


class HeroList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      heroes: [],
      selectedHero: localStorage.getItem(SELECTED_HERO),
    };

    console.log("selected hero!!!: " + this.state.selectedHero);

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
    const previousSelectedHero = this.state.selectedHero;
    const currentSelectedHero = this.state.heroes[index];
    console.log("previous hero " + previousSelectedHero);
    console.log("current hero " + currentSelectedHero);
    if (previousSelectedHero != currentSelectedHero) {
      this.setState({selectedHero: currentSelectedHero}, function() {
        console.log(currentSelectedHero + " selected");
        localStorage.setItem(SELECTED_HERO, currentSelectedHero);
        if (previousSelectedHero) {
          // Clear selected cards.
          console.log("Selected cards for " + previousSelectedHero + " cleared");
          localStorage.setItem(SELECTED_CARDS, '{}');
        }
      });
    } else {
      console.log(currentSelectedHero + " selected again. No changes.");
    }
  }

  render() {
    var that = this;
    return (
      <ul className="heroList">
        {this.state.heroes.map(function(item, index) {
          return (
            <li key={index} onClick={() => that.listenOnSelect(index)}>
              {item}
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
