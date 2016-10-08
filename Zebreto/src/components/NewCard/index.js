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
    this.state = this._getState(false);
  }

  _getState(continuing) {
    return {
      front: '',
      back: '',
      continuing,
    };
  }

  _resetForNextCard(continuing) {
    this.setState(this._getState(continuing));
    this._inputFront.clear();
    this._inputBack.clear();
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
  }

  _createDisabled() {
    return this.state.front === '' || this.state.back === '';
  }

  _reviewDeck = () => {
    this.props.reviewDeck(this.props.deckID);
  }

  // Prevent a person from forgetting to click Create Card before Review Card.
  _reviewDisabled() {
    return this.props.noCardsDue || this.state.front !== '' || this.state.back !== '';
  }

  // Click to acknowledge the message that appears if creating fails.
  _continue = () => {
    this._resetForNextCard(true);
  }

  // React to a prop transition before render() is called by updating the state.
  // Calling this.setState() within this function will not trigger an additional render.
  componentWillReceiveProps({ status }) {
    // The extra requested status separates consecutive failed or succeeded status,
    // so the method receives each of them, even though the method does not receive it.
    if (status === 'CREATING_CARD_FAILED') { // cannot compare to 'CREATING_CARD_REQUESTED'
      this.setState({
        continuing: false, // reset just one property of component state
      });
    }
    else if (status === 'CREATING_CARD_SUCCEEDED') {
      this._resetForNextCard(false);
    }
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
            {
              this.props.status === 'CREATING_CARD_FAILED' && !this.state.continuing
                ? (
                    <MessageButton style={colors.failure} onPress={this._continue}>
                      <NormalText style={layout.flexShrinkDescendant} numberOfLines={1} ellipsizeMode='tail'>Card already exists</NormalText>
                      <NormalText style={layout.atRight}>Continue</NormalText>
                    </MessageButton>
                  )
                : (
                    <Button style={colors.create} onPress={this._createCard} disabled={this._createDisabled()}>
                      <InterfaceText>Create Card</InterfaceText>
                    </Button>
                  )
            }
            <Button style={colors.review} onPress={this._reviewDeck} disabled={this._reviewDisabled()}>
              <InterfaceText>Review Deck</InterfaceText>
            </Button>
            <Button style={colors.stop} onPress={this.props.stopCreating}>
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
