import React, { Component, PropTypes } from 'react';
import {
  Text,
} from 'react-native';

import NormalText from './NormalText';

import layout from './../styles/layout';

// The component to display most user interface text.
// Especially the text in buttons (except the answers to review questions).
export default class InterfaceText extends Component {
  static displayName = 'InterfaceText';
  static propTypes = {
    children: PropTypes.node.isRequired,
    style: Text.propTypes.style,
  };

  render() {
    return (
      <NormalText style={[layout.interface, this.props.style]}>
        {this.props.children}
      </NormalText>
    );
  }
}
