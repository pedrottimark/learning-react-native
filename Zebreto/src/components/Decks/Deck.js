import React, { PureComponent, PropTypes } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import Button from './../Button';
import InterfaceText from './../InterfaceText';
import NormalText from './../NormalText';

import colors from './../../styles/colors';
import layout from './../../styles/layout';

// The component to start an activity with a deck.
// PureComponent: avoid re-rendering non-active decks when a card is created or reviewed.
export default class Deck extends PureComponent {
  static displayName = 'Deck';
  static propTypes = {
    createCards: PropTypes.func.isRequired,
    deck: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
    nCardsDue: PropTypes.number.isRequired,
    reviewDeck: PropTypes.func.isRequired,
  };

  _reviewDeck = () => {
    this.props.reviewDeck(this.props.deck.id);
  }

  _createCards = () => {
    this.props.createCards(this.props.deck.id);
  }

  render() {
    const { deck: { name }, nCardsDue } = this.props;
    return (
      <View style={layout.row}>
        <Button style={[colors.review, styles.reviewButton]} onPress={this._reviewDeck} disabled={nCardsDue === 0}>
          <View style={layout.rowAlignedLeftAndRight}>
            <NormalText>{name}</NormalText>
            <NormalText>{`${nCardsDue} due`}</NormalText>
          </View>
        </Button>
        <Button style={[colors.create, styles.createButton]} onPress={this._createCards}>
          <InterfaceText>+</InterfaceText>
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  reviewButton: {
    flex: 1,
  },
  createButton: {
    flex: 0,
    width: 60,
  },
});
