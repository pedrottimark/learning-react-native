import React, { PropTypes } from 'react';
import {
  View,
  TouchableOpacity,
} from 'react-native';

import layout from './../styles/layout';

// The component to receive tapped input.
const Button = ({ children, disabled = false, onPress, style }) => (
  <TouchableOpacity style={[layout.normal, style]} activeOpacity={0.5}
    onPress={onPress}
    disabled={disabled}
  >
    <View opacity={disabled ? 0.5 : 1}>
      {children}
    </View>
  </TouchableOpacity>
);

Button.displayName = 'Button';
Button.propTypes = {
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
  onPress: PropTypes.func.isRequired,
  style: View.propTypes.style,
};

export default Button;
