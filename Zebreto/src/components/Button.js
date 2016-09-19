import React, { Component, PropTypes } from 'react';
import {
  View,
  TouchableOpacity,
} from 'react-native';

import layout from './../styles/layout';

// The component to receive tapped input.
export default class Button extends Component {
  static displayName = 'Button';
  static propTypes = {
    children: PropTypes.node.isRequired,
    disabled: PropTypes.bool,
    onPress: PropTypes.func.isRequired,
    style: View.propTypes.style,
  };
  static defaultProps = {
    disabled: false,
  };

  render() {
    const { disabled } = this.props;
    return (
      <TouchableOpacity style={[layout.normal, this.props.style]}
        onPress={this.props.onPress}
        activeOpacity={0.5}
        disabled={disabled}
      >
        <View opacity={disabled ? 0.5 : 1}>
          {this.props.children}
        </View>
      </TouchableOpacity>
    );
  }
}
