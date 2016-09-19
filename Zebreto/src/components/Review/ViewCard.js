import React, { Component, PropTypes } from 'react';
import {
  View,
} from 'react-native';

import Button from './../Button';
import InterfaceText from './../InterfaceText';
import MessageButton from './../MessageButton';
import NormalText from './../NormalText';

import colors from './../../styles/colors';
import layout from './../../styles/layout';

// The component to answer a review question for one side of a card.
export default class ViewCard extends Component {
  static displayName = 'ViewCard';
  static propTypes = {
    answerQuestion: PropTypes.func.isRequired,
    cardQuestion: PropTypes.shape({
      answers: PropTypes.arrayOf(PropTypes.string).isRequired,
      answerCorrect: PropTypes.string.isRequired,
      question: PropTypes.string.isRequired,
    }).isRequired,
    continueReviewing: PropTypes.func.isRequired,
    correctlyAnswered: PropTypes.bool.isRequired,
    showingAnswer: PropTypes.bool.isRequired,
    stopReviewing: PropTypes.func.isRequired,
  };

  _answerQuestionCorrectly = () => {
    this.props.answerQuestion(true);
  }

  _answerQuestionIncorrectly = () => {
    this.props.answerQuestion(false);
  }

  // The buttons for the correct answer and the incorrect answers to the question.
  _answerButtons() {
    const { cardQuestion, showingAnswer } = this.props;
    const { answers, answerCorrect } = cardQuestion;
    return answers.map((answer, i) => {
      const isCorrect = answer === answerCorrect;
      const style = showingAnswer && isCorrect
        ? colors.correct
        : colors.review;
      // Refer to methods of instance instead of binding event handlers in render.
      const onPress = isCorrect
        ? this._answerQuestionCorrectly
        : this._answerQuestionIncorrectly;
      return (
        <Button key={i} style={style} onPress={onPress} disabled={showingAnswer}>
          <NormalText>{answer}</NormalText>
        </Button>
      );
    });
  }

  // The button to do either of the following:
  // Continue reviewing after seeing feedback for an answer.
  // Stop reviewing before answering any question.
  _secondaryButton() {
    return this.props.showingAnswer
      ? (
          <MessageButton style={colors.continue} onPress={this.props.continueReviewing}>
            <NormalText>{this.props.correctlyAnswered ? 'Correct!' : 'Oops, not quite.'}</NormalText>
            <NormalText>Continue</NormalText>
          </MessageButton>
        )
      : (
          <Button style={colors.stop} onPress={this.props.stopReviewing}>
            <InterfaceText>Stop Reviewing</InterfaceText>
          </Button>
        );
  }

  render() {
    return (
      <View>
        <NormalText style={layout.normal}>{this.props.cardQuestion.question}</NormalText>
        {this._answerButtons()}
        {this._secondaryButton()}
      </View>
    );
  }
}
