import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import logo from './../../icon.png';

import fonts from './../styles/fonts';

// The component above every scene in the app.
const Header = () => (
  <View style={styles.header}>
    <Image style={styles.logo} source={logo}/>
    <Text style={fonts.header}>ZEBRETO</Text>
  </View>
);

Header.displayName = 'Header';

export default Header;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    marginRight: 8,
    height: 40,
    width: 40,
  },
});
