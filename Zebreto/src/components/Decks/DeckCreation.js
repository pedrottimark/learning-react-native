import React, { Component, PropTypes } from 'react';
import {
  View,
} from 'react-native';

import Input from './../Input';
import MessageButton from './../MessageButton';
import NormalText from './../NormalText';

import colors from './../../styles/colors';
import layout from './../../styles/layout';

// The component to type the name of a new deck, and then create it.
export default class DeckCreation extends Component {
  static displayName = 'DeckCreation';
  static propTypes = {
    createDeck: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired,
    onFocus: PropTypes.func.isRequired,
    status: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      continuing: false,
    };
  }

  _continue = () => {
    this.props.onBlur();
    this.setState({
      continuing: true,
    });
  }

  _onEntry = (name) => {
    this.props.createDeck(name);
    this.setState({
      continuing: false,
      name,
    });
  }

  render() {
    return this.props.status === 'CREATING_DECK_FAILED' && !this.state.continuing
      ? (
          <MessageButton style={colors.failure} onPress={this._continue}>
            <View style={layout.flexShrinkAncestor} numberOfLines={1}>
              <NormalText style={layout.flexShrinkDescendant} numberOfLines={1} ellipsizeMode='tail'>{this.state.name}</NormalText>
              <NormalText> already exists</NormalText>
            </View>
            <NormalText style={layout.atRight}>Continue</NormalText>
          </MessageButton>
        )
      : (
          <Input placeholder='name of a new deck' onEntry={this._onEntry} onBlur={this.props.onBlur} onFocus={this.props.onFocus}/>
        );
  }
}
