import React, { Component, PropTypes } from 'react';
import {
  View,
} from 'react-native';

import Button from './Button';

import layout from './../styles/layout';

// The component to display a message until the user clicks to continue.
export default class MessageButton extends Component {
  static displayName = 'MessageButton';
  static propTypes = {
    children: PropTypes.node.isRequired,
    onPress: PropTypes.func.isRequired,
    style: View.propTypes.style,
  };

  render() {
    return (
      <Button style={this.props.style} onPress={this.props.onPress}>
        <View style={layout.rowAlignedLeftAndRight}>
          {this.props.children}
        </View>
      </Button>
    );
  }
}
