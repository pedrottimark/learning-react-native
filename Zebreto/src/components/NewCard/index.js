import React, { Component, PropTypes } from 'react';
import {
  View,
} from 'react-native';

import Button from './../Button';
import Input from './../Input';
import InterfaceText from './../InterfaceText';
import MessageButton from './../MessageButton';
import NormalText from './../NormalText';

import { connect } from 'react-redux';

import moment from 'moment';

import {
  createCard,
  reviewDeck,
  stopCreating,
} from './../../actions';
import {
  someCardDueForReview,
} from './../../data/cards';
import {
  deckIDInitial,
} from './../../data/decks';

import colors from './../../styles/colors';
import layout from './../../styles/layout';

// The route scene component to create cards in a deck.
class NewCard extends Component {
  static displayName = 'NewCard';
  static propTypes = {
    deckID: PropTypes.string.isRequired,
    createCard: PropTypes.func.isRequired,
    reviewDeck: PropTypes.func.isRequired,
    noCardsDue: PropTypes.bool.isRequired,
    status: PropTypes.string.isRequired,
    stopCreating: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = this._getInitialState();
  }

  _getInitialState() {
    return {
      front: '',
      back: '',
      continuing: false,
    };
  }

  _onChangeFront = (text) => {
    this.setState({
      front: text,
    });
  }

  _onChangeBack = (text) => {
    this.setState({
      back: text,
    });
  }

  _refInputFront = (input) => {
    this._inputFront = input;
  }

  _refInputBack = (input) => {
    this._inputBack = input;
  }

  _createCard = () => {
    this.props.createCard(this.state.front, this.state.back, this.props.deckID);
    this.setState(this._getInitialState());
    this._inputFront.clear();
    this._inputBack.clear();
  }

  _createDisabled() {
    return this.state.front === '' || this.state.back === '';
  }

  // Click to acknowledge the message that appears if creating fails.
  _continue = () => {
    this.setState({
      continuing: true,
    });
  }

  _reviewDeck = () => {
    this.props.reviewDeck(this.props.deckID);
  }

  _reviewDisabled() {
    return this.state.front !== '' || this.state.back !== '' || this.props.noCardsDue;
  }

  _stopDisabled() {
    return this.state.front !== '' || this.state.back !== '';
  }

  _createButton() {
    return this.props.status === 'CREATING_CARD_FAILED' && !this.state.continuing
      ? (
          <MessageButton style={colors.failure} onPress={this._continue}>
            <NormalText>Card already exists</NormalText>
            <NormalText>Continue</NormalText>
          </MessageButton>
        )
      : (
          <Button style={colors.create} onPress={this._createCard} disabled={this._createDisabled()}>
            <InterfaceText>Create Card</InterfaceText>
          </Button>
        );
  }

  render() {
    return this.props.deckID === deckIDInitial
      ? null // After the state change from STOP_CREATING and before the scene changes.
      : (
          <View style={layout.scene}>
            <Input
              placeholder='front of a new card'
              refInput={this._refInputFront}
              onChange={this._onChangeFront}
              onEntry={this._onChangeFront}
              clearOnSubmit={false}
            />
            <Input
              placeholder='back of a new card'
              refInput={this._refInputBack}
              onChange={this._onChangeBack}
              onEntry={this._onChangeBack}
              clearOnSubmit={false}
            />
            {this._createButton()}
            <Button style={colors.review} onPress={this._reviewDeck} disabled={this._reviewDisabled()}>
              <InterfaceText>Review Deck</InterfaceText>
            </Button>
            <Button style={colors.stop} onPress={this.props.stopCreating} disabled={this._stopDisabled()}>
              <InterfaceText>Stop Creating</InterfaceText>
            </Button>
          </View>
        );
  }
}

// A container component subscribes to relevant parts of state in the Redux store.
const mapStateToProps = ({ cards, deckID, status }) => ({
  deckID,
  noCardsDue: !someCardDueForReview(cards, deckID, moment()),
  status,
});
const mapDispatchToProps = {
  createCard,
  reviewDeck,
  stopCreating,
};

export default connect(mapStateToProps, mapDispatchToProps)(NewCard);
