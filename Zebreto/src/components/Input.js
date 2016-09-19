import React, { Component, PropTypes } from 'react';
import {
  TextInput,
  View,
} from 'react-native';

import colors from './../styles/colors';
import fonts from './../styles/fonts';
import layout from './../styles/layout';

// The component to receive typed input.
export default class Input extends Component {
  static displayName = 'Input';
  static propTypes = {
    clearOnSubmit: PropTypes.bool,
    onChange: PropTypes.func,
    onEntry: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    refInput: PropTypes.func,
    style: View.propTypes.style,
  };
  static defaultProps = {
    clearOnSubmit: true,
  };

  constructor(props) {
    super(props);
    this.state = this._getInitialState();
  }

  _getInitialState() {
    return {
      text: '',
    };
  }

  _onChange = (text) => {
    this.setState({
      text,
    });
    if (this.props.onChange) {
      this.props.onChange(text);
    }
  }

  _onSubmit = (event) => {
    this.props.onEntry(event.nativeEvent.text);
    if (this.props.clearOnSubmit) {
      this.setState(this._getInitialState());
    }
  }

  _refInput = (input) => {
    if (this.props.refInput) {
      this.props.refInput(input);
    }
  }

  render() {
    return (
      <TextInput
        style={[layout.normal, fonts.normal, colors.input, this.props.style]}
        autoCapitalize='none'
        autoCorrect={false}
        multiline={false}
        onChangeText={this._onChange}
        onSubmitEditing={this._onSubmit}
        placeholder={this.props.placeholder}
        ref={this._refInput}
        value={this.state.text}
      />
    );
  }
}
