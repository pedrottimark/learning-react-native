import {
  Dimensions,
  StyleSheet,
} from 'react-native';

const { width } = Dimensions.get('window');

const headerSize = width / 7;
const normalSize = width / 15;

const lineHeight = 1.4;

export const headerHeight = headerSize * lineHeight;
export const normalHeight = normalSize * lineHeight; // for Input, see layout

export default StyleSheet.create({
  header: {
    fontFamily: 'Avenir Medium',
    fontSize: headerSize,
    lineHeight: headerHeight,
  },
  normal: {
    fontFamily: 'Avenir Medium',
    fontSize: normalSize,
    lineHeight: normalHeight,
  },
});
