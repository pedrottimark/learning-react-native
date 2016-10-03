import React, { PropTypes } from 'react';
import {
  Text,
} from 'react-native';

import NormalText from './NormalText';

import layout from './../styles/layout';

// The component to display most user interface text.
// Especially the text in buttons (except the answers to review questions).
const InterfaceText = ({ children, style }) => (
  <NormalText style={[layout.interface, style]}>
    {children}
  </NormalText>
);

InterfaceText.displayName = 'InterfaceText';
InterfaceText.propTypes = {
  children: PropTypes.node.isRequired,
  style: Text.propTypes.style,
};

export default InterfaceText;
