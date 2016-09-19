import React, { Component, PropTypes } from 'react';
import {
  View,
} from 'react-native';

import Button from './../Button';
import InterfaceText from './../InterfaceText';
import Deck from './Deck';
import DeckCreation from './DeckCreation';

import { connect } from 'react-redux';

import moment from 'moment';

import {
  createCards,
  createDeck,
  deleteAll,
  reviewDeck,
} from './../../actions';
import {
  countCardsDueForReview,
} from './../../data/cards';

import colors from './../../styles/colors';
import layout from './../../styles/layout';

// The route scene component to start activities with decks.
class Decks extends Component {
  static displayName = 'Decks';
  static propTypes = {
    createCards: PropTypes.func.isRequired,
    createDeck: PropTypes.func.isRequired,
    decks: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
    })).isRequired,
    deleteAll: PropTypes.func.isRequired,
    nCardsDue: PropTypes.objectOf(PropTypes.number).isRequired,
    reviewDeck: PropTypes.func.isRequired,
    status: PropTypes.string.isRequired,
  };

  // The button is disabled when either side of the card is still empty.
  _deleteDisabled() {
    return this.props.decks.length === 0;
  }

  render() {
    // View wrapper around decks is necessary to separate their `flex: 1`
    // from the `flex: 1` of the scene layout!
    const { createCards, createDeck, decks, deleteAll, nCardsDue, reviewDeck, status } = this.props;
    return (
      <View style={layout.scene}>
        <View>
          {
            decks.map((deck) => (
              <Deck key={deck.id}
                deck={deck}
                nCardsDue={nCardsDue.get(deck.id)}
                createCards={createCards}
                reviewDeck={reviewDeck}
              />
            ))
          }
        </View>
        <DeckCreation createDeck={createDeck} status={status}/>
        <Button style={colors.delete} onPress={deleteAll} disabled={this._deleteDisabled()}>
          <InterfaceText>Delete All</InterfaceText>
        </Button>
      </View>
    );
  }
}

// A container component subscribes to relevant parts of state in the Redux store.
const mapStateToProps = ({ cards, decks, status }) => ({
  decks,
  nCardsDue: countCardsDueForReview(cards, decks, moment()),
  status,
});
const mapDispatchToProps = {
  createCards,
  createDeck,
  deleteAll,
  reviewDeck,
};

export default connect(mapStateToProps, mapDispatchToProps)(Decks);
