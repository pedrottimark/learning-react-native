import React, { PropTypes } from 'react';
import {
  View,
} from 'react-native';

import Button from './../Button';
import InterfaceText from './../InterfaceText';
import DeckList from './DeckList';
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
  nCardsDueForReview,
} from './../../data/cards';

import colors from './../../styles/colors';
import layout from './../../styles/layout';

// The route scene component to start activities with decks.
const Decks = ({ createCards, createDeck, decks, deleteAll, nCardsDue, reviewDeck, status }) => (
  <View style={layout.scene}>
    <DeckList createCards={createCards} decks={decks} nCardsDue={nCardsDue} reviewDeck={reviewDeck}/>
    <DeckCreation createDeck={createDeck} status={status}/>
    <Button style={colors.delete} onPress={deleteAll} disabled={decks.length === 0}>
      <InterfaceText>Delete All</InterfaceText>
    </Button>
  </View>
);

Decks.displayName = 'Decks';
Decks.propTypes = {
  createCards: PropTypes.func.isRequired,
  createDeck: PropTypes.func.isRequired,
  decks: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
  })).isRequired,
  deleteAll: PropTypes.func.isRequired,
  nCardsDue: PropTypes.func.isRequired,
  reviewDeck: PropTypes.func.isRequired,
  status: PropTypes.string.isRequired,
};

// A container component subscribes to relevant parts of state in the Redux store.
const mapStateToProps = ({ cards, decks, status }) => ({
  decks,
  nCardsDue: nCardsDueForReview(cards, decks, moment()),
  status,
});
const mapDispatchToProps = {
  createCards,
  createDeck,
  deleteAll,
  reviewDeck,
};

export default connect(mapStateToProps, mapDispatchToProps)(Decks);
