import React, { Component, PropTypes } from 'react';
import {
  Text,
} from 'react-native';

import fonts from './../styles/fonts';

// The component to display most of the text.
export default class NormalText extends Component {
  static displayName = 'NormalText';
  static propTypes = {
    children: PropTypes.node.isRequired,
    style: Text.propTypes.style,
  };

  render() {
    return (
      <Text style={[fonts.normal, this.props.style]}>
        {this.props.children}
      </Text>
    );
  }
}
