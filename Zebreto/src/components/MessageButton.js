import React, { PropTypes } from 'react';
import {
  View,
} from 'react-native';

import Button from './Button';

import layout from './../styles/layout';

// The component to display a message until the user clicks to continue.
const MessageButton = ({ children, onPress, style }) => (
  <Button style={style} onPress={onPress}>
    <View style={layout.rowAlignedLeftAndRight}>
      {children}
    </View>
  </Button>
);

MessageButton.displayName = 'MessageButton';
MessageButton.propTypes = {
  children: PropTypes.node.isRequired,
  onPress: PropTypes.func.isRequired,
  style: View.propTypes.style,
};

export default MessageButton;
