import React, { PropTypes } from 'react';
import {
  Text,
} from 'react-native';

import fonts from './../styles/fonts';

// The component to display most of the text.
const NormalText = ({ children, style }) => (
  <Text style={[fonts.normal, style]}>
    {children}
  </Text>
);

NormalText.displayName = 'NormalText';
NormalText.propTypes = {
  children: PropTypes.node.isRequired,
  style: Text.propTypes.style,
};

export default NormalText;
