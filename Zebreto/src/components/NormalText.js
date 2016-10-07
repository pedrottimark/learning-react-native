import React, { PropTypes } from 'react';
import {
  Text,
} from 'react-native';

import fonts from './../styles/fonts';

// The component to display most of the text.
const NormalText = ({ children, ellipsizeMode, numberOfLines, style }) => (
  <Text style={[fonts.normal, style]} numberOfLines={numberOfLines} ellipsizeMode={ellipsizeMode}>
    {children}
  </Text>
);

NormalText.displayName = 'NormalText';
NormalText.propTypes = {
  children: PropTypes.node.isRequired,
  ellipsizeMode: PropTypes.string,
  numberOfLines: PropTypes.number,
  style: Text.propTypes.style,
};

export default NormalText;
