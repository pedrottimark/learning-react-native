import React, { Component, PropTypes } from 'react';

import Input from './../Input';
import MessageButton from './../MessageButton';
import NormalText from './../NormalText';

import colors from './../../styles/colors';

// The component to type the name of a new deck, and then create it.
export default class DeckCreation extends Component {
  static displayName = 'DeckCreation';
  static propTypes = {
    createDeck: PropTypes.func.isRequired,
    status: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      continuing: false,
    };
  }

  _continue = () => {
    this.setState({
      continuing: true,
    });
  }

  _onEntry = (name) => {
    this.props.createDeck(name);
  }

  render() {
    return this.props.status === 'CREATING_DECK_FAILED' && !this.state.continuing
      ? (
          <MessageButton style={colors.failure} onPress={this._continue}>
            <NormalText>Deck already exists</NormalText>
            <NormalText>Continue</NormalText>
          </MessageButton>
        )
      : (
          <Input placeholder='name of a new deck' onEntry={this._onEntry}/>
        );
  }
}
