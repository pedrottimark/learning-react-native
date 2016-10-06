import React, { Component, PropTypes } from 'react';
import {
  ListView,
} from 'react-native';

import Deck from './Deck';

// The component to display the decks.
export default class DeckList extends Component {
  static displayName = 'DeckList';
  static propTypes = {
    createCards: PropTypes.func.isRequired,
    decks: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
    })).isRequired,
    nCardsDue: PropTypes.func.isRequired,
    reviewDeck: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this._dataSource = new ListView.DataSource({
      getRowData: (dataBlob, sectionID, rowID) => dataBlob.get(rowID),
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    });

    // https://facebook.github.io/react/tips/props-in-getInitialState-as-anti-pattern.html
    // Props in getInitialState is an anti-pattern. However, it's not an anti-pattern
    // if the prop is only seed data for internally-controlled state of the component.
    const { decks, nCardsDue } = this.props;
    this.state = {
      dataSource: this._getSource(decks, nCardsDue),
    };
  }

  _getSource(decks, nCardsDue) {
    // dataBlob is a map whose key is deck id and value is deck and number of cards due.
    // see getRowData (above) and renderRow (below).
    const dataBlob = new Map(decks.map((deck) => [deck.id, {
      deck,
      nCardsDue: nCardsDue(deck.id),
    }]));

    // Each deck corresponds to a section which has one row.
    // ListView (below) has renderRow but not renderSectionHeader.
    const sectionIDs = decks.map((deck) => deck.id);
    const rowIDs = decks.map((deck) => [deck.id]);

    return this._dataSource.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs);
  }

  // React to a prop transition before render() is called by updating the state.
  // Calling this.setState() within this function will not trigger an additional render.
  componentWillReceiveProps({ decks, nCardsDue }) {
    this.setState({
      dataSource: this._getSource(decks, nCardsDue),
    });
  }

  render() {
    const { createCards, reviewDeck } = this.props;
    return (
      <ListView
        dataSource={this.state.dataSource}
        enableEmptySections={true}
        renderRow={({ deck, nCardsDue }, sectionID, deckID) =>
          <Deck key={deckID}
            deck={deck}
            nCardsDue={nCardsDue}
            createCards={createCards}
            reviewDeck={reviewDeck}
          />
        }
      />
    );
  }
}
