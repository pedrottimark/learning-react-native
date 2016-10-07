import {
  StyleSheet,
} from 'react-native';

import { normalHeight } from './fonts';

const margin = 10;
const padding = 10;

export default StyleSheet.create({

  // The ancestor component for the application.
  app: {
    flex: 1, // consists of the entire screen
    marginTop: 30, // except for the status bar at the top
  },

  // A container component for a route scene.
  scene: {
    flex: 1, // consists of the entire screen except for the status bar
    paddingLeft: margin,
    paddingRight: margin,
  },

  // A parent component for children in a row.
  row: {
    flex: 1,
    flexDirection: 'row',
  },

  // A parent component for two children in a row:
  // first child component aligned at the left
  // second child component aligned at the right
  rowAlignedLeftAndRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  // For parent of a leaf component that can shrink so MessageButton displays only one line.
  flexShrinkAncestor: {
    flex: 1,
    flexDirection: 'row',
    flexShrink: 1,
  },

  // For leaf component that can shrink so MessageButton displays only one line.
  flexShrinkDescendant: {
    flexShrink: 1,
  },

  // For child of MessageButton that is aligned at the right.
  atRight: {
    marginLeft: padding,
  },

  // For leaf components that extend View, therefore have block layout.
  normal: {
    marginTop: margin,
    marginBottom: margin,
    padding,
    minHeight: normalHeight + 2 * padding, // for Input when it is empty
  },

  // For most user interface text to contrast with left alignment of language text.
  interface: {
    textAlign: 'center',
  },

});
