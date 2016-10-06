import React, { Component, PropTypes } from 'react';
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
class Decks extends Component {
  static displayName = 'Decks';
  static propTypes = {
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

  constructor(props) {
    super(props);
    this.state = {
      focusInCreation: false,
    };
  }

  _onBlurCreation = () => {
    this.setState({
      focusInCreation: false,
    });
  }

  _onFocusCreation = () => {
    this.setState({
      focusInCreation: true,
    });
  }

  render() {
    const { createCards, createDeck, decks, deleteAll, nCardsDue, reviewDeck, status } = this.props;
    const { focusInCreation } = this.state;

    // The key prop is necessary for the component to keep focus
    // when it is rendered at the top of the screen
    // so the keyboard does not cover the name that a person is tapping.
    const deckCreation = (<DeckCreation key='DeckCreation'
      createDeck={createDeck}
      status={status}
      onBlur={this._onBlurCreation}
      onFocus={this._onFocusCreation}
    />);

    return (
      <View style={layout.scene}>
        { focusInCreation && deckCreation }
        <DeckList createCards={createCards} decks={decks} nCardsDue={nCardsDue} reviewDeck={reviewDeck}/>
        { !focusInCreation && deckCreation }
        <Button style={colors.delete} onPress={deleteAll} disabled={decks.length === 0}>
          <InterfaceText>Delete All</InterfaceText>
        </Button>
      </View>
    );
  }
}

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
